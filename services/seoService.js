const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateSEO(topic, script) {
  try {
    console.log("🔍 Generating SEO for:", topic);

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
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
      max_tokens: 500,
      temperature: 0.7,
    });

    const raw = response.choices[0].message.content.trim();
    const seo = JSON.parse(raw);

    console.log("✅ SEO generated:", seo.title);
    return seo;

  } catch (error) {
    console.error("❌ SEO generation error:", error.message);

    // Fallback SEO
    return {
      title: `${topic} 🤯 #Shorts`,
      description: `Amazing facts about ${topic} that will blow your mind! Watch till the end for the most shocking fact.\n\n#Shorts #Facts #${topic.replace(/\s+/g, "")}`,
      tags: [topic, "facts", "shorts", "amazingfacts", "didyouknow", "mindblowing", "educational", "viral", "fyp", "trending"],
    };
  }
}

module.exports = { generateSEO };