const { google } = require("googleapis");
const readline = require("readline");
const CLIENT_ID = env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = env.YOUTUBE_CLIENT_SECRET;
const REDIRECT_URI= "http://localhost:5000/callback"
console.log("Redirect URI:", REDIRECT_URI);
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/youtube.upload"],
  prompt: "consent",
});

console.log("👉 Open this URL in your browser:");
console.log(authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\n🔑 Enter the code from the browser: ", async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.log("\n✅ Your Refresh Token:");
  console.log(tokens.refresh_token);
  rl.close();
});