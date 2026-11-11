// Short helpers so series scripts read like a screenplay.
//
//   L("A", "smug", "Line of dialogue")                  -> Max speaks, smug face
//   L("B", "surprised", "What?!", { fx: "shake" })      -> with a camera shake
//   L("D", "neutral", "...", { hooded: true })          -> Bruno in a dark hood
//   V("A", "Leo... come outside...")                    -> eerie offscreen voice, using Max's voice
//   CARD("9:00 PM", "shake")                            -> silent black title card
//   CARD("10 MINUTES LATER", null, "knock")             -> ...with a sound effect
//   L("B", "smug", "...", { pose: "crossed", sfx: "footsteps" })
//      poses: neutral point hips crossed shrug shock worried (default: picked from the emotion)
//      sfx: knock thunder footsteps boom whoosh (shocks, scene changes and cliffhangers get sounds automatically)
//   seg("room", true, ["A", "B"], [ ...lines ])          -> a scene: place, night?, who is on screen (left to right)
//   seg("office", false, ["B", "F"], [...], { seated: ["F"] }) -> Victor sits (behind a desk in office/meeting scenes)
//
// Narrated series: a storyteller voice tells the story while the characters act it out silently.
//   N("At 3 AM, his phone buzzed.", { focus: "B", emotion: "surprised" })  -> camera on Leo, who reacts
//   N("Nobody slept that night.")                                          -> wide shot of everyone on screen
//   focus = who the camera shows (must be on screen); emotion/pose/fx/sfx work like L(). Characters can still
//   speak short lines with L() - one punchy line now and then makes the narration hit harder.
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
const N = (text, opts = {}) => ({ speaker: "N", emotion: "neutral", text, ...opts });
const CARD = (card, fx = null, sfx = null) => ({ card, fx, sfx });
const seg = (scene, night, cast, lines, opts = {}) => ({ scene, night, cast, lines, seated: opts.seated || [] });

module.exports = { L, V, N, CARD, seg };
