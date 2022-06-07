const utils = require("../../utils");

module.exports = function (args) {
  const data = args.data.clone();
  const columns = args.columns || data.columns;
  const pattern = utils.text.makeRegexp(
    args.pattern,
    args["ignore case"],
    true
  );
  for (const row of data.rows) {
    for (const column of columns) {
      const value = row[column];
      if (value) {
        row[column] = value.toString().replace(pattern, args.replacement);
      }
    }
  }
  return {
    data,
  };
};
