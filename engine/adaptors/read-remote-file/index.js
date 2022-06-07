const fs = require("fs");

module.exports = async function (args, context) {
  const mappedFilePath = context.utils.file.map(args.address)

  const file = fs.createReadStream(mappedFilePath, args.encoding);

  file.path = mappedFilePath;

  if (args.name) {
    file.name = args.name;
  }

  if (args.mediatype) {
    file.mediaType = args.mediatype;
  }

  return { file };
};
