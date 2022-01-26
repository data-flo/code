const fs = require("fs");
const path = require("path");
const mergeOptions = require("merge-options");

let config = require("../defaults.json");

const configFilePath = process.env.CONFIG_FILE || path.resolve(__dirname, "..", "config.json");
if (fs.existsSync(configFilePath)) {
  config = mergeOptions(config, require(configFilePath));
}

module.exports = config;
