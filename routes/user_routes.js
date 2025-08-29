const express = require("express");
const router = express.Router();
const userController = require("../Controllers/user_controller");
const { checkAuthorization } = require("../middlewares/authMiddleware");
const {
  jobProviderMiddleware,
  roleMiddleware,
} = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Public routes
router.post(
  "/signup",
  upload.fields([
    { name: "nationalId", maxCount: 1 },
    { name: "cv", maxCount: 1 },
    { name: "judiciary", maxCount: 1 },
  ]),
  userController.createUser
);

router.post("/signin", userController.signin);

// Protected routes
router.get("/", checkAuthorization, userController.getUsers);
router.get("/:id", checkAuthorization, userController.getUser);
router.patch(
  "/:id",
  checkAuthorization,
  upload.fields([
    { name: "nationalId", maxCount: 1 },
    { name: "cv", maxCount: 1 },
    { name: "judiciary", maxCount: 1 },
  ]),
  userController.updateUser
);
router.delete("/:id", checkAuthorization, userController.deleteUser);

// Jobprovider-only: update own jobs
router.patch(
  "/:id",
  checkAuthorization,
  jobProviderMiddleware,
  userController.updateUser
);

// Jobseeker-only: delete own account
router.delete(
  "/:id",
  checkAuthorization,
  roleMiddleware(["jobseeker", "admin"]),
  userController.deleteUser
);

module.exports = router;
