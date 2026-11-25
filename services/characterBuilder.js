// Builds a story's own characters from a short description (written by the AI from the story), instead
// of only the six fixed designs. The result is a full "look" that remotion/Character.jsx draws.
//
//   { age: "child", gender: "male", build: "slim", skin: "tan", hair: "messy", hairColor: "brown",
//     top: "raincoat", topColor: "red", bottom: "shorts", bottomColor: "navy", extras: ["freckles"] }
//
// Every field has a sensible default, and unknown values fall back, so an AI typo never breaks a video.

const AGES = ["child", "teen", "adult", "elder"];
const BUILDS = ["slim", "average", "broad"];
const HAIR = ["spiky", "messy", "short", "buzz", "sidepart", "slick", "curly", "long", "ponytail", "bob", "bun", "bald", "hijab"];
const TOPS = ["tee", "hoodie", "shirt", "sweater", "jacket", "coat", "raincoat", "suit", "uniform", "dress", "shawl", "overalls"];
const BOTTOMS = ["pants", "shorts", "skirt"];
const EXTRAS = ["glasses", "beard", "moustache", "cap", "earrings", "freckles", "wrinkles"];

const SKIN = {
  pale: "#F8DCC8", fair: "#F4CFAE", light: "#EDC09A", tan: "#D9A27A", olive: "#C99070",
  brown: "#B97F55", dark: "#8D5A3B", deep: "#6B4230",
};
const COLORS = {
  black: "#1E1E22", charcoal: "#3A3D45", grey: "#8A9099", gray: "#8A9099", silver: "#C3C6CF", white: "#F2F2F2",
  brown: "#5A341A", chestnut: "#7A4A2A", auburn: "#8E3B1F", ginger: "#C8642A", blonde: "#E7C66A", red: "#D63C3C",
  maroon: "#7A2836", pink: "#F28AB2", purple: "#6D4C9F", violet: "#8C6BD1", navy: "#2B3A67", blue: "#3E6FB0",
  sky: "#7FB8E6", teal: "#2AA597", green: "#3F8F5F", olive: "#7A7A3A", mint: "#8FD3B6", yellow: "#F2B83E",
  mustard: "#D9A72E", orange: "#E9772A", beige: "#D8C3A0", cream: "#F1E6CC", tan: "#C79A6A", khaki: "#B5A37A",
};
const HAIR_COLORS = { ...COLORS, grey: "#B9BCC4", gray: "#B9BCC4", white: "#ECECEC", red: "#B3401F", blonde: "#E2BC5C", brown: "#5A341A", black: "#1F1A17" };

const pick = (v, list, dflt) => (list.includes(String(v || "").toLowerCase()) ? String(v).toLowerCase() : dflt);
const colorOf = (v, table, dflt) => {
  const s = String(v || "").trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(s)) return s;
  const key = Object.keys(table).find(k => s === k) || Object.keys(table).find(k => s.includes(k));
  return key ? table[key] : dflt;
};
function darker(hex, f = 0.22) {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(x => Math.round(x * (1 - f)));
  return "#" + c.map(x => x.toString(16).padStart(2, "0")).join("");
}

/** Turns a description into a complete look (every flag set, so nothing leaks in from a preset design) */
function buildLook(spec = {}, name = "") {
  const age = pick(spec.age, AGES, "adult");
  const female = /^f|woman|girl|female/i.test(spec.gender || "");
  let hair = pick(spec.hair, HAIR, female ? "long" : age === "child" ? "messy" : "short");
  let top = pick(spec.top, TOPS, age === "child" ? "tee" : "hoodie");
  let bottom = pick(spec.bottom, BOTTOMS, top === "dress" ? "skirt" : "pants");
  const extras = (Array.isArray(spec.extras) ? spec.extras : []).map(e => String(e).toLowerCase()).filter(e => EXTRAS.includes(e));
  const hairColor = colorOf(spec.hairColor, HAIR_COLORS, age === "elder" ? HAIR_COLORS.grey : HAIR_COLORS.brown);
  const shirt = colorOf(spec.topColor, COLORS, COLORS.blue);
  let pants = colorOf(spec.bottomColor, COLORS, COLORS.navy);
  if (top === "dress") { bottom = "skirt"; pants = shirt; }
  return {
    name,
    custom: true,
    size: { child: 0.74, teen: 0.9, adult: 1, elder: 0.96 }[age],
    headScale: { child: 1.2, teen: 1.07, adult: 1, elder: 1 }[age],
    stoop: age === "elder" ? 4 : 0,
    build: pick(spec.build, BUILDS, "average"),
    skin: colorOf(spec.skin, SKIN, SKIN.light),
    hair: hairColor,
    hairStyle: hair,
    hairPath: null,
    shirt,
    shirtDark: darker(shirt),
    sleeve: shirt,
    pants,
    shoes: colorOf(spec.shoesColor, COLORS, age === "child" ? COLORS.red : COLORS.black),
    strings: "#F2F2F2",
    shawl: darker(shirt, 0.35),
    overalls: pants,
    accent: shirt,
    top: top === "dress" ? "tee" : top,
    bottom,
    tie: top === "uniform",
    glasses: extras.includes("glasses"),
    beard: extras.includes("beard"),
    mustache: extras.includes("moustache") || extras.includes("beard"),
    cap: extras.includes("cap") ? darker(shirt, 0.3) : null,
    earrings: extras.includes("earrings"),
    freckles: extras.includes("freckles"),
    wrinkles: extras.includes("wrinkles") || age === "elder",
    bun: hair === "bun",
  };
}

/** What the AI is told it can choose from */
const SPEC_HELP = `look: {"age": ${AGES.join("|")}, "gender": "male|female", "build": ${BUILDS.join("|")},
 "skin": ${Object.keys(SKIN).join("|")}, "hair": ${HAIR.join("|")}, "hairColor": "black|brown|blonde|red|auburn|grey|white|...",
 "top": ${TOPS.join("|")}, "topColor": "a colour name", "bottom": ${BOTTOMS.join("|")}, "bottomColor": "a colour name",
 "extras": [any of ${EXTRAS.join(", ")}]}`;

module.exports = { buildLook, SPEC_HELP, AGES, HAIR, TOPS, BOTTOMS, EXTRAS };
