const fs = require("fs");
const path = require("path");

const logger = require("cgps-application-server/logger");

module.exports = function (fsMappings, filePath) {
  const normalisedFilePath = filePath.toLowerCase().replace(/\\/g, "/");
  logger.debug("[utils.files.map]", { fsMappings, filePath, normalisedFilePath })
  for (const sourceMapping of Object.keys(fsMappings)) {
    const targetMapping = fsMappings[sourceMapping];
    logger.debug("\t", { normalisedFilePathStartsWithSourceMapping: normalisedFilePath.startsWith(sourceMapping.toLowerCase()), sourceMapping, targetMapping, sourceMappingLowerCase: sourceMapping.toLowerCase() })
    if (normalisedFilePath.startsWith(sourceMapping.toLowerCase())) {
      const resolvedPath = path.resolve(targetMapping, filePath.substr(sourceMapping.length).replace(/\\/g, "/"))
      logger.debug("\t", { resolvedPath, resolvedPathStartsWithTargetMapping: resolvedPath.startsWith(targetMapping) })
      if (resolvedPath.startsWith(targetMapping)) {
        return resolvedPath;
      }
    }
  }

  throw new Error(`Cannot map file: ${filePath}`);
};
