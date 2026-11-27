// Merges this run's upload progress into the newest copy from GitHub, so a push made during an upload
// (e.g. from the writer page) can never make the progress save fail - which once led to a part being
// posted twice.
//   node scripts/mergeProgress.js <this run's progress.json> <file to update (the newest from GitHub)>
const fs = require("fs");
const [ours, target] = process.argv.slice(2);
const read = (f) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return {}; } };
const mine = read(ours);
const theirs = read(target);
const merged = {
  // this run moved the queue on, so its position wins
  seriesId: mine.seriesId ?? theirs.seriesId ?? null,
  part: mine.part ?? theirs.part ?? 0,
  done: [...new Set([...(theirs.done || []), ...(mine.done || [])])],
  // every upload either side knows about is kept (this run's ids win on the same key)
  videos: { ...(theirs.videos || {}), ...(mine.videos || {}) },
  branches: { ...(theirs.branches || {}), ...(mine.branches || {}) },
};
fs.writeFileSync(target, JSON.stringify(merged));
console.log(`progress merged: ${Object.keys(merged.videos).length} uploads recorded`);
