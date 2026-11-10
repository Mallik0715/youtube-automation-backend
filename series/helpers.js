// Short helpers so series scripts read like a screenplay.
//
//   L("A", "smug", "Line of dialogue")                  -> Max speaks, smug face
//   L("B", "surprised", "What?!", { fx: "shake" })      -> with a camera shake
//   L("D", "neutral", "...", { hooded: true })          -> Bruno in a dark hood
//   V("A", "Leo... come outside...")                    -> eerie offscreen voice, using Max's voice
//   CARD("9:00 PM", "shake")                            -> silent black title card
//   seg("room", true, ["A", "B"], [ ...lines ])          -> a scene: place, night?, who is on screen (left to right)
//
// Speakers: A Max · B Leo · C Mira · D Bruno · E Zara · F Victor · V offscreen voice
// voiceOf for V: any speaker code, or "child", "radio" (crackly radio voice), "robot" (app/AI voice)

const L = (speaker, emotion, text, opts = {}) => ({ speaker, emotion, text, ...opts });
const V = (voiceOf, text, opts = {}) => ({
  speaker: "V",
  voiceOf,
  fx: voiceOf === "radio" ? "radio" : voiceOf === "robot" ? "robot" : "echo",
  text,
  ...opts,
});
const CARD = (card, fx = null) => ({ card, fx });
const seg = (scene, night, cast, lines) => ({ scene, night, cast, lines });

module.exports = { L, V, CARD, seg };
