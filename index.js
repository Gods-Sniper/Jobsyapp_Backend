require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user_routes");
const jobRoutes = require("./routes/job_routes");
const applicaionRoutes = require("./routes/application_routes");
const categoryRoutes = require("./routes/category_routes");
const notificationRoutes = require("./routes/notification_routes");
const errorHandler = require("./middlewares/errorHandler");
const http = require("http");
const Server = require("socket.io");
const path = require("path");
const axios = require("axios");

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
app.use("/api/applications", applicaionRoutes);
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

const CAMPAY_BASE_URL = "https://demo.campay.net/api";
// console.log(
//   "helloo",

//   process.env.CAMPAY_USERNAME,
//   process.env.CAMPAY_PASSWORD
// );

// ✅ Request Payment
app.post("/api/payment/request", async (req, res) => {
  try {
    const { amount, from, description } = req.body;

    // 1️⃣  Get a fresh token
    const tokenRes = await axios.post(
      `${CAMPAY_BASE_URL}/token/`,
      {
        username: process.env.CAMPAY_USERNAME,
        password: process.env.CAMPAY_PASSWORD,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const token = tokenRes.data.token;
    console.log("Token:", token);

    // 2️⃣  Make the payment request with that token
    const paymentRes = await axios.post(
      `${CAMPAY_BASE_URL}/collect/`,
      {
        amount,
        currency: "XAF",
        from,
        description,
        external_reference: "JOBSY-" + Date.now(),
      },
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Payment response:", paymentRes.data);
    res.json(paymentRes.data);
  } catch (error) {
    console.error(
      "Payment request failed:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Payment request failed" });
  }
});

// ✅ Check Payment Status
app.get("/api/payment/status/:reference", async (req, res) => {
  try {
    const tokenRes = await axios.post(
      `${CAMPAY_BASE_URL}/token/`,
      {
        username: process.env.CAMPAY_USERNAME,
        password: process.env.CAMPAY_PASSWORD,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const token = tokenRes.data.token; //
    const reference = req.params.reference;
    console.log("Reference:", reference);

    const response = await axios.get(
      `${CAMPAY_BASE_URL}/transaction/${reference}/`,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Status response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to check status" });
  }
});

module.exports = app;
app.listen(process.env.PORT, () =>
  console.log(`Payment API Server running on ${port}`)
);

