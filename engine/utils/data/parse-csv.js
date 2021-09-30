const papaparse = require("papaparse");

module.exports = function (csv, options) {
  const {
    delimiter = "",
    headers = true,
    newline = "",
  } = options || {};

  const results = papaparse.parse(
    csv,
    {
      delimiter,
      newline,
      header: headers,
      dynamicTyping: false,
      skipEmptyLines: true,
    }
  );

  if (Array.isArray(results.errors) && results.errors.length >= 1) {
    throw results.errors;
  }

  results.data.delimiter = results.meta.linebreak;
  results.data.linebreak = results.meta.delimiter;
  results.data.fields = results.meta.fields;
  return results.data;
};
