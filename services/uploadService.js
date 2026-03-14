// const { google } = require("googleapis");
// const fs = require("fs");
// const { getOAuthClient } = require("./authService");

// async function uploadToYouTube(videoPath, title, description, tags) {
//   const auth = getOAuthClient();
//   const youtube = google.youtube({ version: "v3", auth });

//   console.log("📤 Uploading to YouTube...");

//   const response = await youtube.videos.insert({
//     part: ["snippet", "status"],
//     requestBody: {
//       snippet: {
//         title: title,
//         description: description,
//         tags: tags,
//         categoryId: "22",
//       },
//       status: {
//         privacyStatus: "public",
//       },
// //     status: {
// //   privacyStatus: "private", // ← change from "public" to "private" while testing
// // },
//     },
//     media: {
//       body: fs.createReadStream(videoPath),
//     },
//   });

//   console.log("✅ Video uploaded! ID:", response.data.id);
//   return `https://www.youtube.com/watch?v=${response.data.id}`;
// }

// module.exports = { uploadToYouTube };
const { google } = require("googleapis");
const fs = require("fs");
const { getOAuthClient } = require("./authService");

async function uploadToYouTube(videoPath, title, description, tags, thumbnailPath) {
  const auth = getOAuthClient();
  const youtube = google.youtube({ version: "v3", auth });

  console.log("📤 Uploading to YouTube...");

  const response = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title,
        description,
        tags,
        categoryId: "22",
      },
      status: {
        privacyStatus: "public",
      },
    },
    media: {
      body: fs.createReadStream(videoPath),
    },
  });

  const videoId = response.data.id;
  console.log("✅ Video uploaded! ID:", videoId);

  // Upload thumbnail
  if (thumbnailPath && fs.existsSync(thumbnailPath)) {
    await youtube.thumbnails.set({
      videoId,
      media: {
        body: fs.createReadStream(thumbnailPath),
      },
    });
    console.log("✅ Thumbnail uploaded!");
  }

  return `https://www.youtube.com/watch?v=${videoId}`;
}

module.exports = { uploadToYouTube };