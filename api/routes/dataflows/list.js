const DataflowModel = require("../../models/dataflow");

function fetch(loggedUser) {
  const query = {
    user: { $exists: true },
    $or: [
      { access: "public" },
    ],
  };
  if (loggedUser) {
    query.$or.push({ user: loggedUser.id });
  }
  const projection = {
    access: 1,
    createdAt: 1,
    description: 1,
    folder: 1,
    identifier: 1,
    name: 1,
    updatedAt: 1,
    user: 1,
  };
  return (
    DataflowModel.find(query, projection)
      .sort({ createdAt: -1 })
      .then((dataflows) =>
        dataflows.map((dataflow) =>
          ({
            created: dataflow.createdAt,
            description: dataflow.description,
            editable: (
              loggedUser ?
                dataflow.user._id.toString() === loggedUser._id.toString() :
                false
            ),
            folder: dataflow.folder,
            id: dataflow.identifier,
            name: dataflow.name,
            public: (dataflow.access !== "private"),
            updated: dataflow.updatedAt,
          })
        )
      )
  );
}

module.exports = function (req, res, next) {
  fetch(req.user)
    .then((output) => res.json(output))
    .catch(next);
};
