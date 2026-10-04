const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function downloadClip(url, index) {
  const clipsDir = path.join(__dirname, "../storage/clips");
  if (!fs.existsSync(clipsDir)) {
    fs.mkdirSync(clipsDir, { recursive: true });
  }

  const filePath = path.join(clipsDir, `clip${index}.mp4`);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
    timeout: 30000,
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    const fail = (err) => {
      writer.destroy();
      fs.rm(filePath, { force: true }, () => reject(err));
    };
    response.data.on("error", fail);
    writer.on("error", fail);
    writer.on("finish", () => {
      console.log(`✅ Downloaded clip${index}.mp4`);
      resolve(filePath);
    });
  });
}

module.exports = { downloadClip };
