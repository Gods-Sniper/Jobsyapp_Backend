const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET || "secretkey";
module.exports = {
  checkAuthorization: (req, res, next) => {
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

      if (!decoded.user) {
        return res.status(403).json({ message: "Malformed token" });
      }

      console.log("Decoded token:", decoded);
      req.user = decoded.user;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  },
};
