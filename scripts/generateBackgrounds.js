// Generates placeholder painted backgrounds with the free Pollinations image API.
//   node scripts/generateBackgrounds.js            -> only the missing ones
//   node scripts/generateBackgrounds.js office cafe -> just these keys (overwrites)
// Free tier: 1 image per ~45s per IP, ~576x1024 with a small watermark bottom-right, which we crop off.
// Replace any of these with a better hand-picked image anytime (see series/backgrounds.js).
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { spawnSync } = require("child_process");
const { KEYS, promptFor } = require("../series/backgrounds");

const OUT = path.join(__dirname, "../assets/backgrounds");
const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
const WAIT_MS = 50 * 1000;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchImage(prompt, seed) {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1080&height=1920&nologo=true&seed=${seed}`;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await axios.get(url, { responseType: "arraybuffer", timeout: 180000, validateStatus: () => true });
      if (res.status === 200 && String(res.headers["content-type"]).startsWith("image/")) return Buffer.from(res.data);
      console.warn(`   ${res.status} - waiting and retrying (${attempt}/4)`);
    } catch (err) {
      console.warn(`   ${err.message} - retrying (${attempt}/4)`);
    }
    await sleep(WAIT_MS);
  }
  throw new Error("image generation failed");
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const only = process.argv.slice(2);
  const keys = only.length ? only : KEYS.filter(k => !fs.existsSync(path.join(OUT, `${k}.jpg`)));
  console.log(`🎨 ${keys.length} background(s) to generate (~${Math.ceil(keys.length * WAIT_MS / 60000)} min)`);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    console.log(`[${i + 1}/${keys.length}] ${key}`);
    try {
      const raw = path.join(OUT, `${key}.raw.jpg`);
      fs.writeFileSync(raw, await fetchImage(promptFor(key), 1000 + i));
      // Crop off the watermark strip, then fill the 1080x1920 frame
      const r = spawnSync(FFMPEG, ["-y", "-loglevel", "error", "-i", raw, "-vf",
        "crop=iw:ih*0.94:0:0,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920",
        "-q:v", "3", path.join(OUT, `${key}.jpg`)]);
      fs.unlinkSync(raw);
      if (r.status !== 0) throw new Error(String(r.stderr));
      console.log(`   ✅ saved ${key}.jpg`);
    } catch (err) {
      console.error(`   ❌ ${key}: ${err.message}`);
    }
    if (i < keys.length - 1) await sleep(WAIT_MS);
  }
  console.log("🎨 done");
})();
