const mongoose = require("mongoose");

const schema = mongoose.Schema(require("./schema"));

module.exports = mongoose.model("Cache", schema);
