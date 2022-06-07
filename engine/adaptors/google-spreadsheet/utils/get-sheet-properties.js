const { google } = require("googleapis");

module.exports = async function (auth, spreadsheetId, sheetTitle) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.get({ spreadsheetId });
  if (res.data.sheets.length === 0) {
    throw new Error(`The Google Spreadsheet (${spreadsheetId}) does not contain any sheets.`);
  }
  if (sheetTitle) {
    const info = res.data.sheets.find((x) => x.properties.title === sheetTitle);
    if (!info) {
      throw new Error(`Cannot find Sheet with title ${sheetTitle}.`);
    }
    return info.properties;
  }
  else {
    return res.data.sheets[0].properties;
  }
};
