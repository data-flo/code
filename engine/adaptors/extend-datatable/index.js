module.exports = function extendDatatable(args) {
  const sourceColumn = args.data.getColumn(args.source);
  const data = args.data.clone();
  data.addColumn(
    args.target,
    (row) => args.values.get(row[sourceColumn]),
  );
  return {
    data,
  };
};
