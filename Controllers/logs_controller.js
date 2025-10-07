const Log = require("../models/log_model");

exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

async function createLog({ action, performedBy, target, description }) {
  try {
    const log = new Log({ action, performedBy, target, description });
    await log.save();
    console.log(`Log created: ${action}`);
  } catch (err) {
    console.error("Failed to create log:", err);
  }
}
module.exports = { createLog, getLogs: exports.getLogs };
