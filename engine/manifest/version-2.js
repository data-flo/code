module.exports = function (prevDoc) {
  const nextDoc = {};

  // Migrate input transformations and arguments
  nextDoc.input = prevDoc.input.map((prevInput) => {
    const nextInput = {
      ...prevInput,
      isRequired: true,
      isSecret: false,
    };
    if ("default" in nextInput) {
      if (nextInput.nextInput !== null && nextInput.nextInput !== undefined) {
        nextInput.isRequired = false;
      }
    }
    return nextInput;
  });

  // transform and output remain unchnaged
  nextDoc.transform = prevDoc.transform;
  nextDoc.output = prevDoc.output;

  // Set doc version
  nextDoc.version = 2;

  return nextDoc;
};
