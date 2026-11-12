const fs = require("fs");
const path = require("path");

// Add new series here; they play in this order, one part per upload
// (10 series x 5 parts = 50 videos; plan in series/PLAN.md)
// Only insert new series AFTER the one currently uploading (series_progress.json "series" index),
// or already-uploaded parts would repeat.
const SERIES = [
  require("../series/dontAnswerAfter9"),
  // Narrated, viewers pick A or B at the end of every part
  require("../series/hundredMillion"),
  require("../series/backTo2010"),
  require("../series/perfectPlan"),
  require("../series/theBag"),
  require("../series/tuesdayLoop"),
  // Comedy is off for now (files kept in series/ in case it comes back):
  // require("../series/officeLife"),
  // require("../series/friends"),
  require("../series/appKnowsTooMuch"),
  require("../series/missingDiamond"),
  require("../series/creatureBlackwood"),
  require("../series/lighthouse"),
  require("../series/lastRadioMessage"),
  require("../series/nightTrain"),
  require("../series/frozenStation"),
  require("../series/lostInTheDeep"),
];

// Committed back by the workflow, like topic_progress.json
const PROGRESS_FILE = path.join(__dirname, "series_progress.json");
const CARD_SECONDS = 1.6;

function loadProgress() {
  try {
    const data = JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8"));
    // videos: "<seriesId>:<part>" -> YouTube video id, so the next part can count the A/B votes
    return { series: data.series || 0, part: data.part || 0, videos: data.videos || {} };
  } catch {
    return { series: 0, part: 0, videos: {} };
  }
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress), "utf8");
}

function findSeries(id) {
  const index = id ? SERIES.findIndex(s => s.id === id) : 0;
  if (index === -1) throw new Error(`Unknown series "${id}". Available: ${SERIES.map(s => s.id).join(", ")}`);
  return { series: SERIES[index], index };
}

/**
 * The part to make next. With advance=true, progress moves on (use only for real uploads).
 * Returns null once every part of every series is done - never re-uploads old parts.
 */
function getNextPart({ advance = false } = {}) {
  const progress = loadProgress();
  let { series: si, part: pi } = progress;
  while (si < SERIES.length && pi >= SERIES[si].parts.length) { si += 1; pi = 0; }
  if (si >= SERIES.length) return null;

  if (advance) saveProgress({ ...progress, series: si, part: pi + 1 });
  return buildPart(SERIES[si], pi);
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
 * Never claims a result that isn't true - with too few votes it just says "here's what he did".
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
    text = `Last time, we asked: ${prev.question.replace(/^\w/, c => c.toLowerCase())} Here's what ${hero} did.`;
  }
  const first = part.dialogue.lines[0];
  const intro = {
    scene: first.scene, night: first.night, cast: first.cast, seated: first.seated,
    speaker: "N", text, emotion: "neutral", fx: null, voiceOf: null, hooded: false, pose: null, focus: null, sfx: null, voice: null,
  };
  return { ...part, voteIntro: text, dialogue: { ...part.dialogue, lines: [intro, ...part.dialogue.lines] } };
}

// Flattens segments into one list of lines, each carrying its own scene/lighting/cast
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
      speaker: "N", emotion: "neutral", fx: null, voiceOf: null, hooded: false, pose: null, focus: null,
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

module.exports = { getNextPart, getPart, recordUpload, uploadedVideoId, addVoteIntro, SERIES };
