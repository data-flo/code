const FTPClient = require("ftp");
const { PassThrough } = require("stream");
const SFTPClient = require("ssh2-sftp-client");

const validUrl = /^s?ftp:\/\/(.+)$/i;

function getFtpFile(url) {
  let username;
  let password;
  let host;
  let path;
  if (url.match(/^s?ftp:\/\/(.+):(.+)@([^\/]+)(\/.+)$/)) {
    // eslint-disable-next-line no-undef
    [_, username, password, host, path] = url.match(/^s?ftp:\/\/(.+):(.+)@([^\/]+)(\/.+)$/);
  } else if (url.match(/^ftp:\/\/([^\/]+)(\/.+)$/)) {
    // eslint-disable-next-line no-undef
    [_, host, path] = url.match(/^ftp:\/\/([^\/]+)(\/.+)$/);
    username = "anonymous";
    password = "anonymous";
  } else {
    throw new Error("URL is not formatted correctly");
  }
  return new Promise((resolve, reject) => {
    // ftp site
    if (url.startsWith("ftp")) {
      const client = new FTPClient();
      client.on("ready", () => {
        client.get(path, (err, stream) => {
          if (err) {
            reject(err);
          }
          stream.once("close", () => { client.end(); });
          resolve(stream);
        });
      });
      client.connect({
        host,
        user: username,
        password,
      });
    } else if (url.startsWith("sftp")) { // sftp site
      const sftp = new SFTPClient();
      const pass = new PassThrough();
      sftp.connect({
        host,
        username,
        password,
      }).then(() => {
        sftp.get(path, pass);
        pass.on("finish", () => { sftp.end(); });
        resolve(pass);
      }).catch((err) => reject(err));
    }
  });
}

module.exports = async function (args) {
  const match = validUrl.exec(args.url);

  if (!match) {
    throw new Error("Invalid FTP file URL.");
  }

  const content = await getFtpFile(args.url);

  return { file: content };
};
