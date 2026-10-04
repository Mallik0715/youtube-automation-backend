const express = require("express");
const router = express.Router();
const { getAuthUrl, saveToken } = require("../services/authService");

// Step 1: Visit /login to get the Google consent screen
router.get("/login", (req, res) => {
  res.redirect(getAuthUrl());
});

// Step 2: Google redirects here with ?code=...
router.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("No code received");
  }
  try {
    await saveToken(code);
    res.send("✅ Token saved to config/token.json. Copy refresh_token into your YOUTUBE_REFRESH_TOKEN secret, then close this tab.");
  } catch (error) {
    console.error("❌ Token exchange failed:", error.message);
    res.status(500).send("Token exchange failed");
  }
});

module.exports = router;
