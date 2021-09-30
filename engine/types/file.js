const isStream = require("is-stream");
const stringToStream = require("string-to-stream");

module.exports = function (value) {
  if (typeof value === "string") {
    return stringToStream(value);
  }

  if (isStream(value)) {
    return value;
  }

  throw new Error(`Cannot convert value '${value}' to stream`);
};
