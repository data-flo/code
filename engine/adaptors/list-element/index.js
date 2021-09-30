module.exports = function (args) {
  if (args.list.length && args.index >= 1 && args.index <= args.list.length) {
    return {
      value: args.list[args.index - 1],
    };
  } else {
    return {
      value: null,
    };
  }
};
