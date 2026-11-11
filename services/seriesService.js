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
    return { series: data.series || 0, part: data.part || 0 };
  } catch {
    return { series: 0, part: 0 };
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
  let { series: si, part: pi } = loadProgress();
  while (si < SERIES.length && pi >= SERIES[si].parts.length) { si += 1; pi = 0; }
  if (si >= SERIES.length) return null;

  if (advance) saveProgress({ series: si, part: pi + 1 });
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

module.exports = { getNextPart, getPart, SERIES };
