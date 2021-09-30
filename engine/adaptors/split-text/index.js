const utils = require("../../utils");

module.exports = function (args) {
  const regex = utils.text.makeRegexp(args.separator);
  const text = (args.separator === "\n") ? args.text.replace(/\r\n/g, "\n") : args.text;
  const substrings = (
    text
      .split(regex)
      .filter((x) => x !== "")
      .filter((_, index) => !Number.isInteger(args.limit) || index < args.limit)
  );
  return {
    subtexts: substrings,
    occurrences: substrings.length,
  };
};
