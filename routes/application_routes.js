const express = require("express");
const router = express.Router();
const applicationController = require("../Controllers/application_controller");
const { checkAuthorization } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/fileUploadMiddleware");

router.post(
  "/",
  checkAuthorization,
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "cover_letter", maxCount: 1 },
  ]),
  applicationController.applyJob
);

router.get(
  "/job/:jobId",
  checkAuthorization,
  applicationController.getApplicationsByJob
);

router.get("/my", checkAuthorization, applicationController.getMyApplications);

router.put(
  "/:id/status",
  checkAuthorization,
  applicationController.updateApplicationStatus
);

router.delete(
  "/:id",
  checkAuthorization,
  applicationController.deleteApplication
);

router.put(
  "/:id/status",
  checkAuthorization,
  applicationController.updateApplicationStatus
);

module.exports = router;
