const Application = require("../models/application_model");
const Job = require("../models/job_model");
const {
  createNotification,
} = require("../Controllers/notification_controller");
const User = require("../models/user_model");
const { sendPushNotification } = require("../utils/pushNotification");

exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    console.log(job, "jobsssss ");

    if (!job)
      return res.status(404).json({ message: "Job not found", success: false });

    let attachments = [];

    if (req.files && Object.keys(req.files).length > 0) {
      Object.keys(req.files).forEach((field) => {
        req.files[field].forEach((f) => {
          attachments.push({
            name: field,
            filename: f.originalname,
            url: f.path,
            size: f.size,
          });
        });
      });
    }

    if (job.requirements && job.requirements.length > 0) {
      const attachmentNames = attachments.map((a) => a.name);
      const missingRequirements = job.requirements.filter(
        (reqName) => !attachmentNames.includes(reqName)
      );

      if (missingRequirements.length > 0) {
        return res.status(400).json({
          message: `Missing required attachments: ${missingRequirements.join(
            ", "
          )}`,
        });
      }
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      attachments,
      status: "applied",
    });
    console.log(job.postedBy, "job.postedBy", job);

    await createNotification({
      from: req.user._id,
      to: job.postedBy,
      job: job._id,
      application: application._id,
      type: "application_request",
      message: `A new application has been submitted for your job "${job.title}`,
    });

    const recipient = await User.findById(job.postedBy);
    if (recipient && recipient.expoPushToken) {
      await sendPushNotification(
        recipient.expoPushToken,
        `You apply for job "${job.title}".`
      );
    }
    res.status(201).json({
      message: "Application submitted successfully",
      data: application,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({
      job: req.params.jobId,
    }).populate("applicant", "name email");
    res.json({ dat: applications, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    }).populate("job", "title category");
    res.json({ data: applications, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.updateApplicationStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const application = await Application.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!application)
//       return res
//         .status(404)
//         .json({ message: "Application not found", success: false });
//     res.json({
//       data: application,
//       success: true,
//       message: "Application status updated successfully",
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "job"
    );
    if (!application)
      return res.status(404).json({ error: "application not found" });
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application)
      return res
        .status(404)
        .json({ message: "Application not found", success: false });
    res.json({ message: "Application deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id, status, jobId } = req.params;

    console.log(id);

    const validStatuses = [
      "applied",
      "reviewed",
      "shortlisted",
      "rejected",
      "hired",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    console.log(req.params, "req.params");

    const application = await Application.findById(id).populate("job");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (String(application.job.postedBy) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    if (status === "hired") {
      await Job.updateOne(
        { _id: jobId },
        {
          $set: {
            paymentStatus: "in-progress",
            isPublished: true,
            status: "hired",
            jobstatus: "in-progress",
            assignedTo: application.applicant,
          },
        }
      );
    }

    await createNotification({
      from: req.user._id,
      to: application.applicant,
      type: "application_status_update",
      job: application.job._id,
      application: application._id,
      message: `Your application for "${application.job.title}" is now "${status}".`,
    });

    const recipient = await User.findById(job.postedBy);
    if (recipient && recipient.expoPushToken) {
      await sendPushNotification(
        recipient.expoPushToken,
        `New application for your job "${job.title}".`
      );
    }
    res.status(200).json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getApplicationById = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const findApplication = await Application.findById(appointmentId);
    if (!findApplication) {
      return res.status(404).json({
        message: "This application is missing from the system",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Application fetched successfully",
      application: findApplication,
      success: false,
    });
  } catch (error) {
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};
