const stream = require("stream");

module.exports = async function (args) {
  const file = new stream.Readable();
  file.push(args.text, args.encoding);
  file.push(null);
  file.name = args.name;
  file.mediaType = args["media type"];
  return { file };
};
