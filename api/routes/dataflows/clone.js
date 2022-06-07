const DataflowModel = require("../../models/dataflow");
const url = require("../../utils/url");

function cloneDataflow(doc, user) {
  const manifest = doc.cloneManifest(user);
  return (
    DataflowModel.create({
      description: doc.description,
      manifest,
      name: doc.name,
      user,
    })
  );
}

module.exports = function (req, res, next) {
  Promise.resolve(req.dataflow)
    .then((doc) => cloneDataflow(doc, req.user))
    .then((doc) => res.redirect(url(`/edit?${doc.identifier}`)))
    .catch(next);
};
