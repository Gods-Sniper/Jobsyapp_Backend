const User = require("../models/user_model");

const getAllUsers = async () => await User.find();
const getUserById = async (id) => await User.findById(id);
const createUser = async (data) => await new User(data).save();
const updateUser = async (id, data) =>
  await User.findByIdAndUpdate(id, data, { new: true });
const deleteUser = async (id) => await User.findByIdAndDelete(id);
const findUserByEmail = async (email) => await User.findOne({ email });

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  findUserByEmail,
};
