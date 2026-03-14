const cron = require("node-cron");
const { getRandomTopic } = require("../services/topicService");
const { generateScript } = require("../services/scriptService");
const { splitIntoSentences } = require("../services/sentenceService");
const { searchClips } = require("../services/clipSearchService");
const { downloadClip } = require("../services/clipDownloadService");
const { generateVoice } = require("../services/voiceService");
const { buildVideo } = require("../services/videoBuilderService");
const { generateSubtitles } = require("../services/subtitleService");
const { uploadToYouTube } = require("../services/uploadService");

async function runDailyPipeline() {
  console.log("⏰ Cron job started:", new Date().toLocaleString());

  try {
    const topic = getRandomTopic();
    console.log("🎯 Topic:", topic);

    const script = await generateScript(topic);
    if (!script) throw new Error("Script generation failed");
    console.log("📝 Script generated");

    const sentences = splitIntoSentences(script);
    console.log("📄 Sentences:", sentences.length);

    const subtitlePath = await generateSubtitles(sentences);
    console.log("🎬 Subtitles generated");

    const clips = await searchClips(topic);
    console.log("🎥 Clips found:", clips.length);

    const downloadedClips = [];
    for (let i = 0; i < clips.length; i++) {
      const savedPath = await downloadClip(clips[i], i + 1);
      downloadedClips.push(savedPath);
    }
    console.log("⬇️ Clips downloaded:", downloadedClips.length);

    const voicePath = await generateVoice(script);
    console.log("🔊 Voice generated");

    const finalVideo = await buildVideo(downloadedClips, voicePath, subtitlePath);
    console.log("✅ Final video:", finalVideo);

    const youtubeUrl = await uploadToYouTube(
      finalVideo,
      topic,
      `Amazing facts about ${topic}. Watch till the end!`,
      [topic, "facts", "education", "amazing"]
    );

    console.log("🚀 Video uploaded:", youtubeUrl);
    console.log("✅ Daily pipeline completed successfully!");

  } catch (error) {
    console.error("❌ Cron pipeline error:", error.message);
  }
}

// Schedule: every day at 9:00 AM
// Format: second minute hour day month weekday
cron.schedule("0 12 * * *", () => {
  console.log("📅 Running daily video upload...");
  runDailyPipeline();
}, {
  timezone: "Asia/Kolkata" // ← your timezone (IST)
});



console.log("✅ Cron job scheduled — daily at 9:00 AM IST");

module.exports = { runDailyPipeline } ;