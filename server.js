// Local helper server used only to obtain a YouTube refresh token:
//   npm run auth  →  open http://localhost:5000/login
require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.get("/", (req, res) => {
  res.send('YouTube Automation Backend — visit <a href="/login">/login</a> to authorize.');
});

app.use("/", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} — open /login to authorize`);
});
