const toString = require("stream-to-string");

module.exports = async function (args, context) {
  const data = await toString(args.csv, args.encoding);

  const rows = context.utils.data.parseCsv(
    data,
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
