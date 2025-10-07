const User = require("../models/user_model");
const Job = require("../models/job_model");
const Feedback = require("../models/feedback_model");

exports.getSummary = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const jobs = await Job.countDocuments();
    const feedbacks = await Feedback.countDocuments();
    res.json({ users, jobs, feedbacks });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics summary" });
  }
};
