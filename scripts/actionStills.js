// Frames of characters handling things and walking, to check the animation.
//   node scripts/actionStills.js [scene]   -> storage/stills/action_<n>.png  (+ action_sheet.png)
const path = require("path");
const fs = require("fs");
const { execFileSync } = require("child_process");
const { bundle } = require("@remotion/bundler");
const { selectComposition, renderStill } = require("@remotion/renderer");
const { addProps } = require("../services/propService");
const { lineMove } = require("../services/sceneDetails");

const ENTRY = path.join(__dirname, "../remotion/index.jsx");
const ASSETS = path.join(__dirname, "../assets");

async function main() {
  const scene = process.argv[2] || "street";
  const outDir = path.join(__dirname, "../storage/stills");
  fs.mkdirSync(outDir, { recursive: true });
  const script = [
    ["Rahul read the note again.", { focus: "A", emotion: "worried", cast: ["A", "B"] }],
    ["He handed Arjun the cash.", { focus: "A", emotion: "neutral", cast: ["A", "B"] }],
    ["Arjun stared at his phone.", { focus: "B", emotion: "surprised", cast: ["A", "B"] }],
    ["Rahul picked up his bag and followed him.", { focus: "A", emotion: "worried", cast: ["A", "B"] }],
    ["Arjun walked away.", { focus: "B", emotion: "angry", cast: ["A", "B"] }],
    ["Then Dadi walked in.", { focus: "C", emotion: "neutral", cast: ["A", "C"], scene: "home" }],
  ];
  let t = 0.2;
  const lines = script.map(([text, o]) => {
    const l = { speaker: "N", text, scene, night: false, ...o, ...lineMove(text), start: t, end: t + 2.6 };
    t += 2.9;
    return l;
  });
  const inputProps = { scene, lines: addProps(lines), durationSeconds: t + 0.5, hook: null, endCard: null, audio: null, mouth: null, looks: null, backgrounds: [] };
  const serveUrl = await bundle({ entryPoint: ENTRY, publicDir: ASSETS });
  const composition = await selectComposition({ serveUrl, id: "Skit", inputProps });
  // middle of each line, plus mid-walk moments
  const frames = (process.env.FRAMES || "50,135,225,300,330,430,470,525").split(",").map(Number);
  const outs = [];
  for (const f of frames) {
    const out = path.join(outDir, `action_${f}.png`);
    await renderStill({ composition, serveUrl, inputProps, frame: f, output: out, scale: 0.5 });
    outs.push(out);
  }
  const ffmpeg = require("../services/videoBuilderService").FFMPEG || "ffmpeg";
  execFileSync(ffmpeg, ["-y", "-loglevel", "error", ...outs.flatMap(o => ["-i", o]), "-filter_complex", `hstack=${outs.length},scale=${270 * outs.length}:-1`, path.join(outDir, "action_sheet.png")]);
  console.log(path.join(outDir, "action_sheet.png"));
}
main().catch(e => { console.error(e); process.exit(1); });
