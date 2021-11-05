module.exports = function (args) {
  const rows = context.utils.data.parseCsv(
    args.csv,
    {
      delimiter: args.separator,
      newline: args.newline,
    }
  );

  return {
    data: {
      rows,
      columns: rows.fields,
    },
  };
};
