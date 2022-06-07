const fs = require("fs");
const logger = require("cgps-application-server/logger");

const DataflowModel = require("../../models/dataflow");
const { StatusCodeError } = require("../../errors");

function getDocs(req) {
  if (req.files && req.files.manifest) {
    return new Promise((resolve, reject) => {
      fs.readFile(req.files.manifest.path, "utf8", (err, data) => {
        if (err) {
          reject(err);
        }
        return resolve(JSON.parse(data));
      });
    });
  }

  return req.body;
}

function checkDocs(docs) {
  if (!Array.isArray(docs) || docs.length === 0) {
    throw new StatusCodeError(400);
  }

  return docs;
}

function checkManifest(doc) {
  if (!doc || !doc.manifest) {
    throw new StatusCodeError(400);
  }

  return doc;
}

function importManifest(doc, user) {
  return (
    DataflowModel.create({
      description: doc.description,
      manifest: doc.manifest,
      name: doc.name,
      user,
    })
  );
}

async function importDocs(list, user) {
  const models = [];
  const importedIds = new Map();
  for (const doc of list) {
    checkManifest(doc);
    for (const transformation of doc.manifest.transform) {
      if (transformation.type === "dataflow" && importedIds.has(transformation.dataflow)) {
        transformation.dataflow = importedIds.get(transformation.dataflow);
      }
    }
    const model = await importManifest(doc, user);
    importedIds.set(doc.identifier, model.identifier);
    models.push(model);
  }

  return models[models.length - 1];
}

module.exports = function (req, res, next) {
  Promise.resolve(req)
    .then(getDocs)
    .then(checkDocs)
    .then((doc) => importDocs(doc, req.user ? req.user : false))
    .then((doc) => {
      logger.info("dataflow imported", { dataflow: doc.identifier }, { req, res });
      res.json({ id: doc.identifier });
    })
    .catch(next);
};
