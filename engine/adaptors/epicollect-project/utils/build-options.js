const getAuthorisationHeader = require("./get-authorisation-header");

module.exports = async function (args, context) {
  const options = {};

  if ((args["client id"] || args["client secret"]) && !(args["client id"] && args["client secret"])) {
    throw new Error("Both `client id` and `client secret` are required.");
  }

  if (args["client id"] && args["client secret"]) {
    options.headers = await getAuthorisationHeader(args.url, args["client id"], args["client secret"], context);
  }

  return options;
};
