


// const { google } = require("googleapis");
// const fs = require("fs");
// const path = require("path");

// const CREDENTIALS_PATH = path.join(__dirname, "../config/oauth_credentials.json");
// const TOKEN_PATH = path.join(__dirname, "../config/token.json");

// let oauth2Client;

// // ✅ Check if running on GitHub Actions (use env vars) or locally (use files)
// if (process.env.YOUTUBE_CLIENT_ID && process.env.YOUTUBE_REFRESH_TOKEN) {
//   console.log("🔐 Using environment variables for YouTube auth");

//   oauth2Client = new google.auth.OAuth2(
//     process.env.YOUTUBE_CLIENT_ID,
//     process.env.YOUTUBE_CLIENT_SECRET,
//     "http://localhost:3000"
//   );

//   oauth2Client.setCredentials({
//     refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
//   });

// } else {
//   console.log("🔐 Using local config files for YouTube auth");

//   const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
//   const credentialKeys = credentials.web || credentials.installed;
//   const { client_id, client_secret, redirect_uris } = credentialKeys;

// oauth2Client = new google.auth.OAuth2(
//   process.env.YOUTUBE_CLIENT_ID,
//   process.env.YOUTUBE_CLIENT_SECRET,
//   "http://localhost:5000/callback"
// );
//   if (fs.existsSync(TOKEN_PATH)) {
//     const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
//     oauth2Client.setCredentials(token);
//   }
// }

// function getAuthUrl() {
//   return oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     prompt: "consent",
//     scope: ["https://www.googleapis.com/auth/youtube.upload"],
//   });
// }

// async function saveToken(code) {
//   const { tokens } = await oauth2Client.getToken(code);
//   oauth2Client.setCredentials(tokens);
//   fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
//   console.log("✅ Token saved to", TOKEN_PATH);
// }

// function getOAuthClient() {
//   return oauth2Client;
// }

// module.exports = { getAuthUrl, saveToken, getOAuthClient };





const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const TOKEN_PATH = path.join(__dirname, "../config/token.json");

let oauth2Client;

// Always use environment variables
console.log("🔐 Using environment variables for YouTube auth");

oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  "http://localhost:5000/callback"
);

// If refresh token exists in .env, use it
if (process.env.YOUTUBE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
  });
}

// Generate Google OAuth URL
function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/youtube.upload",
    ],
  });
}

// Save token after user authorizes
// async function saveToken(code) {
//   try {
//     const { tokens } = await oauth2Client.getToken(code);

//     oauth2Client.setCredentials(tokens);

//     // Save token locally
//     fs.writeFileSync(
//       TOKEN_PATH,
//       JSON.stringify(tokens, null, 2)
//     );

//     console.log("✅ Token saved to:", TOKEN_PATH);

//     return tokens;

//   } catch (error) {
//     console.error("❌ Error saving token:", error.message);
//     throw error;
//   }
// }

async function saveToken(code) {
  try {
    console.log("Received code:", code);

    const { tokens } = await oauth2Client.getToken(code);

    console.log("Tokens received:", tokens);

    oauth2Client.setCredentials(tokens);

    const fs = require("fs");
    const path = require("path");

    const TOKEN_PATH = path.join(
      __dirname,
      "../config/token.json"
    );

    fs.writeFileSync(
      TOKEN_PATH,
      JSON.stringify(tokens, null, 2)
    );

    console.log("✅ Token saved to:", TOKEN_PATH);

    return tokens;

  } catch (error) {
    console.error("❌ Error saving token:");
    console.error(error);
    throw error;
  }
}
// Return OAuth client
function getOAuthClient() {
  return oauth2Client;
}

module.exports = {
  getAuthUrl,
  saveToken,
  getOAuthClient,
};