const mongoose = require("mongoose");

const schema = mongoose.Schema(require("./schema"));

module.exports = module.exports = mongoose.models.Cache || mongoose.model("Cache", schema);
