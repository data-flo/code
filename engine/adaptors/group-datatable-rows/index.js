
const lodash = require("lodash");

module.exports = async function (args, context) {
  const groupColumns = args["group by"] || [];
  for (const column of groupColumns) {
    args.data.getColumn(column);
  }

  const groups = lodash.groupBy(
    args.data.rows,
    (x) => {
      const keys = [];
      for (const column of groupColumns) {
        keys.push(x[column]);
      }
      return keys.join(" ");
    }
  );

  const rows = [];
  for (const groupRows of Object.values(groups)) {
    const baseRow = {};
    const firstRowInGroup = groupRows[0];
    for (const column of groupColumns) {
      baseRow[column] = firstRowInGroup[column];
    }
    baseRow[args["group name"]] = groupRows;
    rows.push(baseRow);
  }

  return {
    collection: {
      groups: rows,
    },
  };
};
