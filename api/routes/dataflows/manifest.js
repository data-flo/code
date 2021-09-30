module.exports = function (req, res, next) {
  Promise.resolve(req.dataflow)
    .then(
      (model) => res.json({
        access: model.access,
        description: model.description,
        folder: model.folder,
        id: model.identifier,
        manifest: {
          input: model.manifest.input || [],
          output: model.manifest.output || [],
          transform: model.manifest.transform || [],
        },
        name: model.name,
        showDetailedErrors: model.showDetailedErrors,
      })
    )
    .catch(next);
};
