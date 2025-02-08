const express = require("express");
const fs = require("fs").promises;
const path = "C:/CollabVerse/authData.json"; // ✅ File Location
const router = express.Router();

// ✅ Save Auth Data (Token & User ID)
router.post("/save-auth", async (req, res) => {
  try {
    const { token, userId } = req.body;

    // ✅ Validate Input
    if (!token || !userId) {
      return res.status(400).json({ error: "Token and User ID are required" });
    }

    const authData = { token, userId };
    await fs.writeFile(path, JSON.stringify(authData, null, 2));
    res.json({ msg: "Auth data saved successfully" });
  } catch (error) {
    console.error("Error saving auth data:", error);
    res.status(500).json({ error: "Failed to save auth data" });
  }
});

// ✅ Get Auth Data
router.get("/get-auth", async (req, res) => {
  try {
    // ✅ Check if File Exists
    const exists = await fs.access(path).then(() => true).catch(() => false);
    if (!exists) {
      return res.json({ token: null, userId: null });
    }

    // ✅ Read Data from File
    const data = await fs.readFile(path, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading auth data:", error);
    res.status(500).json({ error: "Failed to read auth data" });
  }
});

// ✅ Clear Auth Data
router.delete("/clear-auth", async (req, res) => {
  try {
    // ✅ Check if File Exists
    const exists = await fs.access(path).then(() => true).catch(() => false);
    if (exists) {
      await fs.unlink(path);
    }
    res.json({ msg: "Auth data cleared" });
  } catch (error) {
    console.error("Error clearing auth data:", error);
    res.status(500).json({ error: "Failed to clear auth data" });
  }
});

module.exports = router;
