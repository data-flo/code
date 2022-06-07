const mongoose = require("mongoose");

const schema = mongoose.Schema(require("./schema"));

schema.pre("save", require("./pre-save"));

schema.methods.cloneManifest = require("./clone-manifest");

schema.statics.findByIdentifier = require("./find-by-identifier");
schema.statics.getManifest = require("./get-manifest");

module.exports = mongoose.models.Dataflow || mongoose.model("Dataflow", schema);
