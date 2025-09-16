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

    paymentStatus: {
      type: String,
      enum: ["unpaid", "in-progress", "paid", "refunded"],
      default: "unpaid",
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
      minlength: 2,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

jobSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Job", jobSchema);
