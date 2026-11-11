const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const { bundle } = require("@remotion/bundler");
const { selectComposition, renderMedia } = require("@remotion/renderer");
const { pickMusicTrack, FFMPEG } = require("./videoBuilderService");
const { runFfmpeg } = require("./dialogueVoiceService");

const ENTRY = path.join(__dirname, "../remotion/index.jsx");
// assets/ is served to the video, so it can load assets/backgrounds/<key>.jpg
const ASSETS = path.join(__dirname, "../assets");
const SFX_DIR = path.join(ASSETS, "sfx");
const END_CARD_SECONDS = 2.6;
const FPS = 30;

// Mood-specific tracks live in assets/music/<mood>/*.mp3 (e.g. assets/music/suspense).
// Returns null when there are none, so the caller can fall back to a generated bed.
function pickMoodTrack(mood) {
  const dir = path.join(ASSETS, "music", mood);
  if (!fs.existsSync(dir)) return null;
  const tracks = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith(".mp3"));
  return tracks.length ? path.join(dir, tracks[Math.floor(Math.random() * tracks.length)]) : null;
}

// Low, slowly pulsing drone with a little air - a stand-in until real suspense tracks are added
const GENERATED_SUSPENSE =
  "aevalsrc='0.5*sin(2*PI*55*t)*(0.6+0.4*sin(2*PI*0.12*t))+0.35*sin(2*PI*82.4*t)*(0.5+0.5*sin(2*PI*0.07*t+2))+0.12*sin(2*PI*116.5*t)*(0.5+0.5*sin(2*PI*0.21*t))':s=44100";

function availableBackgrounds() {
  const dir = path.join(ASSETS, "backgrounds");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith(".jpg") && !f.includes(".raw.")).map(f => f.slice(0, -4));
}

/**
 * Loudness of the voice track for every video frame (0..1), so mouths open with the real audio.
 * Normalised against the loud parts of the track; near-silence is gated to 0 so mouths close in pauses.
 */
function voiceEnvelope(voicePath, frames) {
  const RATE = 6000;
  const perFrame = RATE / FPS;
  return new Promise((resolve, reject) => {
    const proc = spawn(FFMPEG, ["-v", "error", "-i", voicePath, "-ac", "1", "-ar", String(RATE), "-f", "s16le", "pipe:1"]);
    const chunks = [];
    proc.stdout.on("data", c => chunks.push(c));
    proc.on("error", reject);
    proc.on("close", code => {
      if (code !== 0) return reject(new Error(`ffmpeg envelope exited ${code}`));
      const buf = Buffer.concat(chunks);
      const samples = buf.length / 2;
      const rms = [];
      for (let f = 0; f < frames; f++) {
        let sum = 0;
        let n = 0;
        for (let i = Math.floor(f * perFrame); i < Math.min(samples, Math.floor((f + 1) * perFrame)); i++) {
          const v = buf.readInt16LE(i * 2) / 32768;
          sum += v * v;
          n++;
        }
        rms.push(n ? Math.sqrt(sum / n) : 0);
      }
      const loud = rms.filter(v => v > 0.01).sort((a, b) => a - b);
      const ref = loud.length ? loud[Math.floor(loud.length * 0.9)] : 1;
      resolve(rms.map(v => {
        const x = v / ref;
        return x < 0.08 ? 0 : Math.round(Math.min(1, x) * 100) / 100;
      }));
    });
  });
}

// Sound effects: which file, when (seconds), how loud. Shocks, scene changes and cliffhangers get
// sounds automatically; script lines can ask for one with `sfx`.
const SFX_VOLUME = { boom: 0.55, whoosh: 0.4, stinger: 0.75, knock: 0.9, thunder: 0.7, footsteps: 0.6, pop: 0.35 };

function sfxEvents(lines, endCard, hook) {
  const events = [];
  if (hook) events.push({ name: "pop", at: 0.05 });
  lines.forEach((l, i) => {
    const prev = lines[i - 1];
    if (prev && (prev.scene !== l.scene || !!prev.night !== !!l.night)) events.push({ name: "whoosh", at: Math.max(0, l.start - 0.3) });
    if (l.fx === "shake") events.push({ name: "boom", at: l.start });
    if (l.sfx) events.push({ name: l.sfx, at: l.start });
  });
  if (endCard?.sfx) events.push({ name: endCard.sfx, at: Math.max(0, endCard.start - 0.15) });
  return events.filter(e => fs.existsSync(path.join(SFX_DIR, `${e.name}.mp3`)));
}

/**
 * Renders the animated skit with Remotion (silent), then mixes voice + music + sound effects with FFmpeg.
 * @param {{scene: string, lines: object[]}} timedDialogue - lines with start/end from dialogueVoiceService
 * @param {string} voicePath
 * @param {number} voiceDuration - seconds
 * @param {{outputName?: string, hook?: string, endCard?: {title: string, subtitle?: string}, music?: string}} [options]
 *   music: a mood folder under assets/music (e.g. "suspense"); omitted = any track in assets/music
 */
async function renderSkit(timedDialogue, voicePath, voiceDuration, options = {}) {
  const { outputName = "skitVideo.mp4", hook = null, endCard = null, music = null } = options;
  const storage = path.join(__dirname, "../storage");
  const silentVideo = path.join(storage, "skit", "skit_silent.mp4");
  const outputVideo = path.join(storage, outputName);
  for (const f of [silentVideo, outputVideo]) if (fs.existsSync(f)) fs.unlinkSync(f);

  const totalSeconds = voiceDuration + (endCard ? END_CARD_SECONDS : 0.6);
  const frames = Math.ceil(totalSeconds * FPS);
  const backgrounds = availableBackgrounds();
  const card = endCard ? { ...endCard, start: voiceDuration } : null;
  const inputProps = {
    scene: timedDialogue.scene,
    lines: timedDialogue.lines,
    durationSeconds: totalSeconds,
    hook,
    endCard: card,
    audio: null,
    mouth: await voiceEnvelope(voicePath, frames),
    backgrounds,
  };
  console.log(`🖼️  ${backgrounds.length} painted background(s) available`);

  console.log("📦 Bundling Remotion project...");
  const serveUrl = await bundle({ entryPoint: ENTRY, publicDir: ASSETS });

  const composition = await selectComposition({ serveUrl, id: "Skit", inputProps });
  console.log(`🎬 Rendering ${composition.durationInFrames} frames (first run downloads a headless Chrome)...`);

  let lastLogged = -10;
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    crf: 20,
    muted: true,
    inputProps,
    outputLocation: silentVideo,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 100);
      if (pct >= lastLogged + 10) {
        lastLogged = pct;
        console.log(`   ...${pct}%`);
      }
    },
  });

  const args = ["-y", "-i", silentVideo, "-i", voicePath];
  let musicFilter;
  const track = music ? pickMoodTrack(music) : pickMusicTrack();
  if (track) {
    console.log("🎵 Music:", path.basename(track));
    args.push("-stream_loop", "-1", "-i", track);
    musicFilter = "[2:a]volume=0.12[music]";
  } else if (music === "suspense") {
    console.log("🎵 No tracks in assets/music/suspense - using generated suspense drone");
    args.push("-f", "lavfi", "-i", GENERATED_SUSPENSE);
    musicFilter = "[2:a]lowpass=f=900,volume=0.10[music]";
  } else {
    args.push("-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo");
    musicFilter = "[2:a]anull[music]";
  }

  const events = sfxEvents(timedDialogue.lines, card, hook);
  console.log(`🔊 ${events.length} sound effect(s)`);
  const sfxFilters = events.map((e, i) => {
    args.push("-i", path.join(SFX_DIR, `${e.name}.mp3`));
    const ms = Math.round(e.at * 1000);
    return `[${3 + i}:a]adelay=${ms}|${ms},volume=${SFX_VOLUME[e.name] ?? 0.6}[s${i}]`;
  });
  const mixInputs = ["[voice]", "[music]", ...events.map((_, i) => `[s${i}]`)];

  args.push(
    // Voice is padded so music keeps playing under the end card; -t sets the real length
    "-filter_complex",
    [musicFilter, "[1:a]apad[voice]", ...sfxFilters,
      `${mixInputs.join("")}amix=inputs=${mixInputs.length}:duration=longest:normalize=0[aout]`].join(";"),
    "-map", "0:v", "-map", "[aout]",
    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ac", "2", "-ar", "44100",
    "-t", totalSeconds.toFixed(2),
    "-movflags", "+faststart",
    outputVideo
  );
  await runFfmpeg(args);

  console.log("✅ Video created:", outputVideo);
  return outputVideo;
}

module.exports = { renderSkit, voiceEnvelope };
