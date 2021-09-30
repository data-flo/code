const validUrl = /^https:\/\/drive\.google\.com\/(?:drive\/folders\/|drive\/u\/\d+\/folders\/|open\?id=)([A-Z0-9\_-]+)/i;

module.exports = function urlToId(url) {
  const match = validUrl.exec(url);
  if (match && match[1]) {
    return match[1];
  }
  else {
    throw new Error("Invalid Google Drive folder or file URL.");
  }
};
