import clipboard from "~/assets/utils/clipboard";

/* eslint no-shadow: 0 */
/* eslint no-use-before-define: 0 */

const zoomLevels = [10, 25, 50, 75, 100, 125, 150, 200, 300, 400, 600, 800];

const sortStagesByExecutionOrder = (steps) => {
  const ordered = [];
  const visited = new Set();

  let numberOfVisited = 0;
  do {
    numberOfVisited = ordered.length;
    for (const item of steps) {
      if (!visited.has(item.name)) {
        let canBeVisited = true;
        for (const binding of (item.binding || [])) {
          if (binding.type === "transformation") {
            if (!visited.has(binding.transformation)) {
              canBeVisited = false;
              break;
            }
          }
        }
        if (canBeVisited) {
          visited.add(item.name);
          ordered.push(item);
        }
      }
    }
  } while (numberOfVisited !== ordered.length);

  if (steps.length !== ordered.length) {
    throw new Error("Cyclic dependencies detected");
  }

  return ordered;
};

function addBinding(state, { kind, direction, transformation, argument, input, output }) {
  if (kind === "transformation") {
    if (state.selection.transformation) {
      const targetStage = (direction === "in") ? transformation : state.selection.transformation;
      const targetArgument = (direction === "in") ? argument : state.selection.argument;
      const sourceStage = (direction === "out") ? transformation : state.selection.transformation;
      const sourceArgument = (direction === "out") ? argument : state.selection.argument;
      const stageManifest = state.manifest.transform.find((x) => x.name === targetStage);
      const bindingIndex = stageManifest.binding.findIndex((x) => x.target === targetArgument);
      if (bindingIndex > -1) {
        stageManifest.binding.splice(bindingIndex, 1);
      }
      stageManifest.binding.push({
        target: targetArgument,
        type: "transformation",
        transformation: sourceStage,
        argument: sourceArgument,
      });
    } else if (state.selection.input) {
      // Bind a transformation node to an input node
      const manifest = state.manifest.transform.find((x) => x.name === transformation);
      const bindingIndex = manifest.binding.findIndex((x) => x.target === argument);
      if (bindingIndex > -1) {
        manifest.binding.splice(bindingIndex, 1);
      }
      manifest.binding.push({
        target: argument,
        type: "input",
        input: state.selection.input,
      });
    } else if (state.selection.output) {
      // Bind a transformation node to an output node
      const manifest = state.manifest.output.find((x) => x.name === state.selection.output);
      manifest.transformation = transformation;
      manifest.argument = argument;
    }
  } else if (kind === "input") {
    // Bind a transformation node to an input node
    const manifest = state.manifest.transform.find((x) => x.name === state.selection.transformation);
    const bindingIndex = manifest.binding.findIndex((x) => x.target === state.selection.argument);
    if (bindingIndex > -1) {
      manifest.binding.splice(bindingIndex, 1);
    }
    manifest.binding.push({
      target: state.selection.argument,
      type: "input",
      input,
    });
  } else if (kind === "output") {
    // Bind a transformation node to an output node
    const manifest = state.manifest.output.find((x) => x.name === output);
    manifest.transformation = state.selection.transformation;
    manifest.argument = state.selection.argument;
  }
}

function addInputVariable(state, { transformation, argument, type, defaultValue, isSecret }) {
  const transformationNode = state.manifest.transform.find((x) => x.name === transformation);
  const name = getAvailableName(state.manifest.input, argument);
  state.manifest.input.push({
    name,
    type,
    description: "",
    default: defaultValue || undefined,
    ui: getNewInputPosition(state.manifest),
    isSecret,
  });
  const currentBindingIndex = transformationNode.binding.findIndex((x) => x.target === argument);
  if (currentBindingIndex >= 0) {
    transformationNode.binding.splice(currentBindingIndex, 1);
  }
  transformationNode.binding.push({
    target: argument,
    type: "input",
    input: name,
  });
  resetBounds(state);
}

function addOutputVariable(state, { transformation, argument, type }) {
  const binding = state.manifest.output.find((x) => x.transformation === transformation && x.argument === argument);
  if (!binding) {
    const name = getAvailableName(state.manifest.output, argument);
    state.manifest.output.push({
      argument,
      description: "",
      name,
      transformation,
      type,
      ui: getNewOutputPosition(state.manifest, transformation),
    });
  }
}

function addTransformation(state, { type, name }) {
  const newName = getNewTransformationName(state.manifest.transform);
  const position = getNewTransformationPosition(state, state.manifest.transform);
  state.manifest.transform.push({
    name: newName,
    type,
    [type]: name,
    description: null,
    binding: [],
    ui: {
      x: position.x,
      y: position.y,
    },
  });
  state.manifest.transform = sortStagesByExecutionOrder(state.manifest.transform);
}

function clearSelection(state) {
  state.selection = null;
}

function convertArgumentBindingToInput(state, { transformation, argument, type, isSecret = false }) {
  const transformationNode = state.manifest.transform.find((x) => x.name === transformation);
  const bindingEntry = transformationNode.binding.find((x) => x.target === argument);
  addInputVariable(
    state,
    {
      transformation,
      argument,
      type,
      defaultValue: bindingEntry.value,
      isSecret,
    }
  );
}

function copySelection(state) {
  if (state.selection.input) {
    const node = state.manifest.input.find((x) => x.name === state.selection.input);
    clipboard.copy({
      dataflo: 3,
      kind: "input",
      data: node,
    });
  } else if (state.selection.output) {
    const node = state.manifest.output.find((x) => x.name === state.selection.output);
    clipboard.copy({
      dataflo: 3,
      kind: "output",
      data: node,
    });
  } else if (state.selection.transformation) {
    const node = state.manifest.transform.find((x) => x.name === state.selection.transformation);
    clipboard.copy({
      dataflo: 3,
      kind: "transformation",
      data: node,
    });
  }
}

function duplicateSelection(state) {
  if (state.selection.transformation) {
    duplicateTransformation(state, state.selection.transformation);
  }
}

function duplicateTransformation(state, name) {
  const transformation = state.manifest.transform.find((x) => x.name === name);
  const newName = getNewTransformationName(state.manifest.transform);
  const position = getNewTransformationPosition(state, state.manifest.transform, transformation.ui);
  state.manifest.transform.push({
    name: newName,
    type: transformation.type,
    [transformation.type]: transformation[transformation.type],
    description: transformation.description ? `Copy of ${transformation.description}` : undefined,
    binding: transformation.binding.map((x) => ({ ...x })),
    ui: {
      x: position.x,
      y: position.y,
    },
  });
  state.selection = { transformation: newName };
}

function getAvailableName(list, requestedName) {
  let availableName = requestedName.replace(/\./g, "-");
  let index = 2;
  while (list.find((x) => x.name === availableName)) {
    availableName = `${requestedName} ${index}`;
    index += 1;
  }
  return availableName;
}

function getNewInputPosition(manifest) {
  if (manifest.input.length) {
    // Position the new node under the last input node
    let minx = Number.MAX_SAFE_INTEGER;
    let maxy = Number.MIN_SAFE_INTEGER;
    for (let index = 0; index < manifest.input.length; index++) {
      const item = manifest.input[index];
      if (item.ui) {
        if (item.ui.x < minx) {
          minx = item.ui.x;
        }
        if (item.ui.y > maxy) {
          maxy = item.ui.y;
        }
      }
    }
    if (minx !== Number.MAX_SAFE_INTEGER && maxy !== Number.MIN_SAFE_INTEGER) {
      return {
        x: minx,
        y: maxy + 64,
      };
    }
  }

  if (manifest.transform.length) {
    // Position the new node before the first transformation node
    let firstNode = manifest.transform[0];
    for (let index = 0; index < manifest.transform.length; index++) {
      const item = manifest.transform[index];
      if (item.ui) {
        if (!firstNode.ui || item.ui.x < firstNode.ui.x) {
          firstNode = item;
        }
      }
    }
    if (firstNode.ui) {
      return {
        x: firstNode.ui.x - 240,
        y: firstNode.ui.y,
      };
    }
  }

  return {
    x: 0,
    y: 0,
  };
}

function getNewOutputPosition(manifest, transformation) {
  if (manifest.transform.length) {
    // Position the new node after the last transformation node
    let lastNode = manifest.transform[0];
    for (let index = 0; index < manifest.transform.length; index++) {
      const item = manifest.transform[index];
      if (item.ui) {
        if (!lastNode.ui || item.ui.x > lastNode.ui.x) {
          lastNode = item;
        }
      }
    }
    if (lastNode.ui) {
      const transformationNode = manifest.transform.find((x) => x.name === transformation);
      let maxy = transformationNode.ui ? transformationNode.ui.y - 64 : Number.MIN_SAFE_INTEGER;
      for (const output of manifest.output) {
        if (output.transformation === transformation && output.ui && output.ui.y > maxy) {
          maxy = output.ui.y;
        }
      }
      return {
        x: lastNode.ui.x + 320,
        y: maxy + 64,
      };
    }
  }

  return {
    x: 0,
    y: 0,
  };
}

function getNewTransformationName(list) {
  let id = 1;
  while (list.find((x) => x.name === `transformation-${id}`)) {
    id += 1;
  }
  return `transformation-${id}`;
}

function getNewTransformationPosition(state, list, initialPostion = screenMiddlePoint(state)) {
  let finalX = initialPostion.x;
  let finalY = initialPostion.y;

  while (list.find((x) => x.ui.x === finalX && x.ui.y === finalY)) {
    finalX += 32;
    finalY += 32;
  }

  return {
    x: finalX,
    y: finalY,
  };
}

function moveInputNode(state, { name, x, y, isFinal, isRelative }) {
  const node = state.manifest.input.find((x) => x.name === name);
  moveNode(state.manifest, node, x, y, isFinal, isRelative);
}

function moveNode(manifest, node, x, y, isFinal, isRelative) {
  node.ui.x = (isRelative ? node.ui.x + x : x) || node.ui.x;
  node.ui.y = (isRelative ? node.ui.y + y : y) || node.ui.y;
  const offsetX = (node.ui.x < 0) ? -node.ui.x : 0;
  const offsetY = (node.ui.y < 0) ? -node.ui.y : 0;
  if (offsetX > 0 || offsetY > 0) {
    for (const item of manifest.transform) {
      item.ui.x += offsetX;
      item.ui.y += offsetY;
    }
    for (const item of manifest.input) {
      item.ui.x += offsetX;
      item.ui.y += offsetY;
    }
    for (const item of manifest.output) {
      item.ui.x += offsetX;
      item.ui.y += offsetY;
    }

    // Do not correct the position of the moving node unless the movement is final.
    if (!isFinal) {
      node.ui.x -= offsetX;
      node.ui.y -= offsetY;
    }
  }
}

function moveOutputNode(state, { name, x, y, isFinal, isRelative }) {
  const node = state.manifest.output.find((x) => x.name === name);
  moveNode(state.manifest, node, x, y, isFinal, isRelative);
}

function moveSelectionDown(state) {
  moveSelection(state, { y: 10 });
}

function moveSelectionLeft(state) {
  moveSelection(state, { x: -10 });
}

function moveSelectionRight(state) {
  moveSelection(state, { x: 10 });
}

function moveSelectionUp(state) {
  moveSelection(state, { y: -10 });
}

function moveSelection(state, { x, y }) {
  if (state.selection.input) {
    moveInputNode(state, { name: state.selection.input, x, y, isRelative: true });
  } else if (state.selection.output) {
    moveOutputNode(state, { name: state.selection.output, x, y, isRelative: true });
  } else if (state.selection.transformation) {
    moveTransformationNode(state, { name: state.selection.transformation, x, y, isRelative: true });
  }
}

function moveTransformationNode(state, { name, x, y, isFinal, isRelative }) {
  const node = state.manifest.transform.find((x) => x.name === name);
  moveNode(state.manifest, node, x, y, isFinal, isRelative);
}

function pasteData(state, text) {
  let clipboard = null;
  try {
    clipboard = JSON.parse(text);
  }
  catch (e) {
    setErrorMessage(state, "Cannot paste from clipboard");
  }
  if (clipboard !== null) {
    if (clipboard.dataflo >= 3 && clipboard.kind && clipboard.data) {
      if (clipboard.kind === "transformation") {
        const newName = getNewTransformationName(state.manifest.transform);
        const position = getNewTransformationPosition(state, state.manifest.transform);
        const node = {
          name: newName,
          type: clipboard.data.type,
          [clipboard.data.type]: clipboard.data[clipboard.data.type],
          description: clipboard.data.description || undefined,
          binding: clipboard.data.binding.reduce(
            (array, binding) => {
              if (binding.type === "value") {
                array.push(binding);
              }
              // else if (binding.type === "input") {
              //   if (state.manifest.input.some((x) => x.name === binding.input)) {
              //     array.push(binding);
              //   }
              // }
              // else if (binding.type === "transformation") {
              //   if (state.manifest.transform.some((x) => x.name === binding.transformation)) {
              //     array.push(binding);
              //   }
              // }
              return array;
            },
            []
          ),
          ui: {
            x: position.x,
            y: position.y,
          },
        };
        state.manifest.transform.push(node);
        state.selection = { transformation: newName };
      }
      else if (clipboard.kind === "input") {
        const name = getAvailableName(state.manifest.input, clipboard.data.name);
        state.manifest.input.push({
          ...clipboard.data,
          ui: getNewInputPosition(state.manifest),
        });
        resetBounds(state);
      }
      else if (clipboard.kind === "output") {
        if (state.manifest.transform.some((x) => x.namde === clipboard.data.transformation)) {
          const name = getAvailableName(state.manifest.output, clipboard.data.name);
          state.manifest.output.push({
            ...clipboard.data,
            ui: getNewOutputPosition(state.manifest, clipboard.data.transformation),
          });
          state.selection = { output: name };
        }
      }
    }
    else {
      setErrorMessage(state, "Invalid clipboard data");
    }
  }
}

function removeArgumentBinding(state, { transformation, argument }) {
  const transformationManifest = state.manifest.transform.find((x) => x.name === transformation);
  const index = transformationManifest.binding.findIndex((x) => x.target === argument);
  if (index >= 0) {
    transformationManifest.binding.splice(index, 1);
  }
}

function removeInput(state, name) {
  // Remove the input definition
  const inputIndex = state.manifest.input.findIndex((x) => x.name === name);
  state.manifest.input.splice(inputIndex, 1);

  // Clear selection if the input is selected
  if (state.selection.input === name) {
    state.selection = null;
  }

  // Remove any binding to the input
  for (const item of state.manifest.transform) {
    item.binding = item.binding.filter((binding) => binding.type !== "input" || binding.input !== name);
  }
}

function removeOutput(state, name) {
  // Remove the output definition
  const outputIndex = state.manifest.output.findIndex((x) => x.name === name);
  state.manifest.output.splice(outputIndex, 1);

  // Clear selection if the input is selected
  if (state.selection.output === name) {
    state.selection = null;
  }
}

function removeSelection(state) {
  if (!state.selection) {
    return;
  }
  if (state.selection.argument) {
    removeArgumentBinding(state, state.selection);
  } else if (state.selection.input) {
    removeInput(state, state.selection.input);
  } else if (state.selection.output) {
    removeOutput(state, state.selection.output);
  } else if (state.selection.transformation) {
    removeTransformation(state, state.selection.transformation);
  }
}

function removeTransformation(state, name) {
  const index = state.manifest.transform.findIndex((x) => x.name === name);
  if (index === -1) return;

  // Remove the transformation node.
  state.manifest.transform.splice(index, 1);

  // Reset selection.
  state.selection = null;

  // Remove any binding to the deleted transformation.
  for (const item of state.manifest.transform) {
    item.binding = item.binding.filter((x) => x.transformation !== name);
  }

  // Remove any output binding to the deleted transformation.
  state.manifest.output = state.manifest.output.filter((x) => x.transformation !== name);
}

function resetBounds(state) {
  const manifest = state.manifest;
  let minx = Number.MAX_SAFE_INTEGER;
  let miny = Number.MAX_SAFE_INTEGER;
  for (let index = 0; index < manifest.transform.length; index++) {
    const item = manifest.transform[index];
    if (!item.ui) {
      item.ui = { x: 100 + index * 160, y: 100 };
    }
  }
  for (let index = 0; index < manifest.input.length; index++) {
    const item = manifest.input[index];
    if (!item.ui) {
      item.ui = getNewInputPosition(manifest);
    }
  }
  for (let index = 0; index < manifest.output.length; index++) {
    const item = manifest.output[index];
    if (!item.ui) {
      item.ui = getNewOutputPosition(manifest, item.transformation);
    }
  }

  for (const list of [manifest.transform, manifest.input, manifest.output]) {
    for (const item of list) {
      if (item.ui.x < minx) {
        minx = item.ui.x;
      }
      if (item.ui.y < miny) {
        miny = item.ui.y;
      }
    }
  }

  minx -= 80;
  miny -= 80;

  for (const list of [manifest.transform, manifest.input, manifest.output]) {
    for (const item of list) {
      item.ui.x -= minx;
      item.ui.y -= miny;
    }
  }
}

function resetZoom(state) {
  state.scale = 100;
  resetBounds(state);
}

function screenMiddlePoint(state) {
  const xPadding = (state.hasSidePane ? 256 : 0) + 240;
  return {
    x: (window.innerWidth - xPadding) / 2 + state.offsets.x - 80,
    y: (window.innerHeight - 64) / 2 + state.offsets.y - 80,
  };
}

function selectInputNode(state, name) {
  if (state.selection === null || state.selection.input !== name) {
    state.sidePaneView = "input";
    state.selection = {
      input: name,
    };
  }
}

function selectOutputNode(state, name) {
  if (state.selection === null || state.selection.output !== name) {
    state.sidePaneView = "output";
    state.selection = {
      output: name,
    };
  }
}

function selectTransformationArgument(state, { transformation, argument, direction }) {
  state.sidePaneView = "transformation";
  state.selection = {
    transformation,
    argument,
    direction,
  };
}

function selectTransformationNode(state, { transformation }) {
  state.sidePaneView = "transformation";
  state.selection = {
    transformation,
  };
}

function setDebugInfo(state, debugInfo) {
  state.debugger.info = debugInfo;
}

function setErrorMessage(state, message = null) {
  state.errorMessage = message;
}

function setManifest(state, data) {
  state.id = data.id;
  state.name = data.name;
  state.description = data.description;
  state.folder = data.folder;
  state.manifest = data.manifest;
  state.access = data.access;
  state.showDetailedErrors = data.showDetailedErrors;

  state.filter = "";
  state.hasSidePane = null;
  state.offsets = { x: 0, y: 0 };
  state.scale = 100;
  state.selection = null;
  state.debugger = {
    active: false,
    info: {},
  };

  for (const item of state.manifest.input) {
    if (!("default" in item)) {
      item.default = undefined;
    }
  }

  resetBounds(state);
}

function setOffsets(state, { x, y, width, height }) {
  state.offsets = { x, y, width, height };
}

function setScale(state, value) {
  state.scale = value;
}

function toggleSidePaneView(state) {
  state.hasSidePane = !state.hasSidePane;
}

function toggleDebuggerMode(state) {
  state.debugger.active = !state.debugger.active;
  if (!state.debugger.active) {
    state.debugger.info = {};
  }
}

function updateAccessControl(state, value) {
  state.access = value;
}

function updateDescription(state, data) {
  state.description = data;
}

function updateFilter(state, value) {
  state.filter = value;
}

function updateFolder(state, value) {
  state.folder = value;
}

function updateName(state, value) {
  state.name = value;
}

function updateArgumentBindingType(state, { transformation, argument, type }) {
  const stageManifest = state.manifest.transform.find((x) => x.name === transformation);
  const binding = stageManifest.binding.find((x) => x.target === argument);
  if (!binding) {
    stageManifest.binding.push({
      target: argument,
      type,
    });
  } else if (binding.type !== type) {
    binding.type = type;
  }
}

function updateArgumentBindingValue(state, { transformation, argument, value }) {
  const transformationManifest = state.manifest.transform.find((x) => x.name === transformation);
  const binding = transformationManifest.binding.find((x) => x.target === argument);
  binding.value = value;
  state.selection = { ...state.selection };
}

function updateInputDatatype(state, { name, value }) {
  const item = state.manifest.input.find((x) => x.name === name);
  item.type = value;
  item.default = null;
  item.enum = null;

  for (const item of state.manifest.transform) {
    item.binding = item.binding.filter((binding) => binding.type !== "input" || binding.input !== name);
  }
}

function updateInputDefaultValue(state, { name, value }) {
  const item = state.manifest.input.find((x) => x.name === name);
  item.default = value;
}

function updateInputDescription(state, { name, description }) {
  const item = state.manifest.input.find((x) => x.name === name);
  item.description = description;
}

function updateInputEnum(state, { name, value }) {
  const item = state.manifest.input.find((x) => x.name === name);
  item.enum = value;
}

function updateInputName(state, { name, newName }) {
  if (!newName) return;

  // Rename the input to an available name if the requested name is already taken.
  const item = state.manifest.input.find((x) => x.name === name);
  item.name = getAvailableName(state.manifest.input, newName);

  // Update all bindings to the renamed input.
  for (const stage of state.manifest.transform) {
    for (const binding of stage.binding) {
      if (binding.type === "input" && binding.input === name) {
        binding.input = item.name;
      }
    }
  }

  // Update name in selection.
  if (state.selection && state.selection.input === name) {
    state.selection.input = item.name;
  }
}

function updateDataflowProp(state, payload) {
  for (const key of Object.keys(payload)) {
    state[key] = payload[key];
  }
}

function updateInputRequiredValue(state, { name, isRequired, defaultValue }) {
  const item = state.manifest.input.find((x) => x.name === name);
  item.isRequired = isRequired;
  if (!isRequired) {
    item.default = defaultValue;
  }
}

function updateInputSecret(state, { name, value }) {
  const item = state.manifest.input.find((x) => x.name === name);
  item.isSecret = value;
}

function updateOutputDescription(state, { name, description }) {
  const item = state.manifest.output.find((x) => x.name === name);
  item.description = description;
}

function updateOutputName(state, { name, newName }) {
  if (!newName) return;

  // Rename the output to an available name if the requested name is already taken.
  const item = state.manifest.output.find((x) => x.name === name);
  item.name = getAvailableName(state.manifest.output, newName);

  // Update name in selection.
  if (state.selection && state.selection.output === name) {
    state.selection.output = item.name;
  }
}

function updateTransformationDescription(state, { transformation, description }) {
  const item = state.manifest.transform.find((x) => x.name === transformation);
  item.description = description;
}

function zoomIn(state) {
  if (state.scale >= zoomLevels[zoomLevels.length - 1]) {
    state.scale += 200;
  } else {
    state.scale = (zoomLevels.find((x) => state.scale < x));
  }
}

function zoomOut(state) {
  if (state.scale > zoomLevels[0]) {
    for (let index = zoomLevels.length - 1; index >= 0; index--) {
      if (zoomLevels[index] < state.scale) {
        state.scale = zoomLevels[index];
        break;
      }
    }
  }
}

export default {
  addBinding,
  addInputVariable,
  addOutputVariable,
  addTransformation,
  clearSelection,
  convertArgumentBindingToInput,
  copySelection,
  duplicateSelection,
  duplicateTransformation,
  moveInputNode,
  moveOutputNode,
  moveSelectionDown,
  moveSelectionLeft,
  moveSelectionRight,
  moveSelectionUp,
  moveTransformationNode,
  pasteData,
  removeArgumentBinding,
  removeInput,
  removeOutput,
  removeSelection,
  removeTransformation,
  resetBounds,
  resetZoom,
  selectInputNode,
  selectOutputNode,
  selectTransformationArgument,
  selectTransformationNode,
  setDebugInfo,
  setErrorMessage,
  setManifest,
  setOffsets,
  setScale,
  toggleDebuggerMode,
  toggleSidePaneView,
  updateAccessControl,
  updateArgumentBindingType,
  updateArgumentBindingValue,
  updateDataflowProp,
  updateDescription,
  updateFilter,
  updateFolder,
  updateInputDatatype,
  updateInputDefaultValue,
  updateInputDescription,
  updateInputEnum,
  updateInputName,
  updateInputRequiredValue,
  updateInputSecret,
  updateName,
  updateOutputDescription,
  updateOutputName,
  updateTransformationDescription,
  zoomIn,
  zoomOut,
};
