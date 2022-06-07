const { google } = require("googleapis");

module.exports = async function (auth, spreadsheetId, range) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await Promise.all([
    sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    }),
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ]);
  return res[0].data.values || [];
};
