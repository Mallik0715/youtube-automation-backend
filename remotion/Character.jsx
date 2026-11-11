import React from "react";

const INK = "#1d1d1f";

// Original recurring characters. Drawn facing right; the Skit flips characters that should face left.
//   top: hoodie | shirt | shawl | overalls     bottom: pants | skirt
export const LOOKS = {
  A: { // Max - spiky hair, orange hoodie
    name: "Max", skin: "#F4C9A0", hair: "#3B2A20", shirt: "#F28C28", shirtDark: "#D4701A", sleeve: "#F28C28",
    pants: "#2E3A59", shoes: "#222", accent: "#FFC93C", top: "hoodie", bottom: "pants",
    hairPath: "M58 200 Q50 75 165 58 L150 18 L212 52 L238 10 L262 60 L310 40 L300 82 Q352 112 344 200 Q300 128 205 120 Q112 124 58 200 Z",
  },
  B: { // Leo - side-swept hair, round glasses, teal shirt
    name: "Leo", skin: "#E9B48A", hair: "#6A3D1F", shirt: "#2BB3A3", shirtDark: "#1E8C80", sleeve: "#2BB3A3",
    pants: "#6B4F3A", shoes: "#3a2a1f", accent: "#4FD8FF", top: "shirt", bottom: "pants", glasses: true,
    hairPath: "M54 205 Q40 62 200 48 Q358 52 350 200 Q338 120 262 100 Q200 150 120 128 Q80 140 54 205 Z",
  },
  C: { // Mira - the old woman of Hollowmere: grey bun, shawl, long skirt
    name: "Mira", skin: "#EBC6A4", hair: "#C9CBD3", shirt: "#6D4C7D", shirtDark: "#553A62", sleeve: "#6D4C7D",
    shawl: "#B5543C", pants: "#3F3550", shoes: "#2a2230", accent: "#D7A6FF", top: "shawl", bottom: "skirt",
    bun: true, wrinkles: true,
    hairPath: "M56 205 Q48 70 200 56 Q352 70 344 205 Q330 120 200 112 Q70 120 56 205 Z",
  },
  D: { // Bruno - the mechanic: red cap, moustache, overalls
    name: "Bruno", skin: "#D9A27A", hair: "#2B2B2B", shirt: "#E8E2D0", shirtDark: "#3D5A80", sleeve: "#E8E2D0",
    overalls: "#3D5A80", pants: "#3D5A80", shoes: "#1f1f1f", accent: "#FF8A5B", top: "overalls", bottom: "pants",
    cap: "#B23A3A", mustache: true,
    hairPath: "M62 190 Q60 80 200 66 Q340 80 338 190 Q300 130 200 126 Q100 130 62 190 Z",
  },
  E: { // Zara - big curly hair, yellow jacket over a white top
    name: "Zara", skin: "#B9784F", hair: "#2A1A12", shirt: "#F2C14E", shirtDark: "#D9A532", sleeve: "#F2C14E",
    pants: "#34405E", shoes: "#2a2a2a", accent: "#FF9EDB", top: "jacket", bottom: "pants", earrings: true,
    hairPath: "M40 250 Q10 200 40 150 Q20 90 80 70 Q100 20 160 30 Q200 0 240 30 Q300 20 320 70 Q380 90 360 150 Q390 200 360 250 Q340 160 290 130 Q200 100 110 130 Q60 160 40 250 Z",
  },
  F: { // Victor - slick side-parted hair, purple suit, red tie
    name: "Victor", skin: "#F0C8A8", hair: "#1C1C24", shirt: "#5B3F8C", shirtDark: "#47306E", sleeve: "#5B3F8C",
    pants: "#47306E", shoes: "#111", accent: "#C9A7FF", top: "suit", bottom: "pants",
    hairPath: "M60 200 Q52 70 190 56 Q330 52 344 190 Q330 120 260 104 Q170 96 120 130 Q80 150 60 200 Z",
  },
};

const CLOAK = "#1E1E28";

// Body poses as arm angles: [upper arm, forearm] in degrees from straight down, positive = toward the
// direction the character faces. Back arm = far side, front arm = near side.
//   backOnTop: draw the back arm in front of the body (crossed arms)   headTop: in front of the head
export const POSES = {
  neutral: { back: [-4, 0], front: [4, 2] },
  point: { back: [-4, 0], front: [80, 90] },
  hips: { back: [-42, 48], front: [42, -48] },
  crossed: { back: [12, 95], front: [-12, -95], backOnTop: true, noGesture: true },
  shrug: { back: [-60, -125], front: [60, 125] },
  shock: { back: [-120, -170], front: [120, 170], noGesture: true },
  worried: { back: [-155, 170], front: [4, 2], headTop: true },
};
// Talking gesture the front arm drifts toward (forward and slightly up)
// Bent elbow, hand forward - an explaining gesture rather than a stiff pointer
const GESTURE = [32, 92];
const UPPER = 125;
const FORE = 120;

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

const BROWS = {
  neutral:   [[125, 162, 182, 162], [228, 162, 285, 162]],
  happy:     [[125, 158, 182, 150], [228, 150, 285, 158]],
  worried:   [[125, 166, 182, 150], [228, 150, 285, 166]],
  surprised: [[125, 140, 182, 134], [228, 134, 285, 140]],
  smug:      [[125, 166, 182, 164], [228, 148, 285, 140]],
};

function ClosedMouth({ emotion }) {
  const common = { fill: "none", stroke: INK, strokeWidth: 7, strokeLinecap: "round" };
  switch (emotion) {
    case "happy": return <path d="M168 292 Q205 332 242 292" {...common} />;
    case "worried": return <path d="M175 308 Q190 298 205 308 Q220 318 235 308" {...common} />;
    case "surprised": return <ellipse cx="205" cy="305" rx="11" ry="15" fill="#5a1a1a" stroke={INK} strokeWidth="6" />;
    case "smug": return <path d="M176 302 Q215 314 244 286" {...common} />;
    default: return <path d="M180 302 Q205 309 230 302" {...common} />;
  }
}

function OpenMouth({ emotion, open }) {
  if (emotion === "happy" || emotion === "smug") {
    const depth = 18 + open * 32;
    return (
      <g>
        <path d={`M168 292 Q205 296 242 292 Q236 ${292 + depth} 205 ${294 + depth} Q174 ${292 + depth} 168 292 Z`}
          fill="#5a1a1a" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
        <ellipse cx="205" cy={290 + depth * 0.85} rx="16" ry={4 + open * 5} fill="#e0656b" />
      </g>
    );
  }
  return (
    <g>
      <ellipse cx="205" cy="306" rx={24 - open * 4} ry={7 + open * 22} fill="#5a1a1a" stroke={INK} strokeWidth="6" />
      <ellipse cx="205" cy={310 + open * 12} rx={12 - open * 2} ry={2 + open * 5} fill="#e0656b" />
    </g>
  );
}

// Slim body layout (SVG units, 400 x 900, feet at ~850). The face artwork is drawn at its original
// size (head centre 200,210, radius 150) and scaled down onto the neck.
const HEAD_SCALE = 0.62;
const HEAD_Y = 150;
const SIT_DROP = 150; // how much lower the upper body sits when seated

function Limb({ points, color, width }) {
  const d = `M${points.map(p => p.join(" ")).join(" L")}`;
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={INK} strokeWidth={width + 8} />
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
  const shift = seated ? 0 : Math.sin(frame / 90 + phase) * 5;
  const drop = seated ? SIT_DROP : 0;

  // Head: still most of the time; small emphasis on loud words, small nods while listening
  const emphasis = talk * level * Math.sin(frame * 0.18 + phase) * 3;
  const nodWave = Math.max(0, Math.sin(frame / 26 + phase * 3));
  const nod = listening ? Math.pow(nodWave, 12) * 7 : 0;
  const headTilt = emphasis + (emotion === "worried" ? -3 : emotion === "smug" ? 3 : 0);

  // Mouth follows the real voice; otherwise a speech-like rhythm
  const open = talk <= 0.05 ? 0 : talk * Math.min(1, level * 1.25);

  // Blink for 4 frames every ~3-4 seconds; eyebrows lift on stressed words
  const [blinkPeriod, blinkOffset] = BLINK[who] || BLINK.A;
  const blinking = (frame + blinkOffset) % blinkPeriod < 4;
  const eyeScale = emotion === "surprised" ? 1.2 : 1;
  const browLift = -level * talk * 10;

  // Pose: blend from the previous pose, then the front arm beats with the voice while talking
  const poseName = pose || (emotion === "worried" ? "worried" : "neutral");
  const P = POSES[poseName] || POSES.neutral;
  const Q = POSES[prevPose] || P;
  const backAngles = lerpArm(Q.back, P.back, poseK);
  let frontAngles = lerpArm(Q.front, P.front, poseK);
  if (!P.noGesture) {
    const target = [GESTURE[0] + level * 22 + Math.sin(frame * 0.12 + phase) * 6, GESTURE[1] + level * 15];
    frontAngles = lerpArm(frontAngles, target, poseName === "point" ? gesture * 0.3 : gesture);
  }

  const shoulderY = 285 + drop + breath;
  const backShoulder = [152 + shift, shoulderY];
  const frontShoulder = [248 + shift, shoulderY];
  const arm = ([sx, sy], angles, color) => {
    const { ex, ey, hx, hy } = armPoints(sx, sy, angles);
    return (
      <g>
        <Limb points={[[sx, sy], [ex, ey], [hx, hy]]} color={color} width={26} />
        <circle cx={hx} cy={hy} r="17" fill={look.skin} stroke={INK} strokeWidth="5" />
      </g>
    );
  };
  const backArmEl = arm(backShoulder, backAngles, hooded ? CLOAK : look.shirtDark);
  const frontArmEl = arm(frontShoulder, frontAngles, sleeve);
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

  const [browL, browR] = BROWS[emotion] || BROWS.neutral;
  const torsoTop = 262 + drop + breath;
  const tY = (y) => y + drop + breath; // shift torso details with the body

  return (
    <svg viewBox="0 0 400 900" width="100%" height="100%" style={{ overflow: "visible" }}>
      <ellipse cx="200" cy="858" rx="110" ry="16" fill="rgba(0,0,0,0.2)" />
      {seated && (
        <g stroke={INK} strokeWidth="6" strokeLinejoin="round">
          {/* office chair */}
          <rect x="112" y={330 + drop - 120} width="150" height="300" rx="40" fill="#E07B39" />
          <rect x="120" y={hipY - 10} width="210" height="44" rx="16" fill="#C8682E" />
          <rect x="196" y={hipY + 34} width="18" height={845 - hipY - 60} fill="#444" />
          <path d={`M140 845 L270 845`} strokeWidth="14" stroke="#333" />
        </g>
      )}
      {backPlace === "behind" && backArmEl}
      {/* legs or long skirt, then shoes */}
      {look.bottom === "skirt" && !seated ? (
        <path d={`M${150 + shift} ${hipY - 30} L${250 + shift} ${hipY - 30} L282 840 L118 840 Z`} fill={look.pants} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      ) : (
        legs.map((pts, i) => <Limb key={i} points={pts} color={hooded ? CLOAK : look.pants} width={30} />)
      )}
      {legs.map((pts, i) => {
        const [fx, fy] = pts[pts.length - 1];
        return <ellipse key={i} cx={fx + 14} cy={fy + 6} rx="32" ry="15" fill={look.shoes} stroke={INK} strokeWidth="4" />;
      })}
      {/* torso */}
      <g transform={`translate(${shift} 0)`}>
        <rect x="142" y={torsoTop} width="116" height={hipY + 20 - torsoTop} rx="46" fill={look.shirt} stroke={INK} strokeWidth="6" />
        {look.top === "hoodie" && (
          <g>
            <rect x="168" y={tY(440)} width="64" height="38" rx="12" fill={look.shirtDark} />
            <line x1="190" y1={tY(272)} x2="188" y2={tY(330)} stroke="#fff" strokeWidth="5" strokeLinecap="round" />
            <line x1="210" y1={tY(272)} x2="212" y2={tY(330)} stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}
        {look.top === "shirt" && (
          <g>
            <path d={`M178 ${tY(264)} L200 ${tY(298)} L222 ${tY(264)}`} fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            {[340, 385, 430].map(y => <circle key={y} cx="200" cy={tY(y)} r="5" fill={look.shirtDark} />)}
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
          <rect x={desk === "wide" ? -260 : -10} y="606" width={desk === "wide" ? 920 : 420} height="34" rx="6" fill="#9C6B3F" />
          <rect x={desk === "wide" ? -240 : 0} y="640" width={desk === "wide" ? 880 : 400} height="270" fill="#7E5230" />
          <line x1={desk === "wide" ? -240 : 0} y1="700" x2={desk === "wide" ? 640 : 400} y2="700" stroke="#6A4428" strokeWidth="5" />
        </g>
      )}
      {backPlace === "body" && backArmEl}
      {frontArmEl}
      {/* neck + head */}
      <rect x={188 + shift} y={HEAD_Y + 60 + drop + breath} width="24" height="60" fill={look.skin} stroke={INK} strokeWidth="5" />
      <g transform={`translate(${200 + shift} ${HEAD_Y + drop + breath + nod}) rotate(${headTilt}) scale(${HEAD_SCALE}) translate(-200 -210)`}>
        {look.bun && <circle cx="200" cy="58" r="52" fill={look.hair} stroke={INK} strokeWidth="6" />}
        <circle cx="200" cy="210" r="150" fill={look.skin} stroke={INK} strokeWidth="8" />
        <ellipse cx="52" cy="220" rx="18" ry="28" fill={look.skin} stroke={INK} strokeWidth="7" />
        <path d={look.hairPath} fill={look.hair} stroke={INK} strokeWidth="7" strokeLinejoin="round" />
        {look.cap && (
          <g stroke={INK} strokeWidth="7" strokeLinejoin="round">
            <path d="M58 168 Q66 36 200 34 Q334 36 342 168 Q200 140 58 168 Z" fill={look.cap} />
            <path d="M290 150 Q392 146 424 176 Q360 186 296 174 Z" fill={look.cap} />
          </g>
        )}
        {[155, 255].map(x => (
          <g key={x} transform={`translate(${x} 215) scale(1 ${blinking ? 0.08 : eyeScale}) translate(${-x} -215)`}>
            <ellipse cx={x} cy="215" rx="30" ry="36" fill="#fff" stroke={INK} strokeWidth="6" />
            <circle cx={x + 9} cy="218" r={emotion === "surprised" ? 11 : 15} fill={INK} />
            <circle cx={x + 14} cy="211" r="5" fill="#fff" />
          </g>
        ))}
        {look.glasses && (
          <g fill="none" stroke={INK} strokeWidth="8">
            <circle cx="155" cy="215" r="46" />
            <circle cx="255" cy="215" r="46" />
            <path d="M201 210 Q205 200 209 210" />
          </g>
        )}
        <g transform={`translate(0 ${browLift})`}>
          <line x1={browL[0]} y1={browL[1]} x2={browL[2]} y2={browL[3]} stroke={INK} strokeWidth="12" strokeLinecap="round" />
          <line x1={browR[0]} y1={browR[1]} x2={browR[2]} y2={browR[3]} stroke={INK} strokeWidth="12" strokeLinecap="round" />
        </g>
        {look.wrinkles && (
          <g stroke={INK} strokeWidth="5" strokeLinecap="round" opacity="0.45" fill="none">
            <path d="M100 205 Q92 215 100 226" />
            <path d="M310 205 Q318 215 310 226" />
            <path d="M150 112 Q200 102 250 112" />
          </g>
        )}
        {look.earrings && <circle cx="52" cy="262" r="12" fill="#F2C14E" stroke={INK} strokeWidth="4" />}
        {who === "F" && <path d="M150 84 Q220 70 290 100" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="8" strokeLinecap="round" />}
        {look.mustache && (
          <path d="M162 276 Q186 256 205 272 Q224 256 248 276 Q236 292 205 284 Q174 292 162 276 Z" fill={look.hair} stroke={INK} strokeWidth="4" />
        )}
        {emotion === "happy" && (
          <g fill="#ff7b8a" opacity="0.45">
            <ellipse cx="120" cy="272" rx="26" ry="15" />
            <ellipse cx="292" cy="272" rx="26" ry="15" />
          </g>
        )}
        {emotion === "worried" && (
          <path d="M330 120 Q348 150 340 166 Q328 180 316 166 Q310 150 330 120 Z" fill="#7fd3ff" stroke={INK} strokeWidth="4" />
        )}
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
