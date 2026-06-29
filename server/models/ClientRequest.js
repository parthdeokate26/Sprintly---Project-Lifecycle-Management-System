const mongoose = require("mongoose");

const clientRequestSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      trim: true
    },

    deadline: {
      type: Date,
    },

    invoice: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "requested",
        "approved",
        "rejected",
        "in progress",
        "completed",
      ],
      default: "requested",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ClientRequest", clientRequestSchema);

