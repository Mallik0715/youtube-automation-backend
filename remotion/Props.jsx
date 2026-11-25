import React from "react";
import { spring } from "remotion";
import { Creature, MOVER_NAMES } from "./Creatures";

const INK = "#262626";
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
  fire: (a) => {
    const f = 0.85 + 0.15 * Math.sin(a * 17) * Math.sin(a * 7);
    return (
      <g {...S}>
        {[-1, 0, 1].map(i => <rect key={i} x="30" y="150" width="140" height="22" rx="11" fill="#7A4A2A" transform={`rotate(${i * 18} 100 160)`} />)}
        <path d={`M50 156 Q30 ${100 - 20 * f} 72 ${70 - 10 * f} Q70 ${100} 92 ${30 * f} Q140 ${80 * f} 150 156 Z`} fill="#FF7A2F" />
        <path d={`M76 156 Q66 ${120 - 14 * f} 96 ${86 - 16 * f} Q124 ${116} 124 156 Z`} fill="#FFD23F" strokeWidth="4" />
      </g>
    );
  },
  footprints: (a) => (
    <g {...S} fill="#8A6A4A" strokeWidth="4">
      {[0, 1, 2, 3].map(i => {
        const show = a * 4 > i;
        const x = 50 + i * 34, y = 160 - i * 38 + (i % 2) * 18;
        return show && <g key={i} transform={`rotate(-30 ${x} ${y})`}>
          <ellipse cx={x} cy={y} rx="13" ry="22" />
          {[-9, -3, 3, 9].map(dx => <circle key={dx} cx={x + dx} cy={y - 28} r="4.5" />)}
        </g>;
      })}
    </g>
  ),
  photo: (a) => (
    <g {...S} transform={`rotate(-6 100 100)`}>
      <rect x="30" y="30" width="140" height="150" rx="6" fill="#fff" />
      <rect x="42" y="42" width="116" height="100" fill="#9CD3F2" strokeWidth="4" />
      <circle cx="80" cy="84" r="16" fill="#F4C9A6" strokeWidth="4" />
      <circle cx="122" cy="86" r="16" fill="#E8B48A" strokeWidth="4" />
      <path d="M60 142 Q80 108 100 142 M102 142 Q122 110 142 142" fill="#5B7DB1" strokeWidth="4" />
    </g>
  ),
  water: (a) => (
    <g {...S}>
      <rect x="78" y="26" width="44" height="22" rx="6" fill="#3F8FD6" />
      <path d="M70 48 L130 48 L140 76 L140 176 Q140 184 132 184 L68 184 Q60 184 60 176 L60 76 Z" fill="#CDEBFF" />
      <path d="M62 110 L138 110 L138 176 Q138 182 132 182 L68 182 Q62 182 62 176 Z" fill="#7FC8F2" stroke="none" />
      <path d="M62 110 Q80 102 100 110 T138 110" fill="none" strokeWidth="4" />
    </g>
  ),
  coconut: (a) => (
    <g {...S}>
      <circle cx="100" cy="108" r="64" fill="#7A4A2A" />
      <circle cx="84" cy="88" r="8" fill={INK} /><circle cx="110" cy="84" r="8" fill={INK} /><circle cx="98" cy="108" r="8" fill={INK} />
      <path d="M60 70 Q70 60 82 64" fill="none" stroke="#A47751" strokeWidth="6" />
    </g>
  ),
  storm: (a) => (
    <g {...S}>
      <ellipse cx="100" cy="74" rx="76" ry="40" fill="#5E6670" />
      <ellipse cx="62" cy="88" rx="44" ry="30" fill="#6E7680" />
      <ellipse cx="140" cy="88" rx="46" ry="30" fill="#6E7680" />
      <path d="M104 104 L80 150 L104 150 L88 194 L134 136 L108 136 L124 104 Z" fill="#FFE27A" opacity={(a * 3) % 1 < 0.5 ? 1 : 0.3} />
    </g>
  ),
  microphone: (a) => (
    <g {...S}>
      <path d="M60 96 Q60 146 100 146 Q140 146 140 96" fill="none" strokeWidth="8" />
      <line x1="100" y1="146" x2="100" y2="182" strokeWidth="8" />
      <line x1="70" y1="182" x2="130" y2="182" strokeWidth="8" />
      <rect x="72" y="20" width="56" height="110" rx="28" fill="#3B3F45" />
      {[46, 62, 78].map(y => <line key={y} x1="80" x2="120" y1={y} y2={y} stroke="#888" strokeWidth="4" />)}
      <circle cx="160" cy="40" r="10" fill="#E53935" stroke="none" opacity={(a * 2) % 1 < 0.5 ? 1 : 0.2} />
    </g>
  ),
  exam: (a) => (
    <g {...S}>
      <path d="M40 24 L148 24 L164 40 L164 180 L40 180 Z" fill="#fff" />
      {[60, 84, 108, 132, 156].map(y => <line key={y} x1="56" x2={y % 48 ? 140 : 110} y1={y} y2={y} stroke="#9AA5AA" strokeWidth="5" />)}
      <circle cx="132" cy="70" r={30 * Math.min(1, a * 3)} fill="none" stroke="#E53935" strokeWidth="6" />
      <text x="132" y="84" textAnchor="middle" fontSize="40" fontWeight="900" fontFamily="Arial Black, sans-serif" fill="#E53935" stroke="none" opacity={a > 0.3 ? 1 : 0}>A+</text>
    </g>
  ),
  trophy: (a) => (
    <g {...S}>
      <path d="M60 30 L140 30 L134 96 Q100 130 66 96 Z" fill="#F2C14E" />
      <path d="M60 44 Q24 44 34 78 Q44 98 66 92 M140 44 Q176 44 166 78 Q156 98 134 92" fill="none" strokeWidth="8" />
      <rect x="90" y="118" width="20" height="34" fill="#E0A62E" />
      <rect x="60" y="150" width="80" height="30" rx="4" fill="#8A5A3C" />
      <path d="M86 50 L100 40 L114 50" fill="none" stroke="#fff" strokeWidth="5" opacity={Math.sin(a * 6) > 0 ? 0.8 : 0} />
    </g>
  ),
  alarm: (a) => (
    <g {...S} transform={`rotate(${Math.sin(a * 40) * 8} 100 110)`}>
      <circle cx="56" cy="46" r="24" fill="#E53935" /><circle cx="144" cy="46" r="24" fill="#E53935" />
      <circle cx="100" cy="110" r="66" fill="#E53935" />
      <circle cx="100" cy="110" r="50" fill="#fff" strokeWidth="4" />
      <path d="M100 110 L100 76 M100 110 L124 120" fill="none" strokeWidth="6" />
      <path d="M54 176 L66 160 M146 176 L134 160" strokeWidth="8" />
    </g>
  ),
  medicine: (a) => (
    <g {...S}>
      <rect x="60" y="56" width="80" height="120" rx="12" fill="#F2F2F2" />
      <rect x="54" y="30" width="92" height="32" rx="8" fill="#E53935" />
      <rect x="60" y="92" width="80" height="50" fill="#9CD3F2" strokeWidth="4" />
      <path d="M100 100 L100 134 M83 117 L117 117" stroke="#E53935" strokeWidth="9" />
    </g>
  ),
  heart: (a) => {
    const b = 1 + 0.08 * Math.max(0, Math.sin(a * 9));
    return <g {...S} transform={`translate(100 104) scale(${b}) translate(-100 -104)`}><path d="M100 172 Q24 120 28 74 Q34 30 74 34 Q94 38 100 62 Q106 38 126 34 Q166 30 172 74 Q176 120 100 172 Z" fill="#E53950" /><ellipse cx="62" cy="70" rx="12" ry="8" fill="#fff" opacity="0.6" stroke="none" /></g>;
  },
  ghost: (a) => (
    <g {...S} transform={`translate(0 ${Math.sin(a * 3) * 8})`}>
      <path d="M40 180 L40 90 Q40 24 100 24 Q160 24 160 90 L160 180 L140 162 L120 180 L100 162 L80 180 L60 162 Z" fill="#F4F6FA" />
      <ellipse cx="80" cy="88" rx="10" ry="16" fill={INK} /><ellipse cx="120" cy="88" rx="10" ry="16" fill={INK} />
      <ellipse cx="100" cy="124" rx="12" ry="16" fill={INK} />
    </g>
  ),
  gift: (a) => (
    <g {...S}>
      <rect x="36" y="80" width="128" height="100" fill="#E25B5B" />
      <rect x="28" y="60" width="144" height="30" fill="#F06B6B" />
      <rect x="90" y="60" width="20" height="120" fill="#FFE27A" strokeWidth="4" />
      <path d="M100 60 Q60 20 66 50 Q70 64 100 60 Q140 20 134 50 Q130 64 100 60" fill="#FFE27A" strokeWidth="4" />
    </g>
  ),
  ring: (a) => (
    <g {...S}>
      <circle cx="100" cy="122" r="52" fill="none" stroke={INK} strokeWidth="22" />
      <circle cx="100" cy="122" r="52" fill="none" stroke="#F2C14E" strokeWidth="13" />
      <path d="M78 64 L100 30 L122 64 L100 80 Z" fill="#BFF2FF" />
      <path d="M140 30 l6 12 l12 6 l-12 6 l-6 12 l-6 -12 l-12 -6 l12 -6 Z" fill="#fff" strokeWidth="3" opacity={Math.sin(a * 6) > 0 ? 1 : 0} />
    </g>
  ),
  cake: (a) => (
    <g {...S}>
      <rect x="40" y="96" width="120" height="76" rx="10" fill="#F6C9D8" />
      <path d="M40 112 Q60 128 80 112 T120 112 T160 112" fill="none" stroke="#fff" strokeWidth="8" />
      {[70, 100, 130].map(x => <g key={x}><rect x={x - 5} y="64" width="10" height="32" fill="#7FC8F2" strokeWidth="3" /><path d={`M${x} ${44 + Math.sin(a * 12 + x) * 3} Q${x + 8} 56 ${x} 62 Q${x - 8} 56 ${x} ${44 + Math.sin(a * 12 + x) * 3}`} fill="#FFB43F" strokeWidth="3" /></g>)}
    </g>
  ),
  door: (a) => {
    const open = Math.min(1, a / 0.7);
    return (
      <g {...S}>
        <rect x="50" y="20" width="100" height="168" fill="#2B2D33" />
        <path d={`M50 20 L${50 + 100 * (1 - open * 0.7)} ${20 + open * 12} L${50 + 100 * (1 - open * 0.7)} ${188 - open * 12} L50 188 Z`} fill="#A0693F" />
        <circle cx={50 + 86 * (1 - open * 0.7)} cy="108" r="6" fill="#F2C14E" strokeWidth="3" />
      </g>
    );
  },
  treasure: (a) => (
    <g {...S}>
      <path d="M30 96 Q30 50 100 50 Q170 50 170 96 Z" fill="#A0693F" transform={`rotate(${-Math.min(1, a * 2) * 20} 30 96)`} />
      <rect x="30" y="96" width="140" height="80" fill="#8A5A3C" />
      {[60, 90, 120, 150].map((x, i) => <circle key={x} cx={x - 10} cy={96 - (i % 2) * 8} r="12" fill="#F2C14E" strokeWidth="4" />)}
      <rect x="88" y="104" width="24" height="26" rx="4" fill="#F2C14E" strokeWidth="4" />
    </g>
  ),
  boat: (a) => (
    <g {...S} transform={`rotate(${Math.sin(a * 2.5) * 5} 100 150)`}>
      <path d="M96 30 L96 132" strokeWidth="6" />
      <path d="M100 36 L156 120 L100 120 Z" fill="#fff" />
      <path d="M100 50 L60 120 L96 120 Z" fill="#F2C14E" />
      <path d="M24 132 L176 132 L150 170 L50 170 Z" fill="#E25B5B" />
      <path d="M10 180 Q30 170 50 180 T90 180 T130 180 T170 180 T200 180" fill="none" stroke="#3F8FD6" strokeWidth="6" />
    </g>
  ),
  ship: (a) => (
    <g {...S} transform={`rotate(${Math.sin(a * 2) * 3} 100 150)`}>
      <rect x="70" y="58" width="60" height="50" fill="#F4F4F4" />
      <rect x="110" y="30" width="20" height="30" fill="#E25B5B" />
      {[80, 100].map(x => <circle key={x} cx={x} cy="82" r="6" fill="#7FC8F2" strokeWidth="3" />)}
      <path d="M16 108 L184 108 L160 160 L40 160 Z" fill="#2E4A6B" />
      <path d="M0 170 Q25 158 50 170 T100 170 T150 170 T200 170" fill="none" stroke="#3F8FD6" strokeWidth="6" />
      <path d={`M120 26 Q${130 + a * 10} ${10 - a * 4} ${140 + a * 20} ${4 - a * 6}`} fill="none" stroke="#bbb" strokeWidth="8" opacity="0.6" />
    </g>
  ),
  bill: (a) => (
    <g {...S}>
      <path d="M40 20 L160 20 L160 180 L140 168 L120 180 L100 168 L80 180 L60 168 L40 180 Z" fill="#fff" />
      <text x="100" y="62" textAnchor="middle" fontSize="30" fontWeight="900" fontFamily="Arial Black, sans-serif" fill="#E53935" stroke="none">RENT</text>
      <text x="100" y="94" textAnchor="middle" fontSize="22" fontWeight="900" fontFamily="Arial Black, sans-serif" fill={INK} stroke="none">DUE</text>
      {[116, 136].map(y => <line key={y} x1="60" x2="140" y1={y} y2={y} stroke="#9AA5AA" strokeWidth="5" />)}
      <rect x="54" y="66" width="92" height="40" rx="6" fill="none" stroke="#E53935" strokeWidth="5" transform={`rotate(-12 100 86)`} opacity={a > 0.3 ? 1 : 0} />
    </g>
  ),
  laptop: (a) => (
    <g {...S}>
      <rect x="40" y="40" width="120" height="86" rx="8" fill="#3B3F45" />
      <rect x="50" y="50" width="100" height="66" fill="#7FD3FF" strokeWidth="3" />
      <path d="M20 130 L180 130 L166 152 L34 152 Z" fill="#C9CED2" />
    </g>
  ),
  torch: (a) => (
    <g {...S}>
      <path d={`M120 70 L200 ${30 + Math.sin(a * 4) * 6} L200 ${150 + Math.sin(a * 4) * 6} L120 110 Z`} fill="#FFF3B0" stroke="none" opacity="0.8" />
      <rect x="20" y="70" width="80" height="40" rx="10" fill="#3B3F45" />
      <path d="M100 64 L124 56 L124 124 L100 116 Z" fill="#5E6670" />
    </g>
  ),
  food: (a) => (
    <g {...S}>
      <ellipse cx="100" cy="140" rx="84" ry="26" fill="#fff" />
      <path d="M40 132 Q40 80 100 80 Q160 80 160 132 Z" fill="#F2B83E" />
      {[70, 100, 130].map(x => <circle key={x} cx={x} cy="104" r="8" fill="#E25B5B" strokeWidth="3" />)}
      {[80, 110].map((x, i) => <path key={x} d={`M${x} ${66 - ((a * 30 + i * 10) % 20)} q8 -10 0 -20`} fill="none" stroke="#bbb" strokeWidth="5" />)}
    </g>
  ),
  lift: (a) => (
    <g {...S}>
      <rect x="40" y="20" width="120" height="164" rx="6" fill="#C3CCD3" />
      <rect x="54" y="52" width="92" height="132" fill="#D7DEE3" />
      <line x1="100" y1="52" x2="100" y2="184" strokeWidth="5" />
      <rect x="70" y="26" width="60" height="22" rx="4" fill="#1E2328" strokeWidth="3" />
      <text x="100" y="44" textAnchor="middle" fontSize="18" fontWeight="900" fill="#FF5A4E" stroke="none" fontFamily="Courier New, monospace">{1 + Math.floor(a * 3) % 9}</text>
    </g>
  ),
};

export const PROP_NAMES = [...Object.keys(DRAW), ...MOVER_NAMES];

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
export function Prop({ name, at, until, t, frame, fps, x, y, size = 330, held = false }) {
  // Animals and planes move into the scene itself instead of popping up in a bubble
  if (MOVER_NAMES.includes(name)) return <Creature name={name} at={at} until={until} t={t} />;
  const draw = DRAW[name];
  if (!draw || t < at || t > until + 0.25) return null;
  const pop = spring({ frame: frame - Math.round(at * fps), fps, config: { damping: 9, stiffness: 190 } });
  const out = t > until ? Math.max(0, 1 - (t - until) / 0.25) : 1;
  const k = pop * out;
  const bob = Math.sin((t - at) * 3) * 8;
  const tilt = (1 - pop) * -25 + Math.sin((t - at) * 2.2) * 3;
  const a = t - at;
  // A character is holding it: no bubble (cash still rains down the first time)
  if (held) return name === "cash" ? <CashRain a={a} /> : null;
  const flash = name === "police" ? (Math.floor(a * 4) % 2 ? "#2F6BFF" : "#FF2E2E") : null;
  return (
    <>
    {name === "cash" && <CashRain a={a} />}
    {name === "storm" && a < 1.2 && (a * 5) % 1 < 0.25 && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: 0.55 }} />}
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
