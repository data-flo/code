module.exports = function (args) {
  const index = args.list.findIndex((x) => x === args.separator);
  if (index >= 0) {
    return {
      first: args.list.slice(0, args.append ? index + 1 : index),
      second: args.list.slice(args.prepend ? index : index + 1),
    };
  }
  else {
    return {
      first: args.list,
      second: [],
    };
  }
};
