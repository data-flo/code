/* eslint no-restricted-globals: 0 */

const { format, parse, parseISO, isValid } = require("date-fns");
const locale = require("date-fns/locale");

module.exports = function (args) {
  if (!args.data.hasColumn(args["source column"])) {
    throw new Error(`data does not include a column named '${args["source column"]}'`);
  }

  const data = args.data.clone();

  const options = { locale: locale[args.locale.replace("-", "")] };

  data.addColumn(
    args["target column"] || args["source column"],
    (row) => {
      const rawValue = row[args["source column"]];
      if (rawValue) {
        let dateValue;
        if (rawValue instanceof Date && !isNaN(rawValue)) {
          dateValue = rawValue;
        }
        else if (args["source format"] === "ISO 8601") {
          dateValue = parseISO(rawValue);
        }
        else {
          dateValue = parse(
            rawValue,
            args["source format"],
            new Date(2000, 0, 1)
          );
        }

        if (isValid(dateValue)) {
          return format(dateValue, args["target format"], options);
        }
      }
      return undefined;
    }
  );

  return {
    data,
  };
};
