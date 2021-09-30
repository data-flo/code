/* eslint no-restricted-globals: 0 */

module.exports = function (args) {
  if (!args.data.hasColumn(args.source)) {
    throw new Error(`data does not include a column named '${args.source}'`);
  }

  const data = args.data.clone();

  if (args.year) {
    data.addColumn(
      args.year,
      (row) => {
        const date = new Date(row[args.source]);
        if (isNaN(date.valueOf())) {
          return null;
        }
        else {
          return date.getFullYear();
        }
      }
    );
  }

  if (args.month) {
    data.addColumn(
      args.month,
      (row) => {
        const date = new Date(row[args.source]);
        if (isNaN(date.valueOf())) {
          return null;
        }
        else {
          return date.getMonth() + 1;
        }
      }
    );
  }

  if (args.day) {
    data.addColumn(
      args.day,
      (row) => {
        const date = new Date(row[args.source]);
        if (isNaN(date.valueOf())) {
          return null;
        }
        else {
          return date.getDate();
        }
      }
    );
  }

  return {
    data,
  };
};
