// Google Gemini (AI Studio API key in GEMINI_API_KEY). Used to write series scripts.
// Models are tried in order: when one is overloaded ("high demand", 503) or rate-limited, the next one
// is used. Override with GEMINI_MODELS (comma-separated) or GEMINI_MODEL (just one).
// List the models your key can use:  GET https://generativelanguage.googleapis.com/v1beta/models
const axios = require("axios");
const { parseLLMJson } = require("./jsonHelper");

const MODELS = (process.env.GEMINI_MODELS || process.env.GEMINI_MODEL || "gemini-3.8-flash,gemini-3.5-flash,gemini-flash-latest,gemini-flash-lite-latest")
  .split(",").map(s => s.trim()).filter(Boolean);
const URL = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Remembers which model last worked, so the next request starts there instead of re-trying busy ones
let preferred = 0;

async function callModel(model, body, key) {
  const res = await axios.post(URL(model), body, { headers: { "x-goog-api-key": key }, timeout: 240000 });
  const cand = res.data.candidates?.[0];
  const text = (cand?.content?.parts || []).map(p => p.text || "").join("");
  if (!text) throw new Error(`no text (finish reason: ${cand?.finishReason || res.data.promptFeedback?.blockReason || "unknown"})`);
  return parseLLMJson(text);
}

/**
 * Asks Gemini for a JSON answer. Busy models are skipped; when every model is busy it waits and goes round again.
 * @param {{system: string, user: string, maxTokens?: number, temperature?: number, rounds?: number, onLog?: (m: string) => void}} opts
 * @returns {Promise<{data: object, model: string}>}
 */
async function askGeminiJSON({ system, user, maxTokens = 16000, temperature = 0.8, rounds = 3, onLog = () => {} }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set in .env");
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts: [{ text: user }] }],
    generationConfig: { responseMimeType: "application/json", temperature, maxOutputTokens: maxTokens },
  };
  let lastError;
  for (let round = 0; round < rounds; round++) {
    for (let k = 0; k < MODELS.length; k++) {
      const i = (preferred + k) % MODELS.length;
      const model = MODELS[i];
      try {
        const data = await callModel(model, body, key);
        preferred = i;
        return { data, model };
      } catch (err) {
        const status = err.response?.status;
        const detail = err.response?.data?.error?.message || err.message;
        lastError = new Error(`Gemini ${model}: ${status || ""} ${detail}`.trim());
        // Bad key / bad request: no point trying other models
        if ([400, 401, 403].includes(status)) throw lastError;
        onLog(`   ${model} unavailable (${status || detail.slice(0, 60)}) - trying the next model`);
      }
    }
    if (round < rounds - 1) {
      onLog("   all Gemini models busy - waiting 30s");
      await sleep(30000);
    }
  }
  throw lastError;
}

module.exports = { askGeminiJSON, GEMINI_MODELS: MODELS };
