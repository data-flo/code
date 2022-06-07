function getType(name) {
  const func = require(`../types/${name}.js`);
  return func;
}

module.exports = function get(name, value) {
  const typeCreator = getType(name);

  return typeCreator(value);
};
