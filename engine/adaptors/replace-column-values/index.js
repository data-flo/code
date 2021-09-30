const utils = require("../../utils");

module.exports = function (args) {
  if (!args.data.hasColumn(args.source)) {
    throw new Error(`data does not include a column named '${args.source}'`);
  }

  const data = args.data.clone();
  const pattern = utils.text.makeRegexp(args.pattern);
  data.addColumn(
    args.target || args.source,
    (row) => {
      const sourceValue = row[args.source];
      if (sourceValue) {
        if (typeof (sourceValue) === "number") {
          const targetValue = sourceValue.toString().replace(pattern, args.replacement);
          // convert back to a number if possible
          if (Number.isNaN(+targetValue)) {
            return targetValue;
          } else {
            return Number(targetValue);
          }
        } else {
          return sourceValue.replace(pattern, args.replacement);
        }

      }
      return null;
    },
  );

  return {
    data,
  };
};
