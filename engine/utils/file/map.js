const fs = require("fs");

module.exports = function (fsMappings, filePath) {
  const normalisedFilePath = filePath.toLowerCase().replace(/\\/g, "/");
  for (const sourceMapping of Object.keys(fsMappings)) {
    if (normalisedFilePath.startsWith(sourceMapping.toLowerCase())) {
      return fsMappings[sourceMapping] + filePath.substr(sourceMapping.length).replace(/\\/g, "/");
    }
  }

  throw new Error(`Cannot map file: ${filePath}`);
};
