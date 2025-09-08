const Job = require("../models/job_model");
const Category = require("../models/category_model");
const {
  createNotification,
} = require("../Controllers/notification_controller");
const { getCoordinates } = require("../utils/helper");

exports.createJob = async (req, res) => {
  try {
    const {
      title,
      category,
      location,
      duration,
      description,
      jobType,
      salary,
      requirements,
    } = req.body;

    if (!location)
      return res
        .status(400)
        .json({ message: "Location is required", status: "error" });
    const coords = await getCoordinates(location);

    if (!(await Category.findById(category))) {
      return res
        .status(400)
        .json({ message: "Invalid category", status: "error" });
    }
    console.log(req.user, "huuuu");
    const job = await Job.create({
      title,
      category,
      location: {
        type: "Point",
        coordinates: [coords.longitude, coords.latitude],
      },
      duration,
      description,
      jobType,
      salary,
      requirements,
      postedBy: req.user._id,
    });
    // await createNotification({
    //   from: req.user.id,
    //   to: req.user.id,
    //   type: "new_job_post",
    //   job: job._id,
    //   message: `Your job "${job.title}" has been posted successfully.`,
    // });
    res.status(201).json(job);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

//update job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job)
      return res.status(404).json({ error: "Job not found or not authorized" });
    res.json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      postedBy: req.user._id,
    });
    if (!job)
      return res.status(404).json({ error: "Job not found or not authorized" });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get jobs posted by the authenticated provider
exports.getJobsByProvider = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).populate(
      "category",
      "name"
    );
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all jobs with optional filters
exports.getJobs = async (req, res) => {
  try {
    const { category, durationType, status } = req.query;
    let filter = { isPublished: true };

    if (category) {
      const cat = await Category.findOne({ name: category });
      if (cat) filter.category = cat._id;
    }

    if (durationType) filter.durationType = durationType;
    if (status) filter.jobStatus = status;

    const jobs = await Job.find(filter)
      .populate("category", "name")
      .populate("postedBy", "name email");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("category", "name postedBy")
      .populate("postedBy", "name email phone");
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get nearby jobs based on location and distance
exports.getNearbyJobs = async (req, res) => {
  try {
    const { distance, location } = req.query;
    if (!location)
      return res.status(400).json({ message: "Location required" });

    const coords = await getCoordinates(location);
    const maxDistance = distance ? parseInt(distance) : 10000;

    const jobs = await Job.find({
      isPublished: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [coords.longitude, coords.latitude],
          },
          $maxDistance: maxDistance,
        },
      },
    }).populate("category", "name");

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Apply to a job
exports.applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (!job.applications) job.applications = [];
    if (
      job.applications.some(
        (app) => app.applicant.toString() === req.user._id.toString()
      )
    ) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = {
      applicant: req.user._id,
      cv: req.file
        ? {
            filename: req.file.originalname,
            url: req.file.path,
            fileType: req.file.mimetype,
            size: req.file.size,
          }
        : undefined,
      attachments: req.files
        ? req.files.map((f) => ({
            filename: f.originalname,
            url: f.path,
            fileType: f.mimetype,
            size: f.size,
          }))
        : [],
    };

    job.applications.push(application);
    await job.save();

    await createNotification({
      from: req.user._id,
      to: job.postedBy,
      type: "application_request",
      message: `New application for your job "${job.title}".`,
    });
    res.json({ message: "Applied successfully", application, response: "ok" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get applicants for a job
exports.getApplicants = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      postedBy: req.user._id,
    }).populate("applications.applicant", "name email phone");
    if (!job)
      return res
        .status(404)
        .json({ message: "Job not found or not authorized" });
    res.json(job.applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
