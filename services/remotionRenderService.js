const path = require("path");
const fs = require("fs");
const { bundle } = require("@remotion/bundler");
const { selectComposition, renderMedia } = require("@remotion/renderer");
const { pickMusicTrack } = require("./videoBuilderService");
const { runFfmpeg } = require("./dialogueVoiceService");

const ENTRY = path.join(__dirname, "../remotion/index.jsx");
const END_CARD_SECONDS = 2.6;

// Mood-specific tracks live in assets/music/<mood>/*.mp3 (e.g. assets/music/suspense).
// Returns null when there are none, so the caller can fall back to a generated bed.
function pickMoodTrack(mood) {
  const dir = path.join(__dirname, "../assets/music", mood);
  if (!fs.existsSync(dir)) return null;
  const tracks = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith(".mp3"));
  return tracks.length ? path.join(dir, tracks[Math.floor(Math.random() * tracks.length)]) : null;
}

// Low, slowly pulsing drone with a little air - a stand-in until real suspense tracks are added
const GENERATED_SUSPENSE =
  "aevalsrc='0.5*sin(2*PI*55*t)*(0.6+0.4*sin(2*PI*0.12*t))+0.35*sin(2*PI*82.4*t)*(0.5+0.5*sin(2*PI*0.07*t+2))+0.12*sin(2*PI*116.5*t)*(0.5+0.5*sin(2*PI*0.21*t))':s=44100";

/**
 * Renders the animated skit with Remotion (silent), then mixes in voice + background music with FFmpeg.
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
  const inputProps = {
    scene: timedDialogue.scene,
    lines: timedDialogue.lines,
    durationSeconds: totalSeconds,
    hook,
    endCard: endCard ? { ...endCard, start: voiceDuration } : null,
    audio: null,
  };

  console.log("📦 Bundling Remotion project...");
  const serveUrl = await bundle({ entryPoint: ENTRY });

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
  args.push(
    // Voice is padded so music keeps playing under the end card; -t sets the real length
    "-filter_complex", `${musicFilter};[1:a]apad[voice];[voice][music]amix=inputs=2:duration=shortest:normalize=0[aout]`,
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

module.exports = { renderSkit };
