module.exports = function (value) {
  if (Array.isArray(value)) {
    return value;
  }

  const array = Array.from(value);

  if (!Array.isArray(array)) {
    throw new Error(`Cannot convert value '${value}' to list`);
  }

  return array;
};
