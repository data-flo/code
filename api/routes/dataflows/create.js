const DataflowModel = require("../../models/dataflow");
const logger = require("cgps-application-server/logger");

module.exports = function (req, res, next) {
  DataflowModel.create({
    manifest: {
      input: [],
      output: [],
      stages: [],
    },
    user: req.user ? req.user : false,
  })
    .then((doc) => {
      logger.info("dataflow created", { dataflow: doc.identifier }, { req, res });
      res.json({ id: doc.identifier });
    })
    .catch(next);
};
