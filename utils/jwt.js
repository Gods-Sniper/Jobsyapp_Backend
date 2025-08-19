const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secretKey";
require("dotenv").config();

exports.generateToken = (user) => {
  if (!user || !user._id || !user.email) {
    throw new Error("Invalid user data for token generation");
  }
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};
