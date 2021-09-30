const escapeStringRegexp = require("escape-string-regexp");

const makeRegexp = (pattern) => {
  if (pattern.startsWith("/") && pattern.endsWith("/")) {
    return new RegExp(pattern.substring(1, pattern.length - 1));
  } else {
    return new RegExp(escapeStringRegexp(pattern));
  }
};

module.exports = function (args) {
  const column = args.data.getColumn(args.column);
  const regexp = makeRegexp(args.pattern);
  const rows = [];
  const complementary = [];
  for (const row of args.data.rows) {
    if ((column in row) && regexp.test(row[column])) {
      rows.push(row);
    }
    else {
      complementary.push(row);
    }
  }
  return {
    complementary: {
      columns: args.data.columns,
      rows: complementary,
    },
    data: {
      columns: args.data.columns,
      rows,
    },
  };
};
