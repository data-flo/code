const tmp = require("tmp");

module.exports = function (options) {
  return new Promise((resolve, reject) => {
    tmp.tmpName(options, (err, path) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(path);
      }
    });
  });
};
