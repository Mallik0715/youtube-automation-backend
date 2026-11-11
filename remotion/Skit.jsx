import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, FLOOR_Y, NIGHT_OVERLAY, backgroundKey } from "./Background";
import { Character, LOOKS } from "./Character";
import { loadFont } from "@remotion/google-fonts/Montserrat";

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
// Bundled Google font so captions look identical on Windows and on GitHub's Linux runners
// (Linux has no Arial Black and fell back to a thin font)
const { fontFamily: MONTSERRAT } = loadFont("normal", { weights: ["900"], subsets: ["latin"] });
const FONT = `${MONTSERRAT}, "Arial Black", "Segoe UI Black", sans-serif`;
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

// Slower ease for arm gestures than for the mouth, so arms glide instead of snapping
const GESTURE_EASE = 0.3;
function gestureAmount(lines, who, t) {
  for (const l of lines) {
    if (l.speaker === who && t >= l.start - GESTURE_EASE && t <= l.end + GESTURE_EASE) {
      const k = Math.min(1, (t - (l.start - GESTURE_EASE)) / GESTURE_EASE, (l.end + GESTURE_EASE - t) / GESTURE_EASE);
      return 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, k)); // smoothstep-like
    }
  }
  return 0;
}

const castOf = (l) => l.cast || DEFAULT_CAST;
// Same background and lighting
const samePlace = (a, b) => !!a && !!b && a.scene === b.scene && !!a.night === !!b.night;
// Same place and same people on screen -> the camera can glide; otherwise it's a new scene
const sameSetting = (a, b, scene) =>
  !!a && !!b && (a.scene || scene) === (b.scene || scene) && !!a.night === !!b.night && castOf(a).join() === castOf(b).join();

// First line index of the run of lines sharing line i's setting
function settingStart(lines, i, scene) {
  let j = i;
  while (j > 0 && sameSetting(lines[j - 1], lines[j], scene)) j--;
  return j;
}

// Shot for line i. Like edited cartoons: open each setting on a wide shot, then cut to the speaker
// alone ("single") line by line, coming back to the wide shot every few lines to re-establish.
// Offscreen voices and title cards use the wide shot.
function shotType(lines, i, scene) {
  const line = lines[i];
  if (!castOf(line).includes(line.speaker)) return "wide";
  const k = i - settingStart(lines, i, scene);
  return k === 0 || k % 4 === 3 ? "wide" : "single";
}

// Pose for a line: explicit line.pose, otherwise picked from the emotion (varied by line so it isn't repetitive)
function autoPose(line, i) {
  if (!line) return "neutral";
  if (line.pose) return line.pose;
  switch (line.emotion) {
    case "smug": return i % 2 ? "crossed" : "hips";
    case "surprised": return line.fx === "shake" ? "shock" : "shrug";
    case "happy": return i % 2 ? "shrug" : "neutral";
    case "worried": return "worried";
    default: return ["neutral", "point", "hips"][i % 3];
  }
}

function poseState(lines, who, t) {
  const own = [];
  lines.forEach((l, i) => { if (l.speaker === who) own.push(i); });
  const started = own.filter(i => lines[i].start <= t);
  const cur = started.length ? started[started.length - 1] : own[0];
  if (cur === undefined) return { pose: "neutral", prevPose: "neutral", poseK: 1 };
  const prev = started.length > 1 ? started[started.length - 2] : null;
  const k = Math.max(0, Math.min(1, (t - lines[cur].start) / 0.3));
  return {
    pose: autoPose(lines[cur], cur),
    prevPose: prev === null ? autoPose(lines[cur], cur) : autoPose(lines[prev], prev),
    poseK: 0.5 - 0.5 * Math.cos(Math.PI * k),
  };
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
      fontFamily: FONT,
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
        fontFamily: FONT, fontWeight: 900,
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
      {(() => {
        // *stars* can wrap one word or several: "*same Tuesday*"
        let inside = false;
        return words.map((w, i) => {
          const opens = w.startsWith("*");
          if (opens) inside = true;
          const hot = inside;
          if (w.replace(/[.,!?'"…]+$/, "").endsWith("*")) inside = false;
          return (
            <span key={i} style={{ color: hot ? "#FFD84A" : "#fff" }}>
              {w.replace(/\*/g, "")}{i < words.length - 1 ? " " : ""}
            </span>
          );
        });
      })()}
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
        fontFamily: FONT, fontWeight: 900, fontSize: 118, lineHeight: 1.05, padding: "0 50px",
        color: "#FFC93C", WebkitTextStroke: "12px #000", paintOrder: "stroke fill", textAlign: "center",
      }}>
        {card.title}
      </div>
      {card.subtitle && (
        <div style={{
          opacity: fade, fontFamily: FONT, fontWeight: 900,
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
 *          endCard?: {title: string, subtitle?: string, start: number}|null, audio?: string|null,
 *          mouth?: number[]|null, backgrounds?: string[]}} props
 *   Each line: speaker (A-F, V = offscreen voice, CARD = title card), text, emotion, start, end,
 *   and optionally scene / night / cast / fx ("shake" | "echo" | "radio" | "robot") / hooded / pose.
 *   mouth: voice loudness per frame (0..1) for real lip sync. backgrounds: painted background keys available.
 *   audio: optional file in the public dir, for previewing with sound in Remotion Studio
 */
export function Skit({ scene, lines, hook, endCard, audio, mouth = null, backgrounds = [] }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const idx = currentLineIndex(lines, t);
  const line = lines[idx];
  const sceneName = line.scene || scene;
  const night = !!line.night;
  const cast = line.cast || DEFAULT_CAST;
  const people = layoutFor(cast);

  // Slow push-in through each shot so the picture is never completely still
  const next = lines[idx + 1];
  const shotEnd = next ? next.start : line.end + 1;
  const progress = Math.max(0, Math.min(1, (t - line.start) / Math.max(0.1, shotEnd - line.start)));
  const z = 1 + 0.035 * progress;
  const shot = shotType(lines, idx, scene);

  // Fade through black when the place or lighting changes
  const runStart = settingStart(lines, idx, scene);
  let nextRun = idx + 1;
  while (nextRun < lines.length && sameSetting(lines[nextRun - 1], lines[nextRun], scene)) nextRun++;
  const fadeIn = runStart > 0 && !samePlace(lines[runStart - 1], line)
    ? interpolate(t - lines[runStart].start, [0, 0.3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const fadeOut = nextRun < lines.length && !samePlace(lines[nextRun], line)
    ? interpolate(lines[nextRun].start - t, [0, 0.2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const blackout = Math.max(fadeIn, fadeOut);

  // Same place, new cast: everyone glides to their new spot and newcomers walk in
  const prevRun = runStart > 0 && samePlace(lines[runStart - 1], line) ? lines[runStart - 1] : null;
  const prevPeople = prevRun ? layoutFor(castOf(prevRun)) : [];
  const enter = prevRun
    ? spring({ frame: frame - Math.round(lines[runStart].start * fps), fps, config: { damping: 16, mass: 0.8 }, durationInFrames: 24 })
    : 1;
  const shake = shakeOffset(line, t);

  // Facing: left half looks right, right half looks left; the middle one looks at whoever spoke last
  const lastOther = (who) => [...lines].reverse().find(l => l.start <= t && l.speaker !== who && cast.includes(l.speaker));
  const facesLeft = (who, i) => {
    if (cast.length === 1) return false;
    if (cast.length === 3 && i === 1) {
      const other = lastOther(who);
      return other ? cast.indexOf(other.speaker) === 0 : false;
    }
    return i >= cast.length / 2;
  };

  // Real lip sync: loudness of the voice track this frame, lightly smoothed
  const level = mouth ? Math.max(mouth[frame] || 0, 0.6 * (mouth[frame - 1] || 0)) : null;

  const seatedHere = line.seated || [];
  const deskScenes = ["office", "meeting"];
  const renderCharacter = (who, i) => {
    const ps = poseState(lines, who, t);
    const seated = seatedHere.includes(who);
    return (
      <Character
        who={who}
        frame={frame}
        talk={talkAmount(lines, who, t)}
        gesture={gestureAmount(lines, who, t)}
        emotion={stateLine(lines, who, t)?.emotion || "neutral"}
        hooded={isHooded(lines, who, t)}
        voice={line.speaker === who ? level : null}
        pose={ps.pose}
        prevPose={ps.prevPose}
        poseK={ps.poseK}
        listening={line.speaker !== who && cast.includes(line.speaker)}
        seated={seated}
        desk={seated && deskScenes.includes(sceneName) ? (shot === "single" ? "wide" : "narrow") : false}
      />
    );
  };

  const bakedNight = backgrounds.includes(backgroundKey(sceneName, night));
  const overlay = NIGHT_OVERLAY[sceneName] ?? 0.3;
  const nightOverlay = night && !bakedNight && (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 60%, rgba(30,40,90,${overlay * 0.6}) 0%, rgba(8,10,30,${Math.min(0.9, overlay * 1.5)}) 100%)`,
      mixBlendMode: "multiply",
    }} />
  );

  let stage;
  if (shot === "single") {
    // The speaker alone, bigger, with the background panned to suggest the camera turned to face them
    const i = cast.indexOf(line.speaker);
    const left = facesLeft(line.speaker, i);
    // Knees-up framing: head around 45% down the screen, legs run off the bottom (seated: same head height)
    const S = 2.0;
    const w = 400 * S;
    const charLeft = 540 - w / 2 + (left ? 70 : -70);
    const seatedHere1 = (line.seated || []).includes(line.speaker);
    const charTop = 860 - 150 * S - (seatedHere1 ? 150 * S : 0);
    stage = (
      <AbsoluteFill style={{ transform: `translate(${shake.x}px, ${shake.y}px) scale(${z})`, transformOrigin: "50% 45%" }}>
        <AbsoluteFill style={{ transform: `translateX(${left ? -110 : 110}px) scale(1.25)`, transformOrigin: "50% 50%" }}>
          <Background scene={sceneName} frame={frame} night={night} images={backgrounds} />
        </AbsoluteFill>
        <div style={{
          position: "absolute", left: charLeft, top: charTop, width: w, height: 900 * S,
          transform: left ? "scaleX(-1)" : undefined,
        }}>
          {renderCharacter(line.speaker, i)}
        </div>
        {nightOverlay}
      </AbsoluteFill>
    );
  } else {
    stage = (
      <AbsoluteFill style={{ transform: `translate(${shake.x}px, ${shake.y}px) scale(${z})`, transformOrigin: "50% 55%" }}>
        <Background scene={sceneName} frame={frame} night={night} images={backgrounds} />
        {people.map((p, i) => {
          const before = prevPeople.find(q => q.who === p.who);
          // Newcomers on the edges walk in from their side; a newcomer in the middle fades in and
          // steps up into place (so they never walk across anyone). Everyone else slides to their new spot.
          const isNew = !before && !!prevRun;
          const middle = cast.length === 3 && i === 1;
          const startLeft = before ? before.left : isNew && !middle ? (i === 0 ? -p.w - 40 : 1080 + 40) : p.left;
          const rise = isNew && middle ? (1 - enter) * 120 : 0;
          const opacity = isNew && middle ? Math.min(1, enter * 1.4) : 1;
          const startW = before ? before.w : p.w;
          const pLeft = startLeft + (p.left - startLeft) * enter;
          const w = startW + (p.w - startW) * enter;
          const top = (before ? before.top : p.top) + (p.top - (before ? before.top : p.top)) * enter;
          const h = (before ? before.h : p.h) + (p.h - (before ? before.h : p.h)) * enter;
          return (
            <div key={p.who} style={{
              position: "absolute", left: pLeft, top: top + rise, width: w, height: h, opacity,
              transform: facesLeft(p.who, i) ? "scaleX(-1)" : undefined,
            }}>
              {renderCharacter(p.who, i)}
            </div>
          );
        })}
        {nightOverlay}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {stage}
      {blackout > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${blackout})` }} />}
      <Captions lines={lines} t={t} frame={frame} fps={fps} />
      {line.speaker === "CARD" && t <= line.end + 0.3 && <TitleCard line={line} t={t} frame={frame} fps={fps} />}
      {hook && line.speaker !== "CARD" && !(endCard && t >= endCard.start) && <HookBanner text={hook} frame={frame} fps={fps} />}
      {endCard && <EndCard card={endCard} t={t} frame={frame} fps={fps} />}
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
}
