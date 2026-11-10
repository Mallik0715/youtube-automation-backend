const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { runEdgeTTS } = require("./voiceService");
const { probeDuration, FFMPEG } = require("./videoBuilderService");

// One distinct voice per character. Override A/B with TTS_VOICE_A / TTS_VOICE_B
// (list voices: python -m edge_tts --list-voices)
const VOICES = {
  A: { voice: process.env.TTS_VOICE_A || "en-US-GuyNeural", rate: "+20%", pitch: "+0Hz" },  // Max
  B: { voice: process.env.TTS_VOICE_B || "en-US-EricNeural", rate: "+18%", pitch: "+6Hz" }, // Leo
  C: { voice: "en-GB-SoniaNeural", rate: "+2%", pitch: "-10Hz" },                           // Mira
  D: { voice: "en-GB-RyanNeural", rate: "+8%", pitch: "-12Hz" },                             // Bruno
  E: { voice: "en-US-AvaNeural", rate: "+14%", pitch: "+0Hz" },                             // Zara
  F: { voice: "en-GB-ThomasNeural", rate: "+6%", pitch: "-4Hz" },                            // Victor
  child: { voice: "en-US-AnaNeural", rate: "-25%", pitch: "-4Hz" },                          // creepy child whisper
  radio: { voice: "en-US-RogerNeural", rate: "+0%", pitch: "-2Hz" },                         // old radio broadcast
  robot: { voice: "en-US-EmmaNeural", rate: "+5%", pitch: "-6Hz" },                          // app / AI voice
};

// Post-processing per offscreen-voice effect
const VOICE_FX = {
  // Ghostly: echoes trailing off, thin and distant
  echo: "apad=pad_dur=0.8,aecho=0.8:0.85:180|360|540:0.5|0.3|0.18,highpass=f=250,volume=1.6",
  // Old radio: narrow band, slightly overdriven
  radio: "highpass=f=500,lowpass=f=2800,acompressor=threshold=0.1:ratio=6,volume=2.2",
  // App / AI: tight metallic comb echo
  robot: "aecho=0.8:0.9:8|16:0.5|0.3,volume=1.2",
};

const GAP_SECONDS = 0.15; // pause between lines so the back-and-forth breathes
const ATTEMPTS = 3;

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(FFMPEG, args);
    let tail = "";
    proc.stderr.on("data", d => { tail = (tail + d).slice(-3000); });
    proc.on("error", err => reject(new Error(`FFmpeg process error: ${err.message}`)));
    proc.on("close", code => (code === 0 ? resolve() : reject(new Error(`FFmpeg exited with code ${code}\n${tail}`))));
  });
}

async function speakLine(line, outFile) {
  // Offscreen voices (speaker "V") borrow someone's voice; ghosts are slowed and lowered
  const filter = VOICE_FX[line.fx] || null;
  const eerie = line.fx === "echo";
  const v = VOICES[line.voiceOf || line.speaker] || VOICES.A;
  const rate = eerie ? "-15%" : v.rate;
  const pitch = eerie ? "-18Hz" : v.pitch;
  const rawFile = filter ? outFile.replace(/\.mp3$/, "_raw.mp3") : outFile;

  const args = ["-m", "edge_tts", "--voice", v.voice, `--rate=${rate}`, `--pitch=${pitch}`, "--text", line.text, "--write-media", rawFile];

  // edge-tts' endpoint intermittently returns no audio
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    if (fs.existsSync(rawFile)) fs.unlinkSync(rawFile);
    try {
      await runEdgeTTS(args);
      if (!fs.existsSync(rawFile)) throw new Error("audio not created");
      break;
    } catch (err) {
      if (attempt === ATTEMPTS) throw err;
      console.warn(`⚠️ ${err.message} - retrying line (${attempt}/${ATTEMPTS - 1})...`);
      await new Promise(res => setTimeout(res, attempt * 5000));
    }
  }

  if (filter) {
    await runFfmpeg(["-y", "-i", rawFile, "-af", filter, outFile]);
    fs.unlinkSync(rawFile);
  }
}

function makeSilence(seconds, outFile) {
  return runFfmpeg(["-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", String(seconds), "-c:a", "libmp3lame", outFile]);
}

/**
 * Voices every line and joins them into one track with a short gap between lines.
 * Lines with speaker "CARD" become silent title cards lasting line.seconds.
 * @param {{lines: object[]}} dialogue
 * @param {string} outDir - where line_N.mp3 and voice.mp3 are written
 * @returns {Promise<{voicePath: string, duration: number, lines: object[]}>}
 *   lines gain start/end (seconds on the joined track) for lip-sync and captions
 */
async function generateDialogueVoices(dialogue, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  console.log(`🎙️ Voicing ${dialogue.lines.length} lines...`);

  const files = [];
  for (let i = 0; i < dialogue.lines.length; i++) {
    const line = dialogue.lines[i];
    const file = path.join(outDir, `line_${i + 1}.mp3`);
    if (line.speaker === "CARD") await makeSilence(line.seconds || 1.6, file);
    else await speakLine(line, file);
    files.push(file);
  }

  // Each line is padded with exactly GAP_SECONDS of silence, so start times are exact sums
  const timed = [];
  let t = 0;
  for (let i = 0; i < files.length; i++) {
    const duration = await probeDuration(files[i]);
    timed.push({ ...dialogue.lines[i], start: t, end: t + duration });
    t += duration + GAP_SECONDS;
  }

  const voicePath = path.join(outDir, "voice.mp3");
  const args = ["-y"];
  files.forEach(f => args.push("-i", f));
  const filters = files.map((_, i) => `[${i}:a]aresample=44100,aformat=channel_layouts=mono,apad=pad_dur=${GAP_SECONDS}[a${i}]`);
  filters.push(`${files.map((_, i) => `[a${i}]`).join("")}concat=n=${files.length}:v=0:a=1[out]`);
  args.push("-filter_complex", filters.join(";"), "-map", "[out]", "-c:a", "libmp3lame", "-b:a", "192k", voicePath);
  await runFfmpeg(args);

  console.log(`✅ Voices joined: ${t.toFixed(1)}s`);
  return { voicePath, duration: t, lines: timed };
}

module.exports = { generateDialogueVoices, runFfmpeg, VOICES };
