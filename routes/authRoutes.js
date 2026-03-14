const express = require("express");
const router = express.Router();
const { getAuthUrl, saveToken } = require("../services/authService");

// Step 1: Visit this to get Google login URL
router.get("/login", (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

// Step 2: Google redirects here with code
router.get("/callback", async (req, res) => {
  const code = req.query.code;
  await saveToken(code);
  res.send("✅ YouTube Auth successful! You can close this tab and start uploading.");
});

module.exports = router;