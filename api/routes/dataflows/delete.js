const DataflowModel = require("../../models/dataflow");
const logger = require("cgps-application-server/logger");

module.exports = function (req, res, next) {
  DataflowModel.deleteOne({ _id: req.dataflow._id })
    .then((result) => (result.ok === 1 && result.n === 1))
    .then((deleted) => {
      logger.info("dataflow deleted", { dataflow: req.dataflow.identifier }, { req, res });
      res.json({ deleted });
    })
    .catch(next);
};
