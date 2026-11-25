// One wide frame of each place with given details, to check location drawings.
//   node scripts/placeStills.js "kitchen:coins,papers" "island*:storm,shelter" ...
//   (a * after the name = night)  -> storage/stills/place_<name>.png
const path = require("path");
const fs = require("fs");
const { bundle } = require("@remotion/bundler");
const { selectComposition, renderStill } = require("@remotion/renderer");

const ENTRY = path.join(__dirname, "../remotion/index.jsx");
const ASSETS = path.join(__dirname, "../assets");

async function main() {
  const outDir = path.join(__dirname, "../storage/stills");
  fs.mkdirSync(outDir, { recursive: true });
  const serveUrl = await bundle({ entryPoint: ENTRY, publicDir: ASSETS });
  for (const arg of process.argv.slice(2)) {
    const [name, det = ""] = arg.split(":");
    const night = name.endsWith("*");
    const scene = name.replace("*", "");
    const line = { speaker: "N", text: "Test.", scene, night, cast: ["A", "B"], details: det ? det.split(",") : [], start: 0, end: 3 };
    const inputProps = { scene, lines: [line], durationSeconds: 3, hook: null, endCard: null, audio: null, mouth: null, looks: null, backgrounds: [] };
    const composition = await selectComposition({ serveUrl, id: "Skit", inputProps });
    const out = path.join(outDir, `place_${scene}${night ? "_night" : ""}.png`);
    await renderStill({ composition, serveUrl, inputProps, frame: 45, output: out, scale: 0.5 });
    console.log(out);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
