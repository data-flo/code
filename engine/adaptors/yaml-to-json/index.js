module.exports = function (args) {
  const yaml = require('js-yaml');
  const json = yaml.load(args.yaml);
  const jsonString = JSON.stringify(json);
  return {
    "json": jsonString
  };
};
