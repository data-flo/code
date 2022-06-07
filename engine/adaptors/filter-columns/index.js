const escapeStringRegexp = require("escape-string-regexp");

const makeRegexp = (pattern) => {
  if (pattern.startsWith("/") && pattern.endsWith("/")) {
    return new RegExp(pattern.substring(1, pattern.length - 1));
  } else {
    return new RegExp(escapeStringRegexp(pattern));
  }
};

module.exports = function (args) {
  const regexp = makeRegexp(args.pattern);
  const toRemove = new Set();
  for (const column of args.data.columns) {
    if (regexp.test(column)) {
        toRemove.add(column);
    }
  }
  const columnsToKeep = args.data.columns.filter((x) => !toRemove.has(x));
  const columnsToRemove = args.data.columns.filter((x) => toRemove.has(x));

  return {
    data: {
      columns: columnsToKeep,
      rows: args.data.rows,
    },
    complementary: {
      columns: columnsToRemove,
      rows: args.data.rows,
    },
  };
};
