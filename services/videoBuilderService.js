

const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const FFMPEG = process.platform === "win32"
  ? `"C:\\Users\\malli\\Downloads\\ffmpeg-8.0.1-essentials_build\\ffmpeg-8.0.1-essentials_build\\bin\\ffmpeg.exe"`
  : "ffmpeg";

async function buildVideo(clips, voicePath, subtitlePath) {

  const clipsListPath = path.join(__dirname, "../storage/clips/clips.txt");
  const musicPath = path.join(__dirname, "../storage/music/background.mp3");
  const outputVideo = path.join(__dirname, "../storage/finalVideo.mp4");

  const clipsText = clips
    .map(c => `file '${c.replace(/\\/g, "/")}'`)
    .join("\n");

  fs.writeFileSync(clipsListPath, clipsText);
  console.log("📄 Clips list created:\n", clipsText);

  if (fs.existsSync(outputVideo)) {
    fs.unlinkSync(outputVideo);
    console.log("🗑️ Deleted old finalVideo.mp4");
  }

  const subtitleAbsolute = path.join(__dirname, "../storage/subtitles.srt");
  const ffmpegSubtitlePath = subtitleAbsolute
    .replace(/\\/g, "/")
    .replace(/^([A-Z]):/, "$1\\:");

  const hasMusic = fs.existsSync(musicPath);
  console.log(hasMusic ? "🎵 Background music found!" : "⚠️ No background music found, skipping...");

  let command;

  if (hasMusic) {
    command = [
      FFMPEG,
      `-y`,
      `-f concat -safe 0 -r 30`,
      `-i "${clipsListPath}"`,
      `-i "${voicePath}"`,
      `-stream_loop -1 -i "${musicPath}"`,
      `-vf "fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,subtitles='${ffmpegSubtitlePath}'"`,
      `-filter_complex "[1:a]volume=1.0[voice];[2:a]volume=0.15[music];[voice][music]amix=inputs=2:duration=first[aout]"`,
      `-map 0:v:0`,
      `-map "[aout]"`,
      `-c:v libx264 -c:a aac`,
      `-shortest`,
      `"${outputVideo}"`
    ].join(" ");
  } else {
    command = [
      FFMPEG,
      `-y`,
      `-f concat -safe 0 -r 30`,
      `-i "${clipsListPath}"`,
      `-i "${voicePath}"`,
      `-vf "fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,subtitles='${ffmpegSubtitlePath}'"`,
      `-map 0:v:0 -map 1:a:0`,
      `-c:v libx264 -c:a aac`,
      `-shortest`,
      `"${outputVideo}"`
    ].join(" ");
  }

  console.log("🚀 Running FFmpeg command:\n", command);

  return new Promise((resolve, reject) => {

    const ffmpegProcess = exec(command, { timeout: 600000 }); // ✅ 10 minutes

    ffmpegProcess.stderr.on("data", (data) => {
      process.stdout.write(`[ffmpeg] ${data}`);
    });

    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        if (fs.existsSync(outputVideo)) {
          console.log("✅ Video created:", outputVideo);
          resolve(outputVideo);
        } else {
          reject(new Error("FFmpeg exited successfully but output file not found!"));
        }
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    ffmpegProcess.on("error", (err) => {
      reject(new Error(`FFmpeg process error: ${err.message}`));
    });

  });

}

module.exports = { buildVideo };