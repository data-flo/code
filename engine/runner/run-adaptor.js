const parseInputArguments = require("./parse-input-arguments");
const parseOutputArguments = require("./parse-output-arguments");

module.exports = async function runAdaptor(name, rawValues, context) {
  const manifest = context.getAdaptorManifest(name);
  const executable = context.getAdaptorExecutable(name);

  // check input against manifest
  const input = parseInputArguments(manifest.input, rawValues);

  // execute adaptor function
  const rawOutput = await Promise.resolve(input).then((args) => executable(args, context));

  // check output against manifest
  const output = parseOutputArguments(manifest.output, rawOutput);

  return output;
};
