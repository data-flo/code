const toString = require("stream-to-string");

module.exports = async function (args) {
  const text = await toString(args.file, args.encoding);
  return { text };
};
