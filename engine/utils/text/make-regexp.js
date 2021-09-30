const escapeStringRegexp = require("escape-string-regexp");

module.exports = function makeRegexp(expression, ignoreCase = true, global = false) {
  if (expression.startsWith("/") && expression.endsWith("/")) {
    const flags = [];
    if (ignoreCase) {
      flags.push("i");
    }
    if (global) {
      flags.push("g");
    }
    return new RegExp(
      expression.substring(1, expression.length - 1),
      flags.join("")
    );
  }

  return new RegExp(escapeStringRegexp(expression));
};
