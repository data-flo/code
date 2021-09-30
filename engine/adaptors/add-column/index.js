module.exports = function (args) {
  const data = args.data.clone();
  data.addColumn(
    args.column,
    () => args.value || ""
  );
  return {
    data,
  };
};
