const request = require("request");

module.exports = async function (uri, json, headers = {}) {
  return new Promise((resolve, reject) => {
    request.post({ uri, json, headers }, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};
