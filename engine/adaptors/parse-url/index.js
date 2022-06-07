module.exports = function (args) {
  const url = new URL(args.url);
  return {
    href: url.href,
    origin: url.origin,
    protocol: url.protocol,
    username: url.username,
    password: url.password,
    host: url.host,
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    "query string": url.search,
    "query values": url.searchParams,
    hash: url.hash,
  };
};
