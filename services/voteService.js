// Counts the A/B votes in a video's comments, so the next part can open with the real result.
// Needs YOUTUBE_API_KEY (public comments are readable with a plain API key; the upload login can't read them).
// Returns { a, b } or null if comments can't be read - the caller then uses a neutral opening.
const { google } = require("googleapis");

const MAX_PAGES = 10; // 100 comments per page; costs 1 API unit each

/**
 * One vote per comment author, from the top-level comment only. Counts a comment when it clearly picks
 * one side: starts with A or B ("A", "b!!", "A because..."), or says "option A" / "team B", or contains
 * a capital A or B on its own (lowercase "a" alone is just the English word, so it only counts first).
 */
function readVote(text) {
  const t = String(text || "").replace(/<[^>]+>/g, " ").trim();
  const picks = new Set();
  const first = t.match(/^[^\p{L}\p{N}]*([ab])(?![\p{L}\p{N}])/iu);
  if (first) picks.add(first[1].toLowerCase());
  for (const m of t.matchAll(/\b(?:option|team|choose|pick|choice)\s+([ab])\b/gi)) picks.add(m[1].toLowerCase());
  for (const m of t.matchAll(/(?<![\p{L}\p{N}'])([AB])(?![\p{L}\p{N}'])/gu)) picks.add(m[1].toLowerCase());
  return picks.size === 1 ? [...picks][0] : null; // "A or B?" and similar don't count
}

async function countVotes(videoId) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!videoId) return null;
  if (!key) {
    console.log("🗳️  No YOUTUBE_API_KEY - skipping the vote count (neutral opening)");
    return null;
  }
  const youtube = google.youtube({ version: "v3", auth: key });
  const voters = new Map();
  let pageToken;
  try {
    for (let page = 0; page < MAX_PAGES; page++) {
      const res = await youtube.commentThreads.list({
        part: ["snippet"], videoId, maxResults: 100, textFormat: "plainText", pageToken,
      });
      for (const item of res.data.items || []) {
        const c = item.snippet.topLevelComment.snippet;
        const vote = readVote(c.textDisplay);
        const who = c.authorChannelId?.value || c.authorDisplayName;
        if (vote && !voters.has(who)) voters.set(who, vote);
      }
      pageToken = res.data.nextPageToken;
      if (!pageToken) break;
    }
  } catch (err) {
    console.warn(`⚠️ Couldn't read comments for ${videoId} (${err.message}) - neutral opening`);
    return null;
  }
  const votes = { a: 0, b: 0 };
  for (const v of voters.values()) votes[v]++;
  console.log(`🗳️  Votes on the previous part: A ${votes.a} · B ${votes.b}`);
  return votes;
}

module.exports = { countVotes, readVote };
