// Picture of a cast built from descriptions (services/characterBuilder.js), all four expressions.
//   node scripts/castStills.js [cast.json]   -> storage/stills/cast.png
// cast.json: [{ "code": "A", "name": "Milo", "look": { "age": "child", ... } }, ...] (default: a test cast)
const path = require("path");
const fs = require("fs");
const { bundle } = require("@remotion/bundler");
const { selectComposition, renderStill } = require("@remotion/renderer");
const { buildLook } = require("../services/characterBuilder");

const ENTRY = path.join(__dirname, "../remotion/index.jsx");
const ASSETS = path.join(__dirname, "../assets");
const DEFAULT = [
  { code: "A", name: "Milo", look: { age: "child", gender: "male", hair: "messy", hairColor: "brown", top: "raincoat", topColor: "yellow", bottom: "shorts", bottomColor: "navy", skin: "fair", extras: ["freckles"] } },
  { code: "E", name: "Mother", look: { age: "adult", gender: "female", hair: "ponytail", hairColor: "black", top: "sweater", topColor: "green", bottom: "skirt", bottomColor: "brown", skin: "tan" } },
  { code: "C", name: "Elder", look: { age: "elder", gender: "male", build: "slim", hair: "bald", hairColor: "white", top: "coat", topColor: "charcoal", bottom: "pants", bottomColor: "black", skin: "light", extras: ["beard"] } },
];

async function main() {
  const cast = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], "utf8")) : DEFAULT;
  const looks = Object.fromEntries(cast.map(c => [c.code, buildLook(c.look, c.name)]));
  const codes = cast.map(c => c.code).slice(0, 3);
  const line = (text, o) => ({ speaker: "N", text, scene: "village", night: true, cast: codes, details: ["fog"], ...o });
  const lines = [line("Test.", { emotion: "neutral", start: 0, end: 2 }), line("Test.", { emotion: "scared", focus: codes[0], start: 2, end: 4 })];
  const inputProps = { scene: "village", lines, durationSeconds: 4, hook: null, endCard: null, audio: null, mouth: null, looks, backgrounds: [] };
  const serveUrl = await bundle({ entryPoint: ENTRY, publicDir: ASSETS });
  const composition = await selectComposition({ serveUrl, id: "Skit", inputProps });
  const outDir = path.join(__dirname, "../storage/stills");
  fs.mkdirSync(outDir, { recursive: true });
  for (const [f, name] of [[30, "cast_wide"], [100, "cast_close"]]) {
    await renderStill({ composition, serveUrl, inputProps, frame: f, output: path.join(outDir, `${name}.png`), scale: 0.5 });
  }
  console.log(path.join(outDir, "cast_wide.png"));
}
main().catch(e => { console.error(e); process.exit(1); });
