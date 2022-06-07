const mongoose = require("mongoose");

const schema = mongoose.Schema(require("./schema"));

schema.pre("save", require("./pre-save"));

schema.statics.findOneOrCreate = require("./findOneOrCreate");

schema.statics.findByAccessToken = require("./find-by-access-token");

module.exports = mongoose.models.User || mongoose.model("User", schema);
