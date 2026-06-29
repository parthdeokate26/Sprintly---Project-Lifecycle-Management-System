const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    sentTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);

