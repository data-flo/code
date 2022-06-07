module.exports = function (args) {
  const values = (
    args.list
      .slice(args.start - 1, args.end || args.list.length)
      .filter((_, index) => !Number.isInteger(args.limit) || index < args.limit)
  );
  return {
    values,
  };
};
