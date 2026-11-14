const fs = require("fs");
const path = require("path");

// Series scripts live in series/ (hand-written .js files, or .json files saved by the series writer page).
// series/queue.json is the upload order (file names). Progress is tracked by series id, so series can be
// added, reordered or removed in the queue without ever repeating an uploaded part.
const SERIES_DIR = path.join(__dirname, "../series");
const QUEUE_FILE = path.join(SERIES_DIR, "queue.json");

/** Loads one series by file name (no extension). JSON is read fresh each time (the writer page edits it). */
function loadSeriesFile(name) {
  const json = path.join(SERIES_DIR, `${name}.json`);
  const s = fs.existsSync(json) ? JSON.parse(fs.readFileSync(json, "utf8")) : require(path.join(SERIES_DIR, `${name}.js`));
  return { ...s, file: name };
}

function readQueue() {
  return JSON.parse(fs.readFileSync(QUEUE_FILE, "utf8"));
}

function writeQueue(names) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(names, null, 2) + "\n", "utf8");
}

/** The series in upload order */
function queueSeries() {
  return readQueue().map(loadSeriesFile);
}

/** Every series script in series/, queued or not (helpers and non-series files are skipped) */
function allSeries() {
  return fs.readdirSync(SERIES_DIR)
    .filter(f => /\.(js|json)$/.test(f) && f !== "queue.json")
    .map(f => f.replace(/\.(js|json)$/, ""))
    .filter((n, i, arr) => arr.indexOf(n) === i)
    .map(n => { try { return loadSeriesFile(n); } catch { return null; } })
    .filter(s => s && Array.isArray(s.parts));
}

const SERIES = queueSeries();

// Committed back by the workflow, like topic_progress.json
const PROGRESS_FILE = path.join(__dirname, "series_progress.json");
const CARD_SECONDS = 1.6;

/** @param {string|null} json - progress file contents to use instead of the local file (e.g. GitHub's copy) */
function loadProgress(json = null) {
  let data = {};
  try { data = JSON.parse(json || fs.readFileSync(PROGRESS_FILE, "utf8")); } catch {}
  // videos: "<seriesId>:<part>" -> YouTube video id, so the next part can count the A/B votes
  const progress = { seriesId: data.seriesId || null, part: data.part || 0, done: data.done || [], videos: data.videos || {} };
  // Older progress files stored the queue position ("series": 1) - convert to ids using the original order
  if (!progress.seriesId && typeof data.series === "number") {
    const list = queueSeries();
    progress.seriesId = list[data.series]?.id || null;
    progress.done = [...new Set([...progress.done, ...list.slice(0, data.series).map(s => s.id)])];
  }
  return progress;
}

function saveProgress(progress) {
  const { seriesId, part, done, videos } = progress;
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ seriesId, part, done, videos }), "utf8");
}

function findSeries(id) {
  const series = id ? allSeries().find(s => s.id === id) : queueSeries()[0];
  if (!series) throw new Error(`Unknown series "${id}". Available: ${allSeries().map(s => s.id).join(", ")}`);
  return { series };
}

/** Which series uploads now, and from which part (0-based). null once the whole queue is done. */
function currentPosition(progressJson = null) {
  const progress = loadProgress(progressJson);
  const list = queueSeries();
  const done = new Set(progress.done);
  let cur = list.find(s => s.id === progress.seriesId);
  let part = progress.part;
  if (!cur || part >= cur.parts.length) {
    if (cur) done.add(cur.id);
    cur = list.find(s => !done.has(s.id) && s.id !== progress.seriesId);
    part = 0;
  }
  return { progress, list, done, series: cur || null, part };
}

/**
 * The part to make next. With advance=true, progress moves on (use only for real uploads).
 * Returns null once every part of every queued series is done - never re-uploads old parts.
 */
function getNextPart({ advance = false } = {}) {
  const { progress, done, series, part } = currentPosition();
  if (!series) return null;
  if (advance) saveProgress({ ...progress, seriesId: series.id, part: part + 1, done: [...done] });
  return buildPart(series, part);
}

/** The queue with each series' status, for the writer page */
function queueStatus(progressJson = null) {
  const { list, done, series: cur, part } = currentPosition(progressJson);
  return list.map(s => ({
    id: s.id, file: s.file, title: s.title, parts: s.parts.length,
    status: done.has(s.id) ? "done" : cur && s.id === cur.id ? "current" : "waiting",
    uploaded: done.has(s.id) ? s.parts.length : cur && s.id === cur.id ? part : 0,
  }));
}

/** @param {string} seriesId @param {number} partNumber - 1-based */
function getPart(seriesId, partNumber) {
  const { series } = findSeries(seriesId);
  if (partNumber < 1 || partNumber > series.parts.length) {
    throw new Error(`${series.id} has parts 1-${series.parts.length}`);
  }
  return buildPart(series, partNumber - 1);
}

/** Remembers the YouTube id of an uploaded part (kept in series_progress.json, committed by the workflow) */
function recordUpload(seriesId, number, videoId) {
  const progress = loadProgress();
  progress.videos[`${seriesId}:${number}`] = videoId;
  saveProgress(progress);
}

/** YouTube id of an uploaded part, or null */
function uploadedVideoId(seriesId, number) {
  return loadProgress().videos[`${seriesId}:${number}`] || null;
}

const LETTER_WORD = { a: "A", b: "B" };
const MIN_VOTES = 3;

/**
 * Interactive series: opens the part with what viewers actually voted on the previous part.
 *   votes = { a, b } counted from real comments, or null when they couldn't be read.
 * Never claims a vote result that isn't true - with too few votes it just says which option the hero chose.
 */
function addVoteIntro(part, votes) {
  if (!part.previousChoice || !part.follows) return part;
  const prev = part.previousChoice;
  const hero = part.hero;
  const chosen = part.follows; // "a" | "b" - the option this part's story continues with
  let text;
  const total = votes ? votes.a + votes.b : 0;
  if (total >= MIN_VOTES && votes.a !== votes.b) {
    const top = votes.a > votes.b ? "a" : "b";
    const pct = Math.round((Math.max(votes.a, votes.b) / total) * 100);
    text = `${pct} percent of you said ${LETTER_WORD[top]}: ${prev[top]}.` +
      (top === chosen ? ` And that's exactly what ${hero} did.` : ` But ${hero} chose ${LETTER_WORD[chosen]}.`);
  } else if (total >= MIN_VOTES) {
    text = `You were split right down the middle. ${hero} chose ${LETTER_WORD[chosen]}: ${prev[chosen]}.`;
  } else {
    text = `Last time, we asked: ${prev.question.replace(/^\w/, c => c.toLowerCase())} ${hero} chose ${LETTER_WORD[chosen]}: ${prev[chosen]}.`;
  }
  const first = part.dialogue.lines[0];
  const intro = {
    scene: first.scene, night: first.night, cast: first.cast, seated: first.seated,
    speaker: "N", text, emotion: "neutral", fx: null, voiceOf: null, hooded: false, pose: null, focus: null, sfx: null, voice: null,
  };
  return { ...part, voteIntro: text, dialogue: { ...part.dialogue, lines: [intro, ...part.dialogue.lines] } };
}

// Flattens segments into one list of lines, each carrying its own scene/lighting/cast
// Character codes by name (remotion/Character.jsx LOOKS)
const HERO_CODES = { Max: "A", Leo: "B", Mira: "C", Bruno: "D", Zara: "E", Victor: "F" };

function buildPart(series, partIndex) {
  const part = series.parts[partIndex];
  const total = series.parts.length;
  const number = partIndex + 1;
  const isLast = number === total;

  const lines = [];
  for (const seg of part.segments) {
    for (const line of seg.lines) {
      const base = { scene: seg.scene, night: !!seg.night, cast: seg.cast, seated: seg.seated || [] };
      if (line.card) {
        lines.push({ ...base, speaker: "CARD", text: line.card, seconds: line.seconds || CARD_SECONDS, fx: line.fx || null, sfx: line.sfx || null });
      } else {
        lines.push({
          ...base,
          speaker: line.speaker,
          text: line.text,
          emotion: line.emotion || "neutral",
          fx: line.fx || null,
          voiceOf: line.voiceOf || null,
          focus: line.focus || null, // narrator lines: who the camera shows acting it out
          // A series can recast a character's voice (e.g. Max, whose usual voice sounds like the narrator's)
          voice: (series.voices || {})[line.voiceOf || line.speaker] || null,
          hooded: !!line.hooded,
          pose: line.pose || null, // neutral | point | hips | crossed | shrug | shock | worried
          prop: line.prop ?? null, // object shown on screen; null = picked from the words, false = none
          sfx: line.sfx || null,   // knock | thunder | footsteps | boom | whoosh (plays as the line starts)
        });
      }
    }
  }

  // Interactive series: the narrator asks viewers to choose, and the A/B card stays up to the end
  const choice = part.choice || null;
  if (choice) {
    const last = lines[lines.length - 1];
    lines.push({
      scene: last.scene, night: last.night, cast: last.cast, seated: last.seated,
      speaker: "N", emotion: "neutral", fx: null, voiceOf: null, hooded: false, prop: false,
      // The camera stays on the hero, weighing it up, between the question and the options
      focus: (last.cast || []).includes(series.heroCode || HERO_CODES[series.hero]) ? series.heroCode || HERO_CODES[series.hero] : null,
      pose: "shrug",
      sfx: "stinger",
      // Honest call to action: the story is pre-written, so we never claim the comments decide it
      text: `${choice.question} A: ${choice.a}. Or B: ${choice.b}. Comment A or B. ` +
        (isLast ? "Drop your theory below." : `Part ${number + 1} shows if you think like ${series.hero || "him"}.`),
      choice,
    });
  }

  // The hook headline sits on screen the whole video and leads the YouTube title:
  // curiosity first, series + part number last (people who want Part 1 can still find it)
  const hook = part.hook || part.title;
  // *stars* only mark the on-screen yellow highlight - never let them reach YouTube
  const seoTitle = `${hook.replace(/\*/g, "")} | ${series.title} Pt ${number}`;
  return {
    seriesId: series.id,
    seriesTitle: series.title,
    number,
    total,
    partTitle: part.title,
    hero: series.hero || "he",
    // Interactive series: which option of the previous part's choice this part continues with
    follows: series.interactive && partIndex > 0 ? part.follows || null : null,
    previousChoice: series.interactive && partIndex > 0 ? series.parts[partIndex - 1].choice || null : null,
    music: series.music || null,
    dialogue: { scene: part.segments[0].scene, lines },
    hook,
    // Mysteries end on a cliffhanger card + stinger; comedy sketches ask viewers to tag a friend (shares)
    endCard: choice
      ? { choice, title: "", sfx: null } // the choice card is already on screen; this just holds it a moment longer
      : series.kind === "comedy"
      ? { title: "TAG SOMEONE WHO DOES THIS", subtitle: "Follow for more", sfx: null }
      : isLast
        ? { title: "SEASON 2?", subtitle: "Comment \"YES\" if you want it", sfx: "stinger" }
        : { title: "WHAT HAPPENS NEXT?", subtitle: `Part ${number + 1} is up next. Follow so you don't miss it`, sfx: "stinger" },
    seo: {
      // YouTube caps titles at 100 chars: drop the #shorts tag (it is in the description too) before cutting words
      title: `${seoTitle} #shorts`.length <= 100 ? `${seoTitle} #shorts` : seoTitle.slice(0, 100),
      description:
        `${series.description}\n\nPart ${number} of ${total}: ${part.title}` +
        (isLast ? "\n\nThe end... or is it?" : `\nPart ${number + 1} is coming next - follow so you don't miss it.`) +
        `\n\n${series.hashtags.join(" ")}`,
      tags: [...(series.tags || []), "mystery", "animated story", "cartoon", "short story", "psychology", series.title, `part ${number}`],
    },
  };
}

module.exports = {
  getNextPart, getPart, recordUpload, uploadedVideoId, addVoteIntro, SERIES,
  queueSeries, allSeries, readQueue, writeQueue, queueStatus, loadSeriesFile, buildPart, SERIES_DIR,
};
