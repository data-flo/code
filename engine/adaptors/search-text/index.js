const makeRegexp = (expression, ignoreCase) => {
  if (expression.startsWith("/") && expression.endsWith("/")) {
    return new RegExp(
      expression.substring(1, expression.length - 1),
      ignoreCase ? "i" : ""
    );
  } else {
    throw new Error(`Invalid regular expression: '${expression}'`);
  }
};

module.exports = function (args) {
  const regex = makeRegexp(args.expression, args.ignoreCase);
  const firstMatch = args.text.match(regex);
  if (firstMatch) {
    return {
      match: firstMatch[args.index],
      groups: firstMatch.slice(1),
    };
  }
  else {
    return {
      match: null,
      groups: [],
    };
  }
};
