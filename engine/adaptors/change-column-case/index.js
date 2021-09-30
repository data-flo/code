const changeCase = require("change-case");

const converions = {
  no: changeCase.noCase,
  dot: changeCase.dotCase,
  swap: changeCase.swapCase,
  path: changeCase.pathCase,
  upper: changeCase.upperCase,
  lower: changeCase.lowerCase,
  camel: changeCase.camelCase,
  snake: changeCase.snakeCase,
  title: changeCase.titleCase,
  param: changeCase.paramCase,
  kebab: changeCase.kebabCase,
  hyphen: changeCase.hyphenCase,
  header: changeCase.headerCase,
  pascal: changeCase.pascalCase,
  constant: changeCase.constantCase,
  sentence: changeCase.sentenceCase,
  upperfirst: changeCase.upperCaseFirst,
  lowerfirst: changeCase.lowerCaseFirst,
};

module.exports = function (args) {
  const column = args.data.getColumn(args.column);
  if (!(args.case in converions)) {
    const validConverions = Object.keys(converions).map((x) => `\`${x}\``).join(", ");
    throw new Error(`Invalid case converion. Supported converions are: ${validConverions}`);
  }
  const converion = converions[args.case];
  const data = args.data.clone();
  data.addColumn(
    args.target || args.column,
    (row) => {
      const sourceValue = row[column];
      if (sourceValue) {
        return converion(sourceValue);
      }
      return sourceValue;
    },
  );

  return {
    data,
  };
};
