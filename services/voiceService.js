const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

const PYTHON = process.env.PYTHON_PATH || "python";
const ATTEMPTS = 3;

function runEdgeTTS(args) {
  return new Promise((resolve, reject) => {
    execFile(PYTHON, args, { timeout: 5 * 60 * 1000 }, (error, stdout, stderr) => {
      if (error) {
        // Keep just the last line of the Python traceback (e.g. "NoAudioReceived: ...")
        const lastLine = (stderr || error.message).trim().split("\n").pop();
        reject(new Error(`edge-tts failed: ${lastLine}`));
      } else {
        resolve();
      }
    });
  });
}

async function generateVoice(script) {
  const outputPath = path.join(__dirname, "../storage/audio/voice.mp3");
  const vttPath = path.join(__dirname, "../storage/audio/words.vtt");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const cleanScript = script.replace(/\s+/g, " ").trim();

  // Arguments are passed directly (no shell), so $, backticks and quotes in the script are safe
  const args = [
    "-m", "edge_tts",
    "--voice", process.env.TTS_VOICE || "en-US-ChristopherNeural",
    "--rate=+5%",
    "--text", cleanScript,
    "--write-media", outputPath,
    "--write-subtitles", vttPath,
  ];

  console.log("🎙️ Generating voice...");

  // edge-tts uses an unofficial Microsoft endpoint that intermittently returns no audio
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    // Remove outputs from a previous attempt/run so stale audio or timings are never reused
    for (const file of [outputPath, vttPath]) {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    }
    try {
      await runEdgeTTS(args);
      if (!fs.existsSync(outputPath)) throw new Error("voice.mp3 not created");
      console.log("✅ Voice generated:", outputPath);
      return outputPath;
    } catch (err) {
      if (attempt === ATTEMPTS) throw err;
      console.warn(`⚠️ ${err.message} - retrying (${attempt}/${ATTEMPTS - 1})...`);
      await new Promise(res => setTimeout(res, attempt * 5000));
    }
  }
}

module.exports = { generateVoice };
