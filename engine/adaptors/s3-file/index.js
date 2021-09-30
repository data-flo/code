const dateFormat = require("dateformat");
const crypto = require("crypto");
const request = require("request");

function getS3File(url, headers) {
  return new Promise((resolve, reject) => {
    request(
      {
        url,
        headers,
      },
      (error, response, body) => {
        if (error) {
          reject(error);
        }
        else if (response.statusCode !== 200) {
          reject(response.statusCode);
        }
        else {
          resolve(body);
        }
      },
    );
  });
}

module.exports = async function (args) {
  const url = new URL(args.url);
  const headers = {};
  if (args.key) {
    if (!args.secret) {
      throw new Error("You must supply a secret with a key to download a private S3 object");
    }
    const now = Date();
    const formattedDate = dateFormat(now, "UTC:ddd, d mmm yyyy HH:MM:ss +0000");

    const [ bucket ] = url.hostname.split(".");

    const stringToSign = `GET\n\n\n${formattedDate}\n/${bucket}${url.pathname}`;

    const key = args.key;
    const secret = args.secret;

    // Calculate the signature to be sent as a header.
    const hmac = crypto.createHmac("sha1", secret).update(stringToSign);
    const signature = hmac.digest("base64");

    headers.Host = url.hostname;
    headers.Date = formattedDate;
    headers.Authorization = `AWS ${key}:${signature}`;
  }

  const file = await getS3File(url.href, headers);

  return { file };
};
