const Papaparse = require("papaparse");

module.exports = function createDatatable(args) {
  const csv = Papaparse.unparse(
    {
      fields: args.columns || args.data.columns,
      data: args.data.rows,
    },
    {
      delimiter: (args.separator === "\\t") ? "\t" : args.separator,
      newline: args.newline,
    }
  );
  return {
    csv,
  };
};
