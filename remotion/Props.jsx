import React from "react";
import { spring } from "remotion";

const INK = "#1d1d1f";
const buzzing = (a) => a % 0.9 < 0.55; // the phone vibrates in bursts
const S = { stroke: INK, strokeWidth: 6, strokeLinejoin: "round", strokeLinecap: "round" };

// Cartoon objects in the same thick-outline style as the characters. All drawn in a 200 x 200 box.
const DRAW = {
  cash: (a) => (
    <g {...S}>
      {[34, 18, 2].map((dy, i) => (
        <g key={i} transform={`translate(${i * 6} ${dy})`}>
          <rect x="22" y="70" width="150" height="80" rx="8" fill={i === 2 ? "#7ED957" : "#5DBB3F"} />
          {i === 2 && <>
            <rect x="80" y="70" width="34" height="80" fill="#E8D9A8" strokeWidth="5" />
            <circle cx="50" cy="110" r="14" fill="none" strokeWidth="5" />
            <circle cx="144" cy="110" r="14" fill="none" strokeWidth="5" />
          </>}
        </g>
      ))}
      <text x="109" y="138" textAnchor="middle" fontSize="44" fontWeight="900" fontFamily="Arial Black, sans-serif" fill="#2E7D32" stroke="none">$</text>
    </g>
  ),
  envelope: (a) => (
    <g {...S}>
      <rect x="22" y="52" width="156" height="104" rx="8" fill="#FFF8E7" />
      <path d="M22 60 L100 116 L178 60" fill="none" />
      <path d="M22 152 L82 104 M178 152 L118 104" fill="none" strokeWidth="4" />
      <circle cx="100" cy="116" r="15" fill="#C62828" />
    </g>
  ),
  phone: (a) => (
    <g {...S}>
      <rect x="60" y="22" width="80" height="156" rx="16" fill="#2B2D33" />
      <rect x="70" y="38" width="60" height="112" rx="5" fill="#7FD3FF" strokeWidth="4" />
      <rect x="77" y="52" width="46" height="16" rx="5" fill="#fff" stroke="none" />
      <rect x="77" y="76" width="34" height="12" rx="4" fill="#fff" stroke="none" opacity="0.8" />
      <circle cx="100" cy="164" r="5" fill="#555" strokeWidth="3" />
      <path d="M40 60 Q28 100 40 140 M160 60 Q172 100 160 140" fill="none" strokeWidth="6" opacity={buzzing(a) ? 1 : 0} />
      <path d="M22 50 Q6 100 22 150 M178 50 Q194 100 178 150" fill="none" strokeWidth="5" opacity={buzzing(a) && a % 0.2 < 0.1 ? 1 : 0} />
    </g>
  ),
  tv: (a) => (
    <g {...S}>
      <rect x="18" y="40" width="164" height="114" rx="14" fill="#3A3D45" />
      <rect x="32" y="54" width="136" height="86" rx="6" fill="#4FA3E3" strokeWidth="4" />
      <rect x="32" y="54" width="136" height="62" fill="#fff" stroke="none" opacity={Math.sin(a * 23) > 0.85 ? 0.35 : 0} />
      <rect x="32" y="116" width="136" height="24" fill={Math.floor(a * 3) % 2 ? "#D32F2F" : "#B71C1C"} strokeWidth="4" />
      <text x="100" y="134" textAnchor="middle" fontSize="18" fontWeight="900" fontFamily="Arial Black, sans-serif" fill="#fff" stroke="none">BREAKING</text>
      <path d="M78 154 L66 178 M122 154 L134 178" fill="none" />
    </g>
  ),
  radio: (a) => (
    <g {...S}>
      <path d="M60 58 L140 30" fill="none" />
      <rect x="22" y="58" width="156" height="104" rx="16" fill="#8D6E63" />
      <circle cx="70" cy="110" r="32" fill="#4E342E" />
      {[0, 1, 2].map(i => <line key={i} x1="46" x2="94" y1={98 + i * 12} y2={98 + i * 12} stroke="#A1887F" strokeWidth="4" />)}
      <rect x="114" y="80" width="48" height="24" rx="4" fill="#FFE082" strokeWidth="4" />
      <circle cx="126" cy="132" r="9" fill="#FFCA28" strokeWidth="4" />
      <circle cx="152" cy="132" r="9" fill="#FFCA28" strokeWidth="4" />
      {[0, 1, 2].map(i => {
        const p = (a * 1.4 + i / 3) % 1;
        return <path key={i} d={`M${186 + p * 26} ${80 - p * 14} Q${200 + p * 34} 110 ${186 + p * 26} ${140 + p * 14}`} fill="none" strokeWidth="5" opacity={1 - p} />;
      })}
    </g>
  ),
  newspaper: (a) => (
    <g {...S}>
      <path d="M30 40 L170 40 L170 166 L30 166 Z" fill="#F1EFE8" />
      <rect x="44" y="54" width="112" height="22" fill="#2B2D33" strokeWidth="3" />
      <rect x="44" y="88" width="50" height="40" fill="#B0BEC5" strokeWidth="3" />
      {[90, 104, 118, 140, 152].map(y => <line key={y} x1={y > 130 ? 44 : 104} x2="156" y1={y} y2={y} strokeWidth="4" />)}
    </g>
  ),
  bag: (a) => (
    <g {...S}>
      <path d="M70 70 Q70 36 100 36 Q130 36 130 70" fill="none" strokeWidth="10" />
      <rect x="20" y="66" width="160" height="96" rx="40" fill="#26282E" />
      <path d="M40 100 L160 100" stroke="#55585F" strokeWidth="5" fill="none" />
      <rect x="88" y="92" width="24" height="16" rx="3" fill="#C9A227" strokeWidth="4" />
      <path d="M128 66 L138 50 L158 52 L150 70 Z" fill="#7ED957" strokeWidth="4" />
    </g>
  ),
  car: (a) => (
    <g {...S}>
      <path d="M14 128 L22 98 Q30 88 50 86 L70 62 Q78 54 92 54 L140 54 Q152 54 160 64 L178 86 Q192 90 190 104 L190 128 Z" fill="#23252B" />
      <path d="M78 66 L92 64 L96 86 L64 86 Z M104 64 L136 64 L154 86 L106 86 Z" fill="#9AD0F5" strokeWidth="4" />
      <circle cx="54" cy="134" r="20" fill="#444" />
      <circle cx="152" cy="134" r="20" fill="#444" />
      <circle cx="54" cy="134" r="7" fill="#bbb" strokeWidth="3" />
      <circle cx="152" cy="134" r="7" fill="#bbb" strokeWidth="3" />
      <rect x="176" y="98" width="12" height="10" rx="3" fill="#FFE082" strokeWidth="3" />
      {a < 0.9 && [70, 96, 120].map((y, i) => <line key={y} x1={-10 - i * 8} x2={-50 - i * 8} y1={y} y2={y} strokeWidth="5" opacity={1 - a / 0.9} />)}
    </g>
  ),
  watch: (a) => (
    <g {...S}>
      <rect x="76" y="14" width="48" height="172" rx="14" fill="#6D4C41" />
      <circle cx="100" cy="100" r="50" fill="#F2C14E" />
      <circle cx="100" cy="100" r="38" fill="#FFFDF5" strokeWidth="4" />
      <path d="M100 100 L100 74 M100 100 L118 108" fill="none" strokeWidth="6" />
      <line x1="100" y1="100" x2="100" y2="68" stroke="#D32F2F" strokeWidth="3" transform={`rotate(${a * 120} 100 100)`} />
      <circle cx="152" cy="100" r="7" fill="#F2C14E" strokeWidth="4" />
    </g>
  ),
  bitcoin: (a) => (
    <g {...S}>
      <circle cx="100" cy="100" r="78" fill="#F7931A" />
      <circle cx="100" cy="100" r="62" fill="none" stroke="#FFB54D" strokeWidth="5" />
      <text x="102" y="134" textAnchor="middle" fontSize="96" fontWeight="900" fontFamily="Arial Black, sans-serif" fill="#fff" stroke={INK} strokeWidth="5" paintOrder="stroke">₿</text>
    </g>
  ),
  clock: (a) => (
    <g {...S}>
      <circle cx="100" cy="104" r="76" fill="#FFFDF5" />
      <circle cx="100" cy="104" r="62" fill="none" stroke="#E0E0E0" strokeWidth="4" />
      {[0, 90, 180, 270].map(a => (
        <line key={a} x1="100" y1="40" x2="100" y2="52" transform={`rotate(${a} 100 104)`} strokeWidth="6" />
      ))}
      <path d="M100 104 L100 62" fill="none" strokeWidth="8" transform={`rotate(${a * 150} 100 104)`} />
      <path d="M100 104 L128 104" fill="none" strokeWidth="8" transform={`rotate(${30 + a * 12} 100 104)`} />
      <circle cx="100" cy="104" r="7" fill={INK} />
      <path d="M44 34 L64 50 M156 34 L136 50" fill="none" strokeWidth="10" />
    </g>
  ),
  key: (a) => (
    <g {...S}>
      <circle cx="62" cy="100" r="38" fill="#F2C14E" />
      <circle cx="62" cy="100" r="14" fill="#fff" strokeWidth="5" />
      <path d="M98 88 L182 88 L182 112 L166 112 L166 130 L150 130 L150 112 L98 112 Z" fill="#F2C14E" />
    </g>
  ),
  bank: (a) => (
    <g {...S}>
      <path d="M18 70 L100 24 L182 70 Z" fill="#E0E3E8" />
      <rect x="22" y="70" width="156" height="14" fill="#C7CCD4" />
      {[40, 78, 116, 154].map(x => <rect key={x} x={x - 8} y="84" width="16" height="64" fill="#F5F6F8" strokeWidth="4" />)}
      <rect x="14" y="148" width="172" height="20" rx="3" fill="#C7CCD4" />
      <circle cx="100" cy={-30 + ((a % 1.2) / 1.2) * 70} r="12" fill="#F2C14E" strokeWidth="4" opacity={(a % 1.2) < 1 ? 1 : 0} />
      <text x="100" y="62" textAnchor="middle" fontSize="28" fontWeight="900" fontFamily="Arial Black, sans-serif" fill="#2E7D32" stroke="none">$</text>
    </g>
  ),
  camera: (a) => (
    <g {...S}>
      <path d="M150 40 L176 40 L176 70 L150 70" fill="#9EA4AE" />
      <path d="M40 70 L156 46 L162 96 L46 120 Z" fill="#E6E8EC" />
      <circle cx="54" cy="96" r="18" fill="#2B2D33" />
      <circle cx="54" cy="96" r="7" fill="#E53935" stroke="none" opacity={a % 1 < 0.5 ? 1 : 0.15} />
      <path d="M100 108 L106 160 L80 160" fill="none" strokeWidth="8" />
    </g>
  ),
  police: (a) => (
    <g {...S}>
      <path d="M100 18 L168 44 Q166 128 100 182 Q34 128 32 44 Z" fill="#1E4FA3" />
      <path d="M100 52 L110 82 L142 82 L116 100 L126 132 L100 112 L74 132 L84 100 L58 82 L90 82 Z" fill="#F2C14E" strokeWidth="5" />
    </g>
  ),
};

export const PROP_NAMES = Object.keys(DRAW);

// How the whole object moves (SVG transform), from a = seconds since it popped up
const MOTION = {
  phone: (a) => buzzing(a) ? `translate(${Math.sin(a * 70) * 6} 0) rotate(${Math.sin(a * 55) * 4} 100 100)` : "",
  car: (a) => `translate(${-170 * Math.max(0, 1 - a / 0.45) ** 2} ${-Math.abs(Math.sin(a * 18)) * 2})`,
  bitcoin: (a) => `translate(100 0) scale(${Math.cos(a * 3.2)} 1) translate(-100 0)`,
  newspaper: (a) => `rotate(${720 * Math.max(0, 1 - a / 0.6) ** 2} 100 100) scale(1)`,
  key: (a) => `rotate(${Math.sin(a * 4) * 14} 62 62)`,
  bag: (a) => `rotate(${Math.sin(a * 5) * 4} 100 160)`,
  envelope: (a) => `translate(0 ${-Math.abs(Math.sin(a * 5)) * 10 * Math.exp(-a * 0.8)})`,
  camera: (a) => `rotate(${Math.sin(a * 1.5) * 9} 160 56)`,
  cash: (a) => `rotate(${Math.sin(a * 6) * 3} 100 100)`,
};

// Bills fluttering down the whole screen when cash first appears
function CashRain({ a }) {
  if (a > 2.6) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, pointerEvents: "none" }}>
      {Array.from({ length: 18 }, (_, i) => {
        const d = (i * 0.11) % 0.7;
        const k = a - d;
        if (k < 0) return null;
        const x = ((i * 337) % 1000) + 10 + Math.sin(k * 3 + i) * 40;
        const y = -140 + k * (760 + (i % 5) * 70);
        const fade = Math.min(1, (2.6 - a) / 0.4);
        return (
          <svg key={i} viewBox="0 0 130 66" width="150" height="76" style={{
            position: "absolute", left: x, top: y, opacity: fade,
            transform: `rotate(${(i % 2 ? 1 : -1) * k * 160 + i * 37}deg) scaleX(${Math.cos(k * 7 + i)})`,
          }}>
            <rect x="3" y="3" width="124" height="60" rx="6" fill="#7ED957" stroke={INK} strokeWidth="5" />
            <circle cx="65" cy="33" r="16" fill="#E8D9A8" stroke={INK} strokeWidth="4" />
            <text x="65" y="44" textAnchor="middle" fontSize="28" fontWeight="900" fontFamily="Arial Black, sans-serif" fill="#2E7D32">$</text>
          </svg>
        );
      })}
    </div>
  );
}

/**
 * A prop popping up in a white bubble, bobbing gently while it stays on screen.
 * x, y: centre (px on the 1080x1920 canvas)
 */
export function Prop({ name, at, until, t, frame, fps, x, y, size = 330 }) {
  const draw = DRAW[name];
  if (!draw || t < at || t > until + 0.25) return null;
  const pop = spring({ frame: frame - Math.round(at * fps), fps, config: { damping: 9, stiffness: 190 } });
  const out = t > until ? Math.max(0, 1 - (t - until) / 0.25) : 1;
  const k = pop * out;
  const bob = Math.sin((t - at) * 3) * 8;
  const tilt = (1 - pop) * -25 + Math.sin((t - at) * 2.2) * 3;
  const a = t - at;
  const flash = name === "police" ? (Math.floor(a * 4) % 2 ? "#2F6BFF" : "#FF2E2E") : null;
  return (
    <>
    {name === "cash" && <CashRain a={a} />}
    <div style={{
      position: "absolute", left: x - size / 2, top: y - size / 2 + bob, width: size, height: size,
      transform: `scale(${k}) rotate(${tilt}deg)`, opacity: Math.min(1, k * 2),
    }}>
      <svg viewBox="-20 -20 240 240" width="100%" height="100%" style={{ overflow: "visible" }}>
        <circle cx="100" cy="106" r="112" fill="rgba(0,0,0,0.25)" />
        {flash && <circle cx="100" cy="100" r="134" fill={flash} opacity="0.55" />}
        <circle cx="100" cy="100" r="112" fill="#fff" stroke={INK} strokeWidth="7" />
        <g transform="translate(14 14) scale(0.86)"><g transform={MOTION[name]?.(a) || ""}>{draw(a)}</g></g>
      </svg>
    </div>
    </>
  );
}
