// Quick look at the picture without voices: renders single frames of a made-up scene to PNGs.
//   node scripts/stills.js <scene> [night] [out-dir]
// Shows: wide shot, close-up, a few emotions and an object popping up. Used to check characters,
// locations and objects after changing the drawings.
const path = require("path");
const fs = require("fs");
const { bundle } = require("@remotion/bundler");
const { selectComposition, renderStill } = require("@remotion/renderer");
const { addProps } = require("../services/propService");

const ENTRY = path.join(__dirname, "../remotion/index.jsx");
const ASSETS = path.join(__dirname, "../assets");

let serveUrl = null;
async function main() {
  // Several places at once: node scripts/stills.js home,canteen,lift
  const scenes = (process.argv[2] || "home").split(",");
  for (const scene of scenes) await renderScene(scene);
}

async function renderScene(scene) {
  const night = process.argv[3] === "night";
  const outDir = process.argv[4] || path.join(__dirname, "../storage/stills");
  fs.mkdirSync(outDir, { recursive: true });
  const script = [
    ["N", "Previously: Rahul gets $1,000 every morning.", { emotion: "worried", cast: ["A", "B"], recap: true }],
    ["N", "Arjun was already there.", { focus: "B", emotion: "angry", cast: ["A", "B"] }],
    ["N", "Then he saw the snake on the floor.", { focus: "A", emotion: "scared", cast: ["A", "B"] }],
    ["N", "A dog ran in. He started crying.", { focus: "B", emotion: "crying", cast: ["A", "B"] }],
    ["N", "Nobody said a word.", { emotion: "surprised", focus: "A", cast: ["A", "B", "C"] }],
  ];
  let t = 0.2;
  const lines = script.map(([speaker, text, o]) => {
    const l = { speaker, text, scene, night, ...o, start: t, end: t + 2 };
    t += 2.3;
    return l;
  });
  const backgrounds = fs.readdirSync(path.join(ASSETS, "backgrounds")).filter(f => f.endsWith(".jpg")).map(f => f.replace(/\.jpg$/, ""));
  const inputProps = {
    scene, lines: addProps(lines), durationSeconds: t + 0.5, hook: "Day 2: *test* hook", endCard: null, audio: null,
    mouth: null, looks: null, backgrounds: process.env.NO_IMAGES ? [] : backgrounds,
    recap: process.env.RECAP ? { start: 0, end: 0 } : null,
  };
  serveUrl = serveUrl || await bundle({ entryPoint: ENTRY, publicDir: ASSETS });
  const composition = await selectComposition({ serveUrl, id: "Skit", inputProps });
  const frames = (process.env.FRAMES || "20,75,160,215,250,300").split(",").map(Number);
  for (const f of frames) {
    const out = path.join(outDir, `${scene}${night ? "_night" : ""}_${f}.png`);
    await renderStill({ composition, serveUrl, inputProps, frame: f, output: out, scale: 0.5 });
    console.log(out);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
