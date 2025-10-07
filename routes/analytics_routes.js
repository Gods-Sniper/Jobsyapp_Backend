const express = require("express");
const router = express.Router();
const analyticsController = require("../Controllers/Analytics_controller");

router.get("/summary", analyticsController.getSummary);

module.exports = router;
