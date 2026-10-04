const { chat } = require("./groqClient");
const { parseLLMJson } = require("./jsonHelper");

// Picks stock-footage searches that match what the narration is actually saying.
// Searching with the topic title ("Why You Can't Stop...") returns nothing useful,
// so we ask for concrete, filmable things in the order they appear in the script.
async function getVisualQueries(topic, script, count = 6) {
  try {
    const response = await chat({
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You choose stock video footage for a narrated YouTube video.
Return ${count} search queries for a stock video site (Pixabay), in the order the ideas appear in the script.
Rules:
- 1 to 3 words each, concrete and filmable: people, actions, places, objects, nature, space
  (good: "couple holding hands", "woman thinking", "city night", "brain scan", "galaxy", "ocean waves")
- Never abstract words like "psychology", "attraction", "theory", "science", "facts"
- Each query should show something different
Return ONLY JSON: { "queries": ["...", "..."] }`,
        },
        { role: "user", content: `Topic: ${topic}\n\nScript:\n${script}` },
      ],
      max_completion_tokens: 1200,
      temperature: 0.5,
    });

    const { queries } = parseLLMJson(response.choices[0].message.content);
    const clean = (Array.isArray(queries) ? queries : [])
      .map(q => String(q).trim().toLowerCase())
      .filter(q => q && q.split(/\s+/).length <= 4)
      .slice(0, count);

    if (clean.length) {
      console.log("🎯 Visual searches:", clean.join(" | "));
      return clean;
    }
  } catch (err) {
    console.warn("⚠️ Visual query generation failed:", err.message);
  }
  return [];
}

module.exports = { getVisualQueries };
