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
  const values = [];
  const complementary = [];
  for (const item of args.list) {
    if (regexp.test(item)) {
      values.push(item);
    }
    else {
      complementary.push(item);
    }
  }
  return {
    complementary,
    values,
  };
};
