import React from "react";

// Flat cartoon scenes drawn in code (1080x1920). Floor starts at FLOOR_Y; characters stand on it.
// Scene names must match SCENES in services/dialogueScriptService.js.
export const FLOOR_Y = 1380;
const INK = "#1d1d1f";
const W = 1080;
const H = 1920;

function Window({ x, y, w, h, sky = "#BFE6FF", frame = "#fff", children }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={sky} stroke={frame} strokeWidth="18" />
      {children}
      <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke={frame} strokeWidth="12" />
      <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} stroke={frame} strokeWidth="12" />
    </g>
  );
}

function Plant({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -60 Q-70 -170 -20 -260 Q0 -150 0 -60 Z" fill="#4CAF6A" stroke={INK} strokeWidth="5" />
      <path d="M0 -60 Q60 -190 30 -280 Q-10 -170 0 -60 Z" fill="#5CC27A" stroke={INK} strokeWidth="5" />
      <path d="M0 -60 Q90 -120 110 -200 Q40 -150 0 -60 Z" fill="#3E9A5A" stroke={INK} strokeWidth="5" />
      <path d="M-55 -70 L55 -70 L40 40 L-40 40 Z" fill="#C8643C" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
    </g>
  );
}

function Skyline({ y, color = "#8FA9C9" }) {
  const blocks = [[0, 160], [90, 260], [170, 120], [250, 330], [360, 210], [450, 290], [560, 150], [640, 380], [760, 230], [860, 300], [960, 180]];
  return (
    <g fill={color}>
      {blocks.map(([x, h]) => <rect key={x} x={x} y={y - h} width="100" height={h} />)}
    </g>
  );
}

function Office() {
  return (
    <g>
      <rect width={W} height={FLOOR_Y} fill="#DCE6F0" />
      <rect y={FLOOR_Y - 40} width={W} height="40" fill="#C3CFDC" />
      <Window x={120} y={250} w={840} h={560} sky="#BFE6FF">
        <Skyline y={810} />
      </Window>
      {/* back desk + monitor */}
      <rect x={60} y={1080} width={500} height="40" fill="#8B6B4A" stroke={INK} strokeWidth="6" />
      <rect x={90} y={1120} width="30" height="260" fill="#6E543A" />
      <rect x={500} y={1120} width="30" height="260" fill="#6E543A" />
      <rect x={200} y={900} width="230" height="160" rx="10" fill="#2A2F3A" stroke={INK} strokeWidth="6" />
      <rect x={300} y={1060} width="30" height="22" fill="#2A2F3A" />
      <rect x={760} y={960} width="220" height="420" rx="8" fill="#B9C4D0" stroke={INK} strokeWidth="6" />
      <line x1={760} y1={1100} x2={980} y2={1100} stroke={INK} strokeWidth="5" />
      <line x1={760} y1={1240} x2={980} y2={1240} stroke={INK} strokeWidth="5" />
      <Plant x={680} y={1340} s={0.9} />
      <rect y={FLOOR_Y} width={W} height={H - FLOOR_Y} fill="#9AA6B5" />
      {[0, 1, 2, 3, 4].map(i => <line key={i} x1="0" y1={FLOOR_Y + 60 + i * 110} x2={W} y2={FLOOR_Y + 60 + i * 110} stroke="#8895A5" strokeWidth="4" />)}
    </g>
  );
}

function Street({ frame }) {
  const cloudX = (frame * 0.6) % (W + 400) - 200;
  return (
    <g>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7EC8F2" />
          <stop offset="1" stopColor="#FCE9C8" />
        </linearGradient>
      </defs>
      <rect width={W} height={FLOOR_Y} fill="url(#sky)" />
      <g fill="#fff" opacity="0.9">
        <ellipse cx={cloudX} cy="260" rx="120" ry="45" />
        <ellipse cx={cloudX + 80} cy="230" rx="90" ry="50" />
      </g>
      {/* buildings */}
      {[[0, 520, "#E07A5F"], [260, 380, "#F2CC8F"], [520, 600, "#81B29A"], [800, 450, "#E9A07A"]].map(([x, top, c]) => (
        <g key={x}>
          <rect x={x} y={top} width="270" height={FLOOR_Y - top} fill={c} stroke={INK} strokeWidth="6" />
          {Array.from({ length: Math.floor((FLOOR_Y - top - 240) / 150) }).map((_, r) => [0, 1].map(col => (
            <rect key={`${r}-${col}`} x={x + 40 + col * 120} y={top + 60 + r * 150} width="70" height="90" fill="#FFF3D6" stroke={INK} strokeWidth="5" />
          )))}
        </g>
      ))}
      <rect x={300} y={FLOOR_Y - 200} width="120" height="200" fill="#5B3A29" stroke={INK} strokeWidth="6" />
      {/* lamp post */}
      <rect x={930} y={820} width="22" height={FLOOR_Y - 820} fill="#2F3640" />
      <circle cx={941} cy={810} r="34" fill="#FFE08A" stroke={INK} strokeWidth="6" />
      <rect y={FLOOR_Y} width={W} height="260" fill="#C9C2B8" />
      {Array.from({ length: 8 }).map((_, i) => <line key={i} x1={i * 150} y1={FLOOR_Y} x2={i * 150} y2={FLOOR_Y + 260} stroke="#B2AA9F" strokeWidth="5" />)}
      <rect y={FLOOR_Y + 260} width={W} height={H - FLOOR_Y - 260} fill="#55595F" />
      {[0, 1, 2, 3].map(i => <rect key={i} x={40 + i * 280} y={FLOOR_Y + 400} width="160" height="20" fill="#F5F5F5" />)}
    </g>
  );
}

function Home() {
  return (
    <g>
      <rect width={W} height={FLOOR_Y} fill="#F3E2C7" />
      <rect y={FLOOR_Y - 50} width={W} height="50" fill="#E2CBA6" />
      <Window x={620} y={330} w={340} h={460} sky="#A9DBF5" />
      <path d="M600 300 L700 300 Q680 560 720 820 L600 820 Z" fill="#D9534F" stroke={INK} strokeWidth="5" />
      <path d="M980 300 L880 300 Q900 560 860 820 L980 820 Z" fill="#D9534F" stroke={INK} strokeWidth="5" />
      <rect x={140} y={400} width="260" height="190" fill="#fff" stroke="#8B6B4A" strokeWidth="18" />
      <path d="M160 570 L240 470 L300 530 L340 490 L380 570 Z" fill="#81B29A" />
      <circle cx={330} cy={450} r="22" fill="#F2CC8F" />
      {/* sofa */}
      <rect x={40} y={1010} width="560" height="220" rx="50" fill="#5C6BC0" stroke={INK} strokeWidth="6" />
      <rect x={40} y={1150} width="560" height="200" rx="40" fill="#7986CB" stroke={INK} strokeWidth="6" />
      <rect x={20} y={1080} width="90" height="260" rx="40" fill="#5C6BC0" stroke={INK} strokeWidth="6" />
      <rect x={530} y={1080} width="90" height="260" rx="40" fill="#5C6BC0" stroke={INK} strokeWidth="6" />
      {/* lamp */}
      <rect x={846} y={980} width="16" height={FLOOR_Y - 980} fill="#3b3b3b" />
      <path d="M780 860 L930 860 L890 990 L820 990 Z" fill="#FFD27F" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      <rect y={FLOOR_Y} width={W} height={H - FLOOR_Y} fill="#B5835A" />
      {Array.from({ length: 6 }).map((_, i) => <line key={i} x1="0" y1={FLOOR_Y + 90 * (i + 1)} x2={W} y2={FLOOR_Y + 90 * (i + 1)} stroke="#9C6E48" strokeWidth="5" />)}
    </g>
  );
}

function Cafe({ frame }) {
  return (
    <g>
      <rect width={W} height={FLOOR_Y} fill="#F7EBDD" />
      <rect y={FLOOR_Y - 420} width={W} height="420" fill="#8C5A3C" />
      {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={i * 92} y1={FLOOR_Y - 420} x2={i * 92} y2={FLOOR_Y} stroke="#7A4D33" strokeWidth="6" />)}
      {/* menu board */}
      <rect x={110} y={300} width="480" height="380" rx="16" fill="#2E3B32" stroke="#8B6B4A" strokeWidth="18" />
      {[0, 1, 2, 3, 4].map(i => <rect key={i} x={160} y={360 + i * 60} width={200 + (i % 3) * 60} height="18" rx="9" fill="#E8E2D0" opacity="0.8" />)}
      {/* hanging lights, gently swinging */}
      {[700, 860, 1000].map((x, i) => {
        const swing = Math.sin(frame / 30 + i) * 3;
        return (
          <g key={x} transform={`rotate(${swing} ${x} 0)`}>
            <line x1={x} y1="0" x2={x} y2="330" stroke={INK} strokeWidth="5" />
            <path d={`M${x - 55} 400 Q${x} 300 ${x + 55} 400 Z`} fill="#F2B134" stroke={INK} strokeWidth="6" />
            <ellipse cx={x} cy="405" rx="30" ry="12" fill="#FFF3B0" />
          </g>
        );
      })}
      {/* counter + coffee machine */}
      <rect x={620} y={820} width="300" height="140" rx="12" fill="#B0B7BF" stroke={INK} strokeWidth="6" />
      <circle cx={700} cy={890} r="26" fill="#2F3640" />
      <rect x={780} y={860} width="100" height="60" rx="8" fill="#2F3640" />
      <rect x={560} y={FLOOR_Y - 420} width="520" height="40" fill="#5E3A26" stroke={INK} strokeWidth="6" />
      <rect y={FLOOR_Y} width={W} height={H - FLOOR_Y} fill="#E4D3BF" />
      {Array.from({ length: 6 }).map((_, r) => Array.from({ length: 8 }).map((_, c) => (
        (r + c) % 2 === 0 ? <rect key={`${r}-${c}`} x={c * 135} y={FLOOR_Y + r * 90} width="135" height="90" fill="#D2BDA4" /> : null
      )))}
    </g>
  );
}

function Park({ frame }) {
  const cloudX = (frame * 0.5) % (W + 400) - 200;
  return (
    <g>
      <rect width={W} height={FLOOR_Y} fill="#9ED8F5" />
      <circle cx="880" cy="260" r="90" fill="#FFE27A" />
      <g fill="#fff">
        <ellipse cx={cloudX} cy="360" rx="130" ry="48" />
        <ellipse cx={cloudX + 90} cy="330" rx="90" ry="52" />
        <ellipse cx={(cloudX + 600) % (W + 400) - 200} cy="200" rx="100" ry="38" />
      </g>
      <path d={`M0 ${FLOOR_Y - 260} Q270 ${FLOOR_Y - 420} 540 ${FLOOR_Y - 280} T1080 ${FLOOR_Y - 300} L1080 ${FLOOR_Y} L0 ${FLOOR_Y} Z`} fill="#8CCB73" />
      {[[130, 1.1], [930, 1.3], [520, 0.8]].map(([x, s]) => (
        <g key={x} transform={`translate(${x} ${FLOOR_Y - 120}) scale(${s})`}>
          <rect x="-22" y="-260" width="44" height="300" fill="#7A5434" stroke={INK} strokeWidth="6" />
          <circle cx="0" cy="-330" r="140" fill="#4FA65B" stroke={INK} strokeWidth="6" />
          <circle cx="-80" cy="-260" r="90" fill="#5CB868" stroke={INK} strokeWidth="6" />
          <circle cx="80" cy="-250" r="95" fill="#469C52" stroke={INK} strokeWidth="6" />
        </g>
      ))}
      {/* bench */}
      <rect x={620} y={1200} width="300" height="26" rx="8" fill="#B5764A" stroke={INK} strokeWidth="5" />
      <rect x={620} y={1250} width="300" height="26" rx="8" fill="#B5764A" stroke={INK} strokeWidth="5" />
      <rect x={640} y={1276} width="20" height={FLOOR_Y - 1276} fill="#3b3b3b" />
      <rect x={880} y={1276} width="20" height={FLOOR_Y - 1276} fill="#3b3b3b" />
      <rect y={FLOOR_Y} width={W} height={H - FLOOR_Y} fill="#6FB65A" />
      <path d={`M380 ${H} Q520 ${FLOOR_Y + 200} 500 ${FLOOR_Y} L640 ${FLOOR_Y} Q700 ${FLOOR_Y + 200} 860 ${H} Z`} fill="#E3C99A" />
    </g>
  );
}

/* ===================== Story scenes ("Don't Answer After 9") ===================== */

function Sky({ night, frame, dusk = true }) {
  if (night) {
    const stars = [[90, 140], [240, 90], [400, 210], [560, 120], [700, 60], [860, 180], [1000, 100], [150, 330], [480, 360], [930, 330], [330, 470], [780, 440]];
    return (
      <g>
        <rect width={W} height={FLOOR_Y} fill="#141B3A" />
        {stars.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3 + (i % 3)} fill="#fff" opacity={0.5 + 0.5 * Math.abs(Math.sin(frame / 25 + i))} />
        ))}
        <circle cx="820" cy="260" r="90" fill="#F4F1DE" />
        <circle cx="850" cy="240" r="90" fill="#141B3A" opacity="0.25" />
      </g>
    );
  }
  return (
    <g>
      <defs>
        <linearGradient id="duskSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={dusk ? "#4B5D9C" : "#7EC8F2"} />
          <stop offset="0.6" stopColor={dusk ? "#E9906B" : "#CDE9F7"} />
          <stop offset="1" stopColor={dusk ? "#F6C77B" : "#F3EED9"} />
        </linearGradient>
      </defs>
      <rect width={W} height={FLOOR_Y} fill="url(#duskSky)" />
      {dusk && <circle cx="760" cy="900" r="120" fill="#FFD27A" opacity="0.9" />}
    </g>
  );
}

function Mountains({ night }) {
  return (
    <g>
      <path d={`M0 980 L180 640 L330 860 L520 560 L720 880 L900 620 L1080 900 L1080 ${FLOOR_Y} L0 ${FLOOR_Y} Z`} fill={night ? "#1E2748" : "#5B5F8F"} />
      <path d={`M0 1120 L220 900 L420 1060 L640 860 L860 1080 L1080 940 L1080 ${FLOOR_Y} L0 ${FLOOR_Y} Z`} fill={night ? "#18203D" : "#3F4A72"} />
    </g>
  );
}

function OldCar({ x, y, night }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth="6" strokeLinejoin="round">
      <path d="M0 120 L20 60 Q40 40 80 40 L110 0 L250 0 L290 40 L340 46 Q370 52 370 90 L370 140 L0 140 Z" fill="#8A3B3B" />
      <path d="M124 14 L180 14 L180 44 L100 44 Z" fill={night ? "#2B3350" : "#BFE3F2"} />
      <path d="M196 14 L244 14 L276 44 L196 44 Z" fill={night ? "#2B3350" : "#BFE3F2"} />
      <circle cx="80" cy="140" r="34" fill="#222" />
      <circle cx="290" cy="140" r="34" fill="#222" />
      <circle cx="80" cy="140" r="12" fill="#999" />
      <circle cx="290" cy="140" r="12" fill="#999" />
      <rect x="350" y="80" width="22" height="18" rx="4" fill="#FFE9A8" />
    </g>
  );
}

function Gate({ frame, night }) {
  return (
    <g>
      <Sky night={night} frame={frame} />
      <Mountains night={night} />
      {/* road */}
      <path d={`M380 ${FLOOR_Y - 260} L700 ${FLOOR_Y - 260} L1080 ${H} L0 ${H} Z`} fill={night ? "#3A3530" : "#A08A6E"} />
      <rect y={FLOOR_Y - 260} width={W} height={H} fill="none" />
      <path d={`M0 ${FLOOR_Y - 120} L380 ${FLOOR_Y - 260} L0 ${FLOOR_Y - 260} Z`} fill={night ? "#1F3325" : "#5E8C4F"} />
      <path d={`M1080 ${FLOOR_Y - 120} L700 ${FLOOR_Y - 260} L1080 ${FLOOR_Y - 260} Z`} fill={night ? "#1F3325" : "#5E8C4F"} />
      <path d={`M0 ${FLOOR_Y - 120} L380 ${FLOOR_Y - 260} L0 ${H} Z`} fill={night ? "#22382A" : "#6A9A58"} />
      <path d={`M1080 ${FLOOR_Y - 120} L700 ${FLOOR_Y - 260} L1080 ${H} Z`} fill={night ? "#22382A" : "#6A9A58"} />
      {/* stone gate arch */}
      <g stroke={INK} strokeWidth="7" strokeLinejoin="round">
        <rect x="250" y="620" width="110" height={FLOOR_Y - 640} fill={night ? "#4E4A55" : "#8C8697"} />
        <rect x="720" y="620" width="110" height={FLOOR_Y - 640} fill={night ? "#4E4A55" : "#8C8697"} />
        <path d="M230 640 Q540 420 850 640 L850 700 Q540 500 230 700 Z" fill={night ? "#5A5562" : "#9C96A6"} />
        <rect x="390" y="560" width="300" height="80" rx="10" fill={night ? "#4A3424" : "#7A5434"} />
      </g>
      <text x="540" y="614" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="44" fill="#F3E3B5" letterSpacing="4">HOLLOWMERE</text>
      <OldCar x={360} y={FLOOR_Y - 220} night={night} />
      {night && <circle cx={735} cy={FLOOR_Y - 130} r="60" fill="#FFE9A8" opacity="0.18" />}
    </g>
  );
}

function House({ x, w, roof, wall, door, chalk, night, frame }) {
  const top = 640;
  return (
    <g stroke={INK} strokeWidth="6" strokeLinejoin="round">
      <rect x={x} y={top} width={w} height={FLOOR_Y - top} fill={wall} />
      <path d={`M${x - 30} ${top} L${x + w / 2} ${top - 200} L${x + w + 30} ${top} Z`} fill={roof} />
      <rect x={x + 40} y={top + 80} width="90" height="90" fill={night ? "#FFD27A" : "#BFE3F2"} />
      <rect x={x + w - 170} y={FLOOR_Y - 330} width="130" height="330" fill={door} />
      <circle cx={x + w - 60} cy={FLOOR_Y - 160} r="8" fill="#E8C35A" />
      {chalk && (
        <g stroke="none">
          <text x={x + w - 105} y={FLOOR_Y - 250} textAnchor="middle" fontFamily="'Comic Sans MS', 'Segoe Print', cursive" fontWeight="700" fontSize="27" fill="#F5F5F0" transform={`rotate(-6 ${x + w - 105} ${FLOOR_Y - 250})`}>COME</text>
          <text x={x + w - 105} y={FLOOR_Y - 214} textAnchor="middle" fontFamily="'Comic Sans MS', 'Segoe Print', cursive" fontWeight="700" fontSize="22" fill="#F5F5F0" transform={`rotate(-6 ${x + w - 105} ${FLOOR_Y - 214})`}>TOMORROW</text>
        </g>
      )}
    </g>
  );
}

function VillageStreet({ frame, night }) {
  return (
    <g>
      <Sky night={night} frame={frame} dusk={false} />
      <Mountains night={night} />
      <House x={-40} w={380} roof="#7A3E2E" wall={night ? "#6B5D52" : "#D9C4A4"} door="#5B3A29" chalk night={night} frame={frame} />
      <House x={380} w={330} roof="#5E4B6E" wall={night ? "#5F5A55" : "#CDBFA8"} door="#4A3A2A" chalk night={night} frame={frame} />
      <House x={750} w={380} roof="#3E5E4E" wall={night ? "#625A50" : "#E0CFB0"} door="#6A4630" chalk={false} night={night} frame={frame} />
      <rect y={FLOOR_Y} width={W} height={H - FLOOR_Y} fill={night ? "#3C3833" : "#9B8F80"} />
      {Array.from({ length: 5 }).map((_, r) => Array.from({ length: 9 }).map((_, c) => (
        <rect key={`${r}-${c}`} x={c * 130 + (r % 2) * 65 - 40} y={FLOOR_Y + 20 + r * 105} width="110" height="80" rx="24" fill={night ? "#47423C" : "#AFA393"} />
      )))}
    </g>
  );
}

function Lantern({ x, y, frame, scale = 1 }) {
  const flicker = 0.85 + 0.15 * Math.sin(frame * 0.7) * Math.sin(frame * 0.31);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="0" cy="40" r="170" fill="#FFC86B" opacity={0.16 * flicker} />
      <circle cx="0" cy="40" r="90" fill="#FFC86B" opacity={0.22 * flicker} />
      <rect x="-40" y="-10" width="80" height="110" rx="14" fill="#FFE2A0" stroke={INK} strokeWidth="6" />
      <path d="M-50 -10 L50 -10 L30 -40 L-30 -40 Z" fill="#3B3B3B" stroke={INK} strokeWidth="5" />
      <rect x="-50" y="100" width="100" height="16" fill="#3B3B3B" />
      <ellipse cx="0" cy="55" rx={12 * flicker} ry={24 * flicker} fill="#FF9A2E" />
    </g>
  );
}

function GuestRoom({ frame, night }) {
  return (
    <g>
      <rect width={W} height={FLOOR_Y} fill={night ? "#4A3A2E" : "#B98F68"} />
      {Array.from({ length: 13 }).map((_, i) => <line key={i} x1={i * 90} y1="0" x2={i * 90} y2={FLOOR_Y} stroke={night ? "#3C2F25" : "#A07A56"} strokeWidth="6" />)}
      {/* window with the moon */}
      <rect x="110" y="300" width="330" height="400" fill={night ? "#141B3A" : "#BFE3F2"} stroke="#6E5038" strokeWidth="20" />
      {night && <circle cx="330" cy="400" r="50" fill="#F4F1DE" />}
      <line x1="275" y1="300" x2="275" y2="700" stroke="#6E5038" strokeWidth="12" />
      <line x1="110" y1="500" x2="440" y2="500" stroke="#6E5038" strokeWidth="12" />
      {/* door on the right - where the shadow appears */}
      <rect x="720" y="560" width="260" height={FLOOR_Y - 560} fill={night ? "#2E241C" : "#7A5434"} stroke={INK} strokeWidth="7" />
      <rect x="745" y="590" width="210" height="240" fill="none" stroke={night ? "#251D16" : "#6A4630"} strokeWidth="8" />
      <circle cx="950" cy="980" r="12" fill="#E8C35A" />
      {/* bed */}
      <rect x="40" y="1040" width="560" height="200" rx="20" fill="#E8DCC6" stroke={INK} strokeWidth="6" />
      <rect x="40" y="1140" width="560" height="200" rx="16" fill="#7A4E3A" stroke={INK} strokeWidth="6" />
      <rect x="70" y="1000" width="170" height="80" rx="30" fill="#F6F0E4" stroke={INK} strokeWidth="5" />
      <Lantern x={640} y={880} frame={frame} />
      <rect y={FLOOR_Y} width={W} height={H - FLOOR_Y} fill={night ? "#3A2C22" : "#8E6A4C"} />
      {Array.from({ length: 6 }).map((_, i) => <line key={i} x1="0" y1={FLOOR_Y + 90 * (i + 1)} x2={W} y2={FLOOR_Y + 90 * (i + 1)} stroke={night ? "#2E231B" : "#7A5A40"} strokeWidth="5" />)}
    </g>
  );
}

function Well({ frame, night }) {
  const sway = Math.sin(frame / 12) * 4;
  return (
    <g>
      <Sky night={night} frame={frame} dusk />
      <Mountains night={night} />
      {/* trees */}
      {[[80, 1.1], [1000, 1.2]].map(([x, s]) => (
        <g key={x} transform={`translate(${x} ${FLOOR_Y - 60}) scale(${s})`}>
          <rect x="-24" y="-300" width="48" height="320" fill="#4A3424" stroke={INK} strokeWidth="6" />
          <circle cx="0" cy="-380" r="150" fill={night ? "#1E3A2A" : "#3E6B4A"} stroke={INK} strokeWidth="6" />
        </g>
      ))}
      <rect y={FLOOR_Y - 200} width={W} height={H} fill={night ? "#2A2F24" : "#7D8B5A"} />
      {/* the well */}
      <g stroke={INK} strokeWidth="7" strokeLinejoin="round">
        <rect x="430" y="620" width="24" height="420" fill="#5B3A29" />
        <rect x="626" y="620" width="24" height="420" fill="#5B3A29" />
        <path d="M380 640 L540 520 L700 640 Z" fill="#6E4A34" />
        <rect x="440" y="700" width="200" height="22" fill="#5B3A29" />
        <ellipse cx="540" cy="1040" rx="190" ry="50" fill="#1A1A1A" />
        <path d="M350 1040 L350 1180 Q540 1240 730 1180 L730 1040 Q540 1090 350 1040 Z" fill={night ? "#5A5560" : "#9A949F"} />
        {[0, 1, 2, 3].map(i => <line key={i} x1={370 + i * 110} y1={1080 + (i % 2) * 20} x2={420 + i * 110} y2={1180} stroke="#6E6875" strokeWidth="5" />)}
      </g>
      {/* rope going down into the dark */}
      <path d={`M540 712 Q${540 + sway} 880 ${540 + sway * 2} 1045`} fill="none" stroke="#C8A877" strokeWidth="8" />
    </g>
  );
}

function Torch({ x, y, frame, i = 0 }) {
  const f = 0.8 + 0.2 * Math.sin(frame * 0.9 + i * 2) * Math.sin(frame * 0.37 + i);
  return (
    <g>
      <circle cx={x} cy={y - 30} r="160" fill="#FF9A2E" opacity={0.14 * f} />
      <rect x={x - 10} y={y - 10} width="20" height="90" fill="#4A3424" stroke={INK} strokeWidth="4" />
      <path d={`M${x} ${y - 70 * f} Q${x + 28} ${y - 20} ${x} ${y} Q${x - 28} ${y - 20} ${x} ${y - 70 * f} Z`} fill="#FFB347" />
      <path d={`M${x} ${y - 40 * f} Q${x + 12} ${y - 12} ${x} ${y} Q${x - 12} ${y - 12} ${x} ${y - 40 * f} Z`} fill="#FFF1B0" />
    </g>
  );
}

function Carvings({ x, y, glow }) {
  return (
    <g fill="none" stroke={glow ? "#7FE0D0" : "#8C7E6E"} strokeWidth="6" opacity={glow ? 0.85 : 0.7} strokeLinecap="round">
      <circle cx={x} cy={y} r="50" />
      <circle cx={x} cy={y} r="22" />
      <path d={`M${x - 90} ${y + 100} L${x - 40} ${y + 70} L${x} ${y + 100} L${x + 40} ${y + 70} L${x + 90} ${y + 100}`} />
      <path d={`M${x - 70} ${y - 90} Q${x} ${y - 140} ${x + 70} ${y - 90}`} />
      <path d={`M${x - 20} ${y + 140} L${x + 20} ${y + 140} M${x} ${y + 120} L${x} ${y + 170}`} />
    </g>
  );
}

function Tunnel({ frame }) {
  return (
    <g>
      <rect width={W} height={H} fill="#1B1714" />
      {Array.from({ length: 14 }).map((_, r) => Array.from({ length: 7 }).map((_, c) => (
        <rect key={`${r}-${c}`} x={c * 170 + (r % 2) * 85 - 60} y={r * 100} width="160" height="90" rx="10" fill="#2E2722" stroke="#14110F" strokeWidth="5" />
      )))}
      {/* the tunnel going on into darkness */}
      <path d="M340 1380 L340 760 Q540 560 740 760 L740 1380 Z" fill="#0A0807" stroke="#14110F" strokeWidth="10" />
      <Carvings x={170} y={720} />
      <Carvings x={910} y={720} />
      <Torch x={120} y={980} frame={frame} i={0} />
      <Torch x={960} y={980} frame={frame} i={1} />
      <rect y={FLOOR_Y} width={W} height={H - FLOOR_Y} fill="#241E1A" />
      {/* still-warm candle + notebook (Part 3 clue) */}
      <g transform={`translate(540 ${FLOOR_Y + 140})`}>
        <ellipse cx="0" cy="0" rx="120" ry="30" fill="#FFB347" opacity={0.2 + 0.08 * Math.sin(frame * 0.8)} />
        <rect x="-14" y="-70" width="28" height="70" fill="#EFE6D2" stroke={INK} strokeWidth="4" />
        <path d={`M0 -${100 + 6 * Math.sin(frame * 0.9)} Q12 -80 0 -72 Q-12 -80 0 -${100 + 6 * Math.sin(frame * 0.9)} Z`} fill="#FFB347" />
        <rect x="50" y="-30" width="110" height="34" rx="4" fill="#6B2E2E" stroke={INK} strokeWidth="4" transform="rotate(-8 105 -13)" />
      </g>
    </g>
  );
}

function Temple({ frame }) {
  const pulse = 0.7 + 0.3 * Math.sin(frame / 20);
  return (
    <g>
      <rect width={W} height={H} fill="#1E1A24" />
      {/* light rays from the emblem */}
      <g opacity={0.18 * pulse} fill="#FFD27A">
        <path d="M540 640 L200 1380 L360 1380 Z" />
        <path d="M540 640 L880 1380 L720 1380 Z" />
        <path d="M540 640 L480 1380 L600 1380 Z" />
      </g>
      {/* pillars */}
      {[60, 290, 660, 890].map(x => (
        <g key={x} stroke={INK} strokeWidth="6">
          <rect x={x} y="260" width="130" height={FLOOR_Y - 260} fill="#4A4252" />
          <rect x={x - 20} y="230" width="170" height="50" fill="#5A5163" />
          <rect x={x - 20} y={FLOOR_Y - 50} width="170" height="50" fill="#5A5163" />
          <line x1={x + 40} y1="300" x2={x + 40} y2={FLOOR_Y - 60} stroke="#3C3544" strokeWidth="6" />
          <line x1={x + 90} y1="300" x2={x + 90} y2={FLOOR_Y - 60} stroke="#3C3544" strokeWidth="6" />
        </g>
      ))}
      {/* golden sun emblem */}
      <g transform="translate(540 640)">
        <circle r={190} fill="#FFD27A" opacity={0.15 * pulse} />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x="-10" y="-150" width="20" height="50" fill="#E8B04A" transform={`rotate(${i * 30 + frame * 0.2})`} />
        ))}
        <circle r="95" fill="#E8B04A" stroke={INK} strokeWidth="7" />
        <circle r="55" fill="#F6D27A" stroke={INK} strokeWidth="5" />
        <circle r="18" fill="#B5762A" />
      </g>
      <Carvings x={225} y={980} glow />
      <Carvings x={855} y={980} glow />
      <Torch x={230} y={1240} frame={frame} i={2} />
      <Torch x={850} y={1240} frame={frame} i={3} />
      {/* steps + floor */}
      <rect y={FLOOR_Y} width={W} height={H - FLOOR_Y} fill="#2C2633" />
      <rect x="300" y={FLOOR_Y - 40} width="480" height="40" fill="#3A3342" stroke={INK} strokeWidth="5" />
      {/* treasure glints */}
      {[[380, 1300], [700, 1310], [540, 1290]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="60" ry="22" fill="#E8B04A" stroke={INK} strokeWidth="4" />
          <circle cx={x - 20 + i * 10} cy={y - 12} r="6" fill="#fff" opacity={Math.max(0, Math.sin(frame / 8 + i * 2))} />
        </g>
      ))}
    </g>
  );
}

const SCENES = {
  office: Office, street: Street, home: Home, cafe: Cafe, park: Park,
  gate: Gate, village: VillageStreet, room: GuestRoom, well: Well, tunnel: Tunnel, temple: Temple,
};
// Scenes that bring their own darkness and light get a lighter night overlay
export const NIGHT_OVERLAY = { tunnel: 0.15, temple: 0.1 };

export function Background({ scene, frame, night = false }) {
  const Scene = SCENES[scene] || Cafe;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <Scene frame={frame} night={night} />
    </svg>
  );
}
