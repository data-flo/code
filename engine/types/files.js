const GeneratorFunction = async function*(){};

module.exports = function (value) {
  if (Array.isArray(value) || value.__proto__.constructor === GeneratorFunction().__proto__.constructor) {
    return value;
  }

  throw new Error(`Cannot convert value '${value}' to file list`);
};
