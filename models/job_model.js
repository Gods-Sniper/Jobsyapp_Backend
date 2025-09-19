const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Freelance", "remote", "Instant"],
      require: true,
    },

    deadline: { type: Date },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    isPublished: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["applied", "reviewed", "shortlisted", "rejected", "hired"],
    },
    jobstatus: {
      type: String,
      enum: ["open", "in-progress", "completed", "closed"],
      default: "open",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "in-progress", "paid"],
      default: "unpaid",
    },

    salary: { type: Number },

    requirements: [String],
    address: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },

    description: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

jobSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Job", jobSchema);
