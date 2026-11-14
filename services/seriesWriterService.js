// Writes a narrated "What would you do?" series with AI (Gemini, or Groq), in the same format as the hand-written
// series in series/. Two ways in:
//   mode "title": just a title/idea - the AI invents the story
//   mode "story": the creator's own story - the AI only splits it into parts, adds cliffhangers and A/B choices
// Works in two steps so each request stays small (Groq's free tier limits tokens per minute):
//   1. outline: series title, characters, and per part: what happens, hook, A/B choice
//   2. each part written as scenes and narrator/character lines, then checked; a failing part is retried once
const { chat } = require("./groqClient");
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
};

// A real, hand-written part used as the example of the format and tone
const EXAMPLE = (() => {
  const bag = require("../series/theBag");
  return JSON.stringify({ segments: bag.parts[1].segments.map(s => ({ scene: s.scene, night: s.night, cast: s.cast, lines: s.lines })) });
})();

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
Every part ends on a cliffhanger that forces a real dilemma - two options a viewer could genuinely argue about.`;

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
   "choice": {"question": "short question, e.g. What should Leo do?", "a": "option, max 7 words, no punctuation", "b": "option, max 7 words, no punctuation"},
   "follows": "a or b: which option of the PREVIOUS part's choice this part continues with (null for part 1)"}]}
Rules: exactly ${parts} parts. Mix "a" and "b" across follows so both kinds of choices happen. Each part's beats must start from the option it follows.
The hero is character ${heroCode}. The last part ends on a final twist; its choice can be a theory question (e.g. "Who sent the letter?").`;

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
  const names = outline.characters.map(c => `${c.code} = ${c.name} (${c.role})`).join("; ");
  return {
    system: `You write one part of a narrated YouTube Shorts story series. A narrator (speaker "N") tells the story; cartoon characters act it out on screen and occasionally say one short line.
${STYLE}
Format - JSON only: {"segments": [{"scene": "...", "night": false, "cast": ["B", "E"], "lines": [ ... ]}]}
- segment = one place. 1-3 segments per part. scene must be one of: ${SCENES.map(s => `${s} (${SCENE_HINTS[s] || s})`).join(", ")}.
- cast = codes of the characters on screen in that place, left to right, 1-3 of: ${CHARACTERS.join(", ")}.
- Narrator line: {"speaker": "N", "text": "...", "focus": "B", "emotion": "worried"} - focus = who the camera shows (must be in that segment's cast).
- Character line: {"speaker": "E", "emotion": "surprised", "text": "..."} - speaker must be in the cast. Max 10 words. Use 1-3 per part, for punch.
- Offscreen voice: {"speaker": "V", "voiceOf": "robot", "text": "..."} - voiceOf "robot" for texts/app messages, "radio" for news broadcasts, or a character code for a phone call.
- emotion: one of ${EMOTIONS.join(", ")}.
- Optional on any line: "fx": "shake" for a shock (max 2 per part); "sfx": one of ${SFX.join(", ")}.
- Length: 7-11 lines, 90-130 words in total. Short punchy sentences, present the facts cinematically.
- Mention concrete objects (money, phone, envelope, car, bag, watch, key, police, clock...) - they appear on screen.
- Do NOT write the A/B question; it is added automatically after your last line. End right on the cliffhanger.
${index === 0 ? "- Part 1: the first line must grab attention immediately." : "- Do NOT recap or say which option was chosen (an intro line is added automatically). Start right after the chosen option happened."}
Example of a finished part (from another series):
${EXAMPLE}`,
    user: `Series: ${outline.title}
Characters: ${names}. The hero is ${heroCode}.
Story so far: ${outline.parts.slice(0, index).map((q, i) => `Part ${i + 1}: ${q.beats}`).join(" ") || "(this is the first part)"}
${index > 0 ? `Last part asked: ${outline.parts[index - 1].choice.question} A: ${outline.parts[index - 1].choice.a} / B: ${outline.parts[index - 1].choice.b}. This part continues with option ${String(p.follows).toUpperCase()}.` : ""}
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
    const part = {
      title: p.title, hook: p.hook, choice: cleanChoice(p.choice),
      ...(index > 0 ? { follows: p.follows === "a" || p.follows === "b" ? p.follows : "a" } : {}),
      segments: normalizeSegments(res.segments),
    };
    // Check just this part (with the previous part's choice so the length estimate is right)
    const probe = { id: "probe", title: "probe", interactive: true, parts: index > 0 ? [{ ...outline.parts[index - 1], choice: cleanChoice(outline.parts[index - 1].choice), segments: [{ scene: "home", cast: ["B"], lines: [{ speaker: "N", text: "x", emotion: "neutral" }] }] }, part] : [part] };
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

  const usesMax = written.some(p => p.segments.some(s => s.cast.includes("A")));
  const series = {
    id: slugify(outline.title || input.title),
    title: outline.title || input.title,
    interactive: true,
    hero,
    heroCode,
    music: "suspense",
    // Max's usual voice is also the narrator's; give him his own
    ...(usesMax ? { voices: { A: { voice: "en-AU-WilliamMultilingualNeural", rate: "+10%", pitch: "+0Hz" } } } : {}),
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
