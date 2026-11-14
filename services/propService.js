// Picks a prop (a cartoon object) for each line from what is said, so the picture shows what the narrator
// talks about: "an envelope" -> an envelope pops up as the word is spoken.
// Script lines can choose one with `prop: "cash"`, or turn it off with `prop: false`.
// Names must match the drawings in remotion/Props.jsx.

// First match wins, so the more specific objects come first
const RULES = [
  ["cash", /\bpiggy bank\b/i],
  ["bitcoin", /\b(bitcoins?|btc|crypto)\b/i],
  ["police", /\b(police|cops?|detectives?|arrest(ed)?|roadblock|handcuffs)\b/i],
  ["envelope", /\b(envelopes?|letters?|note|notes)\b/i],
  ["camera", /\b(cameras?|cctv|footage)\b/i],
  ["watch", /\b(?:a|the|his|her|new|shiny|fake|gold) (?:shiny |new |gold )*watch\b/i],
  ["phone", /\b(phones?|missed calls?|texts?|texted|ringing|voicemail)\b/i],
  ["tv", /\b(news|tv|television|broadcast)\b/i],
  ["newspaper", /\bnewspapers?\b/i],
  ["bag", /\b(bags?|duffel|suitcase|briefcase)\b/i],
  ["car", /\b(car|cars|truck|van|drove|driving|taxi|speeding away)\b/i],
  ["key", /\b(keys?|locked|lock)\b/i],
  ["clock", /\b(midnight|o'clock|deadline|minutes|hours|clock)\b|\b\d{1,2}\s?(AM|PM)\b|\b(AM|PM)\b/],
  ["bank", /\b(bank|banks|account|transfer|transferred)\b/i],
  ["cash", /\$\s?\d|\b(money|cash|dollars?|millions?|billions?|bills|bundles|reward|rich)\b/i],
];

// Offscreen voices: the app / text voice comes from a phone, the broadcast from a radio
const VOICE_PROPS = { robot: "phone", radio: "radio" };

/** Time (seconds) when the character at `index` in the text is spoken, assuming even speed per letter */
function timeAtChar(line, index) {
  const total = line.text.length || 1;
  return line.start + (line.end - line.start) * Math.min(1, index / total);
}

function pickProp(line) {
  if (line.speaker === "CARD" || line.choice || line.prop === false) return null;
  if (typeof line.prop === "string") return { prop: line.prop, at: 0 };
  // Messages: a text/app message shows a phone, a broadcast a radio, a phone call a phone
  const via = line.speaker === "V" ? line.voiceOf : line.via;
  if (via) return { prop: VOICE_PROPS[via] || "phone", at: 0 };
  for (const [prop, re] of RULES) {
    const m = line.text.match(re);
    if (m) return { prop, at: m.index };
  }
  return null;
}

/**
 * Adds prop / propAt (seconds) to timed lines. When back-to-back lines are about the same object it
 * simply stays on screen (propHold: no second pop or pop sound).
 */
function addProps(lines) {
  let last = null; // { prop, at } of the previous line
  return lines.map(l => {
    const p = pickProp(l);
    if (!p) { last = null; return { ...l, prop: null }; }
    if (last && last.prop === p.prop) return { ...l, prop: p.prop, propAt: last.at, propHold: true };
    // Pop in a hair before the word so it lands on it
    const at = Math.max(l.start, timeAtChar(l, p.at) - 0.1);
    last = { prop: p.prop, at };
    return { ...l, prop: p.prop, propAt: at };
  });
}

module.exports = { addProps, pickProp };
