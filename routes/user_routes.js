const express = require("express");
const router = express.Router();
const userController = require("../Controllers/user_controller");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
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
router.get("/", authMiddleware, userController.getUsers);
router.get("/:id", authMiddleware, userController.getUser);
router.patch(
  "/:id",
  authMiddleware,
  upload.fields([
    { name: "nationalId", maxCount: 1 },
    { name: "cv", maxCount: 1 },
    { name: "judiciary", maxCount: 1 },
  ]),
  userController.updateUser
);
router.delete("/:id", authMiddleware, userController.deleteUser);

// Jobprovider-only: update own jobs
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("jobprovider"),
  userController.updateUser
);

// Jobseeker-only: delete own account
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["jobseeker", "admin"]),
  userController.deleteUser
);

module.exports = router;
