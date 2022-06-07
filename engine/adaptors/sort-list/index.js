module.exports = function (args) {
  const forwardOrder = (args.reverse) ? 1 : -1;
  const reverseOrder = (args.reverse) ? -1 : 1;
  const list = (
    args.list
      .slice()
      .sort(
        (a, b) => {
          if (a < b) {
            return forwardOrder;
          }

          if (a > b) {
            return reverseOrder;
          }

          // names must be equal
          return 0;
        }
      )
  );
  return {
    list,
  };
};
