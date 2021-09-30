const escapeStringRegexp = require("escape-string-regexp");

const makeRegexp = (pattern) => {
  if (pattern.startsWith("/") && pattern.endsWith("/")) {
    return new RegExp(pattern.substring(1, pattern.length - 1));
  } else {
    return new RegExp(escapeStringRegexp(pattern));
  }
};

module.exports = function (args) {
  const regexp = makeRegexp(args.pattern);
  const index = args.list.findIndex((item) => regexp.test(item));
  return {
    value: (index >= 0) ? args.list[index] : null,
    index: (index >= 0) ? index + 1 : null,
  };
};
