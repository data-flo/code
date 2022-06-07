const engine = require("../../utils/engine");
const DataflowModel = require("../../models/dataflow");

function capitalise(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getDataflows(identifier, user) {
  return (
    DataflowModel.findOne({ identifier })
      .then((dataflow) => {
        const ids = [];
        for (const step of dataflow.manifest.transform || []) {
          if (step.type === "dataflow") {
            ids.push(step.dataflow);
          }
        }
        return ids;
      })
      .then((ids) =>
        DataflowModel.find(
          {
            $or: [
              { user: user ? user.id : null },
              { access: "public" },
              {
                identifier: { $in: ids },
                $or: [
                  { access: "public" },
                  { access: "protected" },
                ],
              },
            ],
          },
          {
            identifier: 1,
            name: 1,
            description: 1,
            "manifest.input": 1,
            "manifest.output": 1,
          }
        )
          .then((dataflows) =>
            dataflows.map((dataflow) =>
              ({
                type: "dataflow",
                category: "Dataflows",
                id: dataflow.identifier,
                name: dataflow.name,
                description: dataflow.description,
                input: dataflow.manifest.input.map(({ name, type, description }) => ({ name, type, description })),
                output: dataflow.manifest.output.map(({ name, type, description }) => ({ name, type, description })),
              })
            )
          )
      )
  );
}

function getAdaptors(req) {
  return (
    engine(req).getAdaptorsList()
      .then((adaptors) =>
        adaptors.map((adaptor) =>
          ({
            type: "adaptor",
            id: adaptor.name,
            name: capitalise(adaptor.name.replace(/-/g, " ")),
            description: adaptor.manifest.description,
            category: adaptor.manifest.category || "Adaptors",
            input: adaptor.manifest.input,
            output: adaptor.manifest.output,
          })
        )
      )
  );
}

module.exports = function (req, res, next) {
  return Promise.all([
    getDataflows(req.query.identifier, req.user),
    getAdaptors(req),
  ])
    .then(([dataflows, adaptors]) => [...adaptors, ...dataflows])
    .then((output) => res.json(output))
    .catch(next);
};
