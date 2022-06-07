module.exports = function (args) {
  if (!args.data.hasColumn(args.source)) {
    throw new Error(`data does not include a column named '${args.source}'`);
  }

  const data = args.data.clone();

  for (const row of data.rows) {
    row[args.target] = row[args.source];
    row[args.source] = undefined;
  }

  data.columns[data.columns.indexOf(args.source)] = args.target;

  return {
    data,
  };
};
