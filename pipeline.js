require("dotenv").config();
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

async function runPipeline() {
  try {
    console.log("🚀 Starting daily pipeline...");

    const topic = getRandomTopic();
    console.log("🎯 Topic:", topic);

    const script = await generateScript(topic);
    console.log("📝 Script generated");

    const seo = await generateSEO(topic, script);
    console.log("🔍 SEO generated:", seo.title);

    const sentences = splitIntoSentences(script);
    console.log("📄 Sentences:", sentences.length);

    const clips = await searchClips(topic);
    console.log("🎥 Clips found:", clips.length);

    const downloadedClips = [];
    for (let i = 0; i < clips.length; i++) {
      const savedPath = await downloadClip(clips[i], i + 1);
      downloadedClips.push(savedPath);
    }
    console.log("⬇️ Clips downloaded:", downloadedClips.length);

    const voicePath = await generateVoice(script);
    console.log("🔊 Voice generated:", voicePath);

    const subtitlePath = await generateSubtitles(sentences);
    console.log("🎬 Subtitles generated:", subtitlePath);

    const finalVideo = await buildVideo(downloadedClips, voicePath, subtitlePath);
    console.log("✅ Final video:", finalVideo);

    const thumbnailPath = await generateThumbnail(topic);
    console.log("🖼️ Thumbnail generated:", thumbnailPath);

    const youtubeUrl = await uploadToYouTube(
      finalVideo,
      seo.title,
      seo.description,
      seo.tags,
      thumbnailPath
    );

    console.log("🎉 Done! Video uploaded:", youtubeUrl);

  } catch (error) {
    console.error("❌ Pipeline error:", error.message);
    process.exit(1); // ✅ Fail the GitHub Action if error occurs
  }
}

runPipeline();