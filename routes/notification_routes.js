const express = require("express");
const router = express.Router();
const notificationController = require("../Controllers/notification_controller");
const { checkAuthorization } = require("../middlewares/authmiddleware");

router.use(checkAuthorization);

router.post("/", notificationController.createNotification);
router.get("/", notificationController.getUserNotifications);
router.patch("/:id/read", notificationController.markAsRead);
router.delete("/:id", notificationController.deleteNotification);
router.delete("/:id", notificationController.deleteAllNotifications);
module.exports = router;
