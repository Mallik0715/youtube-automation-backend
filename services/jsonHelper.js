// LLMs sometimes wrap JSON in ```json fences or add text around it.
// Pull out the first {...} block and parse that.
function parseLLMJson(raw) {
  const cleaned = raw.replace(/```(?:json)?/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error(`No JSON object in model output: ${raw.slice(0, 200)}`);
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

module.exports = { parseLLMJson };
