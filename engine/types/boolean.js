const yn = require("yn");

module.exports = function (value) {
  if (typeof value === "boolean") {
    return value;
  }

  const bool = yn(value);

  return bool;
};
