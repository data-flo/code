module.exports = function (args) {
  const entries = {};

  if (args["initial entries"]) {
    for (const [ key, value ] of args["initial entries"].entries()) {
      entries[key] = value;
    }
  }

  return {
    collection: entries,
  };
};
