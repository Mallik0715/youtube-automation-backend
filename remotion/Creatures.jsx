import React from "react";

// Animals and vehicles that move *into the scene* when the narrator mentions them, instead of popping
// up in a bubble: a snake slithers across the floor, a dog runs in, a spider drops from the ceiling.
// Same flat style as the characters. Positions are on the 1080x1920 canvas (the floor is around y=1780).
const INK = "#262626";
const O = { stroke: INK, strokeWidth: 5, strokeLinejoin: "round", strokeLinecap: "round" };
const ease = (k) => 1 - Math.pow(1 - Math.min(1, Math.max(0, k)), 3);

function Snake({ a }) {
  // Body: a wave travelling along it while it moves; the head lifts and the tongue flicks once it stops
  const moving = a < 1.3;
  const pts = [];
  for (let i = 0; i <= 30; i++) {
    const x = i * 13;
    const y = 60 + Math.sin(i * 0.55 - a * (moving ? 9 : 2)) * (moving ? 16 : 7) * (i / 30 + 0.3);
    pts.push([x, y]);
  }
  const d = "M" + pts.map(p => p.join(" ")).join(" L");
  const lift = moving ? 0 : Math.min(1, (a - 1.3) / 0.3) * 26;
  const tongue = !moving && (a * 3) % 1 < 0.35;
  return (
    <svg viewBox="-60 -40 520 160" width="820" height="252" style={{ overflow: "visible" }}>
      <path d={d} fill="none" stroke={INK} strokeWidth="40" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#5DAA3C" strokeWidth="30" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#3F7F2A" strokeWidth="8" strokeLinecap="round" strokeDasharray="10 22" />
      <g transform={`translate(${pts[0][0]} ${pts[0][1] - lift})`}>
        {tongue && <path d="M-34 4 L-62 2 L-70 -6 M-62 2 L-70 10" fill="none" stroke="#E53935" strokeWidth="5" strokeLinecap="round" />}
        <ellipse cx="-8" cy="0" rx="34" ry="24" fill="#5DAA3C" {...O} />
        <circle cx="-18" cy="-10" r="7" fill="#FFE27A" stroke={INK} strokeWidth="3" />
        <ellipse cx="-18" cy="-10" rx="2" ry="5" fill={INK} />
      </g>
    </svg>
  );
}

function Dog({ a, moving }) {
  const leg = moving ? Math.sin(a * 22) * 22 : 0;
  const wag = Math.sin(a * 16) * 18;
  return (
    <svg viewBox="-20 -20 300 240" width="470" height="376" style={{ overflow: "visible" }}>
      <path d={`M210 92 Q${250 + wag} ${50 - Math.abs(wag)} ${244 + wag} 40`} fill="none" stroke={INK} strokeWidth="16" strokeLinecap="round" />
      <path d={`M210 92 Q${250 + wag} ${50 - Math.abs(wag)} ${244 + wag} 40`} fill="none" stroke="#C98B4E" strokeWidth="9" strokeLinecap="round" />
      {[[70, leg], [100, -leg], [180, -leg], [205, leg]].map(([x, s], i) => (
        <g key={i} transform={`rotate(${s} ${x} 130)`}>
          <rect x={x - 11} y="120" width="22" height="70" rx="10" fill={i % 2 ? "#B47A40" : "#C98B4E"} {...O} />
        </g>
      ))}
      <ellipse cx="140" cy="118" rx="90" ry="46" fill="#C98B4E" {...O} />
      <ellipse cx="150" cy="128" rx="44" ry="22" fill="#F1D3A8" />
      <g transform={`rotate(${moving ? Math.sin(a * 22) * 3 : Math.sin(a * 3) * 4} 60 70)`}>
        <ellipse cx="50" cy="66" rx="48" ry="42" fill="#C98B4E" {...O} />
        <path d="M44 30 Q20 10 18 60 Q30 76 44 52" fill="#8A5A2C" {...O} />
        <ellipse cx="14" cy="82" rx="24" ry="18" fill="#F1D3A8" {...O} />
        <ellipse cx="-6" cy="76" rx="9" ry="7" fill={INK} />
        <circle cx="38" cy="58" r="7" fill={INK} />
        <circle cx="40" cy="55" r="2.4" fill="#fff" />
        {!moving && <path d="M6 96 Q4 116 16 116 Q24 110 20 96" fill="#E87A86" {...O} strokeWidth="3" />}
      </g>
    </svg>
  );
}

function Cat({ a, moving }) {
  const leg = moving ? Math.sin(a * 18) * 18 : 0;
  const tail = Math.sin(a * 4) * 14;
  return (
    <svg viewBox="-20 -40 260 230" width="360" height="318" style={{ overflow: "visible" }}>
      <path d={`M190 100 Q230 ${60 + tail} ${216 + tail} 10`} fill="none" stroke={INK} strokeWidth="16" strokeLinecap="round" />
      <path d={`M190 100 Q230 ${60 + tail} ${216 + tail} 10`} fill="none" stroke="#4B4B55" strokeWidth="9" strokeLinecap="round" />
      {[[70, leg], [90, -leg], [160, -leg], [180, leg]].map(([x, s], i) => (
        <g key={i} transform={`rotate(${s} ${x} 120)`}><rect x={x - 9} y="110" width="18" height="60" rx="9" fill="#4B4B55" {...O} /></g>
      ))}
      <ellipse cx="128" cy="108" rx="76" ry="36" fill="#4B4B55" {...O} />
      <g>
        <path d="M20 40 L28 -6 L52 26 Z M70 26 L92 -6 L96 40 Z" fill="#4B4B55" {...O} />
        <ellipse cx="58" cy="56" rx="46" ry="40" fill="#4B4B55" {...O} />
        <ellipse cx="40" cy="50" rx="9" ry="11" fill="#C8F06B" stroke={INK} strokeWidth="3" />
        <ellipse cx="74" cy="50" rx="9" ry="11" fill="#C8F06B" stroke={INK} strokeWidth="3" />
        <ellipse cx="40" cy="50" rx="2.5" ry="8" fill={INK} />
        <ellipse cx="74" cy="50" rx="2.5" ry="8" fill={INK} />
        <path d="M52 70 L64 70 L58 77 Z" fill="#F29AA6" />
        <path d="M10 70 L36 72 M10 82 L36 78 M106 70 L80 72 M106 82 L80 78" stroke="#ddd" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

function Rat({ a }) {
  const leg = Math.sin(a * 30) * 20;
  return (
    <svg viewBox="-10 -10 200 120" width="260" height="156" style={{ overflow: "visible" }}>
      <path d="M150 70 Q200 60 196 20" fill="none" stroke="#E5A1A8" strokeWidth="6" strokeLinecap="round" />
      {[[60, leg], [120, -leg]].map(([x, s], i) => <g key={i} transform={`rotate(${s} ${x} 80)`}><rect x={x - 6} y="76" width="12" height="26" rx="6" fill="#8D8F99" {...O} strokeWidth="4" /></g>)}
      <ellipse cx="96" cy="66" rx="60" ry="32" fill="#8D8F99" {...O} />
      <path d="M40 60 Q10 70 4 80 Q30 90 50 80 Z" fill="#8D8F99" {...O} />
      <circle cx="52" cy="40" r="16" fill="#E5A1A8" {...O} strokeWidth="4" />
      <circle cx="30" cy="66" r="4" fill={INK} />
      <circle cx="4" cy="80" r="5" fill="#E5A1A8" />
    </svg>
  );
}

function Spider({ a }) {
  const wiggle = Math.sin(a * 10) * 8;
  return (
    <svg viewBox="-100 -60 200 160" width="260" height="208" style={{ overflow: "visible" }}>
      {[-1, 1].map(s => [0, 1, 2, 3].map(i => (
        <path key={`${s}${i}`} d={`M0 20 Q${s * (40 + i * 6)} ${-10 + i * 18 + (i % 2 ? wiggle : -wiggle)} ${s * (70 + i * 6)} ${20 + i * 20}`} fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      )))}
      <ellipse cx="0" cy="36" rx="34" ry="30" fill="#2B2B33" {...O} />
      <circle cx="0" cy="0" r="22" fill="#2B2B33" {...O} />
      <circle cx="-8" cy="-2" r="6" fill="#fff" /><circle cx="8" cy="-2" r="6" fill="#fff" />
      <circle cx="-7" cy="0" r="3" fill={INK} /><circle cx="9" cy="0" r="3" fill={INK} />
    </svg>
  );
}

function Bird({ a }) {
  const flap = Math.sin(a * 16) * 26;
  return (
    <svg viewBox="-80 -60 160 120" width="170" height="128" style={{ overflow: "visible" }}>
      <path d={`M-6 0 Q-40 ${-30 - flap} -76 ${-10 - flap}`} fill="none" stroke={INK} strokeWidth="14" strokeLinecap="round" />
      <path d={`M-6 0 Q-40 ${-30 - flap} -76 ${-10 - flap}`} fill="none" stroke="#5B7DB1" strokeWidth="8" strokeLinecap="round" />
      <ellipse cx="0" cy="6" rx="38" ry="20" fill="#5B7DB1" {...O} />
      <circle cx="34" cy="-4" r="16" fill="#5B7DB1" {...O} />
      <path d="M48 -4 L66 2 L48 8 Z" fill="#F2B83E" {...O} strokeWidth="3" />
      <circle cx="38" cy="-8" r="3.5" fill={INK} />
      <path d={`M10 4 Q30 ${-26 + flap} 60 ${-14 + flap}`} fill="none" stroke={INK} strokeWidth="14" strokeLinecap="round" />
      <path d={`M10 4 Q30 ${-26 + flap} 60 ${-14 + flap}`} fill="none" stroke="#6F90C9" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

function Plane({ a }) {
  return (
    <svg viewBox="-200 -60 400 120" width="420" height="126" style={{ overflow: "visible" }}>
      <path d="M-200 4 L-110 4" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity="0.8" />
      <path d="M-110 0 Q-100 -24 40 -24 Q120 -22 130 0 Q120 20 40 22 L-100 22 Q-116 16 -110 0 Z" fill="#F4F6F8" {...O} />
      <path d="M-90 -20 L-110 -56 L-80 -56 L-50 -22 Z" fill="#E25B5B" {...O} />
      <path d="M-10 6 L-60 50 L-20 50 L40 8 Z" fill="#C9D3DC" {...O} />
      {[0, 30, 60, 90].map(x => <circle key={x} cx={x - 20} cy="-6" r="7" fill="#7FC8F2" stroke={INK} strokeWidth="3" />)}
    </svg>
  );
}

// name -> how it moves. a = seconds since it appeared, out = seconds since it should leave (or <0)
// Returns {x, y, flip, el} or null. "stay" creatures walk in, stop beside the actors, then leave.
const MOVERS = {
  snake: (a, out) => {
    const k = ease(a / 1.3);
    const x = out > 0 ? 560 + out * 1000 : 1300 - 740 * k;
    return { x, y: 1800, el: <Snake a={a} /> };
  },
  dog: (a, out) => {
    const k = ease(a / 0.9);
    const x = out > 0 ? 300 - out * 1100 : -360 + 660 * k;
    return { x, y: 1720, flip: true, el: <Dog a={a} moving={a < 0.9 || out > 0} /> };
  },
  cat: (a, out) => {
    const k = ease(a / 1.2);
    const x = out > 0 ? 760 + out * 900 : 1120 - 360 * k;
    return { x, y: 1740, el: <Cat a={a} moving={a < 1.2 || out > 0} /> };
  },
  rat: (a) => ({ x: -200 + a * 900, y: 1830, flip: true, el: <Rat a={a} /> }),
  spider: (a, out) => {
    const k = ease(a / 1.0);
    const y = out > 0 ? 760 - out * 1600 : -120 + 880 * k + Math.sin(a * 2) * 14;
    return { x: 830, y, thread: true, el: <Spider a={a} /> };
  },
  bird: (a) => ({ x: -150 + a * 520, y: 520 + Math.sin(a * 3) * 30, el: <Bird a={a} /> }),
  plane: (a) => ({ x: -260 + a * 380, y: 360 - a * 30, el: <Plane a={a} /> }),
};
export const MOVER_NAMES = Object.keys(MOVERS);

export function Creature({ name, at, until, t }) {
  const move = MOVERS[name];
  if (!move || t < at) return null;
  const a = t - at;
  const out = t - until;
  if (out > 1.2 || a > 8) return null;
  const m = move(a, out);
  if (!m) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, pointerEvents: "none" }}>
      {m.thread && <div style={{ position: "absolute", left: m.x - 1.5, top: 0, width: 3, height: Math.max(0, m.y - 40), background: "#eee", opacity: 0.8 }} />}
      <div style={{ position: "absolute", left: m.x, top: m.y, transform: `translate(-50%, -60%) scaleX(${m.flip ? -1 : 1})` }}>{m.el}</div>
    </div>
  );
}
