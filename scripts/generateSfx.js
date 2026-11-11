// Synthesises the sound effects with FFmpeg (no third-party audio, so no licensing questions).
//   node scripts/generateSfx.js     -> writes assets/sfx/*.mp3
// Replace any file with a better sound of the same name if you like.
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
const OUT = path.join(__dirname, "../assets/sfx");

// name -> [lavfi source, extra filter chain]
const SFX = {
  // Air rushing past - used on scene changes
  whoosh: ["anoisesrc=d=0.7:c=white:a=0.5",
    "highpass=f=300,lowpass=f=3000,afade=t=in:d=0.35,afade=t=out:st=0.35:d=0.35,volume=1.5"],
  // Deep hit - shocks and title cards
  boom: ["aevalsrc='0.9*sin(2*PI*(48+40*exp(-6*t))*t)*exp(-2.8*t)+0.25*(random(0)-0.5)*exp(-18*t)':d=1.6:s=44100",
    "lowpass=f=400,volume=1.4"],
  // Three knocks on a wooden door
  knock: ["aevalsrc='(sin(2*PI*160*t)+0.5*sin(2*PI*310*t))*exp(-45*mod(t,0.28))*lt(t,0.84)':d=1:s=44100",
    "lowpass=f=900,volume=1.5"],
  // "Dun... DUN" cliffhanger stinger
  stinger: ["aevalsrc='0.8*sin(2*PI*73.4*t)*exp(-4*t)*lt(t,0.55)+0.9*sin(2*PI*55*t)*exp(-1.6*(t-0.55))*gte(t,0.55)':d=2.6:s=44100",
    "lowpass=f=600,aecho=0.6:0.5:120:0.3,volume=4.5"],
  // Rolling thunder
  thunder: ["anoisesrc=d=3:c=brown:a=1",
    "lowpass=f=300,afade=t=in:d=0.08,afade=t=out:st=0.6:d=2.4,volume=2.2"],
  // Four footsteps
  footsteps: ["aevalsrc='(random(0)-0.5)*exp(-30*mod(t,0.45))*lt(t,1.8)':d=1.9:s=44100",
    "lowpass=f=700,highpass=f=80,volume=12"],
  // Tiny pop - for the hook headline appearing
  pop: ["aevalsrc='sin(2*PI*(600+900*exp(-30*t))*t)*exp(-25*t)':d=0.25:s=44100", "volume=0.8"],
};

fs.mkdirSync(OUT, { recursive: true });
for (const [name, [src, chain]] of Object.entries(SFX)) {
  const out = path.join(OUT, `${name}.mp3`);
  const r = spawnSync(FFMPEG, ["-y", "-loglevel", "error", "-f", "lavfi", "-i", src, "-af", chain, "-ac", "2", "-ar", "44100", "-b:a", "128k", out]);
  console.log(r.status === 0 ? `✅ ${name}.mp3` : `❌ ${name}: ${r.stderr}`);
}
