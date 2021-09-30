module.exports = function (value) {
  if (Number.isInteger(value)) {
    return value;
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    throw new Error(`Cannot convert value '${value}' to number`);
  }

  return number;
};
