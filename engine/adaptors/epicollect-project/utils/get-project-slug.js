const validUrl = /^https:\/\/five\.epicollect\.net\/project\/([^\/]+)/i;

module.exports = function (url) {
  const match = validUrl.exec(url);
  if (match && match[1]) {
    return match[1];
  }
  else {
    throw new Error("Invalid Epicollect5 project URL.");
  }
};
