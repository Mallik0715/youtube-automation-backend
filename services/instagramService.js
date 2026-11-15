// Instagram Reels: posts each rendered part as a Reel and reads its A/B comment votes.
// Needs INSTAGRAM_USER_ID and INSTAGRAM_ACCESS_TOKEN (Meta app "Shorts_uploader", Instagram API).
// Tokens from "Instagram login" start with IG and use graph.instagram.com; Facebook / system-user tokens
// (EAA...) use graph.facebook.com - both work the same way here.
const fs = require("fs");
const axios = require("axios");
const { readVote } = require("./voteService");

const VERSION = process.env.INSTAGRAM_API_VERSION || "v23.0";
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function config() {
  const userId = process.env.INSTAGRAM_USER_ID;
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!userId || !token) return null;
  const host = token.startsWith("IG") ? "graph.instagram.com" : "graph.facebook.com";
  return { userId, token, base: `https://${host}/${VERSION}` };
}

const isConfigured = () => !!config();

// Meta's error message, not axios's generic one
function explain(err) {
  const e = err.response?.data?.error;
  return e ? `${e.message}${e.error_user_msg ? ` - ${e.error_user_msg}` : ""} (code ${e.code})` : err.message;
}

/** Account check that never posts anything: who the token belongs to and how many posts it has */
async function checkAccount() {
  const c = config();
  if (!c) throw new Error("INSTAGRAM_USER_ID / INSTAGRAM_ACCESS_TOKEN are not set");
  try {
    const me = await axios.get(`${c.base}/${c.userId}`, { params: { fields: "id,username,media_count", access_token: c.token } });
    return { ...me.data, api: c.base };
  } catch (err) {
    throw new Error(`Instagram account check failed: ${explain(err)}`);
  }
}

/**
 * Posts a video as a Reel. Steps: create an upload container, send the file to Meta's upload server,
 * wait while Instagram processes it, then publish.
 * @returns {Promise<{id: string, permalink: string|null}>}
 */
async function uploadReel(videoPath, caption) {
  const c = config();
  if (!c) throw new Error("Instagram is not configured");
  const size = fs.statSync(videoPath).size;
  console.log("📸 Uploading to Instagram Reels...");
  try {
    const container = await axios.post(`${c.base}/${c.userId}/media`, null, {
      params: { media_type: "REELS", upload_type: "resumable", caption, share_to_feed: true, access_token: c.token },
    });
    const containerId = container.data.id;

    await axios.post(`https://rupload.facebook.com/ig-api-upload/${VERSION}/${containerId}`, fs.readFileSync(videoPath), {
      headers: { Authorization: `OAuth ${c.token}`, offset: "0", file_size: String(size), "Content-Type": "application/octet-stream" },
      maxBodyLength: Infinity, maxContentLength: Infinity, timeout: 300000,
    });

    // Processing usually takes 20-90 seconds
    for (let i = 0; i < 60; i++) {
      await sleep(10000);
      const s = await axios.get(`${c.base}/${containerId}`, { params: { fields: "status_code,status", access_token: c.token } });
      if (s.data.status_code === "FINISHED") break;
      if (s.data.status_code === "ERROR" || s.data.status_code === "EXPIRED") throw new Error(`Instagram couldn't process the video: ${s.data.status || s.data.status_code}`);
      if (i === 59) throw new Error("Instagram is still processing after 10 minutes");
    }

    const published = await axios.post(`${c.base}/${c.userId}/media_publish`, null, { params: { creation_id: containerId, access_token: c.token } });
    const id = published.data.id;
    let permalink = null;
    try {
      permalink = (await axios.get(`${c.base}/${id}`, { params: { fields: "permalink", access_token: c.token } })).data.permalink;
    } catch {}
    console.log("✅ Reel published:", permalink || id);
    return { id, permalink };
  } catch (err) {
    throw new Error(explain(err));
  }
}

/** A/B votes in a Reel's comments: one vote per person, same rules as YouTube. Returns {a, b} or null. */
async function countInstagramVotes(mediaId) {
  const c = config();
  if (!c || !mediaId) return null;
  const voters = new Map();
  let url = `${c.base}/${mediaId}/comments`;
  let params = { fields: "text,username,from", limit: 50, access_token: c.token };
  try {
    for (let page = 0; page < 20 && url; page++) {
      const res = await axios.get(url, { params });
      for (const cm of res.data.data || []) {
        const vote = readVote(cm.text);
        const who = cm.from?.id || cm.username || cm.id;
        if (vote && !voters.has(who)) voters.set(who, vote);
      }
      url = res.data.paging?.next || null;
      params = undefined; // the "next" link already carries them
    }
  } catch (err) {
    console.warn(`⚠️ Couldn't read Instagram comments (${explain(err)})`);
    return null;
  }
  const votes = { a: 0, b: 0 };
  for (const v of voters.values()) votes[v]++;
  console.log(`🗳️  Instagram votes: A ${votes.a} · B ${votes.b}`);
  return votes;
}

/** Instagram caption for a part: hook, teaser, the call to vote, hashtags (Instagram allows 2,200 characters) */
function captionFor(part) {
  const hook = (part.hook || part.partTitle || "").replace(/\*/g, "");
  const c = part.choice || null;
  const lines = [
    `${hook} (${part.seriesTitle}, Part ${part.number})`,
    "",
    c ? `A: ${c.a}\nB: ${c.b}\n\n${c.question} Comment A or B 👇` : "",
    part.branching && part.number < part.total ? "The most votes decide what happens next." : "",
    "",
    (part.hashtags || []).map(h => (h === "#shorts" ? "#reels" : h)).join(" "),
  ];
  return lines.filter((l, i, arr) => !(l === "" && arr[i - 1] === "")).join("\n").slice(0, 2200);
}

module.exports = { isConfigured, checkAccount, uploadReel, countInstagramVotes, captionFor };
