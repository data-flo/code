module.exports = function (args) {
  const set = Array.from(new Set(args.list));
  return { set };
};
