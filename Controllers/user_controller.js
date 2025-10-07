const bcrypt = require("bcryptjs");
const userService = require("../services/user_services");
const { generateToken } = require("../utils/jwt");
const Job = require("../models/job_model");
const Application = require("../models/application_model");
const { getCoordinates } = require("../utils/helper");
const { createLog } = require("./logs_controller");
const User = require("../models/user_model");
// Signup
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existing = await userService.findUserByEmail(email);
    if (existing)
      return res
        .status(400)
        .json({ message: "Email already exists", status: "error" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
      phone,
      role: role,
      nationalId: `/uploads/${req.files.nationalId[0].filename}` || null,
      cv: `/uploads/${req.files.cv[0].filename}` || null,
      judiciary: `/uploads/${req.files.judiciary[0].filename}` || null,
    };

    const user = await userService.createUser(userData);

    await createLog({
      action: "user_created",
      performedBy: user._id, // user itself, or admin if admin creates users
      target: user._id,
      description: `User ${name} with email ${email} was created.`,
    });

    res.status(201).json({
      data: user,
      message: "User created successfully",
      status: "success",
    });
  } catch (err) {
    next(err);
  }
};

// Signin
exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required", status: "error" });
    const user = await userService.findUserByEmail(email);

    if (!user)
      return res
        .status(401)
        .json({ message: "Invalid credentials", status: "error" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "Invalid credentials", status: "error" });

    const token = generateToken(user);
    res.json({ message: "Signin successful", status: "success", token, user });
  } catch (err) {
    next(err);
  }
};

// Get all users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Get single user
exports.getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    const { address } = req.body;

    if (req.files?.nationalId)
      updateData.nationalId = req.files.nationalId[0].path;
    if (req.files?.cv) updateData.cv = req.filejsons.cv[0].path;
    if (req.files?.judiciary)
      updateData.judiciary = req.files.judiciary[0].path;

    if (address) {
      const coords = await getCoordinates(address);

      updateData.address = {
        type: "Point",
        coordinates: [coords.longitude, coords.latitude],
      };
    }

    const user = await userService.updateUser(req.params.id, updateData);

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await createLog({
      action: "user_deleted",
      performedBy: req.user._id, // whoever performed deletion
      target: user._id,
      description: `User ${user.name} (${user.email}) was deleted.`,
    });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// Activate user
// Activate user
exports.activateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { accountStatus: "active" },
      { new: true } // return the updated user
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    await createLog({
      action: "user_activated",
      performedBy: req.user._id, // admin or whoever performs the action
      target: user._id,
      description: `User ${user.name} with email ${user.email} was activated.`,
    });

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// Block user
exports.blockUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { accountStatus: "blocked" },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    await createLog({
      action: "user_blocked",
      performedBy: req.user._id,
      target: user._id,
      description: `User ${user.name} with email ${user.email} was blocked.`,
    });

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let stats = {
      jobsPosted: 0,
      applications: 0,
      rejectedJobs: 0,
      hiredJobs: 0,
    };

    if (user.role === "jobprovider") {
      stats.jobsPosted = await Job.countDocuments({ postedBy: userId });
      stats.rejectedJobs = await Job.countDocuments({
        applicant: userId,
        status: "rejected",
      });
      console.log("Rejected Jobs:", stats.rejectedJobs);
    } else {
      stats.applications = await Application.countDocuments({
        applicant: userId,
      });
      stats.rejectedJobs = await Application.countDocuments({
        applicant: userId,
        status: "rejected",
      });
      stats.hiredJobs = await Application.countDocuments({
        applicant: userId,
        status: "hired",
      });
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
