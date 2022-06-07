module.exports = function (args) {
  const collection = args.collection.clone();

  collection.set(args.name, args.list);

  return {
    collection,
  };
};
