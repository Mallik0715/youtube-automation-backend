const { spawn, execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

// Set FFMPEG_PATH in .env locally if ffmpeg isn't on PATH (ffprobe is assumed to sit next to it)
const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
const FFPROBE = process.env.FFPROBE_PATH || FFMPEG.replace(/ffmpeg(\.exe)?$/i, "ffprobe$1");

// Put royalty-free .mp3 tracks in assets/music (committed, so CI has them) or storage/music (local only).
// If none exist, a quiet generated ambient pad is used so the video is never silent underneath.
const MUSIC_DIRS = [
  path.join(__dirname, "../assets/music"),
  path.join(__dirname, "../storage/music"),
];

function probeDuration(file) {
  return new Promise((resolve, reject) => {
    execFile(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], (err, stdout) => {
      const duration = parseFloat(stdout);
      if (err || !Number.isFinite(duration)) reject(new Error(`ffprobe failed for ${file}: ${err?.message || stdout}`));
      else resolve(duration);
    });
  });
}

function pickMusicTrack() {
  for (const dir of MUSIC_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const tracks = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith(".mp3"));
    if (tracks.length) return path.join(dir, tracks[Math.floor(Math.random() * tracks.length)]);
  }
  return null;
}

// Plan shots that cover the whole narration: cycle through the clips, and on later
// cycles start further into each clip so the same footage isn't repeated exactly.
function planShots(clips, totalSeconds, shotSeconds) {
  const shots = [];
  let covered = 0;
  for (let k = 0; covered < totalSeconds && k < 500; k++) {
    const clip = clips[k % clips.length];
    const cycle = Math.floor(k / clips.length);
    const length = Math.min(shotSeconds, clip.duration);
    const room = clip.duration - length;
    const offset = room > 0.1 ? (cycle * shotSeconds) % room : 0;
    shots.push({ file: clip.file, offset, length });
    covered += length;
  }
  return shots;
}

/**
 * Cuts the clips into short shots that cover the narration, burns in subtitles, and mixes
 * voice with background music.
 * @param {{width?: number, height?: number, shotSeconds?: number, outputName?: string, timeoutMinutes?: number}} [options]
 *   Defaults produce a vertical 1080x1920 Short with fast ~3.5s cuts.
 */
async function buildVideo(clipPaths, voicePath, subtitlePath, options = {}) {
  const {
    width = 1080,
    height = 1920,
    shotSeconds = 3.5,
    outputName = "finalVideo.mp4",
    timeoutMinutes = 10,
  } = options;

  const outputVideo = path.join(__dirname, "../storage", outputName);
  if (fs.existsSync(outputVideo)) fs.unlinkSync(outputVideo);

  const voiceDuration = await probeDuration(voicePath);

  const clips = [];
  for (const file of clipPaths) {
    try {
      const duration = await probeDuration(file);
      if (duration >= 1) clips.push({ file, duration });
    } catch (err) {
      console.warn("⚠️ Skipping unreadable clip:", err.message);
    }
  }
  if (!clips.length) throw new Error("No usable clips to build the video");

  const shots = planShots(clips, voiceDuration + 0.5, shotSeconds);
  console.log(`🎞️ ${shots.length} shots from ${clips.length} clips for ${voiceDuration.toFixed(1)}s of narration`);

  // Each shot is its own input, decoded and normalised separately, so clips with different
  // sizes/frame rates never break the concat
  const args = ["-y"];
  for (const shot of shots) {
    args.push("-ss", shot.offset.toFixed(2), "-t", shot.length.toFixed(2), "-i", shot.file);
  }
  const voiceIdx = shots.length;
  args.push("-i", voicePath);

  const musicIdx = voiceIdx + 1;
  const musicTrack = pickMusicTrack();
  if (musicTrack) {
    console.log("🎵 Music:", path.basename(musicTrack));
    args.push("-stream_loop", "-1", "-i", musicTrack);
  } else {
    console.log("🎵 No music track found, using generated ambient pad");
    args.push(
      "-f", "lavfi",
      "-i", "aevalsrc='0.3*sin(2*PI*110*t)*(0.7+0.3*sin(2*PI*0.08*t))+0.2*sin(2*PI*164.81*t)*(0.6+0.4*sin(2*PI*0.06*t+1))+0.15*sin(2*PI*220.5*t)':s=44100"
    );
  }

  // FFmpeg's subtitles filter needs forward slashes and an escaped drive colon on Windows
  const ffmpegSubtitlePath = subtitlePath
    .replace(/\\/g, "/")
    .replace(/^([A-Za-z]):/, "$1\\:");

  const filters = [];
  shots.forEach((_, i) => {
    filters.push(`[${i}:v]fps=30,scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},setsar=1,setpts=PTS-STARTPTS[s${i}]`);
  });
  filters.push(`${shots.map((_, i) => `[s${i}]`).join("")}concat=n=${shots.length}:v=1:a=0[cut]`);
  // Light grade for punchier colour + subtle vignette, then burn in subtitles (styles live in the .ass file)
  filters.push(`[cut]eq=contrast=1.05:saturation=1.1,vignette=PI/6,subtitles='${ffmpegSubtitlePath}'[vout]`);

  const musicVolume = musicTrack ? 0.12 : 0.06;
  // Only the generated pad gets softened; real tracks keep their full sound
  const musicTone = musicTrack ? "" : "lowpass=f=1200,";
  filters.push(`[${musicIdx}:a]${musicTone}volume=${musicVolume}[music]`);
  filters.push(`[${voiceIdx}:a][music]amix=inputs=2:duration=first:normalize=0[aout]`);

  args.push(
    "-filter_complex", filters.join(";"),
    "-map", "[vout]", "-map", "[aout]",
    "-t", (voiceDuration + 0.3).toFixed(2),
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "21", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k",
    "-movflags", "+faststart",
    outputVideo
  );

  console.log("🚀 Running FFmpeg...");

  return new Promise((resolve, reject) => {
    const ffmpegProcess = spawn(FFMPEG, args);
    const timer = setTimeout(() => {
      ffmpegProcess.kill("SIGKILL");
      reject(new Error(`FFmpeg timed out after ${timeoutMinutes} minutes`));
    }, timeoutMinutes * 60 * 1000);

    // Keep only the tail of FFmpeg's output so failures are debuggable without flooding the log
    let stderrTail = "";
    ffmpegProcess.stderr.on("data", (data) => {
      stderrTail = (stderrTail + data).slice(-4000);
    });

    ffmpegProcess.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0 && fs.existsSync(outputVideo)) {
        console.log("✅ Video created:", outputVideo);
        resolve(outputVideo);
      } else {
        console.error(stderrTail);
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    ffmpegProcess.on("error", (err) => {
      clearTimeout(timer);
      reject(new Error(`FFmpeg process error: ${err.message}`));
    });
  });
}

module.exports = { buildVideo };
