


// app.get("/callback", async (req, res) => {
//   try {
//     const code = req.query.code;

//     console.log("Received code:", code);

//     const oauth2Client = new (require("googleapis").google).auth.OAuth2(
//       process.env.CLIENT_ID,
//       process.env.CLIENT_SECRET,
//       "http://localhost:5000/callback"
//     );

//     const response = await oauth2Client.getToken(code);

//     console.log("Full token response:", response);

//     const tokens = response.tokens;

//     console.log("\n✅ Refresh Token:");
//     console.log(tokens.refresh_token);

//     res.send("Authorization successful");

//   } catch (error) {
//     console.error("REAL TOKEN ERROR:");
//     console.error(error.response?.data || error.message || error);

//     res.status(500).send("Token exchange failed");
//   }
// });






require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { saveToken } = require("./services/authService");

const app = express();   // ✅ THIS LINE WAS MISSING OR BELOW

app.use(cors());
app.use(express.json());

/* Home route */
app.get("/", (req, res) => {
  res.send("YouTube Automation Backend Running");
});

/* OAuth callback route */
app.get("/callback", async (req, res) => {
  try {
    const code = req.query.code;

    if (!code) {
      return res.send("No code received");
    }

    await saveToken(code);

    res.send("✅ Token saved successfully. You can close this window.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving token");
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});