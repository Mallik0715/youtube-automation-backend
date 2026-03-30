

// require("dotenv").config();
// const fs = require("fs");
// const path = require("path");

// // ✅ Create ALL storage folders before anything else
// const dirs = [
//   "./storage",
//   "./storage/clips",
//   "./storage/audio",
//   "./storage/music",
// ];
// dirs.forEach(dir => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//     console.log(`📁 Created folder: ${dir}`);
//   }
// });

// const { getRandomTopic } = require("./services/topicService");
// const { generateScript } = require("./services/scriptService");
// const { splitIntoSentences } = require("./services/sentenceService");
// const { searchClips } = require("./services/clipSearchService");
// const { downloadClip } = require("./services/clipDownloadService");
// const { generateVoice } = require("./services/voiceService");
// const { buildVideo } = require("./services/videoBuilderService");
// const { generateSubtitles } = require("./services/subtitleService");
// const { uploadToYouTube } = require("./services/uploadService");
// const { generateThumbnail } = require("./services/thumbnailService");
// const { generateSEO } = require("./services/seoService");

// async function runPipeline() {
//   try {
//     console.log("🚀 Starting daily pipeline...");

//     const topic = getRandomTopic();
//     console.log("🎯 Topic:", topic);

//     const script = await generateScript(topic);
//     console.log("📝 Script generated");

//     const seo = await generateSEO(topic, script);
//     console.log("🔍 SEO generated:", seo.title);

//     const sentences = splitIntoSentences(script);
//     console.log("📄 Sentences:", sentences.length);

//     const clips = await searchClips(topic);
//     console.log("🎥 Clips found:", clips.length);

//     const downloadedClips = [];
//     for (let i = 0; i < clips.length; i++) {
//       const savedPath = await downloadClip(clips[i], i + 1);
//       downloadedClips.push(savedPath);
//     }
//     console.log("⬇️ Clips downloaded:", downloadedClips.length);

//     const voicePath = await generateVoice(script);
//     console.log("🔊 Voice generated:", voicePath);

//     const subtitlePath = await generateSubtitles(sentences);
//     console.log("🎬 Subtitles generated:", subtitlePath);

//     const finalVideo = await buildVideo(downloadedClips, voicePath, subtitlePath);
//     console.log("✅ Final video:", finalVideo);

//     const thumbnailPath = await generateThumbnail(topic);
//     console.log("🖼️ Thumbnail generated:", thumbnailPath);

//     const youtubeUrl = await uploadToYouTube(
//       finalVideo,
//       seo.title,
//       seo.description,
//       seo.tags,
//       thumbnailPath
//     );

//     console.log("🎉 Done! Video uploaded:", youtubeUrl);

//   } catch (error) {
//     console.error("❌ Pipeline error:", error.message);
//     process.exit(1);
//   }
// }

// runPipeline();


require("dotenv").config();
const fs = require("fs");
const path = require("path");

console.log("========== PIPELINE START ==========");

/*
-------------------------------------------------------
Global Safety Handlers
-------------------------------------------------------
*/

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:");
  console.error(err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:");
  console.error(err);
  process.exit(1);
});

/*
-------------------------------------------------------
Validate Required Environment Variables
-------------------------------------------------------
*/

const requiredEnv = [
  "YOUTUBE_CLIENT_ID",
  "YOUTUBE_CLIENT_SECRET",
  "YOUTUBE_REFRESH_TOKEN",
  "GROQ_API_KEY",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
}

console.log("✅ Environment variables validated");

/*
-------------------------------------------------------
Create Storage Folders
-------------------------------------------------------
*/

const dirs = [
  "./storage",
  "./storage/clips",
  "./storage/audio",
  "./storage/music",
  "./storage/output",
  "./storage/thumbnails",
];

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created folder: ${dir}`);
  }
});

/*
-------------------------------------------------------
Import Services
-------------------------------------------------------
*/

const { getRandomTopic } = require("./services/topicService");
const { generateScript } = require("./services/scriptService");
const { splitIntoSentences } = require("./services/sentenceService");
const { searchClips } = require("./services/clipSearchService");
const { downloadClip } = require("./services/clipDownloadService");
const { generateVoice } = require("./services/voiceService");
const { buildVideo } = require("./services/videoBuilderService");
const { generateSubtitles } = require("./services/subtitleService");
const { uploadToYouTube } = require("./services/uploadService");
const { generateThumbnail } = require("./services/thumbnailService");
const { generateSEO } = require("./services/seoService");

/*
-------------------------------------------------------
Timeout Helper
-------------------------------------------------------
*/

function withTimeout(promise, ms, label = "Operation") {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms / 1000}s`));
    }, ms)
  );

  return Promise.race([promise, timeout]);
}

/*
-------------------------------------------------------
Main Pipeline
-------------------------------------------------------
*/

async function runPipeline() {
  try {
    console.log("🚀 Starting video pipeline...");

    /*
    ---------------------------------------
    Topic
    ---------------------------------------
    */

    const topic = getRandomTopic();
    console.log("🎯 Topic:", topic);

    /*
    ---------------------------------------
    Script
    ---------------------------------------
    */

    const script = await withTimeout(
      generateScript(topic),
      5 * 60 * 1000,
      "Script generation"
    );

    console.log("📝 Script generated");

    /*
    ---------------------------------------
    SEO
    ---------------------------------------
    */

    const seo = await withTimeout(
      generateSEO(topic, script),
      2 * 60 * 1000,
      "SEO generation"
    );

    console.log("🔍 SEO generated:", seo.title);

    /*
    ---------------------------------------
    Sentences
    ---------------------------------------
    */

    const sentences = splitIntoSentences(script);
    console.log("📄 Sentences:", sentences.length);

    /*
    ---------------------------------------
    Search Clips
    ---------------------------------------
    */

    const clips = await withTimeout(
      searchClips(topic),
      3 * 60 * 1000,
      "Clip search"
    );

    console.log("🎥 Clips found:", clips.length);

    /*
    ---------------------------------------
    Download Clips
    ---------------------------------------
    */

    const downloadedClips = [];

    for (let i = 0; i < clips.length; i++) {
      try {
        console.log(`⬇️ Downloading clip ${i + 1}...`);

        const savedPath = await withTimeout(
          downloadClip(clips[i], i + 1),
          3 * 60 * 1000,
          "Clip download"
        );

        downloadedClips.push(savedPath);

      } catch (err) {
        console.error("⚠️ Clip download failed:", err.message);
      }
    }

    console.log(
      "⬇️ Clips downloaded:",
      downloadedClips.length
    );

    /*
    ---------------------------------------
    Voice Generation
    ---------------------------------------
    */

    const voicePath = await withTimeout(
      generateVoice(script),
      5 * 60 * 1000,
      "Voice generation"
    );

    console.log("🔊 Voice generated:", voicePath);

    /*
    ---------------------------------------
    Subtitles
    ---------------------------------------
    */

    const subtitlePath = await withTimeout(
      generateSubtitles(sentences),
      3 * 60 * 1000,
      "Subtitle generation"
    );

    console.log(
      "🎬 Subtitles generated:",
      subtitlePath
    );

    /*
    ---------------------------------------
    Video Build
    ---------------------------------------
    */

    const finalVideo = await withTimeout(
      buildVideo(
        downloadedClips,
        voicePath,
        subtitlePath
      ),
      15 * 60 * 1000,
      "Video build"
    );

    console.log("✅ Final video:", finalVideo);

    /*
    ---------------------------------------
    Thumbnail
    ---------------------------------------
    */

    const thumbnailPath = await withTimeout(
      generateThumbnail(topic),
      2 * 60 * 1000,
      "Thumbnail generation"
    );

    console.log(
      "🖼️ Thumbnail generated:",
      thumbnailPath
    );

    /*
    ---------------------------------------
    Upload to YouTube
    ---------------------------------------
    */

    const youtubeUrl = await withTimeout(
      uploadToYouTube(
        finalVideo,
        seo.title,
        seo.description,
        seo.tags,
        thumbnailPath
      ),
      30 * 60 * 1000,
      "YouTube upload"
    );

    console.log(
      "🎉 SUCCESS! Video uploaded:",
      youtubeUrl
    );

    console.log(
      "========== PIPELINE COMPLETE =========="
    );

  } catch (error) {
    console.error("❌ PIPELINE FAILED");
    console.error(error.message);
    console.error(error.stack);

    process.exit(1);
  }
}

/*
-------------------------------------------------------
Run
-------------------------------------------------------
*/

runPipeline();