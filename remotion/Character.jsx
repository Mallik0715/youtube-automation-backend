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

/**
 * @param {{who: "A"|"B"|"C"|"D", frame: number, talk: number, emotion: string, hooded?: boolean}} props
 *   talk: 0..1, how much the character is currently speaking (eased in/out at line edges)
 */
export function Character({ who, frame, talk, emotion, hooded = false }) {
  const look = LOOKS[who];
  const phase = PHASE[who] || 0;
  const sleeve = hooded ? CLOAK : look.sleeve;

  // Idle breathing + extra bounce while talking
  const bob = Math.sin(frame / 14 + phase) * 5 + talk * Math.abs(Math.sin(frame * 0.42)) * -10;
  const headTilt = Math.sin(frame / 22 + phase) * 2 + talk * Math.sin(frame * 0.3) * 4;

  // Mouth flaps with irregular rhythm so it reads as speech, not a metronome
  const open = talk > 0.05 ? talk * Math.max(0, 0.45 * Math.sin(frame * 0.95 + phase) + 0.35 * Math.sin(frame * 1.7) + 0.4) : 0;

  // Blink for 4 frames every ~3-4 seconds
  const [blinkPeriod, blinkOffset] = BLINK[who] || BLINK.A;
  const blinking = (frame + blinkOffset) % blinkPeriod < 4;
  const eyeScale = emotion === "surprised" ? 1.2 : 1;

  // Front arm gestures toward the other character while talking
  const armRaise = talk * (55 + Math.sin(frame * 0.22 + phase) * 15);
  // Worried: back hand goes up to the side of the head (drawn in front of the head)
  const worried = emotion === "worried";
  const backArmEl = (
    <g transform={`rotate(${(worried ? 150 : 0) + Math.sin(frame / 18 + phase) * 3} 122 385)`}>
      <path d="M122 385 Q108 470 112 560" fill="none" stroke={hooded ? CLOAK : look.shirtDark} strokeWidth="44" strokeLinecap="round" />
      <circle cx="112" cy="572" r="24" fill={look.skin} stroke={INK} strokeWidth="5" />
    </g>
  );

  const [browL, browR] = BROWS[emotion] || BROWS.neutral;

  return (
    <svg viewBox="0 0 400 900" width="100%" height="100%" style={{ overflow: "visible" }}>
      <ellipse cx="200" cy="868" rx="150" ry="22" fill="rgba(0,0,0,0.18)" />
      <g transform={`translate(0 ${bob})`}>
        {!worried && backArmEl}
        {/* legs or skirt + shoes */}
        {look.bottom === "skirt" ? (
          <path d="M120 560 L280 560 L312 838 L88 838 Z" fill={look.pants} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        ) : (
          <g>
            <rect x="138" y="580" width="52" height="260" rx="20" fill={look.pants} stroke={INK} strokeWidth="5" />
            <rect x="212" y="580" width="52" height="260" rx="20" fill={look.pants} stroke={INK} strokeWidth="5" />
          </g>
        )}
        <ellipse cx="170" cy="846" rx="44" ry="20" fill={look.shoes} />
        <ellipse cx="250" cy="846" rx="44" ry="20" fill={look.shoes} />
        {/* torso */}
        <rect x="104" y="340" width="194" height="290" rx="72" fill={look.shirt} stroke={INK} strokeWidth="6" />
        {look.top === "hoodie" && (
          <g>
            <rect x="150" y="510" width="104" height="60" rx="18" fill={look.shirtDark} />
            <line x1="182" y1="352" x2="178" y2="440" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
            <line x1="222" y1="352" x2="226" y2="440" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          </g>
        )}
        {look.top === "shirt" && (
          <g>
            <path d="M160 342 L200 392 L240 342" fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <circle cx="200" cy="430" r="6" fill={look.shirtDark} />
            <circle cx="200" cy="480" r="6" fill={look.shirtDark} />
          </g>
        )}
        {look.top === "shawl" && (
          <g>
            <path d="M98 372 Q200 440 304 372 L312 480 Q200 540 90 480 Z" fill={look.shawl} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d="M140 470 L132 520 M175 492 L170 545 M225 492 L230 545 M262 470 L270 520" stroke={look.shawl} strokeWidth="6" strokeLinecap="round" />
            <circle cx="200" cy="440" r="11" fill="#E8C35A" stroke={INK} strokeWidth="4" />
          </g>
        )}
        {look.top === "overalls" && (
          <g>
            <rect x="136" y="430" width="130" height="200" rx="24" fill={look.overalls} stroke={INK} strokeWidth="5" />
            <line x1="150" y1="440" x2="140" y2="350" stroke={look.overalls} strokeWidth="16" strokeLinecap="round" />
            <line x1="252" y1="440" x2="262" y2="350" stroke={look.overalls} strokeWidth="16" strokeLinecap="round" />
            <circle cx="152" cy="448" r="8" fill="#E8C35A" />
            <circle cx="250" cy="448" r="8" fill="#E8C35A" />
            <rect x="176" y="470" width="50" height="40" rx="6" fill="none" stroke="#2C4363" strokeWidth="5" />
          </g>
        )}
        {look.top === "jacket" && (
          <g>
            <path d="M168 345 L200 600 L232 345 Z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M168 345 L150 420 L196 470 Z" fill={look.shirtDark} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M232 345 L250 420 L204 470 Z" fill={look.shirtDark} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <circle cx="150" cy="520" r="7" fill={INK} />
          </g>
        )}
        {look.top === "suit" && (
          <g>
            <path d="M162 345 L200 470 L238 345 Z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M192 360 L208 360 L216 450 L200 480 L184 450 Z" fill="#C0392B" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M162 345 L140 440 L190 500 Z" fill={look.shirtDark} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M238 345 L260 440 L210 500 Z" fill={look.shirtDark} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M240 420 L268 412 L262 426 Z" fill="#fff" />
            <circle cx="200" cy="540" r="7" fill={INK} />
          </g>
        )}
        {hooded && (
          <path d="M96 330 L306 330 L346 860 L56 860 Z" fill={CLOAK} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        )}
        {/* front arm */}
        <g transform={`rotate(${-armRaise} 280 385)`}>
          <path d="M280 385 Q298 470 292 560" fill="none" stroke={sleeve} strokeWidth="44" strokeLinecap="round" />
          <path d="M280 385 Q298 470 292 560" fill="none" stroke={INK} strokeWidth="2" strokeOpacity="0.25" />
          <circle cx="292" cy="572" r="24" fill={look.skin} stroke={INK} strokeWidth="5" />
        </g>
        {/* head */}
        <g transform={`rotate(${headTilt} 200 330)`}>
          <rect x="176" y="310" width="48" height="44" fill={look.skin} />
          {look.bun && <circle cx="200" cy="58" r="52" fill={look.hair} stroke={INK} strokeWidth="6" />}
          <circle cx="200" cy="210" r="150" fill={look.skin} stroke={INK} strokeWidth="7" />
          <ellipse cx="52" cy="220" rx="18" ry="28" fill={look.skin} stroke={INK} strokeWidth="6" />
          <path d={look.hairPath} fill={look.hair} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {look.cap && (
            <g stroke={INK} strokeWidth="6" strokeLinejoin="round">
              <path d="M58 168 Q66 36 200 34 Q334 36 342 168 Q200 140 58 168 Z" fill={look.cap} />
              <path d="M290 150 Q392 146 424 176 Q360 186 296 174 Z" fill={look.cap} />
              <circle cx="200" cy="40" r="10" fill={look.cap} />
            </g>
          )}
          {/* eyes look toward the other character (to the right) */}
          {[155, 255].map(x => (
            <g key={x} transform={`translate(${x} 215) scale(1 ${blinking ? 0.08 : eyeScale}) translate(${-x} -215)`}>
              <ellipse cx={x} cy="215" rx="30" ry="36" fill="#fff" stroke={INK} strokeWidth="5" />
              <circle cx={x + 9} cy="218" r={emotion === "surprised" ? 11 : 15} fill={INK} />
              <circle cx={x + 14} cy="211" r="5" fill="#fff" />
            </g>
          ))}
          {look.glasses && (
            <g fill="none" stroke={INK} strokeWidth="7">
              <circle cx="155" cy="215" r="46" />
              <circle cx="255" cy="215" r="46" />
              <path d="M201 210 Q205 200 209 210" />
            </g>
          )}
          <line x1={browL[0]} y1={browL[1]} x2={browL[2]} y2={browL[3]} stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <line x1={browR[0]} y1={browR[1]} x2={browR[2]} y2={browR[3]} stroke={INK} strokeWidth="10" strokeLinecap="round" />
          {look.wrinkles && (
            <g stroke={INK} strokeWidth="4" strokeLinecap="round" opacity="0.45" fill="none">
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
              {/* face in shadow inside a deep hood */}
              <circle cx="200" cy="210" r="150" fill="rgba(0,0,0,0.55)" />
              <path d="M24 240 Q16 10 200 2 Q384 10 376 240 Q372 340 312 380 L300 250 Q298 96 200 92 Q102 96 100 250 L88 380 Q28 340 24 240 Z"
                fill={CLOAK} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
            </g>
          )}
        </g>
        {worried && backArmEl}
      </g>
    </svg>
  );
}
