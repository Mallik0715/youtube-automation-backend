import React from "react";
import { Composition } from "remotion";
import { Skit } from "./Skit";

export const FPS = 30;

// Sample skit so `npm run studio` shows something without running the pipeline.
// Timings are estimated (~0.38s per word); real runs use the measured voice timings.
const demoLines = [
  { speaker: "B", emotion: "worried", text: "Why do I keep checking if she viewed my story?" },
  { speaker: "A", emotion: "smug", text: "Because your brain treats her attention like a slot machine." },
  { speaker: "B", emotion: "surprised", text: "A slot machine? I'm not gambling!" },
  { speaker: "A", emotion: "happy", text: "Random rewards hook you harder than steady ones. Every maybe feels like a jackpot." },
  { speaker: "B", emotion: "worried", text: "So the less she replies, the more I care?" },
  { speaker: "A", emotion: "neutral", text: "Exactly. Unpredictable is addictive. Consistent is safe." },
  { speaker: "B", emotion: "happy", text: "Okay, I'm muting her story right now." },
  { speaker: "A", emotion: "smug", text: "Says the guy refreshing it with his other hand." },
];
let t = 0.2;
const demo = demoLines.map(l => {
  const start = t;
  const end = start + l.text.split(" ").length * 0.38;
  t = end + 0.3;
  return { ...l, start, end };
});

export const Root = () => (
  <Composition
    id="Skit"
    component={Skit}
    fps={FPS}
    width={1080}
    height={1920}
    durationInFrames={FPS * 10}
    defaultProps={{ scene: "cafe", lines: demo, durationSeconds: t + 0.5, audio: null }}
    calculateMetadata={({ props }) => ({
      durationInFrames: Math.max(FPS, Math.ceil(props.durationSeconds * FPS)),
    })}
  />
);
