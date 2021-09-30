
const lodash = require("lodash");

module.exports = async function (args, context) {
  const groupColumns = args.columns;

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

  const wideRows = [];
  const spreadColumns = new Set();
  for (const longRows of Object.values(groups)) {
    const wideRow = {};
    for (const column of groupColumns) {
      wideRow[column] = longRows[0][column];
    }
    for (const longRow of longRows) {
      if (longRow[args.key]) {
        wideRow[longRow[args.key]] = longRow[args.value];
        spreadColumns.add(longRow[args.key]);
      }

    }
    wideRows.push(wideRow);
  }

  return {
    data: {
      columns: [
        ...groupColumns,
        ...Array.from(spreadColumns),
      ],
      rows: wideRows,
    },
  };
};
