const request = require("request");

module.exports = async function (uri, json) {
  return new Promise((resolve, reject) => {
    request.post({ uri, json }, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};
