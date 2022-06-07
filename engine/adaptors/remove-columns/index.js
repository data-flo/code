module.exports = function (args) {
  const columnsToRemove = new Set(args.columns);
  const columns = args.data.columns.filter((x) => !columnsToRemove.has(x));
  return {
    data: {
      columns,
      rows: args.data.rows,
    },
  };
};
