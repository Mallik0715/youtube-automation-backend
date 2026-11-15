// Checks the Instagram connection WITHOUT posting anything: npm run check:instagram
// (on GitHub: Actions -> "Check Instagram" -> Run workflow)
require("dotenv").config({ quiet: true });
const { checkAccount } = require("../services/instagramService");

const token = process.env.INSTAGRAM_ACCESS_TOKEN || "";
console.log(`Token: ${token ? `set (${token.length} characters, ${token.startsWith("IG") ? "Instagram login" : token.startsWith("EAA") ? "Facebook / system user" : "unknown"} type)` : "MISSING"}`);
console.log(`User ID: ${process.env.INSTAGRAM_USER_ID ? "set" : "MISSING"}`);
checkAccount()
  .then(a => console.log(`✅ Connected to @${a.username} (${a.media_count} posts) via ${a.api}. Reels will be posted here.`))
  .catch(err => { console.error(`❌ ${err.message}`); process.exit(1); });
