const DataflowModel = require("../../models/dataflow");

module.exports = function (req, res, next) {
  DataflowModel.deleteOne({ _id: req.dataflow._id })
    .then((result) => (result.ok === 1 && result.n === 1))
    .then((deleted) => res.json({ deleted }))
    .catch(next);
};
