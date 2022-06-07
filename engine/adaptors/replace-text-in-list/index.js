const utils = require("../../utils");

module.exports = function (args) {
  const pattern = utils.text.makeRegexp(args.pattern, true, true);

  const list = (
    (args.list) ?
      args.list.map((text) => (text || "").toString().replace(pattern, args.replacement)) :
      []
  );

  return {
    list,
  };
};
