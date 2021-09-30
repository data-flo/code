const utils = require("../../utils");

module.exports = function (args) {
  const regex = utils.text.makeRegexp(
    args.pattern,
    args["ignore case"],
    false
  );
  return {
    match: args.text && regex.test(args.text),
  };
};
