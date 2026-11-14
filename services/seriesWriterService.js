// Writes a narrated "What would you do?" series with AI (Gemini, or Groq), in the same format as the hand-written
// series in series/. Two ways in:
//   mode "title": just a title/idea - the AI invents the story
//   mode "story": the creator's own story - the AI only splits it into parts, adds cliffhangers and A/B choices
// Works in two steps so each request stays small (Groq's free tier limits tokens per minute):
//   1. outline: series title, characters, and per part: what happens, hook, A/B choice
//   2. each part written as scenes and narrator/character lines, then checked; a failing part is retried once
// Groq is loaded only when used (SCRIPT_AI=groq), so a missing Groq key never breaks Gemini writing
const chat = (...args) => require("./groqClient").chat(...args);
const { parseLLMJson } = require("./jsonHelper");
const { validateSeries, SCENES, CHARACTERS, EMOTIONS, SFX } = require("./seriesValidator");

// What each character looks like on screen (remotion/Character.jsx). Names can change per story - the
// narrator says the names, the picture only knows the look.
const CAST = {
  A: "young man, spiky brown hair, orange hoodie (default name Max)",
  B: "young man, round glasses, teal shirt (default name Leo)",
  C: "old woman, grey hair in a bun, shawl - a grandma or elderly figure (default name Mira)",
  D: "big man with a moustache, cap and work overalls - mechanic, tough guy, criminal (default name Bruno)",
  E: "young woman, big curly hair, yellow jacket (default name Zara)",
  F: "sharp man in a purple suit and red tie - boss, banker, investigator, rich man (default name Victor)",
};

const SCENE_HINTS = {
  office: "office", street: "city street", home: "living room", cafe: "cafe", park: "park", gate: "old iron gate",
  village: "village street", room: "bedroom / guest room", well: "old well", tunnel: "tunnel", temple: "ancient temple",
  museum: "museum hall", forest: "forest", cabin: "wooden cabin", cave: "cave", shore: "beach", lighthouse: "lighthouse room",
  deck: "boat deck", desert: "desert", radio: "radio station", train: "train carriage", snow: "snowy mountain",
  icecave: "ice cave", underwater: "underwater", meeting: "meeting room / bank office",
  bedroom: "teen bedroom", classroom: "school classroom", canteen: "school canteen", corridor: "school corridor with lockers",
  shop: "phone / gadget shop", bank: "bank hall", hospital: "hospital corridor", mall: "shopping mall", lift: "elevator", island: "desert island beach",
};

// Real, hand-written parts used as examples of the format and tone ("$1,000 Every Day")
const EXAMPLE_SERIES = require("../series/thousandEveryDay");
const pickSegs = (segs) => (segs || []).map(s => ({ scene: s.scene, night: s.night, cast: s.cast, lines: s.lines }));
const EXAMPLE_FIRST = JSON.stringify({ segments: pickSegs(EXAMPLE_SERIES.parts[0].segments) });
const EXAMPLE_NEXT = JSON.stringify({
  ifA: pickSegs(EXAMPLE_SERIES.parts[1].ifA), ifB: pickSegs(EXAMPLE_SERIES.parts[1].ifB), segments: pickSegs(EXAMPLE_SERIES.parts[1].segments),
});
// "Day 1 of..." titles get Day 1, Day 2... parts
const isDaySeries = (title) => /^\s*day\s*1\b/i.test(title || "");

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "series";

// Which AI writes: SCRIPT_AI=gemini|groq in .env. Default: Gemini when a GEMINI_API_KEY is set.
const PROVIDER = () => (process.env.SCRIPT_AI || (process.env.GEMINI_API_KEY ? "gemini" : "groq")).toLowerCase();

async function ask(system, user, maxTokens, onLog = () => {}) {
  if (PROVIDER() === "gemini") {
    const { askGeminiJSON } = require("./geminiClient");
    // Gemini models think before answering and that counts toward the limit, so leave plenty of room
    const { data, model } = await askGeminiJSON({ system, user, maxTokens: Math.max(16000, maxTokens * 3), onLog });
    onLog(`   (written by ${model})`);
    return data;
  }
  const res = await chat({
    response_format: { type: "json_object" },
    max_completion_tokens: maxTokens,
    temperature: 0.8,
    messages: [{ role: "system", content: system }, { role: "user", content: user }],
  }, { maxRetries: 6, timeout: 120000 });
  return parseLLMJson(res.choices[0].message.content);
}

const STYLE = `Style: suspense and drama, NO comedy. Grounded, believable, gripping. Family-friendly (no gore, no swearing).
Very short, punchy sentences - like "He counted it twice. It was real." Concrete details (amounts, objects, places).
Every part ends on a cliffhanger that forces a real dilemma - two options a viewer could genuinely argue about.
VIEWERS DECIDE: the option with the most comment votes is what happens next, so both options must lead somewhere interesting.`;

async function writeOutline({ mode, title, story, heroCode, parts, notes }, onLog) {
  const system = `You plan viral "What would you do?" story series for YouTube Shorts. A narrator tells the story while cartoon characters act it out.
${STYLE}
On-screen characters (the ONLY people who can appear; use 2-4 of them):
${Object.entries(CAST).map(([k, v]) => `- ${k}: ${v}`).join("\n")}
Pick names that fit the story (you may keep the default names). Match gender to the look.
Return JSON only:
{"title": "series title, max 40 chars",
 "description": "1-2 sentence teaser for the YouTube description",
 "characters": [{"code": "B", "name": "Leo", "role": "who they are in this story"}],
 "hashtags": ["#shorts", "#whatwouldyoudo", 3 more],
 "tags": [5 search phrases],
 "parts": [{"title": "2-4 words",
   "beats": "3-5 sentences: exactly what happens in this part, ending on the cliffhanger",
   "hook": "on-screen headline, max 12 words, wrap the 1-3 key words in *stars*",
   "choice": {"question": "What would you do?", "a": "option A, max 14 words, no final punctuation, e.g. Buy Arjun the phone, and risk him asking where the money came from", "b": "option B, same style"},
   "ifA": "1-2 sentences: what happens right after the hero picks option A of the PREVIOUS part's choice (null for part 1)",
   "ifB": "1-2 sentences: the same for option B (null for part 1)",
   "default": "a or b: which option to use if nobody votes (null for part 1)"}]}
Rules: exactly ${parts} parts. The beats must make sense whichever option won last time - the consequences of each option go in ifA / ifB, and the beats continue from there without depending on which one happened.
${isDaySeries(title) ? 'This is a "Day 1 of..." series: part N is Day N. Every part\'s beats start with "Day N." and every hook starts with "Day N:".' : ""}
The hero is character ${heroCode}. The last part ends on a final twist and one last big choice.`;

  const user = mode === "story"
    ? `Series title: ${title}\n\nThe creator's story is below. Keep THEIR events, characters and order - do not change what happens. You may split it into ${parts} parts, add cliffhangers, small connecting details and the A/B dilemmas. Map their people onto the on-screen characters (keep their names).\n\nSTORY:\n${story}${notes ? `\n\nExtra notes: ${notes}` : ""}`
    : `Series idea / title: ${title}${notes ? `\nExtra notes: ${notes}` : ""}\nInvent an original, gripping story for it.`;

  const outline = await ask(system, user, 6000, onLog);
  if (!Array.isArray(outline.parts) || !outline.parts.length) throw new Error("the outline came back without parts");
  outline.parts = outline.parts.slice(0, parts);
  return outline;
}

function partPrompt(outline, index, heroCode) {
  const p = outline.parts[index];
  const prev = index > 0 ? outline.parts[index - 1] : null;
  const names = outline.characters.map(c => `${c.code} = ${c.name} (${c.role})`).join("; ");
  const segFmt = `[{"scene": "...", "night": false, "cast": ["B", "E"], "lines": [ ... ]}]`;
  return {
    system: `You write one part of a narrated YouTube Shorts story series. ONLY a narrator speaks; the cartoon characters act the story out silently on screen.
${STYLE}
${index === 0
    ? `Format - JSON only: {"segments": ${segFmt}}`
    : `Format - JSON only: {"ifA": ${segFmt}, "ifB": ${segFmt}, "segments": ${segFmt}}
- ifA: 2-3 lines (25-40 words): what happens right after the hero picked option A last time. ifB: the same for option B.
- segments: the rest of the part. It is played after ifA OR ifB, so it must make sense after either one.`}
- segment = one place. 1-3 segments per part. scene must be one of: ${SCENES.map(s => `${s} (${SCENE_HINTS[s] || s})`).join(", ")}.
- cast = codes of the characters on screen in that place, left to right, 1-3 of: ${CHARACTERS.join(", ")}.
- Narrator line: {"speaker": "N", "text": "...", "focus": "B", "emotion": "worried"} - focus = who the camera shows (must be in that segment's cast).
- Quote line (1-3 per part, max 10 words): {"speaker": "B", "emotion": "crying", "text": "My phone's broken."} - the narrator reads it while that character acts it out; speaker must be in the cast.
- No other voices. Notes and messages are told by the narrator: "The note said: Tell anyone, and it stops forever."
- emotion: one of ${EMOTIONS.join(", ")}.
- Optional on any line: "fx": "shake" for a shock (max 2 per part); "sfx": one of ${SFX.join(", ")}.
- Length: ${index === 0 ? "8-10 lines, 80-110 words" : "segments 5-8 lines, 60-90 words"}. Short punchy sentences, present the facts cinematically.
- Mention concrete objects (money, phone, envelope, car, bag, watch, key, police, clock...) - they appear on screen.
- Do NOT write the A/B question; it is added automatically after your last line. End right on the cliffhanger.
${index === 0 ? "- Part 1: the first line must grab attention immediately." : "- Do NOT recap the vote (an intro line is added automatically)."}
${isDaySeries(outline.title) || /^day/i.test(p.beats || "") ? `- The first line of "segments" starts with "Day ${index + 1}."` : ""}
Example of a finished ${index === 0 ? "first part" : "later part"} (from another series):
${index === 0 ? EXAMPLE_FIRST : EXAMPLE_NEXT}`,
    user: `Series: ${outline.title}
Characters: ${names}. The hero is ${heroCode}.
Story so far: ${outline.parts.slice(0, index).map((q, i) => `Part ${i + 1}: ${q.beats}`).join(" ") || "(this is the first part)"}
${prev ? `Last part asked: ${prev.choice.question} A: ${prev.choice.a} / B: ${prev.choice.b}.
If A won: ${p.ifA || "(you decide)"}
If B won: ${p.ifB || "(you decide)"}` : ""}
Write PART ${index + 1} of ${outline.parts.length}: "${p.title}".
What happens: ${p.beats}
It ends on this dilemma: ${p.choice.question} A: ${p.choice.a} / B: ${p.choice.b}`,
  };
}

/** Fixes small format slips the model makes so they don't fail the checker */
function normalizeSegments(segments) {
  const sfx = new Set(SFX);
  return (segments || []).map(seg => {
    const cast = [...new Set((seg.cast || []).map(c => String(c).toUpperCase()).filter(c => CHARACTERS.includes(c)))].slice(0, 3);
    const lines = (seg.lines || []).filter(l => l && l.text).map(l => {
      const speaker = String(l.speaker || "N").toUpperCase();
      const out = { speaker, text: String(l.text).trim() };
      if (speaker === "V") {
        out.voiceOf = ["robot", "radio", "child", ...CHARACTERS].includes(l.voiceOf) ? l.voiceOf : "robot";
        out.fx = out.voiceOf === "robot" ? "robot" : out.voiceOf === "radio" || CHARACTERS.includes(out.voiceOf) ? "radio" : "echo";
      } else {
        out.emotion = EMOTIONS.includes(l.emotion) ? l.emotion : "neutral";
        if (l.fx === "shake") out.fx = "shake";
        if (speaker === "N") out.focus = cast.includes(l.focus) ? l.focus : cast[0];
        // A character who speaks but wasn't put on screen: add them if there's room, otherwise narrate it
        if (speaker !== "N" && !cast.includes(speaker)) {
          if (CHARACTERS.includes(speaker) && cast.length < 3) cast.push(speaker);
          else { out.speaker = "N"; out.focus = cast[0]; }
        }
      }
      if (l.sfx && sfx.has(l.sfx)) out.sfx = l.sfx;
      return out;
    });
    return { scene: String(seg.scene || "").toLowerCase(), night: !!seg.night, cast: cast.length ? cast : ["B"], lines };
  }).filter(seg => seg.lines.length);
}

async function writePart(outline, index, heroCode, onLog = () => {}) {
  const { system, user } = partPrompt(outline, index, heroCode);
  let feedback = "";
  for (let attempt = 1; attempt <= 2; attempt++) {
    const res = await ask(system, user + feedback, 5000, onLog);
    const p = outline.parts[index];
    const def = p.default === "a" || p.default === "b" ? p.default : index % 2 ? "a" : "b";
    const part = {
      title: p.title, hook: p.hook, choice: cleanChoice(p.choice),
      ...(index > 0 ? { follows: def, ifA: normalizeSegments(res.ifA), ifB: normalizeSegments(res.ifB) } : {}),
      segments: normalizeSegments(res.segments),
    };
    // Check just this part (with the previous part's choice so the length estimate is right)
    const probe = { id: "probe", title: "probe", interactive: true, branching: true, parts: index > 0 ? [{ ...outline.parts[index - 1], choice: cleanChoice(outline.parts[index - 1].choice), segments: [{ scene: "home", cast: ["B"], lines: [{ speaker: "N", text: "x", emotion: "neutral" }] }] }, part] : [part] };
    const r = validateSeries(probe);
    const mine = r.parts[r.parts.length - 1];
    const tooLong = mine.seconds > 66;
    if (!mine.errors.length && !tooLong) return part;
    const problems = [...mine.errors, ...(tooLong ? [`too long (~${mine.seconds}s) - cut to about 100 words`] : [])];
    onLog(`   part ${index + 1}: ${problems.join("; ")}${attempt === 1 ? " - asking the AI to fix it" : ""}`);
    if (attempt === 2) return part; // keep it; the page shows the problems so it can be edited by hand
    feedback = `\n\nYour previous answer had these problems, fix them: ${problems.join("; ")}`;
  }
}

function cleanChoice(c = {}) {
  const strip = (s) => String(s || "").trim().replace(/[.!?]+$/, "");
  return { question: String(c.question || "What should they do?").trim(), a: strip(c.a), b: strip(c.b) };
}

/**
 * @param {{mode: "title"|"story", title: string, story?: string, hero?: string, parts?: number, notes?: string}} input
 * @param {(msg: string) => void} onLog
 */
async function writeSeries(input, onLog = () => {}) {
  const parts = Math.max(1, Math.min(10, parseInt(input.parts, 10) || 10));
  const heroCode = CHARACTERS.includes(input.hero) ? input.hero : "B";
  if (!input.title?.trim()) throw new Error("a title is needed");
  if (input.mode === "story" && (input.story || "").trim().split(/\s+/).length < 40) throw new Error("the story is too short - write at least a few sentences");

  onLog(`📝 Planning ${parts} parts with ${PROVIDER() === "gemini" ? "Gemini" : "Groq"}...`);
  const outline = await writeOutline({ ...input, parts, heroCode }, onLog);
  if (!Array.isArray(outline.characters) || !outline.characters.length) outline.characters = [{ code: heroCode, name: "the hero", role: "hero" }];
  const hero = outline.characters.find(c => c.code === heroCode)?.name || "the hero";
  onLog(`✅ Outline: "${outline.title}" - ${outline.characters.map(c => `${c.name} (${c.code})`).join(", ")}`);

  const written = [];
  for (let i = 0; i < outline.parts.length; i++) {
    onLog(`✍️  Writing part ${i + 1}/${outline.parts.length}: ${outline.parts[i].title}`);
    written.push(await writePart(outline, i, heroCode, onLog));
  }

  const series = {
    id: slugify(outline.title || input.title),
    title: outline.title || input.title,
    interactive: true,
    branching: true,        // the most comment votes decide which way the next part goes
    choiceStyle: "wwyd",    // "A: ... B: ... What would you do? Comment A or B."
    ...(isDaySeries(input.title) || isDaySeries(outline.title) ? { unit: "Day" } : {}),
    hero,
    heroCode,
    music: "suspense",
    hashtags: (outline.hashtags || ["#shorts", "#whatwouldyoudo"]).slice(0, 6),
    tags: (outline.tags || []).slice(0, 8),
    description: outline.description || "",
    characters: outline.characters,
    generated: { mode: input.mode, from: input.title, at: new Date().toISOString() },
    parts: written,
  };
  const check = validateSeries(series);
  onLog(check.errors.length ? `⚠️ ${check.errors.length} problem(s) left to fix by hand` : "✅ All parts pass the checks");
  return { series, outline, check };
}

/** Rewrites one part of an existing draft (same outline beats) */
async function rewritePart(series, outline, index, onLog = () => {}) {
  onLog(`✍️  Rewriting part ${index + 1}...`);
  return writePart(outline, index, series.heroCode || "B", onLog);
}

module.exports = { writeSeries, rewritePart, slugify, CAST };
