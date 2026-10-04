require("dotenv").config();
const fs = require("fs");

console.log("========== PIPELINE START ==========");

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

const requiredEnv = [
  "YOUTUBE_CLIENT_ID",
  "YOUTUBE_CLIENT_SECRET",
  "YOUTUBE_REFRESH_TOKEN",
  "GROQ_API_KEY",
  "PIXABAY_API_KEY",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
}

console.log("✅ Environment variables validated");

const dirs = [
  "./storage",
  "./storage/clips",
  "./storage/audio",
];

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const { getNextTopic } = require("./services/topicService");
const { generateScript } = require("./services/scriptService");
const { splitIntoSentences } = require("./services/sentenceService");
const { searchClips } = require("./services/clipSearchService");
const { getVisualQueries } = require("./services/visualService");
const { checkAccuracy } = require("./services/accuracyService");
const { downloadClip } = require("./services/clipDownloadService");
const { generateVoice } = require("./services/voiceService");
const { buildVideo } = require("./services/videoBuilderService");
const { generateSubtitles } = require("./services/subtitleService");
const { uploadToYouTube } = require("./services/uploadService");
const { generateSEO } = require("./services/seoService");

async function runPipeline() {
  try {
    const topic = getNextTopic();
    console.log("🎯 Topic:", topic);

    const draft = await generateScript(topic);
    const script = await checkAccuracy(draft);
    console.log("📝 Script:\n" + script);

    const seo = await generateSEO(topic, script);
    console.log("🔍 SEO generated:", seo.title);

    const sentences = splitIntoSentences(script);
    console.log("📄 Sentences:", sentences.length);

    const visualQueries = await getVisualQueries(topic, script);
    const clips = await searchClips(visualQueries);
    console.log("🎥 Clips found:", clips.length);

    // One broken clip shouldn't kill the whole run — skip it and keep going
    const downloadedClips = [];
    for (let i = 0; i < clips.length; i++) {
      try {
        downloadedClips.push(await downloadClip(clips[i], i + 1));
      } catch (err) {
        console.warn(`⚠️ Clip ${i + 1} download failed, skipping:`, err.message);
      }
    }
    if (downloadedClips.length === 0) {
      throw new Error("No clips could be downloaded");
    }
    console.log("⬇️ Clips downloaded:", downloadedClips.length);

    const voicePath = await generateVoice(script);

    const subtitlePath = await generateSubtitles(sentences);

    const finalVideo = await buildVideo(downloadedClips, voicePath, subtitlePath);
    console.log("✅ Final video:", finalVideo);

    const youtubeUrl = await uploadToYouTube(
      finalVideo,
      seo.title,
      seo.description,
      seo.tags
    );

    console.log("🎉 SUCCESS! Video uploaded:", youtubeUrl);
    console.log("========== PIPELINE COMPLETE ==========");

    // Exit explicitly: open handles (HTTP agents) otherwise keep the process alive
    process.exit(0);

  } catch (error) {
    console.error("❌ Pipeline error:", error);
    process.exit(1);
  }
}

runPipeline();
