/* eslint "no-plusplus": 0 */

module.exports = function (args) {
  const column = args.data.getColumn(args.column);

  let startValue = null;
  if (args.start) {
    startValue = args.start;
  }
  else {
    for (let index = 1; index < args.data.rows.length; index++) {
      const cellValue = args.data.rows[index][column];
      if (cellValue === null || cellValue === undefined || cellValue === "") {
        startValue = args.data.rows[index - 1][column];
        break;
      }
    }
  }
  if (!startValue) {
    throw new Error("A start value was not specified.");
  }

  const firstMatch = startValue.match(/(\d+)$/i);
  let prefix = null;
  let sequenceNumber = null;
  if (firstMatch) {
    sequenceNumber = Number.parseInt(firstMatch[1], 10);
    prefix = startValue.substring(0, startValue.length - firstMatch[1].length);
  }

  const data = args.data.clone();
  data.addColumn(
    column,
    (row) => (
      row[column] || `${prefix}${++sequenceNumber}`
    ),
  );

  return {
    data,
  };
};
