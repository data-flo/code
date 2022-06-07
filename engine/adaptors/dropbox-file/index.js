const request = require("request");

const validUrl = /^https:\/\/www\.dropbox\.com\/s\/(.+)\/?/i;

module.exports = async function (args, context) {
  const match = validUrl.exec(args.url);
  if (match && match[1]) {
    const url = `https://www.dropbox.com/s/dl/${match[1]}`;
    const file = request(url);
    return { file };
  } else {
    throw new Error("Invalid Dropbox file URL.");
  }
};
