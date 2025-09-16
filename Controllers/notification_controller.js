const Notification = require("../models/Notification_model");

exports.createNotification = async ({ from, to, type, job, message }) => {
  try {
    const notification = await Notification.create({
      from,
      to,
      type,
      job,
      message,
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ to: req.user._id })
      .populate("from", "name email")
      .populate("to", "name email")
      .populate("job", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { status: "read" },
      { new: true }
    );

    res.status(200).json(notification);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking notification as read", error });
  }
};

// Get all notifications for the logged-in user
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ to: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, to: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      to: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ to: req.user._id });
    res.json({ message: "All notifications deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getJobAndApplicantDetailsByNotificationId = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      to: req.user._id,
    })
      .populate("job", "title description category location status")
      .populate("from", "name email");
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    console.log(notification, "notification");
    res.json({
      job: notification.job,
      applicant: notification.from,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
