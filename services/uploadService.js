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
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: fs.createReadStream(videoPath),
    },
  });

  const videoId = response.data.id;
  console.log("✅ Video uploaded! ID:", videoId);

  // The video is already live at this point, so a thumbnail failure must not fail the run
  // (otherwise the topic isn't marked done and the next run uploads it again).
  // thumbnails.set needs a phone-verified channel and is mostly ignored for Shorts.
  if (thumbnailPath && fs.existsSync(thumbnailPath)) {
    try {
      await youtube.thumbnails.set({
        videoId,
        media: {
          body: fs.createReadStream(thumbnailPath),
        },
      });
      console.log("✅ Thumbnail uploaded!");
    } catch (err) {
      console.warn("⚠️ Thumbnail upload failed (video is still live):", err.message);
    }
  }

  return `https://www.youtube.com/watch?v=${videoId}`;
}

module.exports = { uploadToYouTube };
