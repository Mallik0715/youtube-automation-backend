// const express = require("express");
// const cors = require("cors");

// const videoRoutes = require("./routes/videoRoutes");

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api", videoRoutes);

// app.get("/", (req, res) => {
//   res.send("YouTube Automation Backend Running");
// });

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const videoRoutes = require("./routes/videoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", videoRoutes);

app.get("/", (req, res) => {
  res.send("YouTube Automation Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);
require("./workers/cronJob");