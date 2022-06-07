module.exports = function (args) {
  const collection = args["first collection"].clone();

  for (const [ name, object ] of collection.pairs()) {
    collection.set(name, object);
  }

  return {
    collection,
  };
};
