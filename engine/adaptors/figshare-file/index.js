const validUrl = /^https:\/\/figshare\.com\/articles\/([^\/]+)\/(\d+)/i;

module.exports = async function (args, context) {
  const match = validUrl.exec(args.url);
  if (match && match[2]) {
    const details = await (
      context.request.getHttp(`https://api.figshare.com/v2/articles/${match[2]}`)
        .then(JSON.parse)
    );
    if (details.files && details.files.length && details.files[0].download_url) {
      const content = await context.request.getHttp(details.files[0].download_url);
      return { file: content };
    }
  }

  throw new Error("Invalid Figshare file URL.");
};
