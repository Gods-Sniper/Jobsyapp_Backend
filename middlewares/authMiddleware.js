const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET || "secretkey";

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Extract token (remove "Bearer ")
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (!decoded.id || !decoded.email) {
      return res.status(403).json({ message: "Malformed token" });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
