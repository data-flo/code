const DataflowModel = require("../../models/dataflow");

module.exports = function (req, res, next) {
  DataflowModel.create({
    manifest: {
      input: [],
      output: [],
      stages: [],
    },
    user: req.user ? req.user : false,
  })
    .then((doc) => res.json({ id: doc.identifier }))
    .catch(next);
};
