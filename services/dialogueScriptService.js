const { chat } = require("./groqClient");
const { parseLLMJson } = require("./jsonHelper");

// Must match the scenes drawn in remotion/Background.jsx
const SCENES = ["office", "street", "home", "cafe", "park"];
const EMOTIONS = ["neutral", "happy", "worried", "surprised", "smug"];

// Two recurring characters, so viewers recognise them from video to video.
// A = the one who explains, B = the one living through the psychology.
const CHARACTERS = {
  A: { name: "Max", role: "confident friend who knows the psychology and explains it with jokes" },
  B: { name: "Leo", role: "relatable, slightly anxious friend who is going through the situation" },
};

/**
 * Writes a short two-character skit that teaches the topic's psychology.
 * Throws on failure (same as scriptService) so a bad run is retried with the same topic.
 * @returns {Promise<{scene: string, lines: {speaker: "A"|"B", text: string, emotion: string}[]}>}
 */
async function generateDialogue(topic) {
  console.log("🎭 Generating skit dialogue for:", topic);

  const response = await chat({
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You write funny, viral 30-45 second YouTube Shorts skits for a psychology channel.
Two cartoon characters talk:
- A = ${CHARACTERS.A.name}: ${CHARACTERS.A.role}
- B = ${CHARACTERS.B.name}: ${CHARACTERS.B.role}

Write 7 to 10 lines of dialogue that:
1. Opens with a hook line in the middle of a relatable situation (no greetings, no "Hey Max").
2. Teaches one real, well-established psychological insight about the topic, through the conversation.
3. Has at least one laugh and a twist, and ends on a punchline or a line people will want to share.

Rules:
- Each line under 16 words, simple spoken English, punchy.
- Characters alternate mostly, but the same speaker can talk twice in a row.
- Never name universities, journals, years or studies. Only include numbers you are confident are accurate.
- No "subscribe", no "in this video", no stage directions inside the text.
- scene: the best fitting place, one of: ${SCENES.join(", ")}
- emotion per line, one of: ${EMOTIONS.join(", ")}

Return ONLY JSON:
{ "scene": "...", "lines": [ { "speaker": "A", "text": "...", "emotion": "..." } ] }`,
      },
      { role: "user", content: `Topic: "${topic}"` },
    ],
    max_completion_tokens: 2000,
    temperature: 0.9,
  });

  const data = parseLLMJson(response.choices[0].message.content || "");

  const lines = (Array.isArray(data.lines) ? data.lines : [])
    .map(l => ({
      speaker: String(l.speaker).trim().toUpperCase() === "B" ? "B" : "A",
      text: String(l.text || "").replace(/\s+/g, " ").trim(),
      emotion: EMOTIONS.includes(l.emotion) ? l.emotion : "neutral",
    }))
    .filter(l => l.text);

  if (lines.length < 4) {
    throw new Error(`Dialogue too short: ${JSON.stringify(data).slice(0, 300)}`);
  }

  const scene = SCENES.includes(data.scene) ? data.scene : SCENES[Math.floor(Math.random() * SCENES.length)];

  console.log(`✅ Dialogue: ${lines.length} lines, scene "${scene}"`);
  lines.forEach(l => console.log(`   ${CHARACTERS[l.speaker].name}: ${l.text}`));
  return { scene, lines };
}

// Plain text version of the skit, used for SEO generation
function dialogueToScript(dialogue) {
  return dialogue.lines.map(l => `${CHARACTERS[l.speaker].name}: ${l.text}`).join("\n");
}

module.exports = { generateDialogue, dialogueToScript, CHARACTERS, SCENES };
