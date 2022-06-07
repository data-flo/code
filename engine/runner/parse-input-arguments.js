const castType = require("./cast-type");

module.exports = function inputArguments(manifest, rawValues) {
  const input = {};

  // check arguments against manifest
  for (const spec of manifest) {
    const rawValue = rawValues[spec.name];
    if (rawValue !== undefined) {
      if (rawValue !== null) {
        input[spec.name] = castType(spec.type, rawValue);
      }
      else {
        input[spec.name] = null;
      }
    }
    else if (spec.default !== undefined) {
      if (spec.default !== null) {
        input[spec.name] = castType(spec.type, spec.default);
      }
      else {
        input[spec.name] = undefined;
      }
    }
    else {
      throw new Error(`A value is required for input argument ${spec.name}`);
    }
  }

  return input;
};
