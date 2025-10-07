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
const { Server } = require("socket.io");
const path = require("path");
const axios = require("axios");
const analyticsRoutes = require("./routes/analytics_routes");
const logsRoutes = require("./routes/logs_routes");
const { log } = require("console");
const Message = require("./models/message_model"); 
const User = require("./models/user_model");

// Initialize the Express application
const app = express();

const JWT_SECRET = process.env.JWT_SECRET || "SecretKey";

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//db connection
const connect = mongoose.connect("mongodb://localhost:27017/Jobsyapp");
if (!connect) {
  console.log("Database connection failed");
}

const port = process.env.PORT || 4000;

// Create HTTP server and attach Socket.io
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

// Socket.io chat logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a room (for private chats)
  socket.on("joinRoom", async ({ room }) => {
    socket.join(room);
    // Send chat history
    const messages = await Message.find({ room })
      .sort({ timestamp: 1 })
      .populate("from", "name");
    socket.emit("chatHistory", messages);
  });

  // Handle sending messages
  socket.on("sendMessage", async ({ room, message }) => {
    // Save message to DB
    const saved = await Message.create({
      room,
      from: message.from,
      to: message.to, // You can add 'to' in your frontend
      text: message.text,
      timestamp: message.timestamp,
    });
    // Populate sender's name for display
    const populated = await saved.populate("from", "name");
    io.to(room).emit("receiveMessage", populated);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server (only once!)
httpServer.listen(port, () => {
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
app.use("/api/analytics", analyticsRoutes);
app.use("/api/logs", logsRoutes);

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
console.log("Payment API is running on port 4000");

module.exports = app;
