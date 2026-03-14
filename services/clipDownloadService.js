const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function downloadClip(url, index) {

  const filePath = path.join(
    __dirname,
    "../storage/clips",
    `clip${index}.mp4`
  );

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream"
  });

  const writer = fs.createWriteStream(filePath);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {

    writer.on("finish", () => resolve(filePath));
    writer.on("error", reject);

  });

}

module.exports = { downloadClip };
    






