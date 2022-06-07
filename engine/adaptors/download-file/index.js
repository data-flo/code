const request = require("request");

module.exports = async function (args) {
  const file = request(args.url);
  return { file };
};
