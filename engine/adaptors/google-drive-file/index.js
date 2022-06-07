const validUrl = /^https:\/\/drive\.google\.com\/(?:file\/d\/|open\?id=)([^\/]+)/i;

module.exports = async function (args, context) {
  const match = validUrl.exec(args.url);
  if (match && match[1]) {
    const url = `https://drive.google.com/uc?id=${match[1]}&export=download&confirm=no_antivirus`;
    const content = await context.request.getHttp(url);
    return { file: content };
  } else {
    throw new Error("Invalid Google Drive URL.");
  }
};
