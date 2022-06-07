const { google } = require("googleapis");
const columnToLetter = require("../../google-spreadsheet/utils/column-to-letter");

module.exports = async function (auth, spreadsheetId, sheet, cellUpdates) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: "RAW",
      data: cellUpdates.map(([row, col, value]) => {
        if (row > sheet.gridProperties.rowCount) {
          throw new Error(`Cannot update Sheet ${sheet.title}`);
        }
        const cell = `${columnToLetter(col + 1)}${row + 1}`;
        return {
          range: `${sheet.title}!${cell}:${cell}`,
          values: [[value]],
        };
      }),
    },
  });
  return res.data;
};
