const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Sender (who triggered the notification)
      required: true,
    },

    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Receiver (who gets the notification)
      required: true,
    },

    type: {
      type: String,
      enum: [
        "application_request",
        "application_response",
        "application_status_update",
        "new_job_post",
        "job_deleted",
        "job_updated",
      ],
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobs",
    },

    message: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
