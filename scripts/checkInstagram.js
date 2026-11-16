// Checks the Instagram connection WITHOUT posting anything: npm run check:instagram
// (on GitHub: Actions -> "Check Instagram" -> Run workflow)
require("dotenv").config({ quiet: true });
const { checkAccount, uploadReel } = require("../services/instagramService");
const { spawnSync } = require("child_process");
const path = require("path");
const os = require("os");
// --upload-test: also uploads a 5-second test clip WITHOUT publishing it (nothing appears on the profile)
const UPLOAD_TEST = process.argv.includes("--upload-test");

const token = process.env.INSTAGRAM_ACCESS_TOKEN || "";
console.log(`Token: ${token ? `set (${token.length} characters, ${token.startsWith("IG") ? "Instagram login" : token.startsWith("EAA") ? "Facebook / system user" : "unknown"} type)` : "MISSING"}`);
console.log(`User ID: ${process.env.INSTAGRAM_USER_ID ? "set" : "MISSING"}`);
(async () => {
  const a = await checkAccount();
  console.log(`✅ Connected to @${a.username} (${a.media_count} posts) via ${a.api}. Reels will be posted here.`);
  if (!UPLOAD_TEST) return;
  const clip = path.join(os.tmpdir(), "ig_test.mp4");
  const ff = spawnSync(process.env.FFMPEG_PATH || "ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi", "-i", "color=c=0x223344:s=1080x1920:r=30:d=5",
    "-f", "lavfi", "-i", "sine=frequency=440:duration=5", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", clip]);
  if (ff.status !== 0) throw new Error(`couldn't make the test clip: ${ff.stderr}`);
  await uploadReel(clip, "Upload test - not published", { publish: false });
})().catch(err => { console.error(`❌ ${err.message}`); process.exit(1); });
