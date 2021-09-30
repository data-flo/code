const engine = require("../../utils/engine");

module.exports = function (req, res, next) {
  engine(req).getAdaptorsList()
    .then(
      (adaptors) => adaptors.map((adaptor) =>
        ({
          id: adaptor.name,
          name: adaptor.name,
          description: adaptor.manifest.description,
          category: adaptor.manifest.category,
        })
      )
    )
    .then((output) => res.json(output))
    .catch(next);
};
