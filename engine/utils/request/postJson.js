const request = require("request");

module.exports = async function (uri, json, headers = {}) {
  return new Promise((resolve, reject) => {
    request.post(
      { uri, json, headers },
      (error, response, body) => {
        if (error) {
          reject(error);
        }
        else {
          const { statusCode, statusMessage } = response;
          if (statusCode !== 200) {
            reject(`${statusCode} ${statusMessage}`);
          }
          else {
            resolve(body);
          }
        }
      },
    );
  });
};
