const shortUUID = require("short-uuid");

const valueToUuid = require("./utils/value-to-uuid");

module.exports = function (args) {
  const targetColumn = args["target column"];
  const sourceColumn = args["source column"];
  const data = args.data.clone();
  data.addColumn(
    targetColumn,
    (row) => {
      if (!row[targetColumn] || args.overwrite) {
        let newId;
        if (sourceColumn) {
          const oldId = row[sourceColumn];
          newId = valueToUuid(oldId);
        }
        else {
          newId = shortUUID.uuid();
        }

        if (args.short) {
          newId = shortUUID().fromUUID(newId);
        }

        return newId;
      }
      else {
        return undefined;
      }
    },
  );

  return {
    data,
  };
};
