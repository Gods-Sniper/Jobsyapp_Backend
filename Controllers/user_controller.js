const bcrypt = require("bcryptjs");
const userService = require("../services/user_services");
const { generateToken } = require("../utils/jwt");

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
      nationalId: req.files?.nationalId?.[0]?.path || null,
      cv: req.files?.cv?.[0]?.path || null,
      judiciary: req.files?.judiciary?.[0]?.path || null,
    };

    const user = await userService.createUser(userData);
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

    const token = generateToken({ _id: user._id, email: user.email });
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

    if (req.files?.nationalId)
      updateData.nationalId = req.files.nationalId[0].path;
    if (req.files?.cv) updateData.cv = req.filejsons.cv[0].path;
    if (req.files?.judiciary)
      updateData.judiciary = req.files.judiciary[0].path;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
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
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};
