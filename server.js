// Local server on this PC:
//   npm run app   ->  http://localhost:5050          the series writer page (web/)
//   npm run auth  ->  http://localhost:5000/login    one-time YouTube login (the Google redirect URL uses port 5000)
// It only listens on localhost: it can run git and spend API credits, so it isn't reachable from outside.
require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const authRoutes = require("./routes/authRoutes");
const studioRoutes = require("./routes/studioRoutes");

const app = express();

app.use(studioRoutes);
app.use("/", authRoutes);
// Rendered previews
app.use("/media", express.static(path.join(__dirname, "storage")));

const WEB = path.join(__dirname, "web", "dist");
if (fs.existsSync(WEB)) {
  app.use(express.static(WEB));
} else {
  app.get("/", (req, res) => res.send('The page isn\'t built yet: run <code>npm run app</code>. YouTube login: <a href="/login">/login</a>'));
}

const AUTH = process.argv.includes("--auth");
const PORT = process.env.PORT || (AUTH ? 5000 : 5050);
app.listen(PORT, "127.0.0.1", () => {
  console.log(AUTH ? `YouTube login: http://localhost:${PORT}/login` : `Series writer: http://localhost:${PORT}`);
});
