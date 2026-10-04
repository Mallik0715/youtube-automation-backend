// CLI alternative to the server: node config/getRefreshToken.js
require("dotenv").config();
const { google } = require("googleapis");
const readline = require("readline");

const REDIRECT_URI = "http://localhost:5000/callback";

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  REDIRECT_URI
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/youtube.upload"],
  prompt: "consent",
});

console.log("👉 Open this URL in your browser:");
console.log(authUrl);
console.log("\nAfter approving, copy the `code` parameter from the redirected URL.");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\n🔑 Enter the code: ", async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    console.log("\n✅ Your Refresh Token (store it as the YOUTUBE_REFRESH_TOKEN secret):");
    console.log(tokens.refresh_token);
  } catch (err) {
    console.error("❌ Token exchange failed:", err.message);
  } finally {
    rl.close();
  }
});
