const fs = require("fs");
const path = require("path");

// Add new series here; they play in this order, one part per upload
const SERIES = [
  require("../series/dontAnswerAfter9"),
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
      const base = { scene: seg.scene, night: !!seg.night, cast: seg.cast };
      if (line.card) {
        lines.push({ ...base, speaker: "CARD", text: line.card, seconds: line.seconds || CARD_SECONDS, fx: line.fx || null });
      } else {
        lines.push({
          ...base,
          speaker: line.speaker,
          text: line.text,
          emotion: line.emotion || "neutral",
          fx: line.fx || null,
          voiceOf: line.voiceOf || null,
          hooded: !!line.hooded,
        });
      }
    }
  }

  const seoTitle = `${series.title} | Part ${number}/${total}: ${part.title}`;
  return {
    seriesId: series.id,
    seriesTitle: series.title,
    number,
    total,
    partTitle: part.title,
    music: series.music || null,
    dialogue: { scene: part.segments[0].scene, lines },
    badge: `${series.title.toUpperCase()} · PART ${number}/${total}`,
    endCard: isLast
      ? { title: "SEASON 2?", subtitle: "Comment if you want it" }
      : { title: `PART ${number + 1} →`, subtitle: "Follow so you don't miss it" },
    seo: {
      title: `${seoTitle} ${series.hashtags.slice(0, 2).join(" ")}`.slice(0, 100),
      description:
        `${series.description}\n\nPart ${number} of ${total}: ${part.title}` +
        (isLast ? "\n\nThe end... or is it?" : `\nPart ${number + 1} is coming next - follow so you don't miss it.`) +
        `\n\n${series.hashtags.join(" ")}`,
      tags: ["mystery", "animated story", "cartoon", "short story", "psychology", series.title, `part ${number}`],
    },
  };
}

module.exports = { getNextPart, getPart, SERIES };
