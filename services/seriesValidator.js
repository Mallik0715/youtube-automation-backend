// Checks a series script before it can reach YouTube: scenes exist, speakers are on screen, casts fit,
// hooks and A/B choices exist, and estimates each part's length.
// Used by `npm run check:series` and by the series writer page (to check AI-written stories).
const fs = require("fs");
const path = require("path");

// Scene names are read from the SCENES map in remotion/Background.jsx (a JSX file Node can't require)
const bg = fs.readFileSync(path.join(__dirname, "../remotion/Background.jsx"), "utf8");
const sceneBlock = bg.slice(bg.indexOf("const SCENES = {"), bg.indexOf("};", bg.indexOf("const SCENES = {")));
const SCENES = [...sceneBlock.matchAll(/(\w+):\s*\w+/g)].map(m => m[1]);
const CHARACTERS = ["A", "B", "C", "D", "E", "F"];
const VOICES = [...CHARACTERS, "child", "radio", "robot"];
const EMOTIONS = ["neutral", "happy", "worried", "surprised", "smug", "angry", "crying", "scared", "relieved"];
const POSES = ["neutral", "point", "hips", "crossed", "shrug", "shock", "worried"];
const SFX = fs.readdirSync(path.join(__dirname, "../assets/sfx")).filter(f => f.endsWith(".mp3")).map(f => f.slice(0, -4));

// Calibrated from real renders: ~2.25 spoken words/second (natural voices) at the series voice speeds,
// plus the gap between lines, echo tails on ghost voices, and title cards
const WORDS_PER_SECOND = 2.25;
// The narrator reads faster than the characters talk (measured: Back to 2010 Pt 2 came out 55.8s)
const NARRATOR_WPS = 2.9;
const LINE_GAP = 0.15;
const END_CARD = 2.6;
const TARGET_MAX = 62;

/**
 * @returns {{errors: string[], warnings: string[], parts: {where: string, lines: number, seconds: number, errors: string[]}[]}}
 */
function validateSeries(series) {
  const errors = [];
  const warnings = [];
  const parts = [];
  if (!series.id || !/^[a-z0-9-]+$/.test(series.id)) errors.push(`series id must be lowercase-with-dashes (${series.id})`);
  if (!series.title) errors.push("series needs a title");
  if (!Array.isArray(series.parts) || !series.parts.length) {
    errors.push("series has no parts");
    return { errors, warnings, parts };
  }

  series.parts.forEach((part, pi) => {
    const where = `${series.id} part ${pi + 1}`;
    const partErrors = [];
    const fail = (msg) => { partErrors.push(msg); errors.push(`${where}: ${msg}`); };
    if (!part.hook) fail("missing hook");
    let seconds = END_CARD;
    let lines = 0;
    for (const seg of part.segments || []) {
      if (!SCENES.includes(seg.scene)) fail(`unknown scene "${seg.scene}"`);
      if (!Array.isArray(seg.cast) || seg.cast.length < 1 || seg.cast.length > 3) fail(`cast must be 1-3 characters (${seg.cast})`);
      for (const who of seg.cast || []) if (!CHARACTERS.includes(who)) fail(`unknown character "${who}" in cast`);
      for (const line of seg.lines || []) {
        lines++;
        if (line.sfx && !SFX.includes(line.sfx)) fail(`unknown sound effect "${line.sfx}" (have: ${SFX.join(", ")})`);
        if (line.pose && !POSES.includes(line.pose)) fail(`unknown pose "${line.pose}"`);
        if (line.card) { seconds += 1.6 + LINE_GAP; continue; }
        if (!line.text) fail("empty line");
        if (line.speaker === "N") {
          if (line.focus && !(seg.cast || []).includes(line.focus)) fail(`narration focuses on ${line.focus}, who isn't on screen in "${seg.scene}"`);
          if (!EMOTIONS.includes(line.emotion)) fail(`unknown emotion "${line.emotion}"`);
        } else if (line.speaker === "V") {
          if (!VOICES.includes(line.voiceOf)) fail(`offscreen voice needs a valid voiceOf (${line.voiceOf})`);
          seconds += line.fx === "echo" ? 0.8 : 0;
        } else {
          if (!(seg.cast || []).includes(line.speaker)) fail(`${line.speaker} speaks but isn't on screen in "${seg.scene}"`);
          if (!EMOTIONS.includes(line.emotion)) fail(`unknown emotion "${line.emotion}"`);
        }
        const words = (line.text || "").split(/\s+/).filter(Boolean).length;
        const wps = line.speaker === "N" ? NARRATOR_WPS : WORDS_PER_SECOND;
        seconds += words / wps * (line.fx === "echo" ? 1.25 : 1) + 0.35 + LINE_GAP;
      }
    }
    if (!lines) fail("part has no lines");
    if (series.interactive) {
      const c = part.choice;
      if (!c || !c.question || !c.a || !c.b) fail("interactive series: every part needs choice { question, a, b }");
      else {
        if (/[.!?]$/.test(c.a) || /[.!?]$/.test(c.b)) fail("choice options shouldn't end with punctuation (the narrator adds it)");
        const words = `${c.question} A ${c.a} Or B ${c.b} Comment A or B. Part 2 shows if you think like Leo`.split(/\s+/).length;
        seconds += words / NARRATOR_WPS + 0.35 + LINE_GAP;
        lines++;
      }
      if (pi > 0) {
        if (part.follows !== "a" && part.follows !== "b") fail('interactive series: parts 2+ need follows: "a" or "b" (which option of the last choice the story continues with)');
        // "77 percent of you said A: <option>. And that's exactly what Leo did."
        else if (series.parts[pi - 1].choice?.a) seconds += (12 + series.parts[pi - 1].choice.a.split(/\s+/).length) / NARRATOR_WPS + 0.35 + LINE_GAP;
      }
    }
    if (seconds > TARGET_MAX) warnings.push(`${where}: ~${seconds.toFixed(0)}s (aim for under ${TARGET_MAX}s)`);
    parts.push({ where, lines, seconds: Math.round(seconds), errors: partErrors });
  });
  return { errors, warnings, parts };
}

module.exports = { validateSeries, SCENES, CHARACTERS, EMOTIONS, POSES, SFX, TARGET_MAX };
