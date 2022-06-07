const escapeStringRegexp = require("escape-string-regexp");

const makeRegexp = (treatAsRegex, pattern) => {
  if (treatAsRegex) {
    return new RegExp(pattern);
  }
  else {
    return new RegExp(escapeStringRegexp(pattern));
  }
};

module.exports = function (args) {
  const column = args.data.getColumn(args.column);
  const regexp = makeRegexp(args.regex, args.pattern);
  const data = {
    columns: args.data.columns,
    rows: args.data.rows.filter((row) => (column in row) && regexp.test(row[column])),
  };
  return {
    data,
  };
};
