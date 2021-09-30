const url = require("url");

const root = process.env.API_URL_BROWSER || "/";

module.exports = function (path) {
  return url.resolve(root, path);
};
