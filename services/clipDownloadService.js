// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");

// async function downloadClip(url, index) {

//   const filePath = path.join(
//     __dirname,
//     "../storage/clips",
//     `clip${index}.mp4`
//   );

//   const response = await axios({
//     url,
//     method: "GET",
//     responseType: "stream"
//   });

//   const writer = fs.createWriteStream(filePath);

//   response.data.pipe(writer);

//   return new Promise((resolve, reject) => {

//     writer.on("finish", () => resolve(filePath));
//     writer.on("error", reject);

//   });

// }

// module.exports = { downloadClip };
    






const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function downloadClip(url, index) {

  // ✅ Create clips folder if it doesn't exist
  const clipsDir = path.join(__dirname, "../storage/clips");
  if (!fs.existsSync(clipsDir)) {
    fs.mkdirSync(clipsDir, { recursive: true });
    console.log("📁 Created clips folder");
  }

  const filePath = path.join(clipsDir, `clip${index}.mp4`);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
    timeout: 30000, // ✅ 30 second timeout
    headers: {
      "User-Agent": "Mozilla/5.0" // ✅ Some servers need this
    }
  });

  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => {
      console.log(`✅ Downloaded clip${index}.mp4`);
      resolve(filePath);
    });
    writer.on("error", reject);
  });

}

module.exports = { downloadClip };