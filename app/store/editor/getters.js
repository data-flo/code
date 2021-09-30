/* eslint no-shadow: 0 */
/* eslint no-continue: 0 */

const escapeStringRegexp = require("escape-string-regexp");

const sortOrder = {
  dehighlighted: -1,
  normal: 0,
  highlighted: 1,
};

export default {
  allSockets: (state, getters, rootState, rootGetters) => {
    const sockets = [];

    const manifests = rootGetters["transformations/manifests"];
    for (const node of state.manifest.transform) {
      const manifest = manifests[`${node.type}-${node[node.type]}`];
      // const nodeRef = `transformation/${node.name}`;
      for (let index = 0; index < manifest.input.length; index++) {
        const argument = manifest.input[index];
        sockets.push({
          id: `${node.name}-in-${argument.name}`,
          x: node.ui.x,
          y: 48 + node.ui.y + 24 * index,
          nx: 0,
          ny: 48 + 24 * index,
          type: `${argument.type}-in`,
          kind: "transformation",
          full: (
            (manifest.input.length > manifest.output.length)
            &&
            (index >= manifest.output.length)
          ),
          data: {
            transformation: node.name,
            argument: argument.name,
            direction: "in",
          },
        });
      }
      for (let index = 0; index < manifest.output.length; index++) {
        const argument = manifest.output[index];
        sockets.push({
          id: `${node.name}-out-${argument.name}`,
          x: 160 + node.ui.x,
          y: 48 + node.ui.y + 24 * index,
          nx: 160,
          ny: 48 + 24 * index,
          type: `${argument.type}-out`,
          kind: "transformation",
          full: (
            (manifest.output.length > manifest.input.length)
            &&
            (index >= manifest.input.length)
          ),
          data: {
            transformation: node.name,
            argument: argument.name,
            direction: "out",
          },
        });
      }
    }

    for (const node of state.manifest.input) {
      sockets.push({
        id: `input-${node.name}`,
        x: 120 + node.ui.x,
        y: 16 + node.ui.y,
        nx: 120,
        ny: 16,
        type: `${node.type}-out`,
        kind: "input",
        data: {
          input: node.name,
          direction: "out",
        },
      });
    }

    for (const node of state.manifest.output) {
      sockets.push({
        id: `output-${node.name}`,
        x: node.ui.x,
        y: 16 + node.ui.y,
        nx: 0,
        ny: 16,
        type: `${node.type}-in`,
        kind: "output",
        data: {
          output: node.name,
          direction: "in",
        },
      });
    }

    return sockets;
  },
  boundSockets: (state) => {
    const dict = new Map();

    for (const item of state.manifest.transform) {
      for (const binding of item.binding) {
        if (binding.type === "transformation" && binding.transformation) {
          dict.set(`${item.name}-in-${binding.target}`, `${binding.transformation}-out-${binding.argument}`);
          dict.set(`${binding.transformation}-out-${binding.argument}`, `${item.name}-in-${binding.target}`);
        } else if (binding.type === "input" && binding.input) {
          dict.set(`${item.name}-in-${binding.target}`, `input-${binding.input}`);
          dict.set(`input-${binding.input}`, `${item.name}-in-${binding.target}`);
        } else if (binding.type === "value") {
          dict.set(`${item.name}-in-${binding.target}`, true);
        }
      }
    }
    for (const item of state.manifest.output) {
      dict.set(`output-${item.name}`, `${item.transformation}-out-${item.argument}`);
      dict.set(`${item.transformation}-out-${item.argument}`, `output-${item.name}`);
    }
    return dict;
  },
  graphBounds: (state, getters) => {
    const nodes = getters.graphNodes;
    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    for (const item of nodes) {
      if (item.x < minX) {
        minX = item.x;
      }
      if (item.y < minY) {
        minY = item.y;
      }
      if (item.x > maxX) {
        maxX = item.x;
      }
      if (item.y > maxY) {
        maxY = item.y;
      }
    }
    minX -= 40;
    minY -= 40;
    maxX += 360;
    maxY += 360;
    return {
      minX,
      minY,
      maxX,
      maxY,
      width: (maxX),
      height: (maxY),
    };
  },
  graphEdges: (state, getters, rootState, rootGetters) => {
    const connections = [];
    const manifests = rootGetters["transformations/manifests"];

    // add edges for connecting transformation nodes
    for (const item of state.manifest.transform) {
      for (const binding of item.binding) {
        if (binding.type === "transformation" && binding.transformation) {
          const targetManifest = manifests[`${item.type}-${item[item.type]}`];
          if (!targetManifest) {
            throw new Error(`Cannot find manifest for ${item.type}-${item[item.type]}`);
          }
          const sourceTransformation = state.manifest.transform.find((x) => x.name === binding.transformation);
          const sourceManifest = manifests[`${sourceTransformation.type}-${sourceTransformation[sourceTransformation.type]}`];
          connections.push({
            ref: `${sourceTransformation.name}-${binding.argument}-${item.name}-${binding.target}`,
            kind: "transformation",
            sourceNodeRef: `transformation/${binding.transformation}`,
            targetNodeRef: `transformation/${item.name}`,
            sourceSocket: `${binding.transformation}-out-${binding.argument}`,
            targetSocket: `${item.name}-in-${binding.target}`,
            startX: 160 + sourceTransformation.ui.x,
            startY: 48 + sourceTransformation.ui.y + 24 * sourceManifest.output.findIndex((x) => x.name === binding.argument),
            endX: item.ui.x,
            endY: 48 + item.ui.y + 24 * targetManifest.input.findIndex((x) => x.name === binding.target),
            data: {
              targetTransformation: item.name,
              targetArgument: binding.target,
            },
          });
        } else if (binding.type === "input" && binding.input) {
          const targetManifest = manifests[`${item.type}-${item[item.type]}`];
          const targetInputIndex = targetManifest.input.findIndex((x) => x.name === binding.target);
          const sourceInput = state.manifest.input.find((x) => x.name === binding.input);
          connections.push({
            ref: `${sourceInput.name}-${item.name}-${binding.target}`,
            sourceNodeRef: `input/${binding.input}`,
            targetNodeRef: `transformation/${item.name}`,
            sourceSocket: `input-${binding.input}`,
            targetSocket: `${item.name}-in-${binding.target}`,
            kind: "input",
            data: {
              targetTransformation: item.name,
              targetArgument: binding.target,
            },
            startX: 120 + sourceInput.ui.x,
            startY: 16 + sourceInput.ui.y,
            endX: item.ui.x,
            endY: 48 + item.ui.y + 24 * targetInputIndex,
          });
        }
      }
    }

    // add edges for connecting output nodes to transformation nodes
    for (const item of state.manifest.output) {
      const sourceStage = state.manifest.transform.find((x) => x.name === item.transformation);
      const sourceManifest = manifests[`${sourceStage.type}-${sourceStage[sourceStage.type]}`];
      const outputIndex = sourceManifest.output.findIndex((x) => x.name === item.argument);
      connections.push({
        ref: `${sourceStage.name}-${item.argument}-${item.name}`,
        sourceNodeRef: `transformation/${item.transformation}`,
        targetNodeRef: `output/${item.name}`,
        sourceSocket: `${item.transformation}-out-${item.argument}`,
        targetSocket: `output-${item.name}`,
        kind: "output",
        data: {
          targetOutput: item.name,
        },
        startX: 160 + sourceStage.ui.x,
        startY: 48 + sourceStage.ui.y + 24 * outputIndex,
        endX: item.ui.x,
        endY: 16 + item.ui.y,
      });
    }
    return connections;
  },
  graphElements: (state, getters) => {
    const filter = getters.searchFilter;
    const hasSelection = (state.selection !== null);
    const hasFilter = (filter !== null);
    const nodesByRef = new Map();
    const nodes = getters.graphNodes.map((node) => {
      let status = "normal";
      if ((hasSelection && getters.selectedNodeRef === node.ref && getters.selectionKind !== "argument") || (hasFilter && filter.test(node.description))) {
        status = "highlighted";
      }
      else if ((hasSelection && getters.selectedNodeRef !== node.ref) || (getters.selectionKind === "argument") || (hasFilter && !filter.test(node.description))) {
        status = "dehighlighted";
      }
      const mappedNode = {
        ...node,
        status,
      };
      nodesByRef.set(node.ref, mappedNode);
      return mappedNode;
    });
    const edges = getters.graphEdges.map((edge) => {
      const targetNode = nodesByRef.get(edge.targetNodeRef);
      const sourceNode = nodesByRef.get(edge.sourceNodeRef);
      let status = "normal";
      if (
        targetNode.status === "highlighted"
        ||
        sourceNode.status === "highlighted"
        ||
        (
          hasSelection
          &&
          (getters.selectionSocketId === edge.sourceSocket || getters.selectionSocketId === edge.targetSocket)
        )
      ) {
        status = "highlighted";
      } else if (targetNode.status === "dehighlighted" || sourceNode.status === "dehighlighted") {
        status = "dehighlighted";
      }
      return {
        ...edge,
        status,
      };
    });
    return {
      nodes: nodes.sort((a, b) => sortOrder[a.status] > sortOrder[b.status]),
      edges: edges.sort((a, b) => sortOrder[a.status] > sortOrder[b.status]),
    };
  },
  graphNodes: (state, getters, rootState, rootGetters) => {
    const nodes = [];
    if (state.manifest) {
      const manifests = rootGetters["transformations/manifests"];
      for (const item of state.manifest.input) {
        nodes.push({
          x: item.ui.x,
          y: item.ui.y,
          kind: "input",
          ref: `input/${item.name}`,
          data: {
            defaultValue: item.default,
            description: item.description,
            enum: item.enum || [],
            isRequired: item.isRequired,
            isSecret: item.isSecret,
            name: item.name,
            type: item.type,
          },
        });
      }
      for (const item of state.manifest.transform) {
        const transformationManifest = manifests[`${item.type}-${item[item.type]}`] || {};
        nodes.push({
          x: item.ui.x,
          y: item.ui.y,
          kind: "transformation",
          ref: `transformation/${item.name}`,
          data: {
            description: item.description || transformationManifest.name,
            information: transformationManifest.description,
            input: transformationManifest.input || [],
            name: item.name,
            numberOfArguments: (
              transformationManifest.input && transformationManifest.output ?
                Math.max(transformationManifest.input.length, transformationManifest.output.length) :
                0
            ),
            output: transformationManifest.output || [],
            type: item.type,
            [item.type]: item[item.type],
            displayName: transformationManifest.name,
          },
        });
      }
      for (const item of state.manifest.output) {
        nodes.push({
          x: item.ui.x,
          y: item.ui.y,
          kind: "output",
          ref: `output/${item.name}`,
          data: {
            description: item.description,
            name: item.name,
            type: item.type,
          },
        });
      }
    }
    return nodes;
  },
  graphNodesByRef: (state, getters) => {
    const dict = new Map();
    for (const node of getters.graphNodes) {
      dict.set(node.ref, node);
    }
    return dict;
  },
  graphSockets: (state, getters) => {
    const groups = {};
    for (const socket of getters.allSockets) {
      let status = null;
      const selection = getters.selection;
      if (selection.selectedNodeKind !== "dataflow") {
        if (socket.kind === "transformation" && selection.transformation === socket.data.transformation) {
          if (selection.argument) {
            if (selection.argument === socket.data.argument && selection.direction === socket.data.direction) {
              status = "highlighted";
            } else {
              status = "dehighlighted";
            }
          }
        } else if (socket.kind === "input" && selection.input === socket.data.input) {
          status = "highlighted";
        } else if (socket.kind === "output" && selection.output === socket.data.output) {
          status = "highlighted";
        } else if (getters.linkableSocketById.has(socket.Id)) {
          status = "linkable";
        } else {
          status = "dehighlighted";
        }
      }
      const nodeRef = `${socket.kind}/${socket.data[socket.kind]}`;
      groups[nodeRef] = groups[nodeRef] || [];
      groups[nodeRef].push({
        ...socket,
        nodeRef,
        status,
      });
    }
    return groups;
  },
  linkableSockets(state, getters) {
    const sockets = [];
    if (state.selection) {
      for (const socket of getters.allSockets) {
        if (socket.data.transformation && socket.data.transformation === state.selection.transformation) {
          continue;
        }
        if (socket.data.direction === "in" && getters.boundSockets.has(socket.id)) {
          continue;
        }
        if (state.selection.direction !== "out" && getters.boundSockets.get(getters.selectionSocketId) === socket.id) {
          continue;
        }
        if (socket.type === getters.selectionSocketType) {
          sockets.push(socket);
        }
      }
    }
    return sockets;
  },
  linkableSocketById(state, getters) {
    const dict = new Map();
    for (const item of getters.linkableSockets) {
      dict.set(item.id, item);
    }
    return dict;
  },
  scalePercentage(state) {
    return state.scale / 100;
  },
  searchFilter: (state) => {
    const expression = state.filter;
    if (expression) {
      if (expression.startsWith("/") && expression.endsWith("/")) {
        return new RegExp(expression.substring(1, expression.length - 1, "i"));
      } else {
        return new RegExp(escapeStringRegexp(expression).replace(/ /g, ".*"), "i");
      }
    } else {
      return null;
    }
  },
  selectedNodeRef: (state) => {
    if (state.selection) {
      if (state.selection.transformation) {
        return `transformation/${state.selection.transformation}`;
      }
      if (state.selection.input) {
        return `input/${state.selection.input}`;
      }
      if (state.selection.output) {
        return `output/${state.selection.output}`;
      }
    }
    return null;
  },
  selectedTransformation: (state, getters) => {
    if (state.selection) {
      const ref = getters.selectedNodeRef;
      return getters.graphNodes.find((x) => x.ref === ref);
    }
    return null;
  },
  selectedArgument: (state, getters) => {
    if (state.selection && state.selection.argument) {
      const defaultValues = {
        date: new Date(),
        file: "",
        integer: 0,
        map: [],
        number: 0,
        text: "",
      };
      const argumentList = getters.selectedTransformation.data[`${state.selection.direction}put`];
      const argument = argumentList.find((x) => x.name === state.selection.argument);
      if (typeof argument.value === "undefined") {
        argument.value = defaultValues[argument.type];
      }
      return argument;
    }
    return {};
  },
  selectedArgumentBinding: (state) => {
    const { selection } = state;
    if (selection && selection.direction === "in") {
      const transformation = state.manifest.transform.find((x) => x.name === selection.transformation);
      const binding = transformation.binding.find((x) => x.target === selection.argument);
      return binding;
    }
    if (selection && selection.direction === "out") {
      const output = state.manifest.output.find((x) => x.transformation === selection.transformation && x.argument === selection.argument);
      return output;
    }
    return null;
  },
  selection: (state, getters) => {
    const selectedNodeKind = getters.selectionKind;
    const bindableSocketType = getters.selectionSocketType;
    const socketId = getters.selectionSocketId;
    return {
      ...state.selection,
      selectedNodeKind,
      bindableSocketType,
      socketId,
    };
  },
  selectionKind: (state) => {
    let type = null;
    if (state.selection === null) {
      type = "dataflow";
    } else if (state.selection.argument) {
      type = "argument";
    } else if (state.selection.transformation) {
      type = "transformation";
    } else if (state.selection.input) {
      type = "input";
    } else if (state.selection.output) {
      type = "output";
    } else {
      type = undefined;
    }
    return type;
  },
  selectionRemovable: (state) => {
    if (state.selection) {
      if (state.selection.argument && state.selection.direction === "out") {
        return false;
      }
      return true;
    }
    return false;
  },
  selectionSocketId: (state, getters) => {
    switch (getters.selectionKind) {
      case "input":
        return `input-${state.selection.input}`;
      case "argument":
        return `${state.selection.transformation}-${state.selection.direction}-${state.selection.argument}`;
      case "output":
        return `output-${state.selection.output}`;
      default:
        return null;
    }
  },
  selectionSocketType: (state, getters) => {
    if (state.selection) {
      if (state.selection.argument && state.selection.direction === "in") {
        return `${getters.selectedArgument.type}-out`;
      }

      if (state.selection.argument && state.selection.direction === "out") {
        return `${getters.selectedArgument.type}-in`;
      }

      if (state.selection.input) {
        return `${state.manifest.input.find((x) => x.name === state.selection.input).type}-in`;
      }

      if (state.selection.output) {
        return `${state.manifest.output.find((x) => x.name === state.selection.output).type}-out`;
      }
    }

    return null;
  },
  sidePaneViewName: (state) => {
    if (state.selection === null) {
      return "dataflow";
    }
    else if (state.selection.argument) {
      return "argument";
    }
    else if (state.selection.transformation) {
      return "transformation";
    }
    else if (state.selection.input) {
      return "input";
    }
    else if (state.selection.output) {
      return "output";
    }
    return null;
  },
  shortcuts() {
    return [
      {
        key: "+",
        modifier: "ctrlOrCmdKey",
        command: "editor/zoomIn",
        label: "Zoom in",
      },
      {
        key: "=",
        modifier: "ctrlOrCmdKey",
        command: "editor/zoomIn",
      },
      {
        key: "-",
        modifier: "ctrlOrCmdKey",
        command: "editor/zoomOut",
        label: "Zoom out",
      },
      {
        key: "0",
        modifier: "ctrlOrCmdKey",
        command: "editor/resetZoom",
        label: "Reset zoom",
      },
      {
        key: "ArrowDown",
        modifier: "ctrlOrCmdKey",
        command: "editor/moveSelectionDown",
        label: "Move selection downwards",
        keyLabel: "↓",
      },
      {
        key: "ArrowLeft",
        modifier: "ctrlOrCmdKey",
        command: "editor/moveSelectionLeft",
        label: "Move selection leftwards",
        keyLabel: "←",
      },
      {
        key: "ArrowRight",
        modifier: "ctrlOrCmdKey",
        command: "editor/moveSelectionRight",
        label: "Move selection rightwards",
        keyLabel: "→",
      },
      {
        key: "ArrowUp",
        modifier: "ctrlOrCmdKey",
        command: "editor/moveSelectionUp",
        label: "Move selection upwards",
        keyLabel: "↑",
      },
      {
        key: "Backspace",
        modifier: "ctrlOrCmdKey",
        command: "editor/removeSelection",
        label: "Delete selection",
      },
      {
        key: "Delete",
        command: "editor/removeSelection",
        label: "Delete selection",
      },
      {
        key: "d",
        modifier: "ctrlOrCmdKey",
        command: "editor/duplicateSelection",
        label: "Duplicate selection",
        keyLabel: "D",
      },
      {
        key: "v",
        modifier: "ctrlOrCmdKey",
        label: "Paste from clipboard",
        keyLabel: "V",
      },
      {
        key: "c",
        modifier: "ctrlOrCmdKey",
        command: "editor/copySelection",
        label: "Copy to clipboard",
        keyLabel: "C",
      },
    ];
  },
  socketPositions: (state, getters, rootState, rootGetters) => {
    const sockets = new Map();
    const manifests = rootGetters["transformations/manifests"];
    for (const node of state.manifest.transform) {
      const manifest = manifests[`${node.type}-${node[node.type]}`];
      for (let index = 0; index < manifest.input.length; index++) {
        sockets.set(
          `${node.name}-in-${manifest.input[index].name}`,
          [
            node.ui.x,
            48 + node.ui.y + 24 * index,
          ]
        );
      }
      for (let index = 0; index < manifest.output.length; index++) {
        sockets.set(
          `${node.name}-out-${manifest.output[index].name}`,
          [
            160 + node.ui.x,
            48 + node.ui.y + 24 * index,
          ]
        );
      }
    }

    for (const node of state.manifest.input) {
      sockets.set(
        `input-${node.name}`,
        [
          120 + node.ui.x,
          16 + node.ui.y,
        ]
      );
    }

    for (const node of state.manifest.output) {
      sockets.set(
        `output-${node.name}`,
        [
          node.ui.x,
          16 + node.ui.y,
        ]
      );
    }
    return sockets;
  },
  transformationNodeDescriptions: (state, getters) => {
    const dict = {};
    for (const item of getters.graphNodes) {
      if (item.kind === "transformation") {
        dict[item.data.name] = item.data.description;
      }
    }
    return dict;
  },
};
