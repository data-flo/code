const stream = require("stream");
const papaparse = require("papaparse");

module.exports = function createDatatable(args) {
  const csv = papaparse.unparse(
    {
      fields: args.columns || args.data.columns,
      data: args.data.rows,
    },
    {
      delimiter: args.separator,
      newline: args.newline,
    }
  );

  const file = new stream.Readable();
  file.push(csv, "utf8");
  file.push(null);
  file.name = args.filename;
  file.mediaType = "text/csv";

  return { csv: file };
};
