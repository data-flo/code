module.exports = function (args) {
  const rows = args.data.rows;
  const discardedColumns = new Set(args.columns);
  const columns = args.data.columns.filter((x) => !discardedColumns.has(x));
  return {
    data: {
      columns,
      rows,
    },
  };
};
