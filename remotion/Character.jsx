import React from "react";

// "Hoodie Cel" style: round heads, simple dark eyes with strong brows, thick ink outlines,
// two-tone (cel) shading and real hands with fingers.
// Drawn facing right; the Skit flips characters that should face left.
const INK = "#141414";
const SHADE = "rgba(0,0,0,0.2)"; // cel shadow laid over the back half of clothes and faces

//   top: hoodie | shirt | shawl | overalls | jacket | suit     bottom: pants | skirt
export const LOOKS = {
  A: { // Max - spiky dark hair, orange hoodie
    name: "Max", skin: "#F3E4D6", hair: "#22180F", shirt: "#E9772A", shirtDark: "#B85A1A", sleeve: "#E9772A",
    pants: "#2B3245", shoes: "#1a1a1a", accent: "#FFC93C", top: "hoodie", bottom: "pants", strings: "#F7D8B5",
    hairPath: "M58 196 Q44 92 128 60 L114 20 L170 46 L196 4 L226 46 L280 22 L276 66 Q348 96 344 196 Q318 128 232 116 Q196 140 150 120 Q86 132 58 196 Z",
  },
  B: { // Leo - side-swept hair, round glasses, teal shirt
    name: "Leo", skin: "#EBD2BB", hair: "#5A341A", shirt: "#2AA597", shirtDark: "#1D7F74", sleeve: "#2AA597",
    pants: "#5B4636", shoes: "#2c2018", accent: "#4FD8FF", top: "shirt", bottom: "pants", glasses: true,
    hairPath: "M52 200 Q38 64 196 50 Q356 52 350 196 Q338 118 262 98 Q200 146 120 126 Q78 138 52 200 Z",
  },
  C: { // Mira - grey bun, shawl, long skirt
    name: "Mira", skin: "#EED8C4", hair: "#C3C6CF", shirt: "#6D4C7D", shirtDark: "#553A62", sleeve: "#6D4C7D",
    shawl: "#A8503A", pants: "#3F3550", shoes: "#2a2230", accent: "#D7A6FF", top: "shawl", bottom: "skirt",
    bun: true, wrinkles: true,
    hairPath: "M54 204 Q46 70 200 56 Q354 70 346 204 Q330 120 200 112 Q70 120 54 204 Z",
  },
  D: { // Bruno - charcoal cap, moustache, brown work overalls over a grey shirt
    name: "Bruno", skin: "#D9A27A", hair: "#1f1f1f", shirt: "#5F6B73", shirtDark: "#6E5236", sleeve: "#5F6B73",
    overalls: "#7A5C3A", pants: "#6E5236", shoes: "#1a1a1a", accent: "#FF8A5B", top: "overalls", bottom: "pants",
    cap: "#2F3B45", mustache: true,
    hairPath: "M60 196 Q58 82 200 66 Q342 82 340 196 Q300 132 200 126 Q100 132 60 196 Z",
  },
  E: { // Zara - big curly hair, yellow jacket over a white top
    name: "Zara", skin: "#B9784F", hair: "#1f140e", shirt: "#F2B83E", shirtDark: "#C99027", sleeve: "#F2B83E",
    pants: "#2E3852", shoes: "#1f1f1f", accent: "#FF9EDB", top: "jacket", bottom: "pants", earrings: true,
    hairPath: "M36 250 Q4 198 36 148 Q16 86 78 66 Q98 14 160 26 Q200 -6 242 26 Q304 14 324 66 Q386 86 364 148 Q396 198 364 250 Q340 160 290 128 Q200 98 110 128 Q60 160 36 250 Z",
  },
  F: { // Victor - slick side-parted hair, purple suit, red tie
    name: "Victor", skin: "#F0D8C6", hair: "#16161d", shirt: "#4E3780", shirtDark: "#3B2862", sleeve: "#4E3780",
    pants: "#3B2862", shoes: "#0f0f0f", accent: "#C9A7FF", top: "suit", bottom: "pants",
    hairPath: "M58 198 Q50 66 190 52 Q332 48 346 188 Q330 116 260 100 Q170 92 118 128 Q78 148 58 198 Z",
  },
};

const CLOAK = "#1E1E28";

// Body poses as arm angles: [upper arm, forearm] in degrees from straight down, positive = toward the
// direction the character faces. Back arm = far side, front arm = near side.
//   backOnTop: draw the back arm in front of the body (crossed arms)   headTop: in front of the head
//   hands: which hand shape each arm makes in this pose
export const POSES = {
  neutral: { back: [-4, 0], front: [4, 2], hands: ["relaxed", "relaxed"] },
  point: { back: [-4, 0], front: [80, 90], hands: ["relaxed", "point"] },
  hips: { back: [-42, 48], front: [42, -48], hands: ["fist", "fist"] },
  crossed: { back: [12, 95], front: [-12, -95], backOnTop: true, noGesture: true, hands: ["fist", "fist"] },
  shrug: { back: [-60, -125], front: [60, 125], hands: ["open", "open"] },
  shock: { back: [-120, -170], front: [120, 170], noGesture: true, hands: ["open", "open"] },
  worried: { back: [-155, 170], front: [4, 2], headTop: true, hands: ["open", "relaxed"] },
};
// Talking gesture the front arm drifts toward (forward and slightly up) - bent elbow, open hand
const GESTURE = [32, 92];
const UPPER = 120;
const FORE = 96; // the hand adds its own length past the wrist

function armPoints(sx, sy, [a1, a2]) {
  const r = Math.PI / 180;
  const ex = sx + UPPER * Math.sin(a1 * r);
  const ey = sy + UPPER * Math.cos(a1 * r);
  return { ex, ey, hx: ex + FORE * Math.sin(a2 * r), hy: ey + FORE * Math.cos(a2 * r) };
}

const lerp = (a, b, k) => a + (b - a) * k;
const lerpArm = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
const PHASE = { A: 0, B: 2.1, C: 4.2, D: 1.3, E: 3.3, F: 5.1 };
const BLINK = { A: [97, 20], B: [118, 61], C: [131, 7], D: [109, 44], E: [103, 33], F: [127, 90] };

// ---------- Hands ----------
// Local space: wrist at 0,0, fingers pointing up (-y). Each shape is drawn twice: once fat in ink
// (the outline), once in skin on top, so fingers join the palm without inner lines.
const FINGERS = {
  open: [[-12, -26, 21, -12], [-4, -28, 26, -4], [4.5, -28, 25, 4], [12.5, -25, 19, 13]],
  relaxed: [[-11, -26, 19, -2], [-3.7, -28, 22, 0], [3.7, -28, 21, 1], [11, -26, 17, 3]],
};
function handShapes(type) {
  const s = [];
  const cap = (x, y, len, ang, w = 8.5) => s.push({ k: "cap", x, y, len, ang, w });
  if (type === "open" || type === "relaxed") {
    s.push({ k: "palm", x: -16, y: -30, w: 32, h: 31, r: 11 });
    FINGERS[type].forEach(([x, y, len, ang]) => cap(x, y, len, ang));
    cap(-15, -10, type === "open" ? 17 : 15, type === "open" ? -58 : -30, 9.5); // thumb
  } else if (type === "point") {
    s.push({ k: "palm", x: -16, y: -28, w: 32, h: 29, r: 11 });
    cap(-9, -26, 30, 0);                                       // index finger
    [-1, 7, 14].forEach(x => s.push({ k: "dot", x, y: -26, r: 5 })); // curled fingers
    cap(-15, -10, 14, -45, 9.5);
  } else { // fist
    s.push({ k: "palm", x: -17, y: -30, w: 34, h: 31, r: 12 });
    [-12, -4, 4, 12].forEach(x => s.push({ k: "dot", x, y: -29, r: 5.4 }));
  }
  return s;
}
function shapeEl(p, grow, fill, i) {
  if (p.k === "palm") return <rect key={i} x={p.x - grow} y={p.y - grow} width={p.w + grow * 2} height={p.h + grow * 2} rx={p.r + grow} fill={fill} />;
  if (p.k === "dot") return <circle key={i} cx={p.x} cy={p.y} r={p.r + grow} fill={fill} />;
  return (
    <rect key={i} x={-p.w / 2 - grow} y={-p.len - grow} width={p.w + grow * 2} height={p.len + p.w / 2 + grow * 2} rx={p.w / 2 + grow}
      fill={fill} transform={`translate(${p.x} ${p.y}) rotate(${p.ang})`} />
  );
}
function Hand({ x, y, angle, type, skin }) {
  const shapes = handShapes(type);
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      {shapes.map((p, i) => shapeEl(p, 4.5, INK, i))}
      {shapes.map((p, i) => shapeEl(p, 0, skin, `f${i}`))}
      {/* finger creases, knuckle line, thumb fold */}
      {(type === "open" || type === "relaxed") && [-8, 0, 8].map(cx => (
        <line key={cx} x1={cx} y1="-22" x2={cx} y2="-31" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      ))}
      {type === "fist" && (
        <g stroke={INK} strokeWidth="2.6" strokeLinecap="round" fill="none">
          {[-8, 0, 8].map(cx => <line key={cx} x1={cx} y1="-33" x2={cx} y2="-22" />)}
          <path d="M-16 -12 Q-4 -18 9 -14" />
        </g>
      )}
      {type === "point" && <path d="M-14 -12 Q-2 -17 12 -14" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />}
      {/* cel shadow on the far side of the hand */}
      <rect x="4" y="-29" width="12" height="28" rx="6" fill="#000" opacity="0.13" />
    </g>
  );
}

// ---------- Face ----------
// Head space: centre 200,210, radius 150 (scaled down onto the neck). Features sit a little toward
// the facing side so the head reads as turned.
const EYE_L = 170, EYE_R = 252, EYE_Y = 220;
// Brow shape per emotion: [inner end, outer end] offsets (negative = higher)
const BROW = {
  neutral: [0, 0], happy: [-6, -4], worried: [-18, 6], surprised: [-22, -18], smug: [2, 2],
  angry: [16, -12], crying: [-20, 8], scared: [-26, -12], relieved: [-4, -4],
};

function Eyes({ emotion, blinking, frame, phase }) {
  const ink = { fill: INK };
  const arc = (d) => <path d={d} fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" />;
  if (blinking && emotion !== "relieved" && emotion !== "happy") {
    return <g>{[EYE_L, EYE_R].map(x => <line key={x} x1={x - 13} y1={EYE_Y + 6} x2={x + 13} y2={EYE_Y + 6} stroke={INK} strokeWidth="9" strokeLinecap="round" />)}</g>;
  }
  switch (emotion) {
    case "happy": return <g>{[EYE_L, EYE_R].map(x => <g key={x}>{arc(`M${x - 17} ${EYE_Y + 10} Q${x} ${EYE_Y - 16} ${x + 17} ${EYE_Y + 10}`)}</g>)}</g>;
    case "relieved": return <g>{[EYE_L, EYE_R].map(x => <g key={x}>{arc(`M${x - 17} ${EYE_Y} Q${x} ${EYE_Y + 18} ${x + 17} ${EYE_Y}`)}</g>)}</g>;
    case "crying": return <g>{[EYE_L, EYE_R].map(x => <g key={x}>{arc(`M${x - 17} ${EYE_Y + 8} Q${x} ${EYE_Y - 10} ${x + 17} ${EYE_Y + 8}`)}</g>)}</g>;
    case "angry": return (
      <g>
        <rect x={EYE_L - 9} y={EYE_Y - 12} width="18" height="32" rx="9" {...ink} transform={`rotate(12 ${EYE_L} ${EYE_Y})`} />
        <rect x={EYE_R - 9} y={EYE_Y - 12} width="18" height="32" rx="9" {...ink} transform={`rotate(-12 ${EYE_R} ${EYE_Y})`} />
      </g>
    );
    case "surprised": return <g>{[EYE_L, EYE_R].map(x => <circle key={x} cx={x} cy={EYE_Y} r="13" {...ink} />)}</g>;
    case "scared": {
      // Wide white eyes with tiny darting pupils
      const dart = Math.sin(frame * 0.9 + phase) * 4;
      return (
        <g>{[EYE_L, EYE_R].map(x => (
          <g key={x}>
            <ellipse cx={x} cy={EYE_Y} rx="21" ry="25" fill="#fff" stroke={INK} strokeWidth="6" />
            <circle cx={x + 4 + dart} cy={EYE_Y + 2} r="7" {...ink} />
          </g>
        ))}</g>
      );
    }
    case "smug": return (
      // Half-closed: flat top lids
      <g>{[EYE_L, EYE_R].map(x => (
        <g key={x}>
          <rect x={x - 10} y={EYE_Y - 2} width="20" height="20" rx="8" {...ink} />
          <line x1={x - 16} y1={EYE_Y - 2} x2={x + 16} y2={EYE_Y - 4} stroke={INK} strokeWidth="7" strokeLinecap="round" />
        </g>
      ))}</g>
    );
    case "worried": return <g>{[EYE_L, EYE_R].map(x => <rect key={x} x={x - 8} y={EYE_Y - 14} width="16" height="32" rx="8" {...ink} />)}</g>;
    default: return (
      <g>{[EYE_L, EYE_R].map(x => (
        <g key={x}>
          <rect x={x - 9} y={EYE_Y - 18} width="18" height="38" rx="9" {...ink} />
          <circle cx={x + 3} cy={EYE_Y - 8} r="3.6" fill="#fff" />
        </g>
      ))}</g>
    );
  }
}

function Brows({ emotion, lift }) {
  const [inner, outer] = BROW[emotion] || BROW.neutral;
  const y = EYE_Y - 46 + lift;
  const common = { stroke: INK, strokeWidth: emotion === "angry" ? 13 : 10, strokeLinecap: "round" };
  if (emotion === "smug") {
    return (
      <g>
        <line x1={EYE_L - 24} y1={y + 6} x2={EYE_L + 20} y2={y + 8} {...common} />
        <path d={`M${EYE_R - 20} ${y - 2} Q${EYE_R} ${y - 18} ${EYE_R + 24} ${y - 8}`} fill="none" {...common} />
      </g>
    );
  }
  return (
    <g>
      <line x1={EYE_L - 24} y1={y + outer} x2={EYE_L + 20} y2={y + inner} {...common} />
      <line x1={EYE_R - 20} y1={y + inner} x2={EYE_R + 24} y2={y + outer} {...common} />
    </g>
  );
}

const MX = 214, MY = 292;
function ClosedMouth({ emotion }) {
  const common = { fill: "none", stroke: INK, strokeWidth: 8, strokeLinecap: "round" };
  switch (emotion) {
    case "happy": return <path d={`M${MX - 26} ${MY - 6} Q${MX} ${MY + 22} ${MX + 26} ${MY - 6}`} {...common} />;
    case "relieved": return <path d={`M${MX - 22} ${MY - 2} Q${MX} ${MY + 14} ${MX + 22} ${MY - 2}`} {...common} />;
    case "worried": return <path d={`M${MX - 24} ${MY + 4} Q${MX - 12} ${MY - 4} ${MX} ${MY + 4} Q${MX + 12} ${MY + 12} ${MX + 24} ${MY + 4}`} {...common} />;
    case "surprised": return <ellipse cx={MX} cy={MY + 4} rx="11" ry="14" fill="#3a1414" stroke={INK} strokeWidth="6" />;
    case "smug": return <path d={`M${MX - 22} ${MY + 4} Q${MX + 6} ${MY + 10} ${MX + 28} ${MY - 12}`} {...common} />;
    case "angry": return <path d={`M${MX - 24} ${MY + 10} Q${MX} ${MY - 10} ${MX + 24} ${MY + 10}`} {...common} strokeWidth="9" />;
    case "crying": return <path d={`M${MX - 28} ${MY + 14} Q${MX - 14} ${MY - 6} ${MX} ${MY + 2} Q${MX + 14} ${MY - 6} ${MX + 28} ${MY + 14}`} {...common} />;
    case "scared": return (
      <g>
        <rect x={MX - 28} y={MY - 12} width="56" height="26" rx="9" fill="#fff" stroke={INK} strokeWidth="6" />
        <path d={`M${MX - 28} ${MY + 1} L${MX + 28} ${MY + 1} M${MX - 9} ${MY - 12} L${MX - 9} ${MY + 14} M${MX + 9} ${MY - 12} L${MX + 9} ${MY + 14}`} stroke={INK} strokeWidth="3" />
      </g>
    );
    default: return <path d={`M${MX - 20} ${MY + 2} L${MX + 20} ${MY + 2}`} {...common} />;
  }
}

function OpenMouth({ emotion, open }) {
  if (emotion === "happy" || emotion === "smug" || emotion === "relieved") {
    const depth = 14 + open * 28;
    return (
      <g>
        <path d={`M${MX - 26} ${MY - 6} Q${MX} ${MY - 2} ${MX + 26} ${MY - 6} Q${MX + 20} ${MY - 6 + depth} ${MX} ${MY - 4 + depth} Q${MX - 20} ${MY - 6 + depth} ${MX - 26} ${MY - 6} Z`}
          fill="#3a1414" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
        <ellipse cx={MX} cy={MY - 8 + depth * 0.85} rx="13" ry={3 + open * 4} fill="#d9575e" />
      </g>
    );
  }
  return (
    <g>
      <ellipse cx={MX} cy={MY + 4} rx={18 - open * 3} ry={5 + open * 18} fill="#3a1414" stroke={INK} strokeWidth="6" />
      <ellipse cx={MX} cy={MY + 8 + open * 10} rx={9 - open * 2} ry={2 + open * 4} fill="#d9575e" />
    </g>
  );
}

// Slim body layout (SVG units, 400 x 900, feet at ~850). The face artwork is drawn at its original
// size (head centre 200,210, radius 150) and scaled down onto the neck.
const HEAD_SCALE = 0.66;
const HEAD_Y = 150;
const SIT_DROP = 150; // how much lower the upper body sits when seated

function Limb({ points, color, width }) {
  const d = `M${points.map(p => p.join(" ")).join(" L")}`;
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={INK} strokeWidth={width + 10} />
      <path d={d} stroke={color} strokeWidth={width} />
    </g>
  );
}

/**
 * @param {{who: string, frame: number, talk: number, emotion: string, hooded?: boolean, gesture?: number,
 *          pose?: string, prevPose?: string, poseK?: number, voice?: number|null, listening?: boolean, seated?: boolean, desk?: false|"wide"|"narrow"}} props
 *   talk: 0..1, how much the character is currently speaking (eased in/out at line edges)
 *   voice: loudness of the real audio this frame (0..1) - drives the mouth, eyebrows and gesture beats
 *   listening: someone else is talking - occasional small nods
 */
export function Character({ who, frame, talk, emotion, hooded = false, gesture = talk, pose = null, prevPose = null,
  poseK = 1, voice = null, listening = false, seated = false, desk = false }) {
  const look = LOOKS[who];
  const phase = PHASE[who] || 0;
  const sleeve = hooded ? CLOAK : look.sleeve;
  const level = talk > 0.05 ? (voice ?? 0.5 + 0.3 * Math.sin(frame * 0.9 + phase)) : 0;

  // Calm, natural idle: a slow breath and a gentle weight shift - no bobbing
  const breath = Math.sin(frame / 38 + phase) * 2;
  // Fear: a small fast tremble on top of the weight shift
  const tremble = emotion === "scared" ? Math.sin(frame * 2.7 + phase) * 2.5 : 0;
  const shift = (seated ? 0 : Math.sin(frame / 90 + phase) * 5) + tremble;
  const drop = seated ? SIT_DROP : 0;

  // Head: still most of the time; small emphasis on loud words, small nods while listening
  const emphasis = talk * level * Math.sin(frame * 0.18 + phase) * 3;
  const nodWave = Math.max(0, Math.sin(frame / 26 + phase * 3));
  const nod = listening ? Math.pow(nodWave, 12) * 7 : 0;
  const headTilt = emphasis + ({ worried: -3, smug: 3, crying: -7, scared: -2, relieved: 5 }[emotion] || 0);

  // Mouth follows the real voice; otherwise a speech-like rhythm
  const open = talk <= 0.05 ? 0 : talk * Math.min(1, level * 1.25);

  // Blink for 4 frames every ~3-4 seconds; eyebrows lift on stressed words
  const [blinkPeriod, blinkOffset] = BLINK[who] || BLINK.A;
  const blinking = (frame + blinkOffset) % blinkPeriod < 4;
  const browLift = -level * talk * 10;

  // Pose: blend from the previous pose, then the front arm beats with the voice while talking
  const poseName = pose || (emotion === "worried" ? "worried" : "neutral");
  const P = POSES[poseName] || POSES.neutral;
  const Q = POSES[prevPose] || P;
  const backAngles = lerpArm(Q.back, P.back, poseK);
  let frontAngles = lerpArm(Q.front, P.front, poseK);
  let frontHand = poseK < 0.5 ? (Q.hands || P.hands)[1] : P.hands[1];
  const backHand = poseK < 0.5 ? (Q.hands || P.hands)[0] : P.hands[0];
  if (!P.noGesture) {
    const target = [GESTURE[0] + level * 22 + Math.sin(frame * 0.12 + phase) * 6, GESTURE[1] + level * 15];
    const k = poseName === "point" ? gesture * 0.3 : gesture;
    frontAngles = lerpArm(frontAngles, target, k);
    if (k > 0.5 && poseName !== "point") frontHand = "open"; // explaining with an open hand
  }

  const shoulderY = 285 + drop + breath;
  const backShoulder = [152 + shift, shoulderY];
  const frontShoulder = [248 + shift, shoulderY];
  const skin = look.skin;
  const arm = ([sx, sy], angles, color, handType) => {
    const { ex, ey, hx, hy } = armPoints(sx, sy, angles);
    // Hand points along the forearm
    const angle = (Math.atan2(hx - ex, -(hy - ey)) * 180) / Math.PI;
    return (
      <g>
        <Limb points={[[sx, sy], [ex, ey], [hx, hy]]} color={color} width={28} />
        <Hand x={hx} y={hy} angle={angle} type={handType} skin={hooded ? "#c9b6a4" : skin} />
      </g>
    );
  };
  const backArmEl = arm(backShoulder, backAngles, hooded ? CLOAK : look.shirtDark, backHand);
  const frontArmEl = arm(frontShoulder, frontAngles, sleeve, frontHand);
  const backPlace = P.headTop ? "head" : P.backOnTop ? "body" : "behind";

  // Legs: feet stay planted, hips carry the weight shift
  const hipY = 520 + drop;
  const hips = [[180 + shift, hipY], [220 + shift, hipY]];
  const legs = seated
    ? hips.map(([x, y], i) => [[x, y], [x + 120, y + 8], [x + 110 + i * 10, 845]])
    : [
        [hips[0], [176 + shift * 0.5, 690], [172, 845]],
        [hips[1], [226 + shift * 0.5, 690], [230, 845]],
      ];

  const torsoTop = 262 + drop + breath;
  const tY = (y) => y + drop + breath; // shift torso details with the body
  const torsoH = hipY + 20 - torsoTop;

  return (
    <svg viewBox="0 0 400 900" width="100%" height="100%" style={{ overflow: "visible" }}>
      <ellipse cx="200" cy="858" rx="110" ry="16" fill="rgba(0,0,0,0.25)" />
      {seated && (
        <g stroke={INK} strokeWidth="6" strokeLinejoin="round">
          {/* office chair */}
          <rect x="112" y={330 + drop - 120} width="150" height="300" rx="40" fill="#C8682E" />
          <rect x="120" y={hipY - 10} width="210" height="44" rx="16" fill="#A9561F" />
          <rect x="196" y={hipY + 34} width="18" height={845 - hipY - 60} fill="#444" />
          <path d={`M140 845 L270 845`} strokeWidth="14" stroke="#333" />
        </g>
      )}
      {backPlace === "behind" && backArmEl}
      {/* legs or long skirt, then shoes */}
      {look.bottom === "skirt" && !seated ? (
        <g>
          <path d={`M${150 + shift} ${hipY - 30} L${250 + shift} ${hipY - 30} L282 840 L118 840 Z`} fill={look.pants} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d={`M${150 + shift} ${hipY - 30} L${178 + shift} ${hipY - 30} L156 840 L118 840 Z`} fill={SHADE} />
        </g>
      ) : (
        legs.map((pts, i) => <Limb key={i} points={pts} color={hooded ? CLOAK : look.pants} width={30} />)
      )}
      {legs.map((pts, i) => {
        const [fx, fy] = pts[pts.length - 1];
        return (
          <g key={i}>
            <path d={`M${fx - 22} ${fy + 14} Q${fx - 22} ${fy - 8} ${fx + 6} ${fy - 8} Q${fx + 46} ${fy - 6} ${fx + 48} ${fy + 14} Z`} fill={look.shoes} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d={`M${fx - 18} ${fy + 10} L${fx + 44} ${fy + 10}`} stroke="#fff" strokeOpacity="0.25" strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      })}
      {/* torso */}
      <g transform={`translate(${shift} 0)`}>
        {look.top === "hoodie" && !hooded && (
          // hood lying behind the neck
          <path d={`M146 ${tY(278)} Q140 ${tY(232)} 200 ${tY(228)} Q260 ${tY(232)} 254 ${tY(278)} Z`} fill={look.shirtDark} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
        )}
        <rect x="142" y={torsoTop} width="116" height={torsoH} rx="46" fill={look.shirt} stroke={INK} strokeWidth="6" />
        {/* cel shadow: back half of the torso */}
        <rect x="147" y={torsoTop + 6} width="44" height={torsoH - 12} rx="22" fill={SHADE} />
        {look.top === "hoodie" && (
          <g>
            <rect x="166" y={tY(436)} width="68" height="44" rx="12" fill={look.shirtDark} stroke={INK} strokeWidth="4" />
            <path d={`M188 ${tY(272)} Q184 ${tY(310)} 186 ${tY(344)} M212 ${tY(272)} Q216 ${tY(310)} 214 ${tY(344)}`} fill="none" stroke={look.strings || "#fff"} strokeWidth="5" strokeLinecap="round" />
            <circle cx="186" cy={tY(348)} r="4" fill={look.strings || "#fff"} />
            <circle cx="214" cy={tY(348)} r="4" fill={look.strings || "#fff"} />
          </g>
        )}
        {look.top === "shirt" && (
          <g>
            <path d={`M176 ${tY(264)} L200 ${tY(300)} L224 ${tY(264)}`} fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            {[340, 385, 430].map(y => <circle key={y} cx="206" cy={tY(y)} r="5" fill={look.shirtDark} />)}
          </g>
        )}
        {look.top === "shawl" && (
          <g>
            <path d={`M136 ${tY(290)} Q200 ${tY(345)} 264 ${tY(290)} L270 ${tY(372)} Q200 ${tY(412)} 130 ${tY(372)} Z`} fill={look.shawl} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <circle cx="200" cy={tY(336)} r="9" fill="#E8C35A" stroke={INK} strokeWidth="3" />
          </g>
        )}
        {look.top === "overalls" && (
          <g>
            <rect x="158" y={tY(330)} width="84" height={hipY + 10 - tY(330)} rx="16" fill={look.overalls} stroke={INK} strokeWidth="4" />
            <line x1="166" y1={tY(336)} x2="154" y2={tY(272)} stroke={look.overalls} strokeWidth="12" strokeLinecap="round" />
            <line x1="234" y1={tY(336)} x2="246" y2={tY(272)} stroke={look.overalls} strokeWidth="12" strokeLinecap="round" />
            <circle cx="168" cy={tY(342)} r="6" fill="#E8C35A" />
            <circle cx="232" cy={tY(342)} r="6" fill="#E8C35A" />
          </g>
        )}
        {look.top === "jacket" && (
          <g>
            <path d={`M184 ${tY(264)} L200 ${tY(470)} L216 ${tY(264)} Z`} fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <path d={`M184 ${tY(264)} L168 ${tY(320)} L198 ${tY(360)} Z`} fill={look.shirtDark} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <path d={`M216 ${tY(264)} L232 ${tY(320)} L202 ${tY(360)} Z`} fill={look.shirtDark} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          </g>
        )}
        {look.top === "suit" && (
          <g>
            <path d={`M180 ${tY(264)} L200 ${tY(360)} L220 ${tY(264)} Z`} fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <path d={`M195 ${tY(274)} L205 ${tY(274)} L210 ${tY(340)} L200 ${tY(362)} L190 ${tY(340)} Z`} fill="#C0392B" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <path d={`M180 ${tY(264)} L164 ${tY(330)} L196 ${tY(380)} Z`} fill={look.shirtDark} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <path d={`M220 ${tY(264)} L236 ${tY(330)} L204 ${tY(380)} Z`} fill={look.shirtDark} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <circle cx="200" cy={tY(420)} r="5" fill={INK} />
          </g>
        )}
        {hooded && (
          <path d={`M138 ${torsoTop} L262 ${torsoTop} L292 860 L108 860 Z`} fill={CLOAK} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        )}
      </g>
      {desk && (
        <g stroke={INK} strokeWidth="6" strokeLinejoin="round">
          {/* laptop (screen facing away) + desk */}
          <path d="M250 560 L360 560 L372 610 L238 610 Z" fill="#B8BEC6" />
          <rect x={desk === "wide" ? -260 : -10} y="606" width={desk === "wide" ? 920 : 420} height="34" rx="6" fill="#8C5E36" />
          <rect x={desk === "wide" ? -240 : 0} y="640" width={desk === "wide" ? 880 : 400} height="270" fill="#6E4628" />
          <line x1={desk === "wide" ? -240 : 0} y1="700" x2={desk === "wide" ? 640 : 400} y2="700" stroke="#5A3920" strokeWidth="5" />
        </g>
      )}
      {backPlace === "body" && backArmEl}
      {frontArmEl}
      {/* neck + head */}
      <rect x={188 + shift} y={HEAD_Y + 70 + drop + breath} width="24" height="56" fill={skin} stroke={INK} strokeWidth="5" />
      <rect x={190 + shift} y={HEAD_Y + 74 + drop + breath} width="20" height="20" fill={SHADE} />
      <g transform={`translate(${200 + shift} ${HEAD_Y + drop + breath + nod}) rotate(${headTilt}) scale(${HEAD_SCALE}) translate(-200 -210)`}>
        {look.bun && <circle cx="196" cy="54" r="52" fill={look.hair} stroke={INK} strokeWidth="9" />}
        <circle cx="200" cy="210" r="150" fill={skin} stroke={INK} strokeWidth="10" />
        {/* cel shadow on the back of the head */}
        <path d="M118 84 C66 118 46 180 54 236 C62 296 104 344 158 356 C108 316 94 256 98 204 C102 152 112 112 118 84 Z" fill={SHADE} />
        {emotion === "angry" && <ellipse cx="210" cy="200" rx="120" ry="60" fill="#ff2a1a" opacity={0.2 + 0.06 * Math.sin(frame * 0.3)} />}
        {/* fear drains the colour from the lower face (lighter on darker skin so it doesn't look grey) */}
        {emotion === "scared" && <ellipse cx="210" cy="276" rx="124" ry="70" fill="rgb(150,185,255)" opacity={parseInt(skin.slice(1, 3), 16) > 200 ? 0.28 : 0.12} />}
        <path d={look.hairPath} fill={look.hair} stroke={INK} strokeWidth="9" strokeLinejoin="round" />
        <path d="M110 96 Q170 66 236 72" fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="10" strokeLinecap="round" />
        {look.cap && (
          <g stroke={INK} strokeWidth="9" strokeLinejoin="round">
            <path d="M56 170 Q62 34 200 32 Q338 34 344 170 Q200 142 56 170 Z" fill={look.cap} />
            <path d="M290 150 Q394 144 428 176 Q362 188 296 176 Z" fill={look.cap} />
            <path d="M200 34 L200 150" stroke="rgba(0,0,0,0.3)" strokeWidth="5" />
            <circle cx="200" cy="34" r="12" fill={look.cap} />
          </g>
        )}
        <g transform={`translate(0 ${browLift})`}><Brows emotion={emotion} lift={0} /></g>
        <Eyes emotion={emotion} blinking={blinking} frame={frame} phase={phase} />
        {look.glasses && (
          <g fill="none" stroke={INK} strokeWidth="8">
            <circle cx={EYE_L} cy={EYE_Y} r="40" />
            <circle cx={EYE_R} cy={EYE_Y} r="40" />
            <path d={`M${EYE_L + 40} ${EYE_Y - 4} Q${(EYE_L + EYE_R) / 2} ${EYE_Y - 14} ${EYE_R - 40} ${EYE_Y - 4}`} />
            <path d={`M${EYE_L - 40} ${EYE_Y - 6} L62 ${EYE_Y - 14}`} />
          </g>
        )}
        {look.glasses && <ellipse cx={EYE_L - 14} cy={EYE_Y - 16} rx="10" ry="5" fill="#fff" opacity="0.4" transform={`rotate(-30 ${EYE_L - 14} ${EYE_Y - 16})`} />}
        {look.wrinkles && (
          <g stroke={INK} strokeWidth="5" strokeLinecap="round" opacity="0.4" fill="none">
            <path d="M120 230 Q112 240 120 252" />
            <path d="M318 230 Q326 240 318 252" />
            <path d="M160 120 Q210 110 260 120" />
          </g>
        )}
        {look.earrings && <circle cx="66" cy="262" r="13" fill="#F2C14E" stroke={INK} strokeWidth="5" />}
        {look.mustache && (
          <path d={`M${MX - 44} ${MY - 18} Q${MX - 20} ${MY - 38} ${MX} ${MY - 22} Q${MX + 20} ${MY - 38} ${MX + 44} ${MY - 18} Q${MX + 32} ${MY - 2} ${MX} ${MY - 10} Q${MX - 32} ${MY - 2} ${MX - 44} ${MY - 18} Z`}
            fill={look.hair} stroke={INK} strokeWidth="4" />
        )}
        {(emotion === "happy" || emotion === "relieved") && (
          <g fill="#ff6f7d" opacity="0.4">
            <ellipse cx="136" cy="268" rx="24" ry="13" />
            <ellipse cx="292" cy="268" rx="24" ry="13" />
          </g>
        )}
        {(emotion === "worried" || emotion === "scared") && (
          <path d="M318 112 Q338 146 330 162 Q318 178 304 162 Q298 146 318 112 Z" fill="#BFE6FF" stroke={INK} strokeWidth="5" />
        )}
        {emotion === "scared" && (
          <path transform={`translate(0 ${(frame * 2 + phase * 20) % 40})`} d="M96 132 Q110 158 104 172 Q94 184 84 172 Q80 158 96 132 Z" fill="#BFE6FF" stroke={INK} strokeWidth="5" />
        )}
        {emotion === "angry" && (
          // Throbbing cartoon anger mark
          <g transform={`translate(300 96) scale(${1 + 0.15 * Math.max(0, Math.sin(frame * 0.35))})`} stroke="#D32F2F" strokeWidth="9" strokeLinecap="round" fill="none">
            <path d="M-26 -8 Q-10 -6 -8 -26 M8 -26 Q10 -6 26 -8 M26 8 Q10 6 8 26 M-8 26 Q-10 6 -26 8" />
          </g>
        )}
        {emotion === "crying" && [EYE_L, EYE_R].map((x, i) => (
          // Tears: a stream down each cheek with drops sliding along it
          <g key={x}>
            <path d={`M${x + (i ? 10 : -10)} ${EYE_Y + 16} Q${x + (i ? 20 : -20)} ${EYE_Y + 70} ${x + (i ? 14 : -14)} ${EYE_Y + 124}`} fill="none" stroke="#7FD3FF" strokeWidth="14" strokeLinecap="round" opacity="0.85" />
            {[0, 1].map(k => {
              const p = ((frame * 0.04 + k * 0.5 + i * 0.25) % 1);
              return <ellipse key={k} cx={x + (i ? 10 + 10 * p : -10 - 10 * p)} cy={EYE_Y + 20 + p * 104} rx="9" ry="13" fill="#B8E6FF" stroke={INK} strokeWidth="3" opacity={1 - p * 0.6} />;
            })}
          </g>
        ))}
        {emotion === "relieved" && (() => {
          // "Phew": a little puff of breath drifting away
          const p = (frame % 60) / 60;
          return <ellipse cx={262 + p * 60} cy={300 - p * 30} rx={14 + p * 16} ry={10 + p * 10} fill="#fff" stroke={INK} strokeWidth="4" opacity={0.9 * (1 - p)} />;
        })()}
        {open > 0.08 ? <OpenMouth emotion={emotion} open={Math.min(1, open)} /> : <ClosedMouth emotion={emotion} />}
        {hooded && (
          <g>
            <circle cx="200" cy="210" r="150" fill="rgba(0,0,0,0.55)" />
            <path d="M24 240 Q16 10 200 2 Q384 10 376 240 Q372 340 312 380 L300 250 Q298 96 200 92 Q102 96 100 250 L88 380 Q28 340 24 240 Z"
              fill={CLOAK} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          </g>
        )}
      </g>
      {backPlace === "head" && backArmEl}
    </svg>
  );
}
