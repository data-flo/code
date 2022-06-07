
const utils = require("../../utils");

module.exports = function (args) {
  const findColumn = args.data.getColumn(args["find column"]);
  const replaceColumn = args.data.getColumn(args["replace column"]);
  const findPattern = utils.text.makeRegexp(args["find pattern"]);
  const replacePattern = utils.text.makeRegexp(args["replace pattern"]);

  const data = args.data.clone();
  for (const row of data.rows) {
    if ((findColumn in row) && (replaceColumn in row) && findPattern.test(row[findColumn])) {
      row[replaceColumn] = row[replaceColumn].toString().replace(replacePattern, args.replacement);
    }
  }

  return {
    data,
  };
};
