module.exports = function (prevDoc) {
  const nextDoc = {};

  // Input remain unchnaged
  nextDoc.input = prevDoc.input;

  // Migrate stages to transform section
  nextDoc.transform = prevDoc.stages.map((stage) => {
    const transformation = {};

    // Unique ID's are kept as names to be consistent with input and output list
    transformation.name = stage.id;

    // Migrate adaptor or pipeline names based on stage type
    if (stage.type === "adaptor") {
      transformation.type = "adaptor";
      transformation.adaptor = stage.name;
    } else if (stage.type === "pipeline") {
      transformation.type = "dataflow";
      transformation.dataflow = stage.name;
    }

    transformation.binding = stage.bindings.map((prevBinding) => {
      const nextBinding = {};

      // Target remain unchanged
      nextBinding.target = prevBinding.target;

      if (prevBinding.type === "stage") {
        nextBinding.type = "transformation";
        nextBinding.transformation = prevBinding.stage;
        nextBinding.argument = prevBinding.source;
      } else if (prevBinding.type === "input") {
        nextBinding.type = "input";
        nextBinding.input = prevBinding.source;
      } if (prevBinding.type === "value") {
        nextBinding.type = "value";
        nextBinding.value = prevBinding.source;
      }

      return nextBinding;
    });

    // UI and description remain unchanged
    transformation.ui = stage.ui;
    transformation.description = stage.description;

    return transformation;
  });

  // Migrate output transformations and arguments
  nextDoc.output = prevDoc.output.map((prevOutput) => ({
    name: prevOutput.name,
    description: prevOutput.description,
    type: prevOutput.type,
    transformation: prevOutput.stage,
    argument: prevOutput.source,
    ui: prevOutput.ui,
  }));

  nextDoc.version = 1;

  return nextDoc;
};
