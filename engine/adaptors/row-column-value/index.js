module.exports = function (args) {
  const data = args.data;
  const column = args.data.getColumn(args.column || args.data.columns[0]);
  if (data.rows.length && args.row >= 1 && args.row <= data.rows.length) {
    return {
      value: data.rows[args.index - 1][column] || null,
    };
  }
  else {
    return {
      value: null,
    };
  }
};
