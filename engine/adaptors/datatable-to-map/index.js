module.exports = function (args) {
  const keyColumn = args.data.getColumn(args["key column"]);
  const valueColumn = args.data.getColumn(args["value column"]);
  const dictionary = new Map();

  for (const row of args.data.rows) {
    if (keyColumn in row) {
      dictionary.set(row[keyColumn], row[valueColumn]);
    }
  }

  return {
    map: dictionary,
  };
};
