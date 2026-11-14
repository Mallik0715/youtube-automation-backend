// API for the series writer page (web/): write a series with AI, edit it, check it, preview a part,
// put it in the upload queue and push it to GitHub (where the scheduled workflow uploads it).
// Runs only on this PC (server.js listens on localhost).
const express = require("express");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const crypto = require("crypto");
const svc = require("../services/seriesService");
const { validateSeries, SCENES, EMOTIONS, POSES, SFX, CHARACTERS } = require("../services/seriesValidator");

const router = express.Router();
router.use(express.json({ limit: "2mb" }));

const ROOT = path.join(__dirname, "..");
const OUTLINES = path.join(ROOT, "storage", "writer");
fs.mkdirSync(OUTLINES, { recursive: true });

// ---- Background jobs (AI writing, renders, git) - the page polls /api/jobs/:id ----
const jobs = new Map();
function startJob(type, fn) {
  const job = { id: crypto.randomUUID(), type, status: "running", log: [], result: null, error: null, started: Date.now() };
  jobs.set(job.id, job);
  const log = (msg) => { job.log.push(String(msg)); if (job.log.length > 400) job.log.shift(); };
  fn(log).then(r => { job.result = r; job.status = "done"; }).catch(err => { job.error = err.message || String(err); job.status = "error"; log(`❌ ${job.error}`); });
  return job;
}
const busy = (type) => [...jobs.values()].some(j => j.type === type && j.status === "running");

function run(cmd, args, log) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { cwd: ROOT, shell: false });
    let out = "";
    const take = d => String(d).split(/\r?\n/).filter(Boolean).forEach(l => { out += l + "\n"; log(l); });
    p.stdout.on("data", take);
    p.stderr.on("data", take);
    p.on("error", reject);
    p.on("close", code => (code === 0 ? resolve(out) : reject(new Error(`${cmd} ${args[0]} failed (exit ${code})`))));
  });
}

// ---- Series files ----
const jsonFile = (id) => path.join(svc.SERIES_DIR, `${id}.json`);
function readSeries(id) {
  const s = svc.allSeries().find(x => x.id === id);
  if (!s) { const e = new Error(`no series "${id}"`); e.status = 404; throw e; }
  return s;
}
function saveSeries(series) {
  const { file, ...clean } = series; // "file" is added when loading
  fs.writeFileSync(jsonFile(clean.id), JSON.stringify(clean, null, 2) + "\n", "utf8");
}
function uniqueId(id) {
  const taken = new Set(svc.allSeries().map(s => s.id));
  let out = id, n = 2;
  while (taken.has(out)) out = `${id}-${n++}`;
  return out;
}
const wrap = (fn) => (req, res) => Promise.resolve(fn(req, res)).catch(err => res.status(err.status || 500).json({ error: err.message }));

// ---- Routes ----
router.get("/api/meta", (req, res) => {
  const { CAST } = require("../services/seriesWriterService");
  res.json({ scenes: SCENES, emotions: EMOTIONS, poses: POSES, sfx: SFX, characters: CHARACTERS, cast: CAST });
});

// Upload progress lives on GitHub (the workflow commits it after each upload) - read that copy,
// not this PC's possibly older one. Refreshed at most once a minute.
let remote = { at: 0, json: null };
async function remoteProgress() {
  if (Date.now() - remote.at < 60000) return remote.json;
  remote.at = Date.now();
  try {
    await run("git", ["fetch", "-q", "origin"], () => {});
    remote.json = await run("git", ["show", "origin/HEAD:services/series_progress.json"], () => {});
  } catch { remote.json = null; }
  return remote.json;
}

router.get("/api/queue", wrap(async (req, res) => {
  const queue = svc.queueStatus(await remoteProgress());
  const queued = new Set(queue.map(q => q.id));
  const drafts = svc.allSeries().filter(s => !queued.has(s.id)).map(s => ({
    id: s.id, file: s.file, title: s.title, parts: s.parts.length, editable: fs.existsSync(jsonFile(s.file)),
    generated: s.generated || null,
  }));
  res.json({ queue, drafts });
}));

router.post("/api/generate", wrap((req, res) => {
  if (busy("generate")) return res.status(409).json({ error: "a series is already being written" });
  const input = req.body || {};
  const job = startJob("generate", async (log) => {
    const { writeSeries } = require("../services/seriesWriterService");
    const { series, outline, check } = await writeSeries(input, log);
    series.id = uniqueId(series.id);
    saveSeries(series);
    fs.writeFileSync(path.join(OUTLINES, `${series.id}.outline.json`), JSON.stringify(outline, null, 2));
    log(`💾 Saved as series/${series.id}.json (a draft - not in the upload queue yet)`);
    return { id: series.id, check };
  });
  res.json({ job: job.id });
}));

router.get("/api/series/:id", wrap((req, res) => {
  const s = readSeries(req.params.id);
  res.json({ series: s, editable: fs.existsSync(jsonFile(s.file)), check: validateSeries(s) });
}));

router.put("/api/series/:id", wrap((req, res) => {
  const s = readSeries(req.params.id);
  if (!fs.existsSync(jsonFile(s.file))) return res.status(400).json({ error: "hand-written series (.js) are edited in code, not here" });
  const next = { ...req.body.series, id: s.id };
  saveSeries(next);
  res.json({ ok: true, check: validateSeries(next) });
}));

router.delete("/api/series/:id", wrap((req, res) => {
  const s = readSeries(req.params.id);
  if (svc.readQueue().includes(s.file)) return res.status(400).json({ error: "remove it from the queue first" });
  if (!fs.existsSync(jsonFile(s.file))) return res.status(400).json({ error: "only drafts made here can be deleted here" });
  fs.unlinkSync(jsonFile(s.file));
  res.json({ ok: true });
}));

router.post("/api/series/:id/parts/:n/rewrite", wrap((req, res) => {
  const s = readSeries(req.params.id);
  const index = parseInt(req.params.n, 10) - 1;
  const outlineFile = path.join(OUTLINES, `${s.id}.outline.json`);
  if (!fs.existsSync(outlineFile)) return res.status(400).json({ error: "no AI outline saved for this series" });
  const job = startJob("rewrite", async (log) => {
    const { rewritePart } = require("../services/seriesWriterService");
    const outline = JSON.parse(fs.readFileSync(outlineFile, "utf8"));
    const part = await rewritePart(s, outline, index, log);
    const fresh = readSeries(s.id);
    fresh.parts[index] = part;
    saveSeries(fresh);
    log("💾 Saved");
    return { check: validateSeries(fresh) };
  });
  res.json({ job: job.id });
}));

router.post("/api/series/:id/preview", wrap((req, res) => {
  if (busy("preview")) return res.status(409).json({ error: "a preview is already rendering" });
  const s = readSeries(req.params.id);
  const n = Math.max(1, Math.min(s.parts.length, parseInt(req.body.part, 10) || 1));
  const job = startJob("preview", async (log) => {
    log(`🎬 Rendering ${s.title} part ${n} (takes a few minutes)...`);
    // --votes 0,0: a preview never reads YouTube comments
    await run(process.execPath, ["skit.js", "--series", s.id, "--part", String(n), "--votes", "0,0"], log);
    return { video: `/media/series_${s.id}_part${n}.mp4?t=${Date.now()}` };
  });
  res.json({ job: job.id });
}));

router.put("/api/queue", wrap(async (req, res) => {
  const files = req.body.files;
  if (!Array.isArray(files)) return res.status(400).json({ error: "files must be a list" });
  const known = new Set(svc.allSeries().map(s => s.file));
  for (const f of files) if (!known.has(f)) return res.status(400).json({ error: `unknown series file "${f}"` });
  // Never drop the series that's uploading now or ones already finished (progress refers to them)
  const status = svc.queueStatus(await remoteProgress());
  for (const q of status) {
    if (q.status !== "waiting" && !files.includes(q.file)) return res.status(400).json({ error: `"${q.title}" has uploaded parts - it stays in the queue` });
  }
  for (const f of files) {
    const s = svc.loadSeriesFile(f);
    const errs = validateSeries(s).errors;
    if (errs.length) return res.status(400).json({ error: `"${s.title}" has ${errs.length} problem(s) - fix them first: ${errs[0]}` });
  }
  svc.writeQueue([...new Set(files)]);
  res.json({ ok: true });
}));

router.get("/api/git", wrap(async (req, res) => {
  const out = await run("git", ["status", "--porcelain", "--", "series"], () => {});
  res.json({ changes: out.split("\n").filter(Boolean) });
}));

// Commits only the story files (series/*.json and the queue) and pushes them, so the scheduled
// workflow on GitHub uploads them. Code changes are never included here.
router.post("/api/publish", wrap((req, res) => {
  if (busy("publish")) return res.status(409).json({ error: "already pushing" });
  const job = startJob("publish", async (log) => {
    const files = ["series/queue.json", ...fs.readdirSync(svc.SERIES_DIR).filter(f => f.endsWith(".json") && f !== "queue.json").map(f => `series/${f}`)];
    await run("git", ["add", "--", ...files], log);
    const staged = await run("git", ["diff", "--cached", "--name-only", "--", ...files], () => {});
    if (!staged.trim()) { log("Nothing new to push."); return { pushed: false }; }
    log(`Committing: ${staged.trim().split("\n").join(", ")}`);
    const message = (req.body && req.body.message) || "Update series queue from the writer page";
    await run("git", ["commit", "-m", message, "--", ...files], log);
    // The workflow commits upload progress back to GitHub; take that first
    await run("git", ["pull", "--rebase", "--autostash"], log);
    await run("git", ["push"], log);
    log("✅ Pushed. The next scheduled run will use the new queue.");
    return { pushed: true };
  });
  res.json({ job: job.id });
}));

router.get("/api/jobs/:id", (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: "unknown job" });
  res.json(job);
});

module.exports = router;
