const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const TOKEN_PATH = path.join(__dirname, "../config/token.json");
const REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI || "http://localhost:5000/callback";

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  REDIRECT_URI
);

if (process.env.YOUTUBE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
  });
}

function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/youtube.upload"],
  });
}

// Saves tokens to config/token.json (gitignored). Never log the tokens themselves.
async function saveToken(code) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log("✅ Token saved to:", TOKEN_PATH);
  if (tokens.refresh_token_expires_in) {
    const days = Math.round(tokens.refresh_token_expires_in / 86400);
    console.warn(`⚠️ Refresh token expires in ~${days} days — your OAuth app is in "Testing" mode. Publish it to Production to get a long-lived token.`);
  }
  return tokens;
}

function getOAuthClient() {
  return oauth2Client;
}

module.exports = {
  getAuthUrl,
  saveToken,
  getOAuthClient,
};
