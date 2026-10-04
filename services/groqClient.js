const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Groq retires models regularly (the Llama 3.x models are gone). Override with GROQ_MODEL
// instead of editing every service. Check available models: GET https://api.groq.com/openai/v1/models
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

// gpt-oss is a reasoning model: keep reasoning short and leave room for the answer
function chat(params) {
  return groq.chat.completions.create({
    model: MODEL,
    reasoning_effort: "low",
    ...params,
  });
}

module.exports = { chat, MODEL };
