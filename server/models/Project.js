const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    approvalStatus: {
      type: String,
      default: "requested"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    clientReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientRequest",
    },

    status: {
    type: String,
    enum: [
        "Pending",
        "Planning",
        "Development",
        "Debugging",
        "Testing",
        "Awaiting Deployment Approval",
        "Deployment",
        "Completed",
        "Cancelled"
    ],
    default: "Pending"
}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
