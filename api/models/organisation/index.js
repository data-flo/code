const mongoose = require("mongoose");

const schema = mongoose.Schema(require("./schema"));

schema.pre("save", require("./pre-save"));

module.exports = mongoose.models.Organisation || mongoose.model("Organisation", schema);
