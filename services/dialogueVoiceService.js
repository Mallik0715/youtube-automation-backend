const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { runEdgeTTS } = require("./voiceService");
const { probeDuration, FFMPEG } = require("./videoBuilderService");

// One distinct voice per character. Override A/B with TTS_VOICE_A / TTS_VOICE_B
// (list voices: python -m edge_tts --list-voices)
const VOICES = {
  // The "Multilingual" voices are Microsoft's newest, most natural-sounding ones
  A: { voice: process.env.TTS_VOICE_A || "en-US-AndrewMultilingualNeural", rate: "+12%", pitch: "+0Hz" }, // Max
  B: { voice: process.env.TTS_VOICE_B || "en-US-BrianMultilingualNeural", rate: "+12%", pitch: "+8Hz" },  // Leo
  C: { voice: "en-GB-SoniaNeural", rate: "+2%", pitch: "-10Hz" },                                         // Mira
  D: { voice: "en-GB-RyanNeural", rate: "+8%", pitch: "-12Hz" },                                          // Bruno
  E: { voice: "en-US-AvaMultilingualNeural", rate: "+10%", pitch: "+0Hz" },                               // Zara
  F: { voice: "en-GB-ThomasNeural", rate: "+6%", pitch: "-4Hz" },                                         // Victor
  // Storyteller for narrated series (narrated series recast Max with series.voices so he doesn't sound like this): warm, calm, a touch deeper than Max
  N: { voice: process.env.TTS_VOICE_N || "en-US-AndrewMultilingualNeural", rate: "+6%", pitch: "-3Hz" },
  child: { voice: "en-US-AnaNeural", rate: "-25%", pitch: "-4Hz" },                                       // creepy child whisper
  radio: { voice: "en-US-RogerNeural", rate: "+0%", pitch: "-2Hz" },                                      // old radio broadcast
  robot: { voice: "en-US-EmmaMultilingualNeural", rate: "+5%", pitch: "-6Hz" },                           // app / AI voice
};

// Backup engine: Kokoro (open-source, runs on this machine - scripts/kokoro_tts.py). Only used when
// edge-tts is unreachable, and then for the WHOLE part, so a video never mixes two engines.
// One voice for every line: am_michael, a deep, calm storyteller. Sped up to match the edge-tts
// narrator's pace (~2.9 words/s). Ghost / radio / app lines still get their sound effects.
const KOKORO_VOICE = process.env.KOKORO_VOICE || "am_michael";
const KOKORO_SPEED = 1.15;
const KOKORO_PYTHON = process.env.KOKORO_PYTHON || process.env.PYTHON_PATH || "python";
const KOKORO_SCRIPT = path.join(__dirname, "../scripts/kokoro_tts.py");

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
// Microsoft's free TTS endpoint sometimes refuses requests (more often from GitHub's servers):
// retry with growing waits (5s, 10s, 20s), then switch the part to Kokoro
const ATTEMPTS = 4;
const retryWait = (attempt) => Math.min(60, 5 * 2 ** (attempt - 1)) * 1000;

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(FFMPEG, args);
    let tail = "";
    proc.stderr.on("data", d => { tail = (tail + d).slice(-3000); });
    proc.on("error", err => reject(new Error(`FFmpeg process error: ${err.message}`)));
    proc.on("close", code => (code === 0 ? resolve() : reject(new Error(`FFmpeg exited with code ${code}\n${tail}`))));
  });
}

function runKokoro(line, eerie, outWav) {
  const speed = eerie ? 0.85 : KOKORO_SPEED;
  return new Promise((resolve, reject) => {
    const proc = spawn(KOKORO_PYTHON, [KOKORO_SCRIPT, "--voice", KOKORO_VOICE, "--speed", String(speed), "--text", line.text, "--out", outWav]);
    let tail = "";
    proc.stderr.on("data", d => { tail = (tail + d).slice(-2000); });
    proc.on("error", err => reject(new Error(`kokoro: ${err.message}`)));
    proc.on("close", code => (code === 0 ? resolve() : reject(new Error(`kokoro failed: ${tail.trim().split("\n").pop()}`))));
  });
}

async function speakLine(line, outFile, engine = "edge") {
  // Offscreen voices (speaker "V") borrow someone's voice; ghosts are slowed and lowered
  const filter = VOICE_FX[line.fx] || null;
  const eerie = line.fx === "echo";

  if (engine === "kokoro") {
    const wav = outFile.replace(/\.mp3$/, "_k.wav");
    await runKokoro(line, eerie, wav);
    // Ghost voices also drop in pitch, as with edge-tts
    const chain = [eerie ? "asetrate=24000*0.88,aresample=24000" : null, filter].filter(Boolean).join(",");
    await runFfmpeg(["-y", "-i", wav, ...(chain ? ["-af", chain] : []), "-c:a", "libmp3lame", "-b:a", "192k", outFile]);
    fs.unlinkSync(wav);
    return;
  }

  const v = line.voice || VOICES[line.voiceOf || line.speaker] || VOICES.A;
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
      await new Promise(res => setTimeout(res, retryWait(attempt)));
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

  const voiceAll = async (engine) => {
    const out = [];
    for (let i = 0; i < dialogue.lines.length; i++) {
      const line = dialogue.lines[i];
      const file = path.join(outDir, `line_${i + 1}.mp3`);
      if (line.speaker === "CARD") await makeSilence(line.seconds || 1.6, file);
      else await speakLine(line, file, engine);
      out.push(file);
    }
    return out;
  };

  let files;
  if (process.env.TTS_ENGINE === "kokoro") {
    files = await voiceAll("kokoro");
  } else {
    try {
      files = await voiceAll("edge");
    } catch (err) {
      // Redo the whole part with Kokoro so no video mixes two sets of voices
      console.warn(`⚠️ edge-tts unavailable (${err.message}) - voicing this part with Kokoro instead`);
      files = await voiceAll("kokoro");
    }
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
