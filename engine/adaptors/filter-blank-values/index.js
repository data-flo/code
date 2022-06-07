module.exports = function (args) {
  const column = args.data.getColumn(args.column);
  const blankRows = [];
  const nonBlankRows = [];
  for (const row of args.data.rows) {
    const value = row[column];
    if (!(column in row) || (value === undefined) || (value === null) || (value === "")) {
      blankRows.push(row);
    }
    else {
      nonBlankRows.push(row);
    }
  }
  return {
    blanks: {
      columns: args.data.columns,
      rows: blankRows,
    },
    "non-blanks": {
      columns: args.data.columns,
      rows: nonBlankRows,
    },
  };
};
