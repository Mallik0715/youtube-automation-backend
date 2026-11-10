// Animated two-character skit pipeline (Remotion). Separate from pipeline.js so the
// existing stock-footage channel keeps working unchanged.
//
//   npm run skit                         -> render a test video locally, no upload, topic progress untouched
//   npm run skit -- --topic "Why ..."    -> test with a specific topic
//   npm run skit -- --demo               -> built-in sample skit, no Groq call (test voices + render)
//   npm run skit -- --upload             -> next topic, render, upload to YouTube (advances topic progress)
//
// Story series (scripted, no Groq needed - see series/):
//   npm run series                       -> render the next series part locally, progress untouched
//   npm run series -- --part 3           -> render part 3 of the first series
//   npm run series -- --series dont-answer-after-9 --part 2
//   npm run series -- --upload           -> render + upload the next part (advances series progress)
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const argv = process.argv.slice(2);
const UPLOAD = argv.includes("--upload");
const DEMO = argv.includes("--demo") && !UPLOAD;
const SERIES_MODE = argv.includes("--series") || argv.includes("--part");
const flagValue = (name) => {
  const i = argv.lastIndexOf(name); // last: "npm run series" already passes a bare --series
  const v = i !== -1 ? argv[i + 1] : null;
  return v && !v.startsWith("--") ? v : null;
};
const SERIES_ID = flagValue("--series");
const PART = flagValue("--part") ? parseInt(flagValue("--part"), 10) : null;
const topicFlag = argv.indexOf("--topic");
const TOPIC_ARG = topicFlag !== -1 ? argv[topicFlag + 1] : null;

const required = [...(DEMO || SERIES_MODE ? [] : ["GROQ_API_KEY"]), ...(UPLOAD ? ["YOUTUBE_CLIENT_ID", "YOUTUBE_CLIENT_SECRET", "YOUTUBE_REFRESH_TOKEN"] : [])];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
}

const { getNextTopic, peekNextTopic } = require("./services/topicService");
// dialogueScriptService is loaded lazily below: it creates a Groq client, which throws without GROQ_API_KEY (not needed for series)
const { generateDialogueVoices } = require("./services/dialogueVoiceService");
const { renderSkit } = require("./services/remotionRenderService");

const DEMO_DIALOGUE = {
  scene: "cafe",
  lines: [
    { speaker: "B", emotion: "worried", text: "Why do I keep checking if she viewed my story?" },
    { speaker: "A", emotion: "smug", text: "Because your brain treats her attention like a slot machine." },
    { speaker: "B", emotion: "surprised", text: "A slot machine? I'm not gambling!" },
    { speaker: "A", emotion: "happy", text: "Random rewards hook you harder than steady ones. Every maybe feels like a jackpot." },
    { speaker: "B", emotion: "worried", text: "So the less she replies, the more I care?" },
    { speaker: "A", emotion: "neutral", text: "Exactly. Unpredictable is addictive. Consistent is safe." },
    { speaker: "B", emotion: "happy", text: "Okay, I'm muting her story right now." },
    { speaker: "A", emotion: "smug", text: "Says the guy refreshing it with his other hand." },
  ],
};

function freshWorkDir() {
  // Fresh working folder every run so stale line audio is never reused
  const workDir = path.join(__dirname, "storage", "skit");
  fs.rmSync(workDir, { recursive: true, force: true });
  fs.mkdirSync(workDir, { recursive: true });
  return workDir;
}

async function runSeries() {
  const { getNextPart, getPart } = require("./services/seriesService");
  const part = PART ? getPart(SERIES_ID, PART) : getNextPart({ advance: UPLOAD });
  if (!part) {
    console.log("🏁 Every part of every series is already uploaded. Add a new series in series/ to continue.");
    return;
  }
  console.log(`========== SERIES: ${part.seriesTitle} - Part ${part.number}/${part.total}: ${part.partTitle} ==========`);

  const workDir = freshWorkDir();
  const { voicePath, duration, lines } = await generateDialogueVoices(part.dialogue, workDir);
  const timed = { scene: part.dialogue.scene, lines };
  fs.writeFileSync(path.join(workDir, "dialogue.json"), JSON.stringify({ series: part.seriesId, part: part.number, ...timed }, null, 2));

  const outputName = `series_${part.seriesId}_part${part.number}.mp4`;
  const video = await renderSkit(timed, voicePath, duration, {
    outputName, hook: part.hook, endCard: part.endCard, music: part.music,
  });

  if (!UPLOAD) {
    console.log("📝 Title would be:", part.seo.title);
    console.log("🧪 Test run - not uploaded. Watch it here:", video);
    return;
  }
  const { uploadToYouTube } = require("./services/uploadService");
  const url = await uploadToYouTube(video, part.seo.title, part.seo.description, part.seo.tags);
  console.log("🎉 SUCCESS! Part uploaded:", url);
}

async function run() {
  if (SERIES_MODE || process.env.SKIT_MODE === "series") return runSeries();
  console.log("========== SKIT PIPELINE START ==========");
  const topic = TOPIC_ARG || (UPLOAD ? getNextTopic() : peekNextTopic());
  console.log("🎯 Topic:", topic);

  const { generateDialogue } = require("./services/dialogueScriptService");
  const dialogue = DEMO ? DEMO_DIALOGUE : await generateDialogue(topic);

  const workDir = freshWorkDir();
  const { voicePath, duration, lines } = await generateDialogueVoices(dialogue, workDir);
  const timed = { scene: dialogue.scene, lines };
  // Saved so the exact skit can be inspected or re-rendered
  fs.writeFileSync(path.join(workDir, "dialogue.json"), JSON.stringify({ topic, ...timed }, null, 2));

  const video = await renderSkit(timed, voicePath, duration);

  if (!UPLOAD) {
    console.log("🧪 Test run - not uploaded. Watch it here:", video);
    return;
  }

  const { generateSEO } = require("./services/seoService");
  const { dialogueToScript } = require("./services/dialogueScriptService");
  const { uploadToYouTube } = require("./services/uploadService");
  const seo = await generateSEO(topic, dialogueToScript(dialogue));
  const url = await uploadToYouTube(video, seo.title, seo.description, seo.tags);
  console.log("🎉 SUCCESS! Video uploaded:", url);
}

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("❌ Skit pipeline error:", err);
    process.exit(1);
  });
