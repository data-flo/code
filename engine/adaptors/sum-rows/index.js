
const lodash = require("lodash");

module.exports = async function (args, context) {
  const groupColumns = args["group columns"] || [];
  const sumColumns = args["sum columns"];
  for (const column of groupColumns) {
    args.data.getColumn(column);
  }
  for (const column of sumColumns) {
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

  const summedRows = [];
  for (const groupRows of Object.values(groups)) {
    const summedRow = {};
    for (const column of groupColumns) {
      summedRow[column] = groupRows[0][column];
    }
    for (const summedColumn of sumColumns) {
      summedRow[summedColumn] = 0;
    }
    for (const groupRow of groupRows) {
      for (const summedColumn of sumColumns) {
        if (groupRow[summedColumn]) {
          const value = parseFloat(groupRow[summedColumn]);
          if (Number.isFinite(value)) {
            summedRow[summedColumn] += value;
          }
        }
      }
    }
    summedRows.push(summedRow);
  }

  return {
    data: {
      columns: [
        ...groupColumns,
        ...sumColumns,
      ],
      rows: summedRows,
    },
  };
};
