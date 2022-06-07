module.exports = function (args) {
  const merged = [
    ...args.first,
    ...args.second,
  ];
  return {
    merged,
  };
};
