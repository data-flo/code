const fs = require("fs");

module.exports = function (source, name, mediatype) {
  const file = fs.createReadStream(source.path ? source.path : source);

  if (source.path) {
    file.path = source.path ? source.path : source;
  }

  if (name) {
    file.name = name;
  }

  if (mediatype) {
    file.mediaType = mediatype;
  }

  return file;
};
