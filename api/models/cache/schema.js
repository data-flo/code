module.exports = {
  key: {
    index: true,
    required: true,
    type: String,
    unique: true,
  },
  timestamp: {
    type: Date,
  },
  value: {
    required: true,
    type: Object,
  },
};
