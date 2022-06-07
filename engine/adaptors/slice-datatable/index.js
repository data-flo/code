module.exports = function (args) {
  let end = args.end || args.data.rows.length;
  if (end < 0) {
    end = args.data.rows.length + 1 - end;
  }
  const rows = (
    args.data.rows
      .slice(args.begin - 1, end)
      .filter((_, index) => !Number.isInteger(args) || (index < args.limit))
  );
  return {
    data: {
      columns: args.data.columns,
      rows,
    },
  };
};
