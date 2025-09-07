const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secretKey";
require("dotenv").config();

exports.generateToken = (user) => {
  if (!user) {
    throw new Error("Invalid user data for token generation");
  }
  return jwt.sign({ user }, JWT_SECRET, { expiresIn: "7h" });
};
