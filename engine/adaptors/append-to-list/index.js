module.exports = function (args) {
  const list = args.list.slice();
  list.push(args.value);
  return {
    list,
  };
};
