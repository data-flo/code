const utils = require("../../utils");

module.exports = function (args) {
  const pattern = utils.text.makeRegexp(args.pattern, true, true);

  let text = null;
  if (args.text) {
    text = args.text.replace(pattern, args.replacement);
  }

  return {
    text,
  };
};
