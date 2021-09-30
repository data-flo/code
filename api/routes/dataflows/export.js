const slugify = require("slugify");

const DataflowModel = require("../../models/dataflow");

async function exportDataflow(identifier, loggedUser) {
  const model = await DataflowModel.findByIdentifier(identifier, loggedUser);
  const isOwner = (loggedUser && model.user.toString() === loggedUser.id);
  const list = [];
  if (model && (model.access === "public" || isOwner)) {
    // Find and include dependant Dataflows
    for (const transformation of model.manifest.transform) {
      if (transformation.type === "dataflow") {
        const childList = await exportDataflow(transformation.dataflow, loggedUser);

        // Only export dependant Dataflows that have not been included already
        for (const child of childList) {
          if (!list.some((x) => x.identifier === child.identifier)) {
            list.push(child);
          }
        }
      }
    }
    const doc = {
      description: model.description,
      identifier: model.identifier,
      manifest: model.cloneManifest(loggedUser),
      name: model.name,
    };
    list.push(doc);
  }
  return list;
}

function removeUnexportedReferences(list) {
  const exportedIds = new Set();
  for (const doc of list) {
    exportedIds.add(doc.identifier);
  }
  for (const doc of list) {
    // Remove transform references to unexported Dataflows
    doc.manifest.transform = doc.manifest.transform.filter((x) => x.type !== "dataflow" || exportedIds.has(x.dataflow));

    const transformationIds = new Set(doc.manifest.transform.map((x) => x.name));

    // Remove bindings to unexported Dataflows
    for (const step of doc.manifest.transform) {
      step.binding = step.binding.filter((x) => x.type !== "transformation" || transformationIds.has(x.transformation));
    }

    // Clean outputs
    doc.manifest.output = doc.manifest.output.filter((x) => transformationIds.has(x.transformation));
  }

  return list;
}

module.exports = function (req, res, next) {
  Promise.resolve()
    .then(() => exportDataflow(req.dataflow.identifier, req.user))
    .then(removeUnexportedReferences)
    .then((doc) => {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=dataflow-${req.dataflow.identifier}-${
          slugify(
            req.dataflow.name || " Untitled",
            { lower: true }
          )
        }.json`
      );
      res.setHeader(
        "Content-Type",
        "application/json; charset=utf-8"
      );
      res
        .status(200)
        .send(
          JSON.stringify(
            doc,
            null,
            2
          )
        );
    })
    .catch(next);
};
