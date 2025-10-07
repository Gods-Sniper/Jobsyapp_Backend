const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ["info", "warn", "error", "debug"],
  },
  message: {
    type: String,
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who did it
  action: { type: String, required: true },
  target: { type: mongoose.Schema.Types.ObjectId }, // optional, e.g., job/user affected
  description: { type: String },
});

module.exports = mongoose.model("Log", logSchema);
