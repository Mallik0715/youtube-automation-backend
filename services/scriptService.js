const { chat } = require("./groqClient");

// Rotating hook styles so consecutive videos don't all open the same way
const HOOK_STYLES = [
  'a direct confrontation that targets something the viewer has felt ("You\'ve done this with someone you liked - and never knew why.")',
  'a false-assumption callout ("You think it\'s about looks. It isn\'t.")',
  'a surprising, specific claim stated plainly, with no "did you know"',
  'a "what happens when" setup that promises a payoff ("Here\'s what your brain does the second someone ignores you.")',
  'a relatable question the viewer will want answered ("Why do you replay that one embarrassing moment at night?")',
];

// Throws on failure instead of returning a template script: a failed run is retried
// with the same topic next time, whereas a template script would get uploaded as-is.
async function generateScript(topic) {
  console.log("🤖 Generating AI script for:", topic);

  const hookStyle = HOOK_STYLES[Math.floor(Math.random() * HOOK_STYLES.length)];

  const response = await chat({
    messages: [
      {
        role: "system",
        content: `You are a viral YouTube Shorts script writer for a psychology channel (relationships, attraction, the hidden mind).

Write EXACTLY 6 sentences, one per line, no numbering, no bullet points:
1. HOOK - under 15 words. Style for this video: ${hookStyle}. Do NOT start with "Did you know".
2. SETUP - confirm the experience and state the question the video answers.
3. EXPLANATION PART 1 - the first layer of the real psychological explanation.
4. TWIST - a surprising detail that deepens it ("But here's the strange part...").
5. PAYOFF - the full answer to the hook.
6. BUTTON - one final insight the viewer will want to share or comment on.

Rules:
- Every sentence must contain a real, specific insight - no filler.
- Only use well-established findings. Only include a number if it is widely cited and you are confident it is accurate.
- Never attribute claims to a named university, journal, year or study.
- Second person ("you", "your"), simple conversational English, short punchy sentences.
- No intro like "In this video" or "Welcome." No outro like "Subscribe" or "Like."
- Return ONLY the 6 sentences.`,
      },
      {
        role: "user",
        content: `Write a viral YouTube Shorts script about: "${topic}"`,
      },
    ],
    max_completion_tokens: 1500,
    temperature: 0.8,
  });

  const script = (response.choices[0].message.content || "").trim();
  if (script.split(/\s+/).length < 30) {
    throw new Error(`Script too short or empty: "${script}"`);
  }

  console.log("✅ AI Script generated");
  return script;
}

module.exports = { generateScript };
