const express = require("express");
const jobController = require("../Controllers/job_controller");
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

router.use(checkAuthorization);

router.post(
  "/",

  // jobProviderMiddleware,
  jobController.createJob
);

router.put(
  "/:id",

  jobProviderMiddleware,
  jobController.updateJob
);

router.delete(
  "/:id",

  jobProviderMiddleware,
  jobController.deleteJob
);

router.get(
  "/provider",

  jobController.getJobsByProvider
);

router.get(
  "/:id/applicants",

  jobProviderMiddleware,
  jobController.getApplicants
);

router.get("/", jobController.getJobs);

router.get("/:id", jobController.getJobById);

router.get("/nearby", jobController.getNearbyJobs);

router.post(
  "/:id/apply",

  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "attachments", maxCount: 5 },
  ]),
  jobController.applyToJob
);

router.patch(
  "/:jobId/complete", jobController.completeJob
); 

module.exports = router;
