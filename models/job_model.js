const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "freelance", "remote", "instant"],
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
    paymentStatus: {
      type: String,
      enum: ["unpaid", "in-progress", "paid", "refunded"],
      default: "unpaid",
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "lead"],
    },
    durationType: {
      type: String,
      enum: ["instant", "regular"],
      required: true,
    },
    salary: { type: Number },
    requirements: [String],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    description: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 200,
      validate: {
        validator: function (v) {
          const wordCount = v.trim().split(/\s+/).length;
          return wordCount >= 20 && wordCount <= 200;
        },
        message: "Description must be between 20 and 200 words.",
      },
    },
    applications: [
      {
        applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["applied", "reviewed", "shortlisted", "rejected", "hired"],
          default: "applied",
        },
        appliedAt: { type: Date, default: Date.now },
        attachments: [
          {
            fileType: { type: String },
            filename: { type: String },
            url: { type: String },
            fileType: { type: String },
            size: { type: Number },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Add 2dsphere index for geospatial queries
jobSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("Job", jobSchema);
