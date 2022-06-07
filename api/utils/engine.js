const createEngine = require("../../engine");
const DataflowModel = require("../models/dataflow");
const mongodbCache = require("./mongodb-cache");
const config = require("./config");

module.exports = (req) => {
  const engine = createEngine({
    getDataflowManifest: (...args) => DataflowModel.getManifest(...args, req.user),
    cache: mongodbCache,
    defaults: config.adaptors.defaults,
    fsMappings: config.adaptors.fsMappings,
  });
  return engine;
};
