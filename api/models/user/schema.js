const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

module.exports = {
  createdAt: { type: Date },
  email: String,
  name: String,
  organisation: { type: ObjectId, ref: "Organisation" },
  photo: String,
  providerIdentifier: String,
  providerType: String,
  apiAccessToken: {
    type: String,
    index: true,
  },
};
