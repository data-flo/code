const path = require("path");
const SMB2 = require("@marsaud/smb2");

module.exports = async function (args, context) {
  let shareAddress = args.share;
  if (/^smb:\/\//i.test(shareAddress)) {
    shareAddress = shareAddress.substr(4);
  }
  shareAddress = shareAddress.replace(/\//g, "\\");
  const smb2Client = new SMB2({
    share: shareAddress,
    port: args.port,
    domain: args.domain,
    username: args.username,
    password: args.password,
  });

  let folderPath = args["folder path"];
  if (folderPath.startsWith(args.share)) {
    folderPath = folderPath.substr(args.share.length);
  }
  folderPath = folderPath.replace(/\//g, "\\");
  if (folderPath.startsWith("\\")) {
    folderPath = folderPath.substr(1);
  }

  const files = await smb2Client.readdir(folderPath);

  const fileNamePattern = context.utils.text.makeRegexp(args["name pattern"]);


  const filesGenerator = async function* fetchFiles() {
    for (const file of files) {
      if (fileNamePattern.test(file)) {
        const fileStream = await smb2Client.createReadStream(
          path.join(folderPath, file),
          { autoClose: false },
        );
        yield fileStream;
      }
    }
  }

  return { "files list": filesGenerator() };
};
