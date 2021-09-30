module.exports = function (req, res, next) {
  Promise.resolve(req.dataflow)
    .then(
      (doc) => ({
        id: doc.identifier,
        name: doc.name,
        description: doc.description,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        input: doc.manifest.input.map(
          (item) => ({
            description: item.description,
            enum: item.enum,
            name: item.name,
            required: item.isRequired,
            type: item.type,
          })
        ),
        output: doc.manifest.output.map(
          (item) => ({
            description: item.description,
            name: item.name,
            type: item.type,
          })
        ),
        editable: (
          (doc.user && req.user) ?
            doc.user._id.toString() === req.user._id.toString() :
            false
        ),
      })
    )
    .then((output) => res.json(output))
    .catch(next);
};
