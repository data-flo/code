/* eslint eqeqeq: 0 */

module.exports = function (sheetData, args) {
  const cellUpdates = [];
  const updatedIds = new Set();
  const createdIds = new Set();
  const skippedIds = new Set();

  const columnsMapping = new Map();
  const sheetHeaders = sheetData.length ? sheetData[args["header row"] - 1].map((cell) => (cell ? cell.trim() : null)) : [];
  let numberOfColumns = sheetHeaders.length;
  for (const column of args.data.columns) {
    const index = sheetHeaders.indexOf(column);
    if (index >= 0) {
      columnsMapping.set(column, index);
    }
    else if (args["append columns"]) {
      columnsMapping.set(column, numberOfColumns);
      cellUpdates.push([0, numberOfColumns, column]);
      numberOfColumns += 1;
    }
  }

  const rowsMapping = new Map();
  const idColumnIndex = sheetHeaders.indexOf(args["id column"]);
  for (let index = args["header row"]; index < sheetData.length; index++) {
    const sheetRow = sheetData[index];
    rowsMapping.set(sheetRow[idColumnIndex], index);
  }

  let numberOfRows = (sheetData.length > 0) ? sheetData.length : 1;
  for (const row of args.data.rows) {
    const rowId = row[args["id column"]];
    if (rowsMapping.has(rowId)) {
      const sheetRowIndex = rowsMapping.get(rowId);
      const sheetRow = sheetData[sheetRowIndex];
      for (const [column, sheetColumnIndex] of columnsMapping.entries()) {
        if (column in row && (row[column] || "") != (sheetRow[sheetColumnIndex] || "")) {
          cellUpdates.push([sheetRowIndex, sheetColumnIndex, row[column] || ""]);
          updatedIds.add(rowId);
        }
      }
    }
    else if (args["append rows"]) {
      const sheetRowIndex = numberOfRows;
      numberOfRows += 1;
      for (const [column, sheetColumnIndex] of columnsMapping.entries()) {
        cellUpdates.push([sheetRowIndex, sheetColumnIndex, row[column]]);
        createdIds.add(rowId);
      }
    }
    else {
      skippedIds.add(rowId);
    }
  }

  return [
    cellUpdates,
    Array.from(updatedIds),
    Array.from(createdIds),
    Array.from(skippedIds),
  ];
};
