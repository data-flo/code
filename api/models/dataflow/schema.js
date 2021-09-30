const mongoose = require("mongoose");
const shortUUID = require("short-uuid");

const { ObjectId, Mixed } = mongoose.Schema.Types;

module.exports = {
  access: {
    default: "private",
    enum: [
      "private",
      "protected",
      "public",
    ],
    index: true,
    type: String,
  },
  description: {
    type: String,
  },
  createdAt: {
    default: () => new Date(),
    index: true,
    type: Date,
  },
  folder: {
    type: String,
  },
  identifier: {
    default: shortUUID.generate,
    index: true,
    required: true,
    type: String,
    unique: true,
  },
  manifest: {
    input: [
      {
        _id: false,
        default: {
          type: Mixed,
        },
        description: {
          type: String,
        },
        enum: {
          type: Array,
        },
        isRequired: {
          default: true,
          required: true,
          type: Boolean,
        },
        isSecret: {
          default: false,
          required: false,
          type: Boolean,
        },
        name: {
          required: true,
          trim: true,
          type: String,
        },
        type: {
          lowercase: true,
          required: true,
          trim: true,
          type: String,
        },
        ui: {
          x: {
            type: Number,
          },
          y: {
            type: Number,
          },
        },
      },
    ],
    output: [
      {
        _id: false,
        argument: {
          required: true,
          trim: true,
          type: String,
        },
        name: {
          required: true,
          trim: true,
          type: String,
        },
        type: {
          lowercase: true,
          required: true,
          trim: true,
          type: String,
        },
        description: {
          trim: true,
          type: String,
        },
        transformation: {
          required: true,
          trim: true,
          type: String,
        },
        ui: {
          x: {
            type: Number,
          },
          y: {
            type: Number,
          },
        },
      },
    ],
    transform: [
      {
        _id: false,
        adaptor: {
          lowercase: true,
          trim: true,
          type: String,
        },
        dataflow: {
          trim: true,
          type: String,
        },
        description: String,
        type: {
          lowercase: true,
          required: true,
          trim: true,
          type: String,
        },
        name: {
          lowercase: true,
          required: true,
          trim: true,
          type: String,
        },
        ui: {
          x: {
            type: Number,
          },
          y: {
            type: Number,
          },
        },
        binding: [
          {
            _id: false,
            argument: {
              trim: true,
              type: String,
            },
            input: {
              trim: true,
              type: String,
            },
            type: {
              lowercase: true,
              required: true,
              trim: true,
              type: String,
            },
            target: {
              required: true,
              trim: true,
              type: String,
            },
            transformation: {
              lowercase: true,
              trim: true,
              type: String,
            },
            value: {
              type: Mixed,
            },
          },
        ],
      },
    ],
    version: {
      default: 1,
      required: true,
      type: Number,
    },
  },
  name: {
    default: null,
    type: String,
  },
  showDetailedErrors: {
    default: false,
    type: Boolean,
  },
  updatedAt: {
    index: true,
    type: Date,
  },
  user: {
    ref: "User",
    type: ObjectId,
  },
};
