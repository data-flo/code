const url = require("url");

module.exports = function (args) {
  return {
    url: url.format({
      protocol: args.protocol,
      hostname: args.hostname,
      port: args.port,
      pathname: args.pathname,
    }),
  };
};
