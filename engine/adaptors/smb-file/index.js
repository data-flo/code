const fs = require("fs");
const SambaClient = require("samba-client");

module.exports = async function (args) {
  let shareAddress = args.share;
  if (/^smb:\/\//i.test(shareAddress)) {
    shareAddress = shareAddress.substr(4);
  }
  shareAddress = shareAddress.replace(/\//g, "\\");

  const smb2Client = new SambaClient({
    address: shareAddress,
    port: args.port,
    domain: args.domain,
    username: args.username,
    password: args.password,
    timeout: args.timeout,
  });

  let filePath = args["file path"];
  if (filePath.startsWith(args.share)) {
    filePath = filePath.substr(args.share.length);
  }
  filePath = filePath.replace(/\//g, "\\");
  if (filePath.startsWith("\\")) {
    filePath = filePath.substr(1);
  }

  const tmpFilePath = await context.utils.file.tmp({ postfix: ".dbf" });

  await smb2Client.getFile(
    filePath,
    tmpFilePath,
  );

  return { file: fs.createReadStream(tmpFilePath) };
};
