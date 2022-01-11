const path = require("path");
const Filehound = require("filehound");
const globalTunnel = require("global-tunnel-ng");

const runAdaptor = require("./runner/run-adaptor");
const runDataflow = require("./runner/run-dataflow");
const request = require("./utils/request");
const cache = require("./utils/cache");
const utils = require("./utils");

globalTunnel.initialize();

const defaultConfig = {
  adaptors: "./adaptors",
  defaults: {},
  fsMappings: {},
};

class Engine {
  constructor(config = {}) {
    this.options = Object.assign({}, defaultConfig, config);
    this.request = config.request || request;
    this.cache = config.cache || cache;
    this.utils = utils;
    this.utils.file.map = require("./utils/file/map").bind(this, this.options.fsMappings);

    this.getDataflowManifest = this.getDataflowManifest.bind(this);
  }

  getDataflowManifest(name) {
    if (this.options.getDataflowManifest && typeof this.options.getDataflowManifest === "function") {
      return this.options.getDataflowManifest(name);
    } else {
      throw new Error(`Cannot resolve manifest for dataflow ${name}.`);
    }
  }

  getAdaptorsFolder() {
    return path.join(__dirname, this.options.adaptors);
  }

  getAdaptorsList() {
    return Filehound.create()
      .path(this.getAdaptorsFolder())
      .depth(1)
      .directory()
      .find()
      .then((subdirectories) =>
        subdirectories.map((dir) => {
          const name = path.basename(dir);
          return {
            name,
            manifest: this.getAdaptorManifest(name),
          };
        })
      );
  }

  getAdaptorManifest(name) {
    const manifest = require(path.join(this.getAdaptorsFolder(), name, "manifest.json"));
    if (typeof this.options.defaults[name] !== "undefined") {
      for (const [key, value] of Object.entries(this.options.defaults[name])) {
        const input = manifest.input.find((x) => x.name === key);
        if (typeof input !== "undefined") {
          if (typeof input.default !== "undefined" && input.default !== "") {
            input.description = input.description.replace(`\`${input.default}\``, value);
          }
          input.default = value;
        } else {
          throw new Error(`Cannot override default value for input argument ${key} of ${name} adaptor.`);
        }
      }
    }
    return manifest;
  }

  getAdaptorExecutable(name) {
    return require(path.join(this.getAdaptorsFolder(), name, "index.js"));
  }

  runAdaptor(name, args) {
    return runAdaptor(name, args, this);
  }

  runDataflow(manifest, args, options) {
    return runDataflow(manifest, args, options, this);
  }
}

module.exports = function (config) {
  return new Engine(config);
};
