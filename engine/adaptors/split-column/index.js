const utils = require("../../utils");

module.exports = function (args) {
  const column = args.data.getColumn(args.source);
  const regex = utils.text.makeRegexp(args.separator, true, true);

  const rows = [];
  for (const prevRow of args.data.rows) {
    let nextRow = prevRow;
    const value = prevRow[column];
    if (value) {
      nextRow = { ...prevRow };
      const splits = value.toString().split(regex);
      for (let index = 0; index < args.columns.length && index < splits.length; index++) {
        nextRow[args.columns[index]] = splits[index];
      }
    }
    rows.push(nextRow);
  }

  return {
    data: {
      columns: [
        ...args.data.columns,
        ...args.columns,
      ],
      rows,
    },
  };
};
