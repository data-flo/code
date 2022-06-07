
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

  const filteredRows = [];
  for (const groupRows of Object.values(groups)) {
    let filteredGroupRows = (
      groupRows
        .slice(args.start - 1, args.end || groupRows.length)
    );
    if (Number.isInteger(args.limit)) {
      filteredGroupRows = (
        filteredGroupRows
          .filter((_, index) => !Number.isInteger(args.limit) || index < args.limit)
      );
    }

    Array.prototype.push.apply(filteredRows, filteredGroupRows);
  }

  return {
    data: {
      columns: args.data.columns,
      rows: filteredRows,
    },
  };
};
