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

    jobType: {
      type: String,
<<<<<<< HEAD
      enum: ["full-time", "part-time", "freelance", "remote", "instant"],
      required: true,
=======
      enum: ["Full-time", "Part-time", "Freelance", "remote", "Instant"],
      require: true,
>>>>>>> f26feee373b5a32955db972e764170a704d4a3f6
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
<<<<<<< HEAD
=======
    duration: {
      type: String,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

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
>>>>>>> f26feee373b5a32955db972e764170a704d4a3f6
  },
  { timestamps: true }
);

jobSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Job", jobSchema);
