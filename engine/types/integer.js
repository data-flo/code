module.exports = function (value) {
  if (Number.isInteger(value)) {
    return value;
  }

  const number = Number.parseInt(value, 10);

  if (Number.isNaN(number)) {
    throw new Error(`Cannot convert value '${value}' to integer`);
  }

  return number;
};
