module.exports = function (args) {
  const column = args.data.getColumn(args.column);
  const list = args.data.rows.map((row) => row[column]);
  return {
    list,
  };
};
