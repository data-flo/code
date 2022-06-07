const Mustache = require("mustache");

module.exports = function (args) {
  const view = {};
  for (const [ key, value ] of args.variables.entries()) {
    view[key] = value;
  }
  const output = Mustache.render(
    args.template,
    view,
  );

  return {
    output,
  };
};
