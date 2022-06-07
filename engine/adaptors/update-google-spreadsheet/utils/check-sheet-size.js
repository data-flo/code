
const { google } = require("googleapis");

async function addCells(authClient, spreadsheetId, sheet, rowCount, columnCount) {
  const sheets = google.sheets({ version: "v4", auth: authClient });
  const newRowCount = Math.max(sheet.gridProperties.rowCount, rowCount);
  const newColumnCount = Math.max(sheet.gridProperties.columnCount, columnCount);
  const request = {
    spreadsheetId,
    resource: {
      requests: [
        {
          updateSheetProperties: {
            properties: {
              sheetId: sheet.sheetId,
              gridProperties: {
                rowCount: newRowCount,
                columnCount: newColumnCount,
              },
            },
            fields: "gridProperties",
          },
        },
      ],
    },
  };
  const response = await sheets.spreadsheets.batchUpdate(request);
  sheet.gridProperties = {
    rowCount: newRowCount,
    columnCount: newColumnCount,
  };
  return response.data;
}

module.exports = async function (authClient, spreadsheetId, sheet, cellUpdates, resize) {
  let maxRow = 0;
  let maxColumn = 0;
  for (const [row, col] of cellUpdates) {
    if (row > maxRow) {
      maxRow = row;
    }
    if (col > maxColumn) {
      maxColumn = col;
    }
  }

  if (maxRow >= sheet.gridProperties.rowCount || maxColumn >= sheet.gridProperties.columnCount) {
    if (resize) {
      await addCells(authClient, spreadsheetId, sheet, maxRow + 1, maxColumn + 1);
    }
    else if (maxRow > sheet.gridProperties.rowCount) {
      throw new Error(`Cannot update Sheet ${sheet.title}. Sheet size must be at least ${maxRow + 1} rows (current size is ${sheet.gridProperties.rowCount}).`);
    }
    else if (maxColumn > sheet.gridProperties.columnCount) {
      throw new Error(`Cannot update Sheet ${sheet.title}. Sheet size must be at least ${maxColumn + 1} columns (current size is ${sheet.gridProperties.columnCount}).`);
    }
  }
};
