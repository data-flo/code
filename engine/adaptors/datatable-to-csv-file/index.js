const stream = require("stream");
const papaparse = require("papaparse");

module.exports = function createDatatable(args) {
  const csv = papaparse.unparse(
    {
      fields: args.columns || args.data.columns,
      data: args.data.rows,
    },
    {
      delimiter: (args.separator === "\\t") ? "\t" : args.separator,
      newline: args.newline,
    }
  );

  const file = new stream.Readable();
  // Add universal BOM to force excel to read CSV in utf-8
  // https://stackoverflow.com/questions/42462764/javascript-export-csv-encoding-utf-8-issue
  file.push("\uFEFF", "utf8")
  file.push(csv, "utf8");
  file.push(null);
  file.name = args.filename;
  file.mediaType = "text/csv";

  return { csv: file };
};
