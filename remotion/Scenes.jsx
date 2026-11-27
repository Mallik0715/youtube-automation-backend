import React from "react";

// Locations drawn in the same flat "Storytime" style as the characters (thin dark outlines, flat
// colours), so people look like they are *in* the place instead of in front of a photo.
// Each scene has two layers:
//   back  - everything behind the characters (walls, furniture, sky), with small moving details
//   front - a few things in front of them (plant leaves, a table edge, rocks) at the screen edges,
//           moved more than the back when the camera pans, which gives depth
// Canvas 1080 x 1920. The wall meets the floor at y=1380; characters stand with their feet near y=1710.
const W = 1080, H = 1920, FY = 1380;
const INK = "#262626";
const O = { stroke: INK, strokeWidth: 5, strokeLinejoin: "round", strokeLinecap: "round" };
const VP = [540, 800]; // vanishing point for floors and corridors
const wave = (frame, speed, phase = 0) => Math.sin(frame * speed + phase);

// ---------- shared pieces ----------
function Sky({ id, night, frame, x = 0, y = 0, w = W, h = FY, sun = true }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={night ? "#141C3F" : "#7CC6F2"} />
          <stop offset="1" stopColor={night ? "#34437A" : "#D9F1FF"} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-sky)`} />
      {night
        ? <g>
            {Array.from({ length: 26 }).map((_, i) => (
              <circle key={i} cx={x + ((i * 137) % w)} cy={y + ((i * 89) % (h * 0.7))} r={2 + (i % 3)} fill="#fff" opacity={0.5 + 0.5 * Math.abs(wave(frame, 0.05, i))} />
            ))}
            <circle cx={x + w * 0.78} cy={y + h * 0.16} r="46" fill="#FFF6D5" />
            <circle cx={x + w * 0.78 + 18} cy={y + h * 0.16 - 10} r="40" fill="#141C3F" opacity="0.9" />
          </g>
        : sun && <circle cx={x + w * 0.8} cy={y + h * 0.15} r="58" fill="#FFE27A" />}
      {!night && <Clouds frame={frame} x={x} y={y} w={w} h={h} />}
    </g>
  );
}
function Cloud({ cx, cy, s = 1, color = "#fff" }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`} fill={color}>
      <ellipse cx="0" cy="0" rx="70" ry="32" />
      <ellipse cx="-42" cy="8" rx="42" ry="24" />
      <ellipse cx="44" cy="6" rx="48" ry="26" />
      <ellipse cx="6" cy="-22" rx="40" ry="30" />
    </g>
  );
}
function Clouds({ frame, x, y, w, h }) {
  return (
    <g opacity="0.95">
      {[0, 1, 2].map(i => {
        const span = w + 400;
        const cx = x - 200 + ((frame * (0.5 + i * 0.25) + i * span * 0.37) % span);
        return <Cloud key={i} cx={cx} cy={y + h * (0.12 + i * 0.12)} s={0.7 + (i % 2) * 0.4} />;
      })}
    </g>
  );
}

// A room seen straight on: back wall, two narrow side walls, wooden floor in perspective
function Room({ wall, side, floor, plank, base = "#FFFFFF", tiles = false }) {
  const yb = FY + 90 * ((FY - VP[1]) / (VP[0] - 90)); // where the side walls meet the screen edge
  const lines = [];
  for (let i = 0; i <= 10; i++) {
    const x0 = 90 + i * 90;
    lines.push(<line key={i} x1={x0} y1={FY} x2={VP[0] + (x0 - VP[0]) * ((H - VP[1]) / (FY - VP[1]))} y2={H} stroke={plank} strokeWidth="4" />);
  }
  return (
    <g>
      <rect x="0" y="0" width={W} height={FY} fill={wall} />
      {tiles && Array.from({ length: 24 }).map((_, i) => <line key={i} x1="90" x2="990" y1={i * 60} y2={i * 60} stroke={side} strokeWidth="3" opacity="0.5" />)}
      {tiles && Array.from({ length: 16 }).map((_, i) => <line key={`v${i}`} x1={90 + i * 60} x2={90 + i * 60} y1="0" y2={FY} stroke={side} strokeWidth="3" opacity="0.5" />)}
      <path d={`M0 0 L90 0 L90 ${FY} L0 ${yb} Z`} fill={side} />
      <path d={`M${W} 0 L990 0 L990 ${FY} L${W} ${yb} Z`} fill={side} />
      <path d={`M0 ${yb} L90 ${FY} L990 ${FY} L${W} ${yb} L${W} ${H} L0 ${H} Z`} fill={floor} />
      {lines}
      {[1470, 1600, 1780].map(y => <line key={y} x1="0" x2={W} y1={y} y2={y} stroke={plank} strokeWidth="3" opacity="0.6" />)}
      <rect x="90" y={FY - 30} width="900" height="30" fill={base} {...O} strokeWidth="4" />
      <line x1="90" y1="0" x2="90" y2={FY} stroke={INK} strokeWidth="4" opacity="0.5" />
      <line x1="990" y1="0" x2="990" y2={FY} stroke={INK} strokeWidth="4" opacity="0.5" />
    </g>
  );
}

function Window({ id, x, y, w, h, frame, night, curtain = null, city = false }) {
  return (
    <g>
      <clipPath id={`${id}-clip`}><rect x={x} y={y} width={w} height={h} /></clipPath>
      <g clipPath={`url(#${id}-clip)`}>
        <Sky id={id} night={night} frame={frame} x={x} y={y} w={w} h={h} sun={false} />
        {city && <Skyline x={x} y={y + h} w={w} night={night} />}
      </g>
      <rect x={x} y={y} width={w} height={h} fill="none" {...O} strokeWidth="14" stroke="#FFFFFF" />
      <rect x={x - 7} y={y - 7} width={w + 14} height={h + 14} fill="none" {...O} />
      <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke="#fff" strokeWidth="12" />
      <line x1={x} y1={y + h * 0.45} x2={x + w} y2={y + h * 0.45} stroke="#fff" strokeWidth="12" />
      <rect x={x - 26} y={y + h} width={w + 52} height="22" rx="6" fill="#F4F4F4" {...O} />
      {curtain && [0, 1].map(i => {
        const sway = wave(frame, 0.03, i * 2) * 6;
        const cx = i ? x + w + 10 : x - 10;
        const dir = i ? -1 : 1;
        return (
          <g key={i}>
            <path d={`M${cx - dir * 50} ${y - 50} L${cx + dir * 70} ${y - 50} Q${cx + dir * 40 + sway} ${y + h * 0.5} ${cx + dir * 64 + sway} ${y + h + 60} L${cx - dir * 50} ${y + h + 60} Z`} fill={curtain} {...O} />
            {[0.3, 0.6].map(k => <path key={k} d={`M${cx - dir * 50 + dir * 110 * k} ${y - 40} Q${cx + dir * 30 * k + sway} ${y + h * 0.5} ${cx - dir * 40 + dir * 100 * k + sway} ${y + h + 50}`} fill="none" stroke={INK} strokeWidth="3" opacity="0.35" />)}
          </g>
        );
      })}
      {curtain && <rect x={x - 80} y={y - 62} width={w + 160} height="16" rx="8" fill="#8A6A4A" {...O} strokeWidth="4" />}
    </g>
  );
}

function Skyline({ x, y, w, night, color }) {
  const c = color || (night ? "#2B3560" : "#9DB7D6");
  const blocks = [[0, 260, 110], [100, 360, 90], [180, 220, 120], [290, 420, 100], [380, 300, 130], [500, 380, 90], [580, 250, 140], [710, 340, 110], [810, 280, 120], [920, 400, 100], [1010, 260, 120]];
  return (
    <g>
      {blocks.filter(([bx]) => bx < w + 40).map(([bx, bh, bw], i) => (
        <g key={i}>
          <rect x={x + bx} y={y - bh} width={bw} height={bh} fill={c} />
          {Array.from({ length: Math.floor(bh / 50) }).map((_, r) => [0, 1].map(k => (
            <rect key={`${r}${k}`} x={x + bx + 18 + k * (bw / 2 - 6)} y={y - bh + 24 + r * 50} width="22" height="26" fill={night ? ((r + k + i) % 3 ? "#FFD86B" : "#3A4778") : "#C9DAEE"} opacity={night ? 0.9 : 0.8} />
          )))}
        </g>
      ))}
    </g>
  );
}

function Plant({ x, y, s = 1, frame = 0, pot = "#D9774B" }) {
  const sway = wave(frame, 0.04, x) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-50, -22, 0, 24, 50].map((a, i) => (
        <path key={i} d={`M0 -60 Q${a * 0.6 + sway} -150 ${a * 1.6 + sway * 2} ${-200 - (i % 2) * 40} Q${a * 0.2} -130 0 -60 Z`} fill={i % 2 ? "#4FAF5B" : "#3E9A4C"} {...O} strokeWidth="4" />
      ))}
      <path d="M-55 -70 L55 -70 L42 0 L-42 0 Z" fill={pot} {...O} />
      <rect x="-60" y="-82" width="120" height="20" rx="6" fill={pot} {...O} />
    </g>
  );
}

function Frame({ x, y, w, h, color = "#8A5A3C", children }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={color} {...O} />
      <rect x={x + 14} y={y + 14} width={w - 28} height={h - 28} fill="#F6EEDC" stroke={INK} strokeWidth="3" />
      {children}
    </g>
  );
}

function WallClock({ x, y, r = 55, frame }) {
  const a = (frame / 30) * 6; // the second hand ticks once a second
  const sec = Math.floor(frame / 30) * 6;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#fff" {...O} strokeWidth="8" />
      {Array.from({ length: 12 }).map((_, i) => <line key={i} x1="0" y1={-r + 8} x2="0" y2={-r + 18} stroke={INK} strokeWidth="4" transform={`rotate(${i * 30})`} />)}
      <line x1="0" y1="0" x2="0" y2={-r * 0.5} stroke={INK} strokeWidth="7" strokeLinecap="round" transform="rotate(-60)" />
      <line x1="0" y1="0" x2="0" y2={-r * 0.75} stroke={INK} strokeWidth="5" strokeLinecap="round" transform={`rotate(${a * 0.02 + 40})`} />
      <line x1="0" y1="8" x2="0" y2={-r * 0.82} stroke="#E04848" strokeWidth="3" transform={`rotate(${sec})`} />
      <circle r="6" fill={INK} />
    </g>
  );
}

function Lamp({ x, y, night, shade = "#F5C26B" }) {
  return (
    <g>
      {night && <circle cx={x} cy={y - 330} r="260" fill="#FFD27A" opacity="0.22" />}
      <line x1={x} y1={y} x2={x} y2={y - 300} stroke={INK} strokeWidth="10" />
      <ellipse cx={x} cy={y} rx="60" ry="14" fill="#555" {...O} />
      <path d={`M${x - 70} ${y - 290} L${x + 70} ${y - 290} L${x + 40} ${y - 400} L${x - 40} ${y - 400} Z`} fill={night ? "#FFE3A3" : shade} {...O} />
    </g>
  );
}

function CeilingLight({ x, y, frame, flicker = false, night }) {
  const on = !flicker || (frame % 97 > 4 && frame % 53 !== 7);
  return (
    <g>
      {on && <path d={`M${x - 120} ${y + 20} L${x + 120} ${y + 20} L${x + 330} ${y + 700} L${x - 330} ${y + 700} Z`} fill="#FFF7D6" opacity={night ? 0.16 : 0.1} />}
      <rect x={x - 130} y={y} width="260" height="26" rx="8" fill={on ? "#FFFBEA" : "#BFC4C9"} {...O} strokeWidth="4" />
    </g>
  );
}

function Fan({ x, y, frame }) {
  const a = frame * 14;
  return (
    <g transform={`translate(${x} ${y})`}>
      <line x1="0" y1="-120" x2="0" y2="0" stroke={INK} strokeWidth="8" />
      <g transform={`scale(1 0.28) rotate(${a})`}>
        {[0, 120, 240].map(r => <rect key={r} x="-14" y="-150" width="28" height="150" rx="12" fill="#8C6B4F" {...O} strokeWidth="6" transform={`rotate(${r})`} />)}
      </g>
      <circle r="18" fill="#6B4E3A" {...O} />
    </g>
  );
}

function Rug({ cx, cy, rx, ry, color, edge }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={color} {...O} />
      <ellipse cx={cx} cy={cy} rx={rx - 30} ry={ry - 14} fill="none" stroke={edge} strokeWidth="6" />
    </g>
  );
}

// ---------- the places ----------
function Home({ frame, night }) {
  return (
    <g>
      <Room wall="#F2D7B6" side="#E2C29C" floor="#C98F5D" plank="#B27C4C" />
      <Window id="home-w" x={330} y={300} w={420} h={480} frame={frame} night={night} curtain="#C25B5B" />
      <Frame x={130} y={380} w={140} h={180}><circle cx="200" cy="450" r="30" fill="#E7B56A" /><path d="M144 540 L180 490 L210 520 L240 470 L256 540 Z" fill="#6BAA75" /></Frame>
      <Frame x={820} y={360} w={130} h={130} color="#4A6C8F"><path d="M834 476 L870 430 L900 455 L936 410 L936 476 Z" fill="#7FB3D5" /></Frame>
      <Lamp x={900} y={1350} night={night} />
      {/* sofa against the wall */}
      <g>
        <rect x={180} y={1060} width={720} height={200} rx="40" fill="#5E7FB8" {...O} />
        <rect x={210} y={1150} width={330} height={130} rx="24" fill="#6F90C9" {...O} />
        <rect x={540} y={1150} width={330} height={130} rx="24" fill="#6F90C9" {...O} />
        <rect x={130} y={1120} width={90} height={230} rx="34" fill="#5E7FB8" {...O} />
        <rect x={860} y={1120} width={90} height={230} rx="34" fill="#5E7FB8" {...O} />
        <rect x={240} y={1100} width={110} height="90" rx="22" fill="#F2C14E" {...O} transform="rotate(-8 295 1145)" />
        <rect x={200} y={1280} width={680} height="40" fill="#4C6A9E" {...O} />
        {[220, 860].map(x => <rect key={x} x={x - 8} y="1320" width="22" height="40" fill="#6B4E3A" {...O} strokeWidth="4" />)}
      </g>
      <Rug cx={540} cy={1560} rx={430} ry={110} color="#D98A6A" edge="#F2C1A0" />
    </g>
  );
}
function HomeFront({ frame }) {
  return <Plant x={60} y={1960} s={1.5} frame={frame} pot="#C86F47" />;
}

function Bedroom({ frame, night, details }) {
  return (
    <g>
      <Room wall="#CFE2F3" side="#B7CFE6" floor="#B98A62" plank="#A47751" />
      <Window id="bed-w" x={620} y={330} w={320} h={420} frame={frame} night={night} curtain="#F2C94C" />
      {has(details, "car") && (
        <g>
          <clipPath id="bed-car"><rect x={620} y={330} width={320} height={420} /></clipPath>
          <g clipPath="url(#bed-car)">
            <rect x={620} y={690} width={320} height={60} fill="#7D8690" />
            <path d="M650 700 Q670 650 730 648 L820 648 Q860 650 880 700 L900 712 L900 740 L640 740 L640 712 Z" fill="#1E1F24" {...O} strokeWidth="4" />
            <path d="M690 700 Q705 664 740 662 L770 662 L770 700 Z M782 700 L782 662 L812 662 Q840 664 852 700 Z" fill="#3B4250" />
            <circle cx="690" cy="740" r="16" fill={INK} /><circle cx="850" cy="740" r="16" fill={INK} />
          </g>
        </g>
      )}
      {/* posters */}
      <rect x={150} y={300} width={170} height={230} fill="#F27B6B" {...O} transform="rotate(-4 235 415)" />
      <circle cx={235} cy={400} r="46" fill="#FFE27A" transform="rotate(-4 235 415)" />
      <rect x={360} y={360} width={150} height={110} fill="#7FC8A9" {...O} transform="rotate(3 435 415)" />
      {/* bed */}
      <g>
        <rect x={120} y={880} width={60} height={480} rx="12" fill="#8A5A3C" {...O} />
        <rect x={150} y={900} width={400} height={220} rx="30" fill="#A06B47" {...O} />
        <rect x={150} y={1140} width={560} height={140} rx="22" fill="#5B7DB1" {...O} />
        <rect x={190} y={1070} width={190} height={90} rx="34" fill="#FFFFFF" {...O} />
        <path d="M330 1150 Q480 1110 710 1140 L710 1280 L330 1280 Z" fill="#6C8FC7" {...O} />
        <rect x={150} y={1280} width={560} height="60" fill="#8A5A3C" {...O} />
      </g>
      {/* bedside table + lamp + phone */}
      <rect x={760} y={1170} width={170} height={190} rx="8" fill="#C28A5C" {...O} />
      <line x1="770" y1="1250" x2="920" y2="1250" stroke={INK} strokeWidth="4" />
      <circle cx="845" cy="1290" r="7" fill={INK} />
      {night && <circle cx={845} cy={1040} r="170" fill="#FFD27A" opacity="0.25" />}
      <line x1="845" y1="1170" x2="845" y2="1080" stroke={INK} strokeWidth="8" />
      <path d="M790 1080 L900 1080 L875 1000 L815 1000 Z" fill={night ? "#FFE3A3" : "#F29E6B"} {...O} />
      <Rug cx={560} cy={1600} rx={380} ry={100} color="#9C88C9" edge="#C4B5E6" />
    </g>
  );
}

function Canteen({ frame, night }) {
  const steam = (x, i) => [0, 1, 2].map(k => {
    const p = ((frame * 0.012 + k / 3 + i * 0.2) % 1);
    return <ellipse key={k} cx={x + Math.sin(p * 6 + i) * 14} cy={980 - p * 200} rx={18 + p * 26} ry={12 + p * 16} fill="#fff" opacity={0.6 * (1 - p)} />;
  });
  return (
    <g>
      <Room wall="#DCEBD3" side="#C3D9B8" floor="#D9D3C4" plank="#BDB6A6" tiles />
      {/* menu board */}
      <rect x={250} y={190} width={580} height={250} rx="12" fill="#2F4A3A" {...O} strokeWidth="8" />
      <text x={540} y={260} textAnchor="middle" fontSize="54" fontWeight="900" fill="#FFE27A" fontFamily="Arial Black, sans-serif">CANTEEN</text>
      {[300, 345, 390].map((y, i) => <g key={y}><line x1={300} x2={600 - i * 40} y1={y} y2={y} stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity="0.8" /><line x1={680} x2={780} y1={y} y2={y} stroke="#FFE27A" strokeWidth="7" strokeLinecap="round" /></g>)}
      <Fan x={260} y={150} frame={frame} />
      <Fan x={830} y={150} frame={frame + 7} />
      {/* serving counter with big pots */}
      <rect x={120} y={1000} width={840} height={60} fill="#B9C3C9" {...O} />
      <rect x={140} y={1060} width={800} height={240} fill="#8FA3AE" {...O} />
      {[260, 470, 680].map((x, i) => (
        <g key={x}>
          <rect x={x - 70} y={920} width={140} height={90} rx="12" fill="#C9CED2" {...O} />
          <rect x={x - 84} y={914} width={168} height={20} rx="8" fill="#AEB5BA" {...O} />
          {steam(x, i)}
        </g>
      ))}
      <rect x={830} y={880} width={90} height={130} rx="8" fill="#E8644A" {...O} />
      {[1100, 1170, 1240].map(y => <line key={y} x1={160} x2={920} y1={y} y2={y} stroke="#7B8F99" strokeWidth="4" />)}
      {/* a long table with benches behind the actors */}
      <rect x={60} y={1330} width={960} height={40} rx="10" fill="#E2A65E" {...O} />
      <rect x={100} y={1370} width={22} height={90} fill="#8A6A4A" {...O} strokeWidth="4" />
      <rect x={958} y={1370} width={22} height={90} fill="#8A6A4A" {...O} strokeWidth="4" />
      {[230, 520, 800].map(x => <g key={x}><rect x={x - 50} y={1310} width={100} height={22} rx="6" fill="#7FB0D8" {...O} strokeWidth="4" /><circle cx={x - 15} cy={1312} r="14" fill="#F2C14E" /></g>)}
    </g>
  );
}
function CanteenFront() {
  return (
    <g>
      <rect x={-40} y={1800} width={360} height={60} rx="12" fill="#E2A65E" {...O} />
      <rect x={20} y={1760} width={140} height={44} rx="8" fill="#7FB0D8" {...O} />
      <circle cx={70} cy={1764} r="22" fill="#F2C14E" {...O} strokeWidth="4" />
      <rect x={760} y={1800} width={360} height={60} rx="12" fill="#E2A65E" {...O} />
      <rect x={880} y={1772} width={110} height={30} rx="8" fill="#F27B6B" {...O} />
    </g>
  );
}

function Classroom({ frame, night }) {
  return (
    <g>
      <Room wall="#F6E6C6" side="#E8D2A8" floor="#C49A6C" plank="#AD855A" />
      {/* chalkboard */}
      <rect x={140} y={360} width={560} height={380} rx="10" fill="#3E6A4E" {...O} strokeWidth="14" stroke="#8A5A3C" />
      <rect x={140} y={360} width={560} height={380} rx="10" fill="none" {...O} />
      <g stroke="#F4F4F4" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.85">
        <path d="M190 430 L260 430 M225 410 L225 450" />
        <path d="M300 420 Q330 400 350 430 Q330 460 300 440" />
        <path d="M400 430 L520 430 M400 470 L560 470 M190 540 Q260 500 330 540 T470 540" />
        <path d="M190 620 L360 620 M190 660 L300 660" />
      </g>
      <rect x={180} y={740} width={480} height="16" fill="#8A5A3C" {...O} strokeWidth="4" />
      <WallClock x={540} y={240} frame={frame} />
      <Window id="class-w" x={760} y={330} w={200} h={430} frame={frame} night={night} />
      <rect x={160} y={190} width={240} height={110} rx="10" fill="#F27B6B" {...O} />
      <text x={280} y={262} textAnchor="middle" fontSize="50" fontWeight="900" fill="#fff" fontFamily="Arial Black, sans-serif">A B C</text>
      {/* teacher's desk */}
      <rect x={130} y={1120} width={340} height={40} rx="8" fill="#A0693F" {...O} />
      <rect x={150} y={1160} width={300} height={200} fill="#8A5A3C" {...O} />
      <rect x={180} y={1070} width={90} height={50} fill="#5B7DB1" {...O} strokeWidth="4" />
      <rect x={290} y={1082} width={80} height={38} fill="#F2C14E" {...O} strokeWidth="4" />
      <circle cx="420" cy="1095" r="22" fill="#E8644A" {...O} strokeWidth="4" />
      {/* rows of student desks */}
      {[560, 800].map(x => (
        <g key={x}>
          <rect x={x - 100} y={1210} width={200} height={26} rx="6" fill="#D8A86C" {...O} />
          <rect x={x - 90} y={1236} width={14} height={124} fill="#6B6B6B" />
          <rect x={x + 76} y={1236} width={14} height={124} fill="#6B6B6B" />
        </g>
      ))}
    </g>
  );
}
function ClassroomFront() {
  return (
    <g>
      <rect x={820} y={1770} width={330} height={36} rx="8" fill="#D8A86C" {...O} />
      <rect x={850} y={1730} width={120} height={42} fill="#5B7DB1" {...O} />
      <rect x={870} y={1700} width={100} height={32} fill="#E8644A" {...O} />
      <rect x={840} y={1806} width={16} height={140} fill="#6B6B6B" />
    </g>
  );
}

// A long school / office corridor going away from the camera (strong perspective)
function Corridor({ frame, night }) {
  const far = { x0: 400, x1: 680, y0: 620, y1: 1040 };
  const lerp = (a, b, k) => a + (b - a) * k;
  // left wall: from screen edge (x 0, top -200, bottom 1560) to the far end
  const L = (k, v) => [lerp(0, far.x0, k), lerp(v === "top" ? -200 : 1560, v === "top" ? far.y0 : far.y1, k)];
  const R = (k, v) => [lerp(W, far.x1, k), lerp(v === "top" ? -200 : 1560, v === "top" ? far.y0 : far.y1, k)];
  const lockers = (side) => {
    const P = side === "L" ? L : R;
    const out = [];
    const steps = [0.08, 0.24, 0.37, 0.48, 0.57, 0.65, 0.72];
    for (let i = 0; i < steps.length - 1; i++) {
      const a = steps[i], b = steps[i + 1];
      const yt = (k) => lerp(P(k, "top")[1], P(k, "bottom")[1], 0.3);
      const yb = (k) => lerp(P(k, "top")[1], P(k, "bottom")[1], 0.93);
      const d = `M${P(a, "top")[0]} ${yt(a)} L${P(b, "top")[0]} ${yt(b)} L${P(b, "top")[0]} ${yb(b)} L${P(a, "top")[0]} ${yb(a)} Z`;
      out.push(<path key={`${side}${i}`} d={d} fill={i % 2 ? "#3F7FBF" : "#4A8BCB"} {...O} strokeWidth={4 - i * 0.4} />);
      const mx = P(lerp(a, b, side === "L" ? 0.8 : 0.8), "top")[0];
      out.push(<line key={`${side}${i}h`} x1={mx} x2={mx} y1={lerp(yt(a), yb(a), 0.42)} y2={lerp(yt(a), yb(a), 0.5)} stroke="#DDE6EE" strokeWidth={6 - i * 0.6} strokeLinecap="round" />);
    }
    return out;
  };
  return (
    <g>
      <rect width={W} height={H} fill="#EFE6D2" />
      {/* ceiling */}
      <path d={`M0 -200 L${W} -200 L${far.x1} ${far.y0} L${far.x0} ${far.y0} Z`} fill="#F7F3EA" />
      {/* walls */}
      <path d={`M0 -200 L${far.x0} ${far.y0} L${far.x0} ${far.y1} L0 1560 Z`} fill="#E8DCC0" />
      <path d={`M${W} -200 L${far.x1} ${far.y0} L${far.x1} ${far.y1} L${W} 1560 Z`} fill="#DCCFB2" />
      {/* floor, shiny */}
      <path d={`M0 1560 L${far.x0} ${far.y1} L${far.x1} ${far.y1} L${W} 1560 L${W} ${H} L0 ${H} Z`} fill="#BFC7CC" />
      {[0.15, 0.35, 0.55, 0.75].map(k => <line key={k} x1={lerp(0, far.x0, k)} x2={lerp(W, far.x1, k)} y1={lerp(1560, far.y1, k)} y2={lerp(1560, far.y1, k)} stroke="#A9B2B8" strokeWidth="4" />)}
      <path d={`M380 1920 L500 ${far.y1} L580 ${far.y1} L700 1920 Z`} fill="#fff" opacity="0.18" />
      {/* far end: a door */}
      <rect x={far.x0} y={far.y0} width={far.x1 - far.x0} height={far.y1 - far.y0} fill="#E2D5B8" {...O} strokeWidth="3" />
      <rect x={490} y={820} width={100} height={220} fill="#9A6B47" {...O} strokeWidth="4" />
      <rect x={510} y={840} width={60} height={50} fill="#BFE3F5" stroke={INK} strokeWidth="3" />
      {lockers("L")}
      {lockers("R")}
      {/* notice board on the right wall */}
      <path d={`M${R(0.06, "top")[0]} ${lerp(R(0.06, "top")[1], 1560, 0.08)} L${R(0.2, "top")[0]} ${lerp(R(0.2, "top")[1], R(0.2, "bottom")[1], 0.1)}`} stroke="none" />
      {/* ceiling lights in perspective */}
      {[0.15, 0.4, 0.6].map((k, i) => {
        const y = lerp(-200, far.y0, k) + 40;
        const half = lerp(260, 50, k);
        const on = !(i === 1 && frame % 89 < 5);
        return <g key={k}>
          {on && <path d={`M${540 - half} ${y} L${540 + half} ${y} L${540 + half * 2.4} ${y + 600 * (1 - k)} L${540 - half * 2.4} ${y + 600 * (1 - k)} Z`} fill="#FFF8DC" opacity="0.08" />}
          <rect x={540 - half} y={y - 10} width={half * 2} height={lerp(26, 8, k)} rx="6" fill={on ? "#FFFDF0" : "#B9BEC2"} {...O} strokeWidth={lerp(4, 2, k)} />
        </g>;
      })}
      {night && <rect width={W} height={H} fill="#0B1030" opacity="0.15" />}
    </g>
  );
}
function CorridorFront() {
  return null;
}

function Hospital({ frame, night }) {
  // heart monitor: a moving ECG line
  const ecg = [];
  for (let i = 0; i <= 40; i++) {
    const x = 790 + i * 4.5;
    const p = (i + frame * 0.8) % 40;
    const y = 540 + (p > 18 && p < 20 ? -40 : p >= 20 && p < 22 ? 30 : p > 14 && p < 16 ? -8 : 0);
    ecg.push(`${x} ${y}`);
  }
  return (
    <g>
      <Room wall="#DDEFEF" side="#C3DFDF" floor="#C9D3D6" plank="#B3BFC2" />
      <Window id="hosp-w" x={360} y={300} w={300} h={360} frame={frame} night={night} />
      {/* curtain rail + privacy curtain */}
      <rect x={100} y={130} width={420} height="12" rx="6" fill="#9AA5AA" {...O} strokeWidth="3" />
      <path d={`M110 140 L250 140 Q${230 + wave(frame, 0.03) * 8} 700 250 1250 L110 1250 Z`} fill="#8FC9C0" {...O} />
      {[150, 200].map(x => <path key={x} d={`M${x} 150 Q${x - 10} 700 ${x} 1240`} fill="none" stroke={INK} strokeWidth="3" opacity="0.3" />)}
      {/* bed */}
      <rect x={300} y={1000} width={30} height={360} fill="#9AA5AA" {...O} />
      <rect x={320} y={1120} width={420} height={110} rx="20" fill="#FFFFFF" {...O} />
      <rect x={340} y={1080} width={150} height={60} rx="24" fill="#F4F4F4" {...O} />
      <path d="M470 1130 Q600 1100 740 1125 L740 1230 L470 1230 Z" fill="#9CC6E8" {...O} />
      <rect x={320} y={1230} width={420} height="34" fill="#9AA5AA" {...O} />
      {[340, 720].map(x => <g key={x}><rect x={x - 6} y="1264" width="14" height="80" fill="#6B777C" /><circle cx={x} cy="1350" r="14" fill={INK} /></g>)}
      {/* heart monitor */}
      <line x1="880" y1="660" x2="880" y2="1350" stroke="#6B777C" strokeWidth="12" />
      <rect x={770} y={460} width={220} height={170} rx="14" fill="#30373B" {...O} />
      <rect x={784} y={474} width={192} height={130} rx="6" fill="#0E2A22" />
      <polyline points={ecg.join(" ")} fill="none" stroke="#5CFF9D" strokeWidth="4" strokeLinejoin="round" />
      <text x={950} y={500} textAnchor="end" fontSize="26" fontWeight="900" fill="#5CFF9D" fontFamily="Arial, sans-serif">{72 + Math.round(wave(frame, 0.02) * 3)}</text>
      {/* IV stand */}
      <line x1="210" y1="700" x2="210" y2="1350" stroke="#9AA5AA" strokeWidth="10" />
      <path d="M180 720 L240 720 L236 820 Q210 840 184 820 Z" fill="#DDF3FF" {...O} strokeWidth="4" />
      <rect x={140} y={1340} width={140} height="14" rx="7" fill="#6B777C" />
      <text x={540} y={230} textAnchor="middle" fontSize="60" fontWeight="900" fill="#E25B5B" fontFamily="Arial Black, sans-serif">+</text>
    </g>
  );
}
function HospitalFront() {
  return <Plant x={1010} y={1960} s={1.3} pot="#7FB0D8" />;
}

function Office({ frame, night, details }) {
  return (
    <g>
      <Room wall="#E9E4DA" side="#D6CFC1" floor="#8E9AA6" plank="#7D8994" base="#D6CFC1" />
      <Window id="off-w" x={150} y={260} w={520} h={560} frame={frame} night={night} city />
      {/* bookshelf */}
      <rect x={740} y={420} width={230} height={940} fill="#9A6B47" {...O} />
      {[600, 780, 960, 1140].map((y, r) => (
        <g key={y}>
          <rect x={750} y={y} width={210} height="14" fill="#7A5236" />
          {[0, 1, 2, 3, 4].map(i => <rect key={i} x={760 + i * 38} y={y - 120 + (i % 2) * 20} width="30" height={120 - (i % 2) * 20} fill={["#E8644A", "#5B7DB1", "#F2C14E", "#6BAA75", "#9C88C9"][(i + r) % 5]} {...O} strokeWidth="3" />)}
        </g>
      ))}
      <CeilingLight x={540} y={60} frame={frame} night={night} />
      <Plant x={680} y={1360} s={1.1} frame={frame} />
      {has(details, "safe") && (
        <g>
          <rect x={360} y={960} width={240} height={260} rx="12" fill="#5E6670" {...O} />
          <rect x={385} y={985} width={190} height={210} rx="8" fill="#6E7680" {...O} strokeWidth="4" />
          <circle cx={480} cy={1090} r="40" fill="#C9CED2" {...O} />
          {Array.from({ length: 8 }).map((_, i) => <line key={i} x1="480" y1="1056" x2="480" y2="1064" stroke={INK} strokeWidth="3" transform={`rotate(${i * 45 + frame * 2} 480 1090)`} />)}
          <rect x={540} y={1060} width="18" height="60" rx="6" fill="#C9CED2" {...O} strokeWidth="3" />
        </g>
      )}
      {/* water cooler */}
      <rect x={130} y={1080} width={110} height={280} rx="10" fill="#E6EAEE" {...O} />
      <rect x={140} y={960} width={90} height={130} rx="30" fill="#9FD6F2" {...O} opacity="0.9" />
    </g>
  );
}

function Meeting({ frame, night }) {
  return (
    <g>
      <Room wall="#E4E9EE" side="#CCD4DC" floor="#6F7C89" plank="#5F6B77" base="#CCD4DC" />
      {/* glass wall with the city */}
      <Window id="meet-w" x={120} y={220} w={460} h={620} frame={frame} night={night} city />
      {/* whiteboard with a chart */}
      <rect x={640} y={330} width={330} height={260} rx="8" fill="#FFFFFF" {...O} />
      <polyline points="670,550 730,500 790,520 850,440 930,380" fill="none" stroke="#E25B5B" strokeWidth="8" strokeLinejoin="round" />
      {[680, 740, 800, 860].map((x, i) => <rect key={x} x={x} y={560 - (i + 1) * 30} width="34" height={(i + 1) * 30} fill="#7FB0D8" opacity="0.7" />)}
      {/* long table */}
      <path d="M140 1220 L940 1220 L1000 1300 L80 1300 Z" fill="#8A5A3C" {...O} />
      <rect x={80} y={1300} width={920} height="30" fill="#6B4E3A" {...O} />
      {[200, 380, 560, 740].map((x, i) => <rect key={x} x={x} y={1160} width="120" height="70" rx="18" fill="#3D4A5A" {...O} />)}
      {[260, 640].map(x => <rect key={x} x={x} y={1196} width="70" height="26" rx="4" fill="#F4F4F4" stroke={INK} strokeWidth="3" />)}
      <CeilingLight x={540} y={60} frame={frame} night={night} />
    </g>
  );
}

function Shop({ frame, night }) {
  const blink = Math.floor(frame / 15) % 2;
  return (
    <g>
      <Room wall="#F4ECF7" side="#E2D3EA" floor="#E8E2DA" plank="#D2CAC0" tiles />
      <rect x={240} y={250} width={600} height={140} rx="20" fill="#6C4AB6" {...O} strokeWidth="7" />
      <text x={540} y={346} textAnchor="middle" fontSize="80" fontWeight="900" fill="#FFE27A" fontFamily="Arial Black, sans-serif">PHONES</text>
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <circle key={i} cx={270 + i * 77} cy={404} r="9" fill={(i + blink) % 2 ? "#FFE27A" : "#fff"} {...O} strokeWidth="3" />)}
      {/* wall shelves with phones on display */}
      {[470, 660, 850].map((y, r) => (
        <g key={y}>
          <rect x={130} y={y + 120} width={820} height="18" rx="4" fill="#B9A3C9" {...O} />
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <g key={i}>
              <rect x={170 + i * 112} y={y + 10} width="58" height="108" rx="10" fill="#2B2D33" {...O} strokeWidth="4" />
              <rect x={177 + i * 112} y={y + 20} width="44" height="84" rx="4" fill={["#7FD3FF", "#FF9EDB", "#9CF2B4", "#FFE27A"][(i + r) % 4]} />
            </g>
          ))}
        </g>
      ))}
      {/* glass counter */}
      <rect x={140} y={1100} width={800} height={30} rx="6" fill="#DDF3FF" {...O} />
      <rect x={160} y={1130} width={760} height={230} fill="#BFE3F5" {...O} opacity="0.9" />
      {[300, 480, 660, 820].map(x => <rect key={x} x={x} y={1200} width="60" height="34" rx="6" fill="#fff" {...O} strokeWidth="3" />)}
      <rect x={760} y={1040} width={110} height={64} rx="8" fill="#2B2D33" {...O} />
      <rect x={770} y={1048} width={90} height={44} rx="4" fill="#5CE1E6" />
    </g>
  );
}

function Street({ frame, night, details }) {
  const shops = [
    { x: -20, w: 380, h: 900, c: "#E8A87C", awning: "#C0392B", sign: "BAKERY" },
    { x: 360, w: 360, h: 1060, c: "#9CC5D8", awning: "#2C7DA0", sign: "BOOKS" },
    { x: 720, w: 380, h: 940, c: "#E6D28A", awning: "#3F8F5F", sign: "CAFE" },
  ];
  const carX = ((frame * 9) % 2400) - 600;
  return (
    <g>
      <Sky id="street" night={night} frame={frame} h={900} />
      <Skyline x={0} y={600} w={W} night={night} color={night ? "#232B52" : "#B9CDE2"} />
      {shops.map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={1280 - s.h} width={s.w} height={s.h} fill={s.c} {...O} />
          {Array.from({ length: Math.floor((s.h - 420) / 170) }).map((_, r) => [0, 1].map(k => (
            <rect key={`${r}${k}`} x={s.x + 50 + k * (s.w / 2 - 20)} y={1280 - s.h + 60 + r * 170} width={s.w / 2 - 90} height="110" fill={night ? ((r + k + i) % 2 ? "#FFD86B" : "#2B3560") : "#DDF2FF"} {...O} strokeWidth="4" />
          )))}
          <rect x={s.x + 30} y={940} width={s.w - 60} height="60" rx="8" fill="#fff" {...O} />
          <text x={s.x + s.w / 2} y={985} textAnchor="middle" fontSize="40" fontWeight="900" fill={s.awning} fontFamily="Arial Black, sans-serif">{s.sign}</text>
          <path d={`M${s.x + 20} 1010 L${s.x + s.w - 20} 1010 L${s.x + s.w} 1080 L${s.x} 1080 Z`} fill={s.awning} {...O} />
          {[0, 1, 2, 3, 4].map(k => <path key={k} d={`M${s.x + k * s.w / 5} 1080 q${s.w / 10} 30 ${s.w / 5} 0`} fill={s.awning} {...O} strokeWidth="4" />)}
          <rect x={s.x + 40} y={1110} width={s.w - 80} height="170" fill={night ? "#FFE3A3" : "#CDEAF7"} {...O} />
        </g>
      ))}
      {/* road behind the pavement, with a passing car */}
      <rect x="0" y="1280" width={W} height="110" fill="#5E6670" />
      <g transform={`translate(${has(details, "car") ? 620 : carX} 1250)`}>
        <rect x="0" y="40" width="300" height="70" rx="24" fill={has(details, "car") ? "#1E1F24" : "#E25B5B"} {...O} />
        <path d="M50 42 Q80 -10 150 -8 Q220 -8 250 42 Z" fill={has(details, "car") ? "#1E1F24" : "#E25B5B"} {...O} />
        <path d="M80 40 Q100 6 145 6 L145 40 Z M160 40 L160 6 Q205 6 225 40 Z" fill="#CDEAF7" stroke={INK} strokeWidth="4" />
        {[70, 230].map(x => <circle key={x} cx={x} cy="110" r="26" fill={INK} />)}
        {night && <path d="M300 60 L560 30 L560 120 L300 90 Z" fill="#FFF3B0" opacity="0.4" />}
      </g>
      {/* pavement */}
      <rect x="0" y="1380" width={W} height={H - 1380} fill="#C9C2B6" />
      <rect x="0" y="1380" width={W} height="24" fill="#A39C90" />
      {[0, 1, 2, 3, 4, 5].map(i => <line key={i} x1={i * 220 - 40} y1="1404" x2={i * 260 - 120} y2={H} stroke="#B3AC9F" strokeWidth="4" />)}
      {/* street lamps */}
      {[120, 960].map(x => (
        <g key={x}>
          {night && <circle cx={x} cy={760} r="200" fill="#FFE08A" opacity="0.2" />}
          <rect x={x - 8} y={760} width="16" height="640" fill="#3D4550" {...O} strokeWidth="3" />
          <path d={`M${x - 40} 760 L${x + 40} 760 L${x + 24} 700 L${x - 24} 700 Z`} fill={night ? "#FFE9A6" : "#5A6470"} {...O} />
        </g>
      ))}
    </g>
  );
}
function StreetFront() {
  return (
    <g>
      <rect x={950} y={1720} width={80} height={140} rx="18" fill="#E25B5B" {...O} />
      <rect x={930} y={1700} width={120} height={36} rx="12" fill="#C84444" {...O} />
      <circle cx={990} cy={1780} r="14" fill="#C84444" {...O} strokeWidth="4" />
    </g>
  );
}

function Tree({ x, y, s = 1, frame = 0, dark = false }) {
  const sway = wave(frame, 0.035, x) * 6;
  const leaf = dark ? ["#2F7A45", "#2A6B3D"] : ["#5DB65E", "#4CA14F"];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-24 0 L-16 -260 L16 -260 L24 0 Z" fill="#8A5A3C" {...O} />
      <g transform={`rotate(${sway * 0.4} 0 -260)`}>
        <circle cx={-90} cy={-330} r="100" fill={leaf[1]} {...O} />
        <circle cx={90} cy={-320} r="105" fill={leaf[1]} {...O} />
        <circle cx={0} cy={-430} r="130" fill={leaf[0]} {...O} />
        <circle cx={-40} cy={-300} r="90" fill={leaf[0]} />
        <circle cx={50} cy={-300} r="90" fill={leaf[0]} />
      </g>
    </g>
  );
}
function Bush({ x, y, s = 1, color = "#4CA14F" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={color} {...O}>
      <circle cx="-60" cy="-40" r="60" />
      <circle cx="60" cy="-40" r="60" />
      <circle cx="0" cy="-80" r="70" />
      <rect x="-110" y="-40" width="220" height="40" stroke="none" />
    </g>
  );
}

function Park({ frame, night }) {
  return (
    <g>
      <Sky id="park" night={night} frame={frame} h={1100} />
      <path d={`M0 1000 Q300 900 600 980 T${W} 960 L${W} ${FY} L0 ${FY} Z`} fill={night ? "#2C4E3A" : "#8CCB7A"} />
      <Tree x={150} y={1200} s={0.8} frame={frame} />
      <Tree x={880} y={1180} s={0.9} frame={frame} />
      <Tree x={560} y={1100} s={0.6} frame={frame} />
      <rect x="0" y="1150" width={W} height={H - 1150} fill={night ? "#2F5A3E" : "#7CC36B"} />
      {/* path */}
      <path d={`M380 ${H} Q460 1500 520 1150 L600 1150 Q680 1500 800 ${H} Z`} fill={night ? "#7A7363" : "#E5D3A6"} />
      {/* bench */}
      <g>
        <rect x={130} y={1230} width={300} height={22} rx="6" fill="#B07A4A" {...O} />
        <rect x={130} y={1190} width={300} height={22} rx="6" fill="#B07A4A" {...O} />
        <rect x={130} y={1268} width={300} height={24} rx="6" fill="#9A6B47" {...O} />
        {[150, 400].map(x => <rect key={x} x={x} y={1290} width="14" height="70" fill="#3D4550" />)}
      </g>
      {/* birds */}
      {!night && [0, 1].map(i => {
        const bx = ((frame * (3 + i) + i * 500) % 1400) - 200;
        const flap = wave(frame, 0.5, i) * 10;
        return <path key={i} d={`M${bx - 24} ${300 + i * 80} q12 ${-10 - flap} 24 0 q12 ${-10 - flap} 24 0`} fill="none" stroke={INK} strokeWidth="5" />;
      })}
      {[100, 300, 700, 950].map((x, i) => <g key={x}>{[0, 1, 2].map(k => <circle key={k} cx={x + k * 22} cy={1420 + (i % 2) * 160} r="9" fill={["#F27B6B", "#FFE27A", "#fff"][k]} />)}</g>)}
    </g>
  );
}
function ParkFront() {
  return (
    <g>
      <Bush x={40} y={1960} s={1.3} />
      <Bush x={1060} y={1960} s={1.2} color="#5DB65E" />
    </g>
  );
}

// Inside a lift: metal walls, closed doors, a floor display that keeps counting
function Lift({ frame, night }) {
  const floorNo = 1 + Math.floor(frame / 60) % 9;
  const lerp = (a, b, k) => a + (b - a) * k;
  return (
    <g>
      <rect width={W} height={H} fill="#AEB8C0" />
      {/* side walls in perspective */}
      <path d={`M0 -100 L200 260 L200 1380 L0 1650 Z`} fill="#98A3AC" />
      <path d={`M${W} -100 L880 260 L880 1380 L${W} 1650 Z`} fill="#8E99A2" />
      {[0.3, 0.65].map(k => <line key={k} x1={lerp(0, 200, k)} y1={lerp(-100, 260, k)} x2={lerp(0, 200, k)} y2={lerp(1650, 1380, k)} stroke="#7F8A93" strokeWidth="4" />)}
      {[0.3, 0.65].map(k => <line key={`r${k}`} x1={lerp(W, 880, k)} y1={lerp(-100, 260, k)} x2={lerp(W, 880, k)} y2={lerp(1650, 1380, k)} stroke="#77828B" strokeWidth="4" />)}
      {/* back wall: the doors */}
      <rect x={200} y={260} width={680} height={1120} fill="#C3CCD3" {...O} strokeWidth="4" />
      <rect x={300} y={420} width={480} height={960} fill="#D7DEE3" {...O} />
      <line x1={540} y1={420} x2={540} y2={1380} stroke={INK} strokeWidth="6" />
      {[0.15, 0.5, 0.85].map(k => <line key={k} x1={300 + 240 * k} y1="440" x2={300 + 240 * k + 60} y2="1360" stroke="#fff" strokeWidth="6" opacity="0.25" />)}
      {/* floor display */}
      <rect x={430} y={300} width={220} height={90} rx="10" fill="#1E2328" {...O} />
      <text x={500} y={370} textAnchor="middle" fontSize="62" fontWeight="900" fill="#FF5A4E" fontFamily="Courier New, monospace">{floorNo}</text>
      <path d={`M590 ${362 - (frame % 30)} l20 -26 l20 26 Z`} fill="#FF5A4E" opacity={frame % 30 < 20 ? 1 : 0.2} />
      {/* button panel */}
      <rect x={810} y={700} width={56} height={300} rx="8" fill="#5E6A73" {...O} strokeWidth="4" />
      {[0, 1, 2, 3, 4, 5].map(i => <circle key={i} cx={838} cy={730 + i * 44} r="14" fill={i === 9 - floorNo || i === 2 ? "#FFE27A" : "#DDE3E7"} stroke={INK} strokeWidth="3" />)}
      {/* ceiling light strip */}
      <rect x={260} y={180} width={560} height="40" rx="10" fill="#FFFBEA" {...O} />
      <path d="M260 220 L820 220 L1000 900 L80 900 Z" fill="#FFF8DC" opacity="0.1" />
      {/* handrail on the back wall */}
      <rect x={200} y={1050} width={680} height="20" rx="10" fill="#E6EAEE" {...O} strokeWidth="4" />
      {/* floor */}
      <path d={`M0 1650 L200 1380 L880 1380 L${W} 1650 L${W} ${H} L0 ${H} Z`} fill="#4E555C" />
      {[1, 2, 3, 4, 5, 6].map(i => <line key={i} x1={200 + i * 97} y1="1380" x2={540 + (200 + i * 97 - 540) * 2.2} y2={H} stroke="#5F676E" strokeWidth="4" />)}
      {night && <rect width={W} height={H} fill="#0B1030" opacity="0.1" />}
    </g>
  );
}

function Radio({ frame, night }) {
  const onAir = Math.floor(frame / 20) % 2 === 0;
  return (
    <g>
      <Room wall="#5A4A6B" side="#4A3C59" floor="#3E3A44" plank="#4B4752" base="#4A3C59" />
      {/* sound foam */}
      {Array.from({ length: 6 }).map((_, r) => Array.from({ length: 7 }).map((_, c) => (
        <rect key={`${r}${c}`} x={130 + c * 120} y={420 + r * 90} width="110" height="80" rx="10" fill={(r + c) % 2 ? "#4A3C59" : "#55466A"} />
      )))}
      {/* ON AIR sign */}
      <rect x={340} y={200} width={400} height={140} rx="20" fill={onAir ? "#E53935" : "#7A2A2A"} {...O} strokeWidth="7" />
      {onAir && <rect x={320} y={180} width={440} height={180} rx="30" fill="#FF5252" opacity="0.25" />}
      <text x={540} y={295} textAnchor="middle" fontSize="80" fontWeight="900" fill={onAir ? "#fff" : "#C88"} fontFamily="Arial Black, sans-serif">ON AIR</text>
      {/* tape machine with spinning reels */}
      <rect x={720} y={600} width={250} height={340} rx="12" fill="#8A8F96" {...O} />
      {[680, 840].map((y, i) => (
        <g key={y} transform={`translate(845 ${y}) rotate(${frame * (i ? 5 : 7)})`}>
          <circle r="64" fill="#3B3F45" {...O} />
          {[0, 120, 240].map(a => <circle key={a} cx="0" cy="-34" r="14" fill="#8A8F96" transform={`rotate(${a})`} />)}
          <circle r="10" fill="#ddd" />
        </g>
      ))}
      {/* mixing desk */}
      <path d="M120 1120 L960 1120 L1000 1240 L80 1240 Z" fill="#2E3238" {...O} />
      {Array.from({ length: 14 }).map((_, i) => {
        const level = 0.5 + 0.5 * Math.abs(Math.sin(frame * 0.15 + i));
        return (
          <g key={i}>
            <rect x={160 + i * 55} y={1140} width="12" height="70" fill="#111" />
            <rect x={150 + i * 55} y={1160 + (1 - level) * 30} width="32" height="16" rx="3" fill="#ddd" stroke={INK} strokeWidth="2" />
            <circle cx={166 + i * 55} cy={1135} r="6" fill={i % 3 === Math.floor(frame / 10) % 3 ? "#5CFF9D" : "#335"} />
          </g>
        );
      })}
      <rect x={80} y={1240} width={920} height={120} fill="#25282D" {...O} />
      {/* microphone on an arm */}
      <path d="M260 1120 L300 900 L400 820" fill="none" stroke="#2B2D33" strokeWidth="12" strokeLinecap="round" />
      <rect x={380} y={760} width={60} height={110} rx="28" fill="#3B3F45" {...O} transform="rotate(-30 410 815)" />
    </g>
  );
}

function Cave({ frame, night, details }) {
  const flick = 0.85 + 0.15 * Math.sin(frame * 0.6) * Math.sin(frame * 0.23);
  return (
    <g>
      <rect width={W} height={H} fill="#3B3340" />
      {/* the way out: light at the cave mouth */}
      <path d="M640 1380 Q620 820 800 700 Q980 820 960 1380 Z" fill={night ? "#2A3866" : "#BFE6FF"} />
      {!night && <path d="M700 1380 Q720 1000 800 900 Q880 1000 900 1380 Z" fill="#E6F6FF" />}
      {/* rock layers */}
      <path d="M0 0 L1080 0 L1080 520 Q900 600 800 560 Q620 480 520 600 Q380 520 240 640 Q120 560 0 640 Z" fill="#4A4150" {...O} />
      <path d="M0 640 Q120 560 240 640 Q120 900 160 1380 L0 1380 Z" fill="#544A5B" {...O} />
      <path d="M1080 520 Q900 600 960 1380 L1080 1380 Z" fill="#544A5B" {...O} />
      {[[300, 600, 90], [450, 560, 70], [620, 520, 110], [920, 580, 80]].map(([x, y, h], i) => <path key={i} d={`M${x - 26} ${y} L${x} ${y + h} L${x + 26} ${y} Z`} fill="#5E5466" {...O} strokeWidth="4" />)}
      {/* floor */}
      <path d={`M0 1380 Q540 1300 1080 1380 L1080 ${H} L0 ${H} Z`} fill="#6A5E63" />
      {[[200, 1500], [860, 1560], [520, 1820]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="70" ry="22" fill="#5B5055" />)}
      {has(details, "flooded") && <g><rect x="0" y="1500" width={W} height={H - 1500} fill="#3F6FA0" opacity="0.75" /><SeaWaves y={1520} frame={frame} night /></g>}
      {/* campfire */}
      <circle cx={360} cy={1250} r={420 * flick} fill="#FF9A3C" opacity="0.18" />
      <g transform="translate(360 1370)">
        {[-50, 0, 50].map((x, i) => <rect key={i} x={x - 70} y={-14} width="140" height="26" rx="12" fill="#7A4A2A" {...O} strokeWidth="4" transform={`rotate(${(i - 1) * 25})`} />)}
        <path d={`M-50 -10 Q-60 ${-90 * flick} 0 ${-170 * flick} Q60 ${-90 * flick} 50 -10 Z`} fill="#FF7A2F" {...O} strokeWidth="4" />
        <path d={`M-26 -10 Q-30 ${-60 * flick} 0 ${-110 * flick} Q30 ${-60 * flick} 26 -10 Z`} fill="#FFD23F" />
        {[0, 1, 2].map(k => {
          const p = ((frame * 0.02 + k / 3) % 1);
          return <circle key={k} cx={Math.sin(p * 8 + k) * 30} cy={-120 - p * 260} r={6 * (1 - p)} fill="#FFD23F" />;
        })}
      </g>
    </g>
  );
}
function CaveFront() {
  return (
    <g>
      <path d="M-20 -20 L300 -20 Q240 80 160 70 L120 220 L80 80 Q20 100 -20 60 Z" fill="#2E2833" {...O} />
      <path d="M1100 -20 L800 -20 Q860 90 940 80 L980 240 L1010 90 Q1060 110 1100 70 Z" fill="#2E2833" {...O} />
      <path d={`M-20 ${H + 20} L-20 1780 Q80 1720 200 1790 Q260 1860 240 ${H + 20} Z`} fill="#3A333F" {...O} />
      <path d={`M1100 ${H + 20} L1100 1760 Q980 1730 900 1810 Q860 1880 880 ${H + 20} Z`} fill="#3A333F" {...O} />
    </g>
  );
}

function SeaWaves({ y, frame, night, color }) {
  return (
    <g>
      {[0, 1, 2, 3].map(r => {
        const yy = y + r * 70;
        const off = (frame * (2 + r)) % 160;
        let d = `M${-160 + off} ${yy}`;
        for (let x = -160 + off; x < W + 160; x += 80) d += ` q20 -14 40 0 q20 14 40 0`;
        return <path key={r} d={d} fill="none" stroke={night ? "#5C74B0" : "#E8F7FF"} strokeWidth="5" opacity={0.7 - r * 0.1} />;
      })}
    </g>
  );
}

function Island({ frame, night, details }) {
  const swell = wave(frame, 0.04) * 10;
  return (
    <g>
      <Sky id="island" night={night} frame={frame} h={1060} />
      <rect x="0" y="900" width={W} height="400" fill={night ? "#22345F" : "#2F9FD6"} />
      <SeaWaves y={950} frame={frame} night={night} />
      {has(details, "storm") && <SeaWaves y={1010} frame={frame * 2} night={night} />}
      {/* shoreline foam moving in and out */}
      <path d={`M0 ${1180 + swell} Q270 ${1150 + swell} 540 ${1180 + swell} T${W} ${1170 + swell} L${W} 1300 L0 1300 Z`} fill={night ? "#3B5590" : "#7FD0EE"} />
      <path d={`M0 ${1200 + swell} Q270 ${1170 + swell} 540 ${1200 + swell} T${W} ${1190 + swell}`} fill="none" stroke="#fff" strokeWidth="10" opacity="0.8" />
      {/* sand */}
      <path d={`M0 1240 Q540 1200 1080 1250 L1080 ${H} L0 ${H} Z`} fill={night ? "#9C8A68" : "#F2D99C"} />
      {[[160, 1500], [840, 1460], [600, 1800], [300, 1700]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="40" ry="8" fill={night ? "#8C7B5B" : "#E2C57F"} />)}
      {/* a small shelter of sticks and leaves - only once the story has built one */}
      {has(details, "shelter") && <g>
        <path d="M640 1300 L800 1080 L960 1300 Z" fill="#7BAA4E" {...O} />
        <path d="M680 1300 L800 1130 L920 1300 Z" fill={night ? "#3A2E26" : "#5A4636"} />
        {[700, 760, 840, 900].map((x, i) => <line key={x} x1={x} y1={1300} x2={800} y2={1080} stroke="#8A5A3C" strokeWidth="6" />)}
      </g>}
      <IslandDetails frame={frame} night={night} details={details} />
      {/* palm tree */}
      <PalmTree x={180} y={1330} frame={frame} />
      {/* driftwood + crate from the wreck */}
      <rect x={380} y={1300} width="170" height="26" rx="13" fill="#A47751" {...O} transform="rotate(-6 465 1313)" />
      <rect x={950} y={1260} width="90" height="80" fill="#B98A5C" {...O} />
      <line x1="950" y1="1300" x2="1040" y2="1300" stroke={INK} strokeWidth="4" />
    </g>
  );
}
function PalmTree({ x, y, frame, s = 1 }) {
  const sway = wave(frame, 0.04, x) * 5;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-18 0 Q-40 -300 20 -560 L48 -556 Q0 -300 18 0 Z" fill="#A47751" {...O} />
      {[-150, -110, -40, 20, 90, 150].map((a, i) => (
        <path key={i} d={`M34 -556 Q${34 + Math.sin((a * Math.PI) / 180) * 140 + sway} ${-640 + Math.abs(a) * 0.3} ${34 + Math.sin((a * Math.PI) / 180) * 280 + sway * 2} ${-470 + Math.abs(a) * 0.9} Q${34 + Math.sin((a * Math.PI) / 180) * 150} ${-570 + Math.abs(a) * 0.4} 34 -556 Z`} fill={i % 2 ? "#3E9A4C" : "#4FAF5B"} {...O} strokeWidth="4" />
      ))}
      {[[20, -540], [50, -530], [34, -510]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="16" fill="#6B4E3A" {...O} strokeWidth="3" />)}
    </g>
  );
}
function IslandFront({ frame }) {
  const sway = wave(frame, 0.05) * 6;
  return (
    <g>
      {[-30, 10, 50].map((a, i) => (
        <path key={i} d={`M1120 ${-40 + i * 60} Q${900 + sway} ${60 + i * 80 + a} ${760 + sway * 2} ${200 + i * 110} Q${920} ${90 + i * 80} 1120 ${-40 + i * 60} Z`} fill={i % 2 ? "#3E9A4C" : "#4FAF5B"} {...O} />
      ))}
      <path d={`M-30 ${H + 20} L-30 1760 Q60 1700 170 1760 Q230 1820 220 ${H + 20} Z`} fill="#8C8790" {...O} />
    </g>
  );
}

function Forest({ frame, night }) {
  const fog = wave(frame, 0.01) * 60;
  return (
    <g>
      <rect width={W} height={H} fill={night ? "#162238" : "#CFE8D2"} />
      {/* far trees, pale */}
      {[60, 260, 470, 690, 900].map((x, i) => <path key={x} d={`M${x} ${1100 - (i % 2) * 80} L${x - 90} 1380 L${x + 90} 1380 Z`} fill={night ? "#1F3348" : "#9CCBA4"} />)}
      {[0, 180, 380, 620, 840, 1040].map((x, i) => <path key={x} d={`M${x} ${900 - (i % 3) * 60} L${x - 130} 1380 L${x + 130} 1380 Z`} fill={night ? "#1A2C3D" : "#79B385"} />)}
      {/* sun rays */}
      {!night && [0, 1, 2].map(i => <path key={i} d={`M${300 + i * 220} 0 L${380 + i * 220} 0 L${200 + i * 260} 1380 L${120 + i * 260} 1380 Z`} fill="#FFFBE0" opacity={0.12 + 0.04 * wave(frame, 0.02, i)} />)}
      {/* near trunks */}
      {[[60, 70], [930, 80], [700, 50]].map(([x, w], i) => (
        <g key={i}>
          <rect x={x - w / 2} y="0" width={w} height="1400" fill={night ? "#3A2E2A" : "#7A5236"} {...O} />
          <path d={`M${x} 300 Q${x + 60} 260 ${x + 110} 200`} fill="none" stroke={night ? "#3A2E2A" : "#7A5236"} strokeWidth="18" strokeLinecap="round" />
        </g>
      ))}
      <path d={`M0 1360 Q540 1300 1080 1360 L1080 ${H} L0 ${H} Z`} fill={night ? "#26392C" : "#5E9B54"} />
      <path d={`M420 ${H} Q480 1600 520 1350 L580 1350 Q640 1600 760 ${H} Z`} fill={night ? "#4A4436" : "#B99A6B"} opacity="0.8" />
      <ellipse cx={540 + fog} cy={1330} rx="760" ry="80" fill="#fff" opacity={night ? 0.08 : 0.25} />
      {night && [0, 1, 2, 3, 4].map(i => <circle key={i} cx={(i * 211 + frame * 0.7) % W} cy={900 + Math.sin(frame * 0.05 + i) * 80 + i * 60} r="5" fill="#E8FF8A" opacity={0.5 + 0.5 * Math.abs(wave(frame, 0.1, i))} />)}
    </g>
  );
}
function ForestFront({ frame }) {
  const sway = wave(frame, 0.05) * 5;
  const fern = (x, flip) => (
    <g transform={`translate(${x} 1960) scale(${flip ? -1 : 1} 1)`}>
      {[-70, -35, 0, 30, 60].map((a, i) => (
        <path key={i} d={`M0 0 Q${a + sway} -140 ${a * 2.4 + sway * 2} -260 Q${a * 1.2} -120 0 0 Z`} fill={i % 2 ? "#2F7A45" : "#3E9A4C"} {...O} strokeWidth="4" />
      ))}
    </g>
  );
  return <g>{fern(60, false)}{fern(1020, true)}</g>;
}

function Deck({ frame, night }) {
  const roll = wave(frame, 0.03) * 1.6;
  return (
    <g>
      <g transform={`rotate(${roll} 540 1000)`}>
        <Sky id="deck" night={night} frame={frame} h={1000} />
        <rect x="-200" y="900" width={W + 400} height="500" fill={night ? "#1E2E58" : "#2A8CC2"} />
        <SeaWaves y={950} frame={frame} night={night} />
      </g>
      {/* gulls */}
      {!night && [0, 1].map(i => {
        const bx = ((frame * (2 + i)) + i * 600) % 1400 - 200;
        return <path key={i} d={`M${bx - 26} ${380 + i * 120} q13 -16 26 0 q13 -16 26 0`} fill="none" stroke={INK} strokeWidth="5" />;
      })}
      {/* mast, sail and ropes */}
      <rect x={760} y={80} width="30" height="1300" fill="#8A5A3C" {...O} />
      <path d={`M790 160 Q${960 + wave(frame, 0.05) * 20} 520 790 900 Z`} fill="#F6F1E4" {...O} />
      <line x1="775" y1="120" x2="120" y2="1300" stroke="#C9A66B" strokeWidth="6" />
      <line x1="775" y1="120" x2="1080" y2="900" stroke="#C9A66B" strokeWidth="6" />
      {/* railing behind the actors */}
      <rect x="0" y="1180" width={W} height="20" fill="#A47751" {...O} />
      <rect x="0" y="1260" width={W} height="18" fill="#A47751" {...O} />
      {[40, 220, 400, 580, 760, 940].map(x => <rect key={x} x={x} y="1180" width="22" height="200" fill="#8A5A3C" {...O} strokeWidth="4" />)}
      {/* deck planks */}
      <rect x="0" y="1380" width={W} height={H - 1380} fill="#C48A55" />
      {[1440, 1530, 1640, 1780].map(y => <line key={y} x1="0" x2={W} y1={y} y2={y} stroke="#A9733F" strokeWidth="5" />)}
      <circle cx={180} cy={1330} r="44" fill="none" stroke="#F2F2F2" strokeWidth="18" />
      <circle cx={180} cy={1330} r="44" fill="none" stroke="#E25B5B" strokeWidth="18" strokeDasharray="34 35" />
    </g>
  );
}
function DeckFront() {
  return (
    <g>
      <rect x={-20} y={1700} width={70} height={260} rx="10" fill="#8A5A3C" {...O} />
      <path d="M40 1760 Q160 1720 220 1800 Q160 1860 40 1840" fill="none" stroke="#C9A66B" strokeWidth="14" strokeLinecap="round" />
    </g>
  );
}

// ---------- places added to match what the scripts describe ----------
const has = (details, k) => Array.isArray(details) && details.includes(k);

function Kitchen({ frame, night, details }) {
  const steam = [0, 1, 2].map(k => {
    const p = ((frame * 0.012 + k / 3) % 1);
    return <ellipse key={k} cx={820 + Math.sin(p * 6 + k) * 14} cy={920 - p * 200} rx={16 + p * 24} ry={10 + p * 14} fill="#fff" opacity={0.6 * (1 - p)} />;
  });
  return (
    <g>
      <Room wall="#F4E3C3" side="#E6CFA5" floor="#B5865C" plank="#9E7350" />
      {/* tiles behind the counter */}
      <rect x={90} y={760} width={900} height={250} fill="#DDEBF0" />
      {Array.from({ length: 15 }).map((_, i) => <line key={i} x1={90 + i * 60} x2={90 + i * 60} y1="760" y2="1010" stroke="#C3D6DD" strokeWidth="3" />)}
      {[820, 880, 940].map(y => <line key={y} x1="90" x2="990" y1={y} y2={y} stroke="#C3D6DD" strokeWidth="3" />)}
      {/* upper cabinets */}
      {[120, 330].map(x => <g key={x}><rect x={x} y={400} width={190} height={260} rx="8" fill="#7FB0A2" {...O} /><circle cx={x + 170} cy={540} r="7" fill={INK} /></g>)}
      <Window id="kit-w" x={560} y={420} w={250} h={260} frame={frame} night={night} />
      {/* counter, sink, stove with a pot */}
      <rect x={90} y={1010} width={900} height={36} fill="#E9E2D6" {...O} />
      <rect x={100} y={1046} width={880} height={300} fill="#8DBBAE" {...O} />
      {[260, 500, 740].map(x => <line key={x} x1={x} y1="1046" x2={x} y2="1346" stroke={INK} strokeWidth="4" />)}
      <rect x={600} y={1000} width={160} height={20} rx="6" fill="#BFC7CC" {...O} strokeWidth="4" />
      <rect x={770} y={960} width={130} height={56} rx="8" fill="#5E6670" {...O} />
      {steam}
      {/* hanging lamp */}
      <line x1="540" y1="0" x2="540" y2="260" stroke={INK} strokeWidth="5" />
      {night && <circle cx={540} cy={420} r="330" fill="#FFD27A" opacity="0.18" />}
      <path d="M470 260 L610 260 L580 320 L500 320 Z" fill={night ? "#FFE3A3" : "#E8644A"} {...O} />
      {/* the kitchen table everyone sits around */}
      <rect x={180} y={1250} width={720} height={44} rx="10" fill="#C98A52" {...O} />
      <rect x={220} y={1294} width={24} height={120} fill="#8A5A3C" {...O} strokeWidth="4" />
      <rect x={836} y={1294} width={24} height={120} fill="#8A5A3C" {...O} strokeWidth="4" />
      {(has(details, "dinner") || night) && [330, 540, 750].map(x => (
        <g key={x}><ellipse cx={x} cy={1246} rx="60" ry="14" fill="#fff" {...O} strokeWidth="4" /><ellipse cx={x} cy={1240} rx="34" ry="8" fill="#F2B83E" /></g>
      ))}
      {has(details, "coins") && [[400, 1236], [430, 1230], [460, 1238], [500, 1232], [530, 1240], [380, 1242]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="16" ry="7" fill="#F2C14E" {...O} strokeWidth="3" />)}
      {has(details, "coins") && <rect x={600} y={1210} width={70} height={36} rx="8" fill="#D9774B" {...O} strokeWidth="4" />}
      {has(details, "papers") && <g><rect x={600} y={1226} width={150} height={20} fill="#fff" {...O} strokeWidth="3" transform="rotate(-4 675 1236)" /><rect x={760} y={1212} width={14} height={36} fill="#2B5BA8" {...O} strokeWidth="3" transform="rotate(30 767 1230)" /></g>}
    </g>
  );
}
function KitchenFront() {
  return (
    <g>
      <rect x={-30} y={1640} width={150} height={40} rx="10" fill="#C98A52" {...O} />
      <rect x={0} y={1680} width={22} height={260} fill="#8A5A3C" {...O} strokeWidth="4" />
      <rect x={-30} y={1460} width={30} height={200} fill="#8A5A3C" {...O} strokeWidth="4" />
    </g>
  );
}

// The building's basement: lift motor, fuse box, a janitor's old desk under one swinging bulb
function ControlRoom({ frame, night, details }) {
  const swing = Math.sin(frame * 0.05) * 8;
  const on = frame % 113 > 5 && frame % 47 !== 3;
  const bx = 540 + Math.sin((swing * Math.PI) / 180) * 260, by = 260;
  return (
    <g>
      <Room wall="#6E7378" side="#5C6166" floor="#4F5459" plank="#5A5F64" base="#5C6166" />
      {/* concrete blocks */}
      {Array.from({ length: 12 }).map((_, r) => <line key={r} x1="90" x2="990" y1={100 + r * 105} y2={100 + r * 105} stroke="#62676C" strokeWidth="4" />)}
      {/* pipes */}
      <rect x={60} y={60} width={980} height={30} rx="15" fill="#8A6A4A" {...O} />
      <rect x={60} y={120} width={980} height={22} rx="11" fill="#7F8890" {...O} />
      <rect x={940} y={60} width={30} height={700} rx="15" fill="#8A6A4A" {...O} />
      {/* lift motor: a big wheel with cables going up the shaft */}
      <g transform="translate(270 780)">
        <line x1="-60" y1="-780" x2="-60" y2="0" stroke="#2B2D33" strokeWidth="8" />
        <line x1="60" y1="-780" x2="60" y2="0" stroke="#2B2D33" strokeWidth="8" />
        <g transform={`rotate(${frame * 0.6})`}>
          <circle r="120" fill="#9AA5AA" {...O} />
          <circle r="90" fill="#7F8A93" {...O} strokeWidth="4" />
          {[0, 60, 120].map(a => <rect key={a} x="-8" y="-90" width="16" height="180" fill="#5E6A73" transform={`rotate(${a})`} />)}
          <circle r="24" fill="#3B3F45" {...O} />
        </g>
        <rect x={-160} y={120} width={320} height={300} rx="10" fill="#5E6A73" {...O} />
        <text x="0" y="200" textAnchor="middle" fontSize="34" fontWeight="900" fill="#FFD23F" fontFamily="Arial Black, sans-serif">LIFT 1</text>
        <path d="M-120 230 L120 230" stroke="#FFD23F" strokeWidth="10" strokeDasharray="20 14" />
      </g>
      {/* fuse box */}
      <rect x={760} y={420} width={150} height={220} rx="8" fill="#9AA5AA" {...O} />
      {[0, 1, 2].map(i => <g key={i}><rect x={784 + i * 40} y={470} width="22" height="60" fill="#3B3F45" /><rect x={784 + i * 40} y={i === 1 ? 470 : 500} width="22" height="30" fill="#E25B5B" stroke={INK} strokeWidth="3" /></g>)}
      <circle cx="835" cy="590" r="10" fill={on ? "#5CFF9D" : "#335"} />
      {/* the janitor's desk with an old monitor showing the lift's floor */}
      <rect x={560} y={1060} width={380} height={36} fill="#8A6A4A" {...O} />
      <rect x={580} y={1096} width={340} height={250} fill="#6B5038" {...O} />
      <rect x={720} y={900} width={170} height={150} rx="14" fill="#C9C2B0" {...O} />
      <rect x={738} y={918} width={134} height={100} rx="8" fill="#0E2A22" />
      <text x={805} y={990} textAnchor="middle" fontSize="54" fontWeight="900" fill="#5CFF9D" fontFamily="Courier New, monospace">{13 + (Math.floor(frame / 45) % 2)}</text>
      {has(details, "newspaper") && <g transform="rotate(-6 640 1050)"><rect x={590} y={1030} width={120} height={34} fill="#E9D48A" {...O} strokeWidth="3" /><line x1="600" y1="1044" x2="690" y2="1044" stroke={INK} strokeWidth="4" /></g>}
      {/* mop and bucket */}
      <path d="M480 1360 L520 1360 L514 1290 L486 1290 Z" fill="#E8C35A" {...O} />
      <line x1="500" y1="1290" x2="470" y2="980" stroke="#A47751" strokeWidth="10" />
      {/* the hidden panel: open once the script finds what's behind it */}
      {(has(details, "panel") || has(details, "microphone")) && (
        <g>
          <rect x={150} y={1130} width={220} height={190} fill="#2B2D33" {...O} />
          <rect x={120} y={1130} width={30} height={190} fill="#7F8890" {...O} transform="rotate(-20 135 1225)" />
          <rect x={170} y={1250} width={110} height={56} rx="6" fill="#8A8F96" {...O} strokeWidth="4" />
          <circle cx="200" cy="1278" r="14" fill="#3B3F45" /><circle cx="250" cy="1278" r="14" fill="#3B3F45" />
          <rect x={300} y={1170} width={30} height={60} rx="14" fill="#3B3F45" {...O} strokeWidth="4" />
          <path d="M180 1240 Q220 1170 260 1240" fill="#5E7FB8" {...O} strokeWidth="4" />
        </g>
      )}
      {/* one swinging bulb */}
      <line x1="540" y1="0" x2={bx} y2={by} stroke={INK} strokeWidth="4" />
      {on && <circle cx={bx} cy={by + 20} r="300" fill="#FFE9A6" opacity="0.13" />}
      <circle cx={bx} cy={by + 20} r="22" fill={on ? "#FFF3B0" : "#9AA5AA"} {...O} strokeWidth="4" />
      <rect width={W} height={H} fill="#000" opacity={on ? 0.08 : 0.3} />
    </g>
  );
}

// Jungle cliff: coconut palms on top of crumbling rock, a stream running down into a pool
function Cliff({ frame, night, details }) {
  const flow = (frame * 6) % 80;
  return (
    <g>
      <Sky id="cliff" night={night} frame={frame} h={1100} />
      <path d="M0 900 Q300 820 560 900 L560 1380 L0 1380 Z" fill={night ? "#1F3348" : "#7DBA7E"} />
      {/* the cliff */}
      <path d="M520 1380 L560 600 Q600 440 700 400 L1080 380 L1080 1380 Z" fill={night ? "#4A4150" : "#A88B6E"} {...O} />
      {[[620, 700], [760, 560], [880, 820], [700, 980], [960, 1100], [800, 1200]].map(([x, y], i) => <path key={i} d={`M${x} ${y} l60 -20 l40 30`} fill="none" stroke={INK} strokeWidth="4" opacity="0.5" />)}
      {/* crumbling rocks falling now and then */}
      {[0, 1].map(i => {
        const p = ((frame * 0.01 + i * 0.5) % 1);
        return p < 0.35 && <rect key={i} x={600 + i * 40} y={460 + p * 2400} width="20" height="16" rx="4" fill="#8C7158" {...O} strokeWidth="3" transform={`rotate(${p * 900} ${610 + i * 40} ${468 + p * 2400})`} />;
      })}
      {/* palms with coconuts on top */}
      {[780, 960].map((x, i) => <PalmTree key={x} x={x} y={410} s={0.75 - i * 0.1} frame={frame} />)}
      {/* stream: from the jungle on the left down into a pool */}
      <path d="M0 1080 Q160 1100 260 1180 Q340 1250 300 1380 L180 1380 Q210 1260 150 1200 Q80 1150 0 1150 Z" fill={night ? "#2C4A7A" : "#5BB8E8"} {...O} />
      {[0, 1, 2].map(k => <path key={k} d={`M${30 + k * 50} ${1110 + k * 20} q40 ${10 + flow / 8} 80 30`} fill="none" stroke="#fff" strokeWidth="4" opacity={0.7 - k * 0.15} strokeDasharray="20 60" strokeDashoffset={-flow} />)}
      <path d={`M0 1380 Q540 1320 1080 1380 L1080 ${H} L0 ${H} Z`} fill={night ? "#26392C" : "#5E9B54"} />
      <ellipse cx={240} cy={1440} rx="220" ry="40" fill={night ? "#2C4A7A" : "#5BB8E8"} {...O} />
      <ellipse cx={240} cy={1440} rx="150" ry="22" fill="none" stroke="#fff" strokeWidth="4" opacity="0.5" />
      {[[80, 1360], [440, 1350]].map(([x, y], i) => <Bush key={i} x={x} y={y} s={0.6} color={night ? "#2F5A3E" : "#4CA14F"} />)}
    </g>
  );
}

// The men's camp on the north beach: tent, a radio on a crate, a small boat tied to the rocks
function Camp({ frame, night, details }) {
  const bob = Math.sin(frame * 0.06) * 6;
  const blink = Math.floor(frame / 12) % 2;
  return (
    <g>
      <Sky id="camp" night={night} frame={frame} h={1000} />
      <rect x="0" y="880" width={W} height="400" fill={night ? "#22345F" : "#2F9FD6"} />
      <SeaWaves y={930} frame={frame} night={night} />
      {/* rocks on the right with the boat tied to them */}
      <path d="M760 1200 Q800 1080 900 1090 Q1000 1060 1080 1120 L1080 1260 L760 1260 Z" fill="#8C8790" {...O} />
      <g transform={`translate(560 ${1110 + bob}) rotate(${bob * 0.4})`}>
        <path d="M0 0 L240 0 L210 60 L30 60 Z" fill="#E8E2D0" {...O} />
        <rect x="160" y="-40" width="50" height="40" fill="#5E6670" {...O} strokeWidth="4" />
        <line x1="10" y1="-4" x2="10" y2="-70" stroke={INK} strokeWidth="5" />
      </g>
      <path d={`M800 1130 Q720 ${1160 + bob} 640 ${1110 + bob}`} fill="none" stroke="#C9A66B" strokeWidth="6" />
      <path d={`M0 1200 Q540 1170 1080 1220 L1080 ${H} L0 ${H} Z`} fill={night ? "#9C8A68" : "#F2D99C"} />
      {/* tent */}
      <path d="M80 1340 L260 1080 L440 1340 Z" fill="#E8783C" {...O} />
      <path d="M260 1080 L230 1340 L290 1340 Z" fill="#B9562A" {...O} strokeWidth="4" />
      {/* lantern */}
      {night && <circle cx={480} cy={1250} r="160" fill="#FFD27A" opacity="0.25" />}
      <rect x={462} y={1236} width="36" height="50" rx="8" fill={night ? "#FFE3A3" : "#F2C14E"} {...O} strokeWidth="4" />
      {/* crate with the radio */}
      <rect x={560} y={1250} width={180} height={110} fill="#B98A5C" {...O} />
      <line x1="560" y1="1305" x2="740" y2="1305" stroke={INK} strokeWidth="4" />
      <rect x={590} y={1186} width={120} height={66} rx="8" fill="#4E5A4A" {...O} />
      <circle cx="620" cy="1219" r="16" fill="#2B2D33" />
      <rect x={648} y={1200} width="46" height="18" fill="#C8F06B" stroke={INK} strokeWidth="3" />
      <circle cx="690" cy="1238" r="6" fill={blink ? "#FF5252" : "#552222"} />
      <line x1="700" y1="1186" x2="730" y2="1110" stroke={INK} strokeWidth="5" />
      {/* barrels */}
      <rect x={880} y={1250} width={90} height={120} rx="12" fill="#3F6FA0" {...O} />
      <line x1="880" y1="1290" x2="970" y2="1290" stroke={INK} strokeWidth="4" />
    </g>
  );
}

// Island extras the narration asks for: footprints, a boat or ship on the horizon, signal smoke, a fire
function IslandDetails({ frame, night, details }) {
  return (
    <g>
      {has(details, "ship") && (
        <g transform={`translate(${470 - frame * 0.08} 905)`}>
          <rect x="40" y="-46" width="60" height="30" fill="#F4F4F4" {...O} strokeWidth="3" />
          <rect x="80" y="-70" width="14" height="24" fill="#E25B5B" stroke={INK} strokeWidth="3" />
          <path d="M0 -16 L150 -16 L132 10 L18 10 Z" fill="#2E4A6B" {...O} strokeWidth="3" />
        </g>
      )}
      {has(details, "boat") && (
        <g transform={`translate(${940 + Math.sin(frame * 0.01) * 30} ${915 + Math.sin(frame * 0.07) * 3})`}>
          <path d="M0 0 L70 0 L60 16 L10 16 Z" fill="#fff" {...O} strokeWidth="3" />
          <rect x="40" y="-14" width="18" height="14" fill="#5E6670" stroke={INK} strokeWidth="3" />
        </g>
      )}
      {has(details, "footprints") && [[540, 1880], [600, 1790], [560, 1700], [620, 1620], [580, 1550], [640, 1490], [610, 1430], [660, 1380]].map(([x, y], i) => {
        const s = 0.4 + (y - 1300) / 900;
        return <ellipse key={i} cx={x + (i % 2 ? 34 : 0) * s} cy={y} rx={20 * s} ry={10 * s} fill={night ? "#6E5E42" : "#C9A869"} />;
      })}
      {(has(details, "smoke") || has(details, "fire")) && (
        <g transform="translate(470 1320)">
          {night && <circle cx="0" cy="-40" r="220" fill="#FF9A3C" opacity="0.2" />}
          {[-30, 0, 30].map((x, i) => <rect key={i} x={x - 50} y={-10} width="100" height="18" rx="9" fill="#7A4A2A" {...O} strokeWidth="3" transform={`rotate(${(i - 1) * 25})`} />)}
          <path d={`M-34 -6 Q-40 ${-70 - Math.sin(frame * 0.6) * 10} 0 ${-120 - Math.sin(frame * 0.5) * 12} Q40 -70 34 -6 Z`} fill="#FF7A2F" {...O} strokeWidth="4" />
          <path d="M-16 -6 Q-18 -50 0 -78 Q18 -50 16 -6 Z" fill="#FFD23F" />
          {has(details, "smoke") && [0, 1, 2, 3, 4].map(k => {
            const p = ((frame * 0.008 + k / 5) % 1);
            return <circle key={k} cx={Math.sin(p * 5 + k) * 40 + p * 120} cy={-140 - p * 900} r={30 + p * 70} fill="#8C8C8C" opacity={0.6 * (1 - p)} />;
          })}
        </g>
      )}
    </g>
  );
}

// Rain and lightning, drawn in front of everyone
function Storm({ frame, outdoor }) {
  const flash = frame % 150 < 4 || (frame % 150 > 8 && frame % 150 < 11);
  return (
    <g>
      {outdoor && <rect width={W} height={H} fill="#0B1226" opacity="0.25" />}
      {outdoor && Array.from({ length: 70 }).map((_, i) => {
        const x = (i * 97 + frame * 6) % (W + 200) - 100;
        const y = (i * 263 + frame * 48) % (H + 200) - 100;
        return <line key={i} x1={x} y1={y} x2={x - 18} y2={y + 70} stroke="#CFE3FF" strokeWidth="4" opacity="0.55" />;
      })}
      {flash && <rect width={W} height={H} fill="#fff" opacity="0.5" />}
    </g>
  );
}
const OUTDOOR = new Set(["island", "shore", "forest", "deck", "street", "park", "cliff", "camp", "village", "gate"]);

// Old village street: cottages with a warning painted on the doors, a bell tower, lanterns, cobblestones
function Cottage({ x, w, h, wall, roof, night, sign, lit, frame }) {
  const top = 1300 - h;
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={wall} {...O} />
      <path d={`M${x - 30} ${top + 10} L${x + w / 2} ${top - 150} L${x + w + 30} ${top + 10} Z`} fill={roof} {...O} />
      <rect x={x + w * 0.62} y={top - 120} width="40" height="80" fill="#7A6A5A" {...O} strokeWidth="4" />
      {/* window, lit from inside at night */}
      <rect x={x + 30} y={top + 60} width={w * 0.34} height="110" fill={night && lit ? "#FFD27A" : night ? "#2B3560" : "#BFE3F5"} {...O} />
      <line x1={x + 30 + w * 0.17} y1={top + 60} x2={x + 30 + w * 0.17} y2={top + 170} stroke={INK} strokeWidth="4" />
      {night && lit && <rect x={x + 10} y={top + 40} width={w * 0.34 + 40} height="150" fill="#FFD27A" opacity="0.15" />}
      {/* the door with the warning painted on it */}
      <rect x={x + w - 160} y={1300 - 240} width="130" height="240" fill="#6B4E3A" {...O} />
      <circle cx={x + w - 50} cy={1300 - 120} r="7" fill="#E8C35A" />
      {sign && (
        <g transform={`rotate(-4 ${x + w - 95} ${1300 - 160})`}>
          {["WHEN THE", "FOG COMES,", "STAY", "INSIDE"].map((t, i) => (
            <text key={i} x={x + w - 95} y={1300 - 200 + i * 30} textAnchor="middle" fontSize="23" fontWeight="900" fill="#F2EDE2" fontFamily="Arial Black, sans-serif" opacity="0.9">{t}</text>
          ))}
        </g>
      )}
    </g>
  );
}

function Village({ frame, night, details }) {
  const ringing = has(details, "bell");
  const swing = ringing ? Math.sin(frame * 0.35) * 22 : 0;
  return (
    <g>
      <Sky id="village" night={night} frame={frame} h={1000} />
      <path d="M0 900 Q200 760 420 860 Q620 700 820 840 Q960 760 1080 820 L1080 1300 L0 1300 Z" fill={night ? "#1F2B45" : "#9BB7A0"} />
      {/* bell tower in the middle distance */}
      <g>
        <rect x={440} y={380} width={200} height={920} fill={night ? "#6E6A72" : "#B8AFA3"} {...O} />
        <path d="M420 390 L540 230 L660 390 Z" fill={night ? "#4A3F4E" : "#8C4A3A"} {...O} />
        <path d="M480 560 L480 470 Q540 410 600 470 L600 560 Z" fill="#1E1E28" {...O} />
        <g transform={`rotate(${swing} 540 470)`}>
          <line x1="540" y1="470" x2="540" y2="490" stroke={INK} strokeWidth="6" />
          <path d="M510 545 Q512 492 540 488 Q568 492 570 545 Z" fill="#C9A227" {...O} />
          <circle cx="540" cy="552" r="8" fill="#8A6A1A" {...O} strokeWidth="3" />
        </g>
        {ringing && [0, 1, 2].map(k => {
          const p = ((frame * 0.03 + k / 3) % 1);
          return <g key={k} fill="none" stroke="#F2D06B" strokeWidth="5" opacity={1 - p}>
            <path d={`M${470 - p * 90} ${470 - p * 40} Q${450 - p * 110} 520 ${470 - p * 90} ${570 + p * 40}`} />
            <path d={`M${610 + p * 90} ${470 - p * 40} Q${630 + p * 110} 520 ${610 + p * 90} ${570 + p * 40}`} />
          </g>;
        })}
        <circle cx="540" cy="700" r="56" fill="#F4F0E6" {...O} />
        <line x1="540" y1="700" x2="540" y2="660" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <line x1="540" y1="700" x2="512" y2="716" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      </g>
      {/* cottages either side */}
      <Cottage x={-40} w={380} h={560} wall={night ? "#8C7F70" : "#E2D3B8"} roof={night ? "#3E3440" : "#9A5B3E"} night={night} sign lit frame={frame} />
      <Cottage x={740} w={380} h={600} wall={night ? "#7F8A8C" : "#D7DCD2"} roof={night ? "#33384A" : "#5E6E8C"} night={night} sign lit={false} frame={frame} />
      {/* the warning, painted big on the tower wall */}
      <text x={540} y={880} textAnchor="middle" fontSize="30" fontWeight="900" fill="#B3261E" fontFamily="Arial Black, sans-serif" opacity="0.85">STAY INSIDE</text>
      {/* cobbled street */}
      <rect x="0" y="1300" width={W} height={H - 1300} fill={night ? "#5A5560" : "#B5ADA2"} />
      {Array.from({ length: 6 }).map((_, r) => Array.from({ length: 9 }).map((_, c) => {
        const y = 1330 + r * (40 + r * 22);
        const x = c * 130 + (r % 2) * 65 - 40;
        return <ellipse key={`${r}${c}`} cx={x} cy={y} rx={50 + r * 8} ry={14 + r * 5} fill={night ? "#66616C" : "#C4BDB2"} stroke={night ? "#4A4650" : "#A39C90"} strokeWidth="3" />;
      }))}
      {/* lanterns */}
      {[380, 700].map(x => (
        <g key={x}>
          {night && <circle cx={x} cy={1000} r="150" fill="#FFC15E" opacity={0.18 + 0.04 * Math.sin(frame * 0.3 + x)} />}
          <rect x={x - 7} y={1010} width="14" height="300" fill="#3D3540" {...O} strokeWidth="3" />
          <rect x={x - 26} y={960} width="52" height="60" rx="8" fill={night ? "#FFD27A" : "#E8D9A8"} {...O} strokeWidth="4" />
        </g>
      ))}
    </g>
  );
}

// Fog: soft banks rolling across, thick at the ground. Drawn in front of the characters (it swallows their legs)
function Fog({ frame, outdoor }) {
  const id = "fog-blur";
  const banks = [
    { y: 1700, rx: 900, ry: 170, speed: 0.6, o: 0.75 },
    { y: 1480, rx: 800, ry: 150, speed: -0.45, o: 0.55 },
    { y: 1200, rx: 700, ry: 140, speed: 0.35, o: 0.45 },
    { y: 900, rx: 650, ry: 130, speed: -0.25, o: 0.3 },
  ];
  return (
    <g opacity={outdoor ? 1 : 0.35}>
      <defs><filter id={id} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40" /></filter></defs>
      <g filter={`url(#${id})`}>
        {banks.map((b, i) => [0, 1].map(k => {
          const span = W + b.rx * 2;
          const cx = ((frame * b.speed * 3 + k * span / 2 + i * 300) % span + span) % span - b.rx;
          return <ellipse key={`${i}${k}`} cx={cx} cy={b.y + Math.sin(frame * 0.02 + i) * 20} rx={b.rx} ry={b.ry} fill="#E6ECF2" opacity={b.o} />;
        }))}
        <rect x="-200" y="1780" width={W + 400} height="300" fill="#E6ECF2" opacity="0.8" />
      </g>
    </g>
  );
}

// Tech lab / basement workshop: a wall of signal monitors, server racks, a workbench, red alarm lights
function Lab({ frame, night, details }) {
  const alarm = has(details, "alarm") || has(details, "storm");
  const wave = (x0, y0, w, h, k, color) => {
    let d = `M${x0} ${y0 + h / 2}`;
    for (let i = 1; i <= 24; i++) {
      const x = x0 + (w * i) / 24;
      const y = y0 + h / 2 + Math.sin(i * 0.9 + frame * 0.25 + k) * h * 0.32 * (i % 5 === 0 ? 1.6 : 1);
      d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return <path d={d} fill="none" stroke={color} strokeWidth="3" />;
  };
  return (
    <g>
      <Room wall="#3E4550" side="#343A44" floor="#2E3238" plank="#3A3F46" base="#343A44" />
      {/* pipes and cables */}
      <rect x={60} y={70} width={980} height={24} rx="12" fill="#5E6670" {...O} strokeWidth="4" />
      <path d="M120 94 Q140 300 110 500 M960 94 Q930 260 970 480" fill="none" stroke="#1E1E22" strokeWidth="10" />
      {/* wall of monitors */}
      {[0, 1, 2].map(c => [0, 1].map(r => {
        const x = 230 + c * 210, y = 300 + r * 170;
        const red = (c + r + Math.floor(frame / 20)) % 4 === 0;
        return (
          <g key={`${c}${r}`}>
            <rect x={x} y={y} width="190" height="150" rx="10" fill="#1E2328" {...O} />
            <rect x={x + 12} y={y + 12} width="166" height="110" rx="4" fill={red ? "#2A0E10" : "#0B2420"} />
            {wave(x + 16, y + 20, 158, 90, c * 2 + r, red ? "#FF5252" : "#5CFF9D")}
          </g>
        );
      }))}
      {/* server racks with blinking lights */}
      {[100, 870].map((x, k) => (
        <g key={x}>
          <rect x={x} y={560} width={110} height={800} rx="6" fill="#262A31" {...O} />
          {Array.from({ length: 12 }).map((_, i) => (
            <g key={i}>
              <rect x={x + 12} y={590 + i * 62} width="86" height="44" rx="4" fill="#33383F" stroke="#1A1D22" strokeWidth="3" />
              <circle cx={x + 26} cy={612 + i * 62} r="5" fill={(i + k + Math.floor(frame / 6)) % 3 === 0 ? "#5CFF9D" : "#1F4D33"} />
              <circle cx={x + 42} cy={612 + i * 62} r="5" fill={(i * 2 + k + Math.floor(frame / 9)) % 4 === 0 ? "#FFB43F" : "#4D3A1F"} />
            </g>
          ))}
        </g>
      ))}
      {/* workbench with a router, antenna and tools */}
      <rect x={250} y={1110} width={580} height={34} fill="#6B5038" {...O} />
      <rect x={270} y={1144} width={540} height={210} fill="#57412E" {...O} />
      <rect x={300} y={1060} width={130} height={52} rx="10" fill="#1E2328" {...O} strokeWidth="4" />
      {[320, 360, 400].map(x => <line key={x} x1={x} y1="1062" x2={x - 10} y2="1000" stroke={INK} strokeWidth="5" strokeLinecap="round" />)}
      {[330, 350, 370, 390].map((x, i) => <circle key={x} cx={x} cy="1092" r="5" fill={(i + Math.floor(frame / 5)) % 2 ? "#5CFF9D" : "#1F4D33"} />)}
      <line x1="700" y1="1110" x2="740" y2="900" stroke="#9AA5AA" strokeWidth="8" />
      <circle cx="740" cy="900" r="16" fill="#E25B5B" {...O} strokeWidth="4" />
      {[0, 1, 2].map(k => { const p = ((frame * 0.03 + k / 3) % 1); return <circle key={k} cx="740" cy="900" r={20 + p * 80} fill="none" stroke="#E25B5B" strokeWidth="3" opacity={1 - p} />; })}
      <rect x={520} y={1080} width={120} height={30} rx="6" fill="#C9A227" {...O} strokeWidth="3" />
      {/* red alarm light sweeping */}
      {alarm && (
        <g>
          <rect width={W} height={H} fill="#FF1E1E" opacity={0.1 + 0.1 * Math.max(0, Math.sin(frame * 0.4))} />
          <circle cx={540} cy={150} r="26" fill="#FF3B3B" {...O} strokeWidth="4" />
        </g>
      )}
      <rect width={W} height={H} fill="#05070C" opacity={night ? 0.15 : 0.05} />
    </g>
  );
}

// Concrete storm drain: a round tunnel going away, shallow water flowing, a ladder up to a grate
function Drain({ frame, night, details }) {
  const flow = (frame * 3) % 60;
  const rings = [0, 1, 2, 3, 4, 5];
  return (
    <g>
      <rect width={W} height={H} fill="#1B1F24" />
      {/* rings of the pipe getting smaller into the distance */}
      {rings.map(i => {
        const k = i / rings.length;
        const r = 760 * (1 - k * 0.82);
        return <ellipse key={i} cx={540} cy={900 - k * 40} rx={r} ry={r * 1.05} fill={i % 2 ? "#4A5058" : "#545A62"} stroke="#3A4047" strokeWidth="6" />;
      })}
      <ellipse cx={540} cy={858} rx={110} ry={115} fill="#0A0C10" />
      {/* light falling through a grate above */}
      <path d="M440 0 L640 0 L760 1500 L320 1500 Z" fill="#DDEBFF" opacity={night ? 0.08 : 0.14} />
      {[460, 500, 540, 580, 620].map(x => <rect key={x} x={x} y={0} width="14" height="40" fill="#2B2F35" />)}
      {/* ladder on the side */}
      <g>
        {[0, 1].map(k => <rect key={k} x={850 + k * 80} y={300} width="14" height="1100" fill="#7A6A5A" {...O} strokeWidth="3" />)}
        {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={850} y={340 + i * 90} width="94" height="12" fill="#8A7A6A" stroke={INK} strokeWidth="3" />)}
      </g>
      {/* water on the floor */}
      <path d={`M0 1500 Q540 1420 1080 1500 L1080 ${H} L0 ${H} Z`} fill="#3F5A6E" />
      {[0, 1, 2, 3].map(r => <path key={r} d={`M${-60 + ((flow + r * 30) % 60)} ${1560 + r * 90} q60 -12 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0`} fill="none" stroke="#8FB3C9" strokeWidth="4" opacity={0.6 - r * 0.1} />)}
      {/* drips */}
      {[0, 1, 2].map(i => { const p = ((frame * 0.02 + i / 3) % 1); return <ellipse key={i} cx={300 + i * 230} cy={300 + p * 1200} rx="4" ry="8" fill="#8FB3C9" opacity={1 - p} />; })}
      <rect width={W} height={H} fill="#000" opacity="0.2" />
    </g>
  );
}

// scene name -> [back, front]
export const VECTOR_SCENES = {
  home: [Home, HomeFront],
  bedroom: [Bedroom, null],
  room: [Bedroom, null],
  canteen: [Canteen, CanteenFront],
  cafe: [Canteen, CanteenFront],
  classroom: [Classroom, ClassroomFront],
  corridor: [Corridor, CorridorFront],
  hospital: [Hospital, HospitalFront],
  office: [Office, null],
  meeting: [Meeting, null],
  shop: [Shop, null],
  mall: [Shop, null],
  street: [Street, StreetFront],
  park: [Park, ParkFront],
  lift: [Lift, null],
  radio: [Radio, null],
  cave: [Cave, CaveFront],
  island: [Island, IslandFront],
  shore: [Island, IslandFront],
  forest: [Forest, ForestFront],
  deck: [Deck, DeckFront],
  kitchen: [Kitchen, KitchenFront],
  controlroom: [ControlRoom, null],
  basement: [ControlRoom, null],
  cliff: [Cliff, ForestFront],
  camp: [Camp, null],
  village: [Village, null],
  lab: [Lab, null],
  workshop: [Lab, null],
  drain: [Drain, null],
  tunnel: [Drain, null],
  gate: [Village, null],
};

export function VectorBack({ scene, frame, night, details = [] }) {
  const Back = VECTOR_SCENES[scene]?.[0];
  if (!Back) return null;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <Back frame={frame} night={night} details={details} />
    </svg>
  );
}

export function VectorFront({ scene, frame, night, details = [] }) {
  const Front = VECTOR_SCENES[scene]?.[1];
  const storm = has(details, "storm") || has(details, "rain");
  const fog = has(details, "fog");
  if (!Front && !storm && !fog) return null;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {Front && <Front frame={frame} night={night} details={details} />}
      {fog && <Fog frame={frame} outdoor={OUTDOOR.has(scene)} />}
      {storm && <Storm frame={frame} outdoor={OUTDOOR.has(scene)} />}
    </svg>
  );
}
