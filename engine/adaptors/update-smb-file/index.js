const SMB2 = require("@marsaud/smb2");

module.exports = async function (args) {
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
  let filePath = args["file path"];
  if (filePath.startsWith(args.share)) {
    filePath = filePath.substr(args.share.length);
  }
  filePath = filePath.replace(/\//g, "\\");
  if (filePath.startsWith("\\")) {
    filePath = filePath.substr(1);
  }

  const writeStream = await smb2Client.createWriteStream(filePath);

  args.update.pipe(writeStream);

  const file = await smb2Client.createReadStream(filePath);
  return { file };
};
