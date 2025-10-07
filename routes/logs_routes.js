const express = require("express");
const router = express.Router();
const logsController = require("../Controllers/logs_controller");

router.get("/", logsController.getLogs);

module.exports = router;
