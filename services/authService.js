const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const CREDENTIALS_PATH = path.join(__dirname, "../config/oauth_credentials.json");
const TOKEN_PATH = path.join(__dirname, "../config/token.json");

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));

// Handle both "web" and "installed" credential types
const credentialKeys = credentials.web || credentials.installed;
const { client_id, client_secret, redirect_uris } = credentialKeys;

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// Load saved token if exists
if (fs.existsSync(TOKEN_PATH)) {
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oauth2Client.setCredentials(token);
}

function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.upload"],
  });
}

async function saveToken(code) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log("✅ Token saved to", TOKEN_PATH);
}

function getOAuthClient() {
  return oauth2Client;
}

module.exports = { getAuthUrl, saveToken, getOAuthClient };