module.exports = function (args, context) {
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
