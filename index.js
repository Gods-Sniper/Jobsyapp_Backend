require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user_routes");
const jobRoutes = require("./routes/job_routes");
const categoryRoutes = require("./routes/category_routes");
const notificationRoutes = require("./routes/notification_routes");
const errorHandler = require("./middlewares/errorHandler");
const path = require("path");

// Initialize the Express application
const app = express();

const JWT_SECRET = process.env.JWT_SECRET || "SecretKey";

//db connection
const connect = mongoose.connect("mongodb://localhost:27017/Jobsyapp");
if (!connect) {
  console.log("Database connection failed");
}

port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("Connected to the database");
});

// Middleware to parse JSON requests
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// user routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/notification", notificationRoutes);

//Root route
app.get("/api", (req, res) => {
  res.send("Welcome to the Jobsy API");
});

// Error handling middleware
app.use(errorHandler);

app.get("/api", (req, res) => {
  res.send("Jobsy API is running");
});
