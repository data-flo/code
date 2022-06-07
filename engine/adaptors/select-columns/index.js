module.exports = function (args) {
  const rows = args.data.rows;
  const columns = args.columns;
  return {
    data: {
      columns,
      rows,
    },
  };
};
