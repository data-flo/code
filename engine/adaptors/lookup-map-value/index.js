module.exports = function (args) {
  if (args.dictionary.has(args.query)) {
    return {
      value: args.dictionary.get(args.query),
    };
  }
  else {
    return {
      value: args.default,
    };
  }
};
