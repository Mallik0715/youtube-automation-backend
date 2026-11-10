import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, FLOOR_Y, NIGHT_OVERLAY } from "./Background";
import { Character, LOOKS } from "./Character";

// Character placement (px on the 1080x1920 canvas). The SVG is 400x900 units, feet at y=868.
const FEET_Y = FLOOR_Y + 330;
const LAYOUTS = {
  1: { scale: 1.15, lefts: [310] },
  2: { scale: 1.15, lefts: [40, 1080 - 40 - 400 * 1.15] },
  3: { scale: 0.98, lefts: [-10, 344, 698] },
};

const EASE = 0.12; // seconds for the mouth/gesture to ease in and out at line edges
const WORDS_PER_CAPTION = 3;
const GHOST_RED = "#FF4D4D";
// Offscreen voice caption colours: ghosts red, radios green, apps/AI cyan
const VOICE_COLORS = { radio: "#7CFF6B", robot: "#5CE1E6" };
const FONT = '"Arial Black", "Segoe UI Black", "DejaVu Sans", sans-serif';
const DEFAULT_CAST = ["A", "B"];

function layoutFor(cast) {
  const layout = LAYOUTS[Math.min(3, Math.max(1, cast.length))];
  const w = 400 * layout.scale;
  const top = FEET_Y - 868 * layout.scale;
  return cast.map((who, i) => ({
    who,
    left: layout.lefts[i],
    top,
    w,
    h: 900 * layout.scale,
    head: { x: layout.lefts[i] + 200 * layout.scale, y: top + 210 * layout.scale },
  }));
}

function talkAmount(lines, who, t) {
  for (const l of lines) {
    if (l.speaker === who && t >= l.start && t <= l.end) {
      return Math.max(0, Math.min(1, (t - l.start) / EASE, (l.end - t) / EASE));
    }
  }
  return 0;
}

// Latest line this character has started, or their first upcoming one
function stateLine(lines, who, t) {
  const own = lines.filter(l => l.speaker === who);
  const started = own.filter(l => l.start <= t);
  return started.length ? started[started.length - 1] : own[0];
}

// Hooded until the hooded line (current or next one of theirs) is over
function isHooded(lines, who, t) {
  const next = lines.find(l => l.speaker === who && l.end >= t);
  return !!next?.hooded;
}

function currentLineIndex(lines, t) {
  let idx = 0;
  lines.forEach((l, i) => { if (l.start <= t) idx = i; });
  return idx;
}

function shakeOffset(line, t, strength = 22) {
  if (line?.fx !== "shake") return { x: 0, y: 0 };
  const k = t - line.start;
  if (k < 0 || k > 0.7) return { x: 0, y: 0 };
  const amp = strength * (1 - k / 0.7);
  return { x: Math.sin(k * 90) * amp, y: Math.cos(k * 70) * amp * 0.7 };
}

function Captions({ lines, t, frame, fps }) {
  const line = lines.find(l => l.speaker !== "CARD" && t >= l.start && t <= l.end + 0.15);
  if (!line) return null;

  const words = line.text.split(/\s+/).filter(Boolean);
  const perWord = (line.end - line.start) / words.length;
  const wordIdx = Math.min(words.length - 1, Math.max(0, Math.floor((t - line.start) / perWord)));
  const chunkStart = Math.floor(wordIdx / WORDS_PER_CAPTION) * WORDS_PER_CAPTION;
  const chunk = words.slice(chunkStart, chunkStart + WORDS_PER_CAPTION);

  const chunkFrame = Math.round((line.start + chunkStart * perWord) * fps);
  const pop = spring({ frame: frame - chunkFrame, fps, config: { damping: 12, stiffness: 220 }, durationInFrames: 8 });
  const offscreen = line.speaker === "V";
  const ghostColor = VOICE_COLORS[line.voiceOf] || GHOST_RED;
  const ghost = offscreen && line.fx === "echo";
  const accent = offscreen ? ghostColor : LOOKS[line.speaker]?.accent || "#FFC93C";
  // The offscreen voice trembles
  const tremble = ghost ? `translate(${Math.sin(frame * 1.3) * 4}px, ${Math.cos(frame * 1.7) * 3}px)` : "";

  return (
    <div style={{
      position: "absolute", top: 430, left: 70, right: 70, textAlign: "center",
      transform: `${tremble} scale(${0.75 + 0.25 * pop})`,
      fontFamily: '"Arial Black", "Segoe UI Black", "DejaVu Sans", sans-serif',
      fontWeight: 900, fontSize: 108, lineHeight: 1.1, textTransform: "uppercase",
      fontStyle: offscreen ? "italic" : "normal",
      WebkitTextStroke: "14px #000", paintOrder: "stroke fill",
      textShadow: offscreen ? `0 0 30px ${ghostColor}` : "0 8px 0 rgba(0,0,0,0.35)",
    }}>
      {chunk.map((w, i) => (
        <span key={i} style={{ color: offscreen ? (chunkStart + i === wordIdx ? "#fff" : ghostColor) : chunkStart + i === wordIdx ? accent : "#fff" }}>
          {w}{i < chunk.length - 1 ? " " : ""}
        </span>
      ))}
    </div>
  );
}

function TitleCard({ line, t, frame, fps }) {
  const startFrame = Math.round(line.start * fps);
  const pop = spring({ frame: frame - startFrame, fps, config: { damping: 9, stiffness: 160 } });
  const s = shakeOffset(line, t, 30);
  return (
    <AbsoluteFill style={{ backgroundColor: "#050508", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        transform: `translate(${s.x}px, ${s.y}px) scale(${0.6 + 0.4 * pop})`,
        fontFamily: '"Arial Black", "Segoe UI Black", "DejaVu Sans", sans-serif', fontWeight: 900,
        fontSize: 170, color: "#fff", letterSpacing: 6, textShadow: `0 0 50px ${GHOST_RED}, 0 0 12px ${GHOST_RED}`,
      }}>
        {line.text}
      </div>
    </AbsoluteFill>
  );
}

// The hook headline: stays on screen so anyone scrolling past mid-video knows why to stay.
// Wrap a word in *stars* to highlight it in yellow.
function HookBanner({ text, frame, fps }) {
  const pop = spring({ frame, fps, config: { damping: 11, stiffness: 180 } });
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <div style={{
      position: "absolute", top: 110, left: 50, right: 50, textAlign: "center",
      transform: `scale(${0.6 + 0.4 * pop})`, transformOrigin: "50% 0%",
      fontFamily: FONT, fontWeight: 900, fontSize: 64, lineHeight: 1.12, textTransform: "uppercase",
      WebkitTextStroke: "10px #000", paintOrder: "stroke fill", textShadow: "0 6px 0 rgba(0,0,0,0.4)",
    }}>
      {words.map((w, i) => {
        const hot = /^\*.*\*[.,!?…]*$/.test(w);
        return (
          <span key={i} style={{ color: hot ? "#FFD84A" : "#fff" }}>
            {w.replace(/\*/g, "")}{i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
}

function EndCard({ card, t, frame, fps }) {
  const k = t - card.start;
  if (k < 0) return null;
  const fade = interpolate(k, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const pop = spring({ frame: frame - Math.round(card.start * fps), fps, config: { damping: 10, stiffness: 140 } });
  const pulse = 1 + 0.04 * Math.sin(k * 6);
  return (
    <AbsoluteFill style={{ backgroundColor: `rgba(5,5,10,${0.88 * fade})`, alignItems: "center", justifyContent: "center", gap: 30 }}>
      <div style={{
        transform: `scale(${(0.5 + 0.5 * pop) * pulse})`,
        fontFamily: '"Arial Black", "Segoe UI Black", "DejaVu Sans", sans-serif', fontWeight: 900, fontSize: 118, lineHeight: 1.05, padding: "0 50px",
        color: "#FFC93C", WebkitTextStroke: "12px #000", paintOrder: "stroke fill", textAlign: "center",
      }}>
        {card.title}
      </div>
      {card.subtitle && (
        <div style={{
          opacity: fade, fontFamily: '"Arial Black", "Segoe UI Black", "DejaVu Sans", sans-serif', fontWeight: 900,
          fontSize: 56, color: "#fff", textAlign: "center", padding: "0 60px",
        }}>
          {card.subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
}

/**
 * @param {{scene: string, lines: object[], durationSeconds: number, hook?: string|null,
 *          endCard?: {title: string, subtitle?: string, start: number}|null, audio?: string|null}} props
 *   Each line: speaker (A-D, V = offscreen voice, CARD = title card), text, emotion, start, end,
 *   and optionally scene / night / cast / fx ("shake" | "echo") / hooded.
 *   audio: optional file in the public dir, for previewing with sound in Remotion Studio
 */
export function Skit({ scene, lines, hook, endCard, audio }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const idx = currentLineIndex(lines, t);
  const line = lines[idx];
  const sceneName = line.scene || scene;
  const night = !!line.night;
  const cast = line.cast || DEFAULT_CAST;
  const people = layoutFor(cast);

  // "Camera": a hard cut per line, alternating wide shots with close-ups on whoever is talking,
  // plus a slow push-in during each shot so nothing is ever completely still
  const next = lines[idx + 1];
  const shotEnd = next ? next.start : line.end + 1;
  const progress = Math.max(0, Math.min(1, (t - line.start) / Math.max(0.1, shotEnd - line.start)));
  const speakerSpot = people.find(p => p.who === line.speaker);
  const closeUp = !!speakerSpot && idx % 2 === 1;
  const scale = (closeUp ? 1.45 : 1) * (1 + 0.04 * progress);
  let dx = 0;
  let origin = "540px 1100px";
  if (closeUp) {
    const head = speakerSpot.head;
    // Shift toward centring the speaker, but never so far that the scene's edge shows
    const dxMin = (1080 - head.x) * (1 - scale);
    const dxMax = head.x * (scale - 1);
    dx = Math.max(dxMin, Math.min(dxMax, (540 - head.x) * 0.7));
    origin = `${head.x}px ${head.y}px`;
  }
  const shake = shakeOffset(line, t);

  // Facing: left half looks right, right half looks left; the middle one looks at whoever spoke last
  const lastOther = (who) => [...lines].reverse().find(l => l.start <= t && l.speaker !== who && cast.includes(l.speaker));
  const facesLeft = (p, i) => {
    if (cast.length === 1) return false;
    if (cast.length === 3 && i === 1) {
      const other = lastOther(p.who);
      return other ? cast.indexOf(other.speaker) === 0 : false;
    }
    return i >= cast.length / 2;
  };

  const overlay = NIGHT_OVERLAY[sceneName] ?? 0.3;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${dx + shake.x}px, ${shake.y}px) scale(${scale})`, transformOrigin: origin }}>
        <Background scene={sceneName} frame={frame} night={night} />
        {people.map((p, i) => (
          <div key={p.who} style={{
            position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h,
            transform: facesLeft(p, i) ? "scaleX(-1)" : undefined,
          }}>
            <Character
              who={p.who}
              frame={frame}
              talk={talkAmount(lines, p.who, t)}
              emotion={stateLine(lines, p.who, t)?.emotion || "neutral"}
              hooded={isHooded(lines, p.who, t)}
            />
          </div>
        ))}
        {night && (
          <AbsoluteFill style={{
            background: `radial-gradient(ellipse at 50% 60%, rgba(30,40,90,${overlay * 0.6}) 0%, rgba(8,10,30,${Math.min(0.9, overlay * 1.5)}) 100%)`,
            mixBlendMode: "multiply",
          }} />
        )}
      </AbsoluteFill>
      <Captions lines={lines} t={t} frame={frame} fps={fps} />
      {line.speaker === "CARD" && t <= line.end + 0.3 && <TitleCard line={line} t={t} frame={frame} fps={fps} />}
      {hook && line.speaker !== "CARD" && <HookBanner text={hook} frame={frame} fps={fps} />}
      {endCard && <EndCard card={endCard} t={t} frame={frame} fps={fps} />}
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
}
