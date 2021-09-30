module.exports = function (args) {
  const data = {
    columns: [args.column],
    rows: args.list.map((x) => ({ [args.column]: x })),
  };
  return {
    data,
  };
};
