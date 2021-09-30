const latestVesion = 2;

module.exports = function (prevDoc) {
  const docVersion = prevDoc.version || 0;

  let nextDoc = prevDoc;

  for (let versionNumber = docVersion + 1; versionNumber <= latestVesion; versionNumber++) {
    const updator = require(`./version-${versionNumber}`);
    nextDoc = updator(nextDoc);
  }

  return nextDoc;
};
