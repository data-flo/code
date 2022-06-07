const fs = require("fs");
const util = require('util');
const stream = require('stream');
const pipeline = util.promisify(stream.pipeline);

module.exports = async function (args, context) {
  const mappedFilePath = context.utils.file.map(args.address)

  await pipeline(
    args.file,
    fs.createWriteStream(mappedFilePath, args.encoding),
  );

  const file = fs.createReadStream(mappedFilePath, args.encoding);

  return { file };
};
