
module.exports = function (req, res, next) {
  req.dataflow.access = req.body.access;
  req.dataflow.description = req.body.description;
  req.dataflow.folder = req.body.folder;
  req.dataflow.showDetailedErrors = req.body.showDetailedErrors;
  req.dataflow.manifest = {
    ...req.dataflow.manifest,
    ...req.body.manifest,
  };
  req.dataflow.name = req.body.name;
  req.dataflow.save()
    .then((doc) => {
      if (doc.ok === 1 && doc.nModified === 1) {
        return true;
      } else {
        return false;
      }
    })
    .then((modified) => res.json({ modified }))
    .catch(next);
};
