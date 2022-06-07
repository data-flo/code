const castType = require("./cast-type");

module.exports = function outputArguments(manifest, rawValues) {
  const output = {};

  // check arguments against manifest
  for (const spec of manifest) {
    const rawValue = rawValues[spec.name];
    if (spec.name in rawValues && rawValue !== undefined) {
      if (rawValue !== null) {
        output[spec.name] = castType(spec.type, rawValue);
      }
      else {
        output[spec.name] = rawValue;
      }
    }
    else {
      throw new Error(`A value is required for output argument ${spec.name}`);
    }
  }

  return output;
};
