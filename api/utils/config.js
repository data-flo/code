const fs = require("fs");
const path = require("path");
const mergeOptions = require("merge-options");

let config = require("../defaults.json");

if (fs.existsSync(path.resolve(__dirname, "..", "config.json"))) {
  config = mergeOptions(config, require("../config.json"));
}

module.exports = config;
