const validRegexp = /^(?:https:\/\/docs\.google\.com\/spreadsheets\/d\/|https:\/\/drive\.google\.com\/open\?id=)((?:e\/)?[^\/]+)\/?(.*)/i;

module.exports = function (url) {
  const match = validRegexp.exec(url);
  if (match && match[1]) {
    return match[1];
  }
  else {
    throw new Error("Invalid Google Sheets URL.");
  }
};
