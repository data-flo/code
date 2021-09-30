const escapeStringRegexp = require("escape-string-regexp");

const makeRegexp = (pattern) => {
  if (pattern.startsWith("/") && pattern.endsWith("/")) {
    return new RegExp(pattern.substring(1, pattern.length - 1));
  } else {
    return new RegExp(escapeStringRegexp(pattern));
  }
};

module.exports = function (value) {
  if (value instanceof RegExp) {
    return value;
  }

  try {
    return makeRegexp(value);
  } catch (_) {
    throw new Error(`\'${value}\' is not a valid regular expression.`);
  }
};
