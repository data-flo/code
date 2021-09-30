const { google } = require("googleapis");

module.exports = async function getClient() {
  return google.auth.getClient({
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive.appdata",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  });
};
