const { chat } = require("./groqClient");
const { parseLLMJson } = require("./jsonHelper");

const PROMPT = `You are a careful fact-checker for an educational YouTube channel.
Review the narration script. Fix any claim that is:
- false, or a popular myth
- exaggerated (inflated numbers, "always", "proven" when it's only suggested)
- a specific statistic, percentage, study, university, journal or year that you are not confident is real

Fix with the smallest possible edit: correct it, soften it ("research suggests...", "some studies found..."), or remove the number.
Keep everything else exactly as written: same hook, same structure, same number of lines, same tone, similar length.

Return ONLY JSON: { "issues": ["short description of each fix"], "script": "corrected script" }`;

// Second pass over generated scripts: models invent convincing-sounding stats even when told not to.
// Never blocks an upload — if the check itself fails, the original script is kept.
async function checkAccuracy(script, { maxTokens = 8000 } = {}) {
  try {
    const response = await chat({
      response_format: { type: "json_object" },
      reasoning_effort: "high",
      messages: [
        { role: "system", content: PROMPT },
        { role: "user", content: script },
      ],
      max_completion_tokens: maxTokens,
      temperature: 0.2,
    });

    const result = parseLLMJson(response.choices[0].message.content);
    const fixed = typeof result.script === "string" ? result.script.trim() : "";

    // Reject a "fix" that lost most of the script
    if (fixed.split(/\s+/).length < script.split(/\s+/).length * 0.6) {
      console.warn("⚠️ Accuracy check returned a much shorter script, keeping the original");
      return script;
    }

    const issues = Array.isArray(result.issues) ? result.issues : [];
    console.log(issues.length
      ? `🔎 Accuracy check fixed ${issues.length} issue(s):\n   - ${issues.join("\n   - ")}`
      : "🔎 Accuracy check: no issues");
    return fixed;
  } catch (err) {
    console.warn("⚠️ Accuracy check failed, keeping the original script:", err.message);
    return script;
  }
}

module.exports = { checkAccuracy };
