const express = require("express");
const jobController = require("../controllers/job_controller");
const { checkAuthorization } = require("../middlewares/authMiddleware");
const {
  roleMiddleware,
  jobProviderMiddleware,
  jobSeekerMiddleware,
} = require("../middlewares/roleMiddleware");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


router.post(
  "/",
  checkAuthorization,
  jobProviderMiddleware,
  jobController.createJob
);


router.put(
  "/:id",
  checkAuthorization,
  jobProviderMiddleware,
  jobController.updateJob
);


router.delete(
  "/:id",
  checkAuthorization,
  jobProviderMiddleware,
  jobController.deleteJob
);


router.get(
  "/provider",
  checkAuthorization,
  jobProviderMiddleware,
  jobController.getJobsByProvider
);

// Get applicants for a job
router.get(
  "/:id/applicants",
  checkAuthorization,
  jobProviderMiddleware,
  jobController.getApplicants
);

// Get all published jobs
router.get("/", checkAuthorization, jobController.getJobs);

// Get a single job
router.get("/:id", checkAuthorization, jobController.getJobById);

// Get nearby jobs
router.get("/nearby", checkAuthorization, jobController.getNearbyJobs);

// Apply to a job with CV / attachments
router.post(
  "/:id/apply",
  checkAuthorization,
  jobSeekerMiddleware,
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "attachments", maxCount: 5 },
  ]),
  jobController.applyToJob
);
module.exports = router;
