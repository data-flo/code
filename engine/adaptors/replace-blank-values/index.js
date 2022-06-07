module.exports = function (args) {
  const column = args.data.getColumn(args.column);
  const data = args.data.clone();
  for (const row of data.rows) {
    const value = row[column];
    if (!(column in row) || (value === undefined) || (value === null) || (value === "")) {
      row[column] = args.replacement;
    }
  }
  return {
    data,
  };
};
