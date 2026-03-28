const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

function loadSchedule() {
  const filePath = path.join(__dirname, "schedule.json");
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// GET API for all schedules (returns raw JSON object)
app.get("/api/schedule", (req, res) => {
  const scheduleData = loadSchedule();
  res.json(scheduleData);
});

// GET API for specific branch endpoints (e.g., /api/schedule/cs, /api/schedule/it, etc.)
app.get("/api/schedule/:branch", (req, res) => {
  const scheduleData = loadSchedule();

  const branchParam = req.params.branch.toLowerCase();
  const { sem, day } = req.query;

  const branchData = scheduleData[branchParam];

  if (!branchData) {
    return res.json([]);
  }

  let result = [];

  if (sem) {
    if (branchData[sem]) {
      result = branchData[sem];
    }
  } else {
    for (const semKey in branchData) {
      result = result.concat(branchData[semKey]);
    }
  }

  if (day) {
    result = result.filter((x) => x.day === day);
  }

  res.json(result);
});

// POST API
app.post("/api/schedule", (req, res) => {
  res.json({ message: "POST works (but JSON file won't update permanently)" });
});

// Export for Vercel serverless — only listen locally
if (require.main === module) {
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

module.exports = app;