const fs = require("fs");
const path = require("path");

module.exports = function (fsMappings, filePath) {
  const normalisedFilePath = filePath.toLowerCase().replace(/\\/g, "/");
  for (const sourceMapping of Object.keys(fsMappings)) {
    if (normalisedFilePath.startsWith(sourceMapping.toLowerCase())) {
      const resolvedPath = path.resolve(fsMappings[sourceMapping], filePath.substr(sourceMapping.length).replace(/\\/g, "/"))
      if (resolvedPath.startsWith(fsMappings[sourceMapping])) {
        return resolvedPath;
      }
    }
  }

  throw new Error(`Cannot map file: ${filePath}`);
};
