module.exports = function (args) {
  const list = args.list.slice();
  list.unshift(args.value);
  return {
    list,
  };
};
