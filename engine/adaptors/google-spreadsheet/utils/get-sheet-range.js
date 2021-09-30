/* eslint one-var: 0, one-var-declaration-per-line: 0 */

const columnToLetter = require("./column-to-letter");

const validRangeRegex = /^(?:([A-Z]+)(\d+)?)?:?(?:([A-Z]+)(\d+)?)?$/i;

module.exports = function (sheetProps, range) {
  let fromCol, fromRow, toCol, toRow;
  if (range) {
    const firstMatch = range.match(validRangeRegex);
    if (firstMatch) {
      fromCol = firstMatch[1];
      fromRow = firstMatch[2];
      toCol = firstMatch[3];
      toRow = firstMatch[4];
    }
  }
  fromCol = fromCol || "A";
  fromRow = fromRow || "1";
  toCol = toCol || columnToLetter(sheetProps.gridProperties.columnCount);
  toRow = toRow || sheetProps.gridProperties.rowCount;
  return {
    fromCol,
    fromRow,
    toCol,
    toRow,
    sheet: sheetProps.title,
    address: `${sheetProps.title}!${fromCol}${fromRow}:${toCol}${toRow}`,
  };
};
