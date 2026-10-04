const { chat } = require("./groqClient");
const { parseLLMJson } = require("./jsonHelper");


function fallbackSEO(topic) {
  return {
    title: `${topic} 🤯 #Shorts`,
    description: `Amazing facts about ${topic} that will blow your mind! Watch till the end for the most shocking fact.\n\n#Shorts #Facts #${topic.replace(/[^\w]/g, "")}`,
    tags: [topic, "facts", "shorts", "amazingfacts", "didyouknow", "mindblowing", "educational", "viral", "fyp", "trending"],
  };
}

// YouTube limits: title ≤ 100 chars, tags ≤ 500 chars total
function sanitizeSEO(seo, topic) {
  const fallback = fallbackSEO(topic);
  const title = typeof seo.title === "string" && seo.title.trim() ? seo.title.trim() : fallback.title;
  const description = typeof seo.description === "string" && seo.description.trim() ? seo.description.trim() : fallback.description;

  const tags = [];
  let tagChars = 0;
  for (const tag of Array.isArray(seo.tags) ? seo.tags : fallback.tags) {
    const clean = String(tag).replace(/[<>]/g, "").trim();
    if (!clean || tagChars + clean.length > 450) continue;
    tags.push(clean);
    tagChars += clean.length;
  }

  return {
    title: title.slice(0, 100),
    description: description.slice(0, 4900),
    tags,
  };
}

async function generateSEO(topic, script) {
  try {
    console.log("🔍 Generating SEO for:", topic);

    const response = await chat({
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a YouTube SEO expert for a facts/shorts channel.
Return ONLY a valid JSON object, no markdown, no backticks, no explanation.`,
        },
        {
          role: "user",
          content: `Generate YouTube SEO for a Shorts video about: "${topic}"
Script: "${script}"

Return this exact JSON format:
{
  "title": "catchy title under 60 chars with emojis",
  "description": "2-3 sentences description with keywords, end with relevant hashtags like #Shorts #Facts #[topic]",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"]
}`,
        },
      ],
      max_completion_tokens: 1500,
      temperature: 0.7,
    });

    const seo = sanitizeSEO(parseLLMJson(response.choices[0].message.content), topic);
    console.log("✅ SEO generated:", seo.title);
    return seo;

  } catch (error) {
    console.error("❌ SEO generation error, using fallback:", error.message);
    return fallbackSEO(topic);
  }
}

module.exports = { generateSEO };
