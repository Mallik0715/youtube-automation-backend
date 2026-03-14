

// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function generateScript(topic) {
//   try {
//     console.log("🤖 Generating AI script for:", topic);

//     // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//     // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//     const prompt = `
// You are a YouTube script writer for a facts channel.
// Write a short, engaging YouTube video script about: "${topic}"

// Rules:
// - Exactly 5 sentences
// - Each sentence is one amazing, specific, real fact
// - No intro like "In this video" or "Welcome"
// - No outro like "Subscribe" or "Like"
// - Each fact must be surprising and specific with real numbers or details
// - Write in simple, clear English
// - Return ONLY the 5 sentences, one per line, no numbering, no bullet points

// Example format:
// The human brain contains 86 billion neurons that can form over 100 trillion connections.
// Your brain is 73% water and losing just 2% of that water causes memory problems.
// ...
// `;

//     const result = await model.generateContent(prompt);
//     const script = result.response.text().trim();

//     console.log("✅ AI Script generated");
//     return script;

//   } catch (error) {
//     console.error("❌ Gemini error:", error.message);

//     // Fallback script if API fails
//     return `${topic} is one of the most fascinating subjects in the world.
// Scientists continue to make incredible discoveries about ${topic} every year.
// Many of these discoveries completely change how we understand our universe.
// Researchers have found surprising connections between ${topic} and everyday life.
// These amazing facts about ${topic} will completely change the way you see the world.`;
//   }
// }

// module.exports = { generateScript };


const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateScript(topic) {
  try {
    console.log("🤖 Generating AI script for:", topic);

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // free + high quality
      messages: [
        {
          role: "system",
          content: `You are a YouTube script writer for a facts channel.
Rules:
- Exactly 5 sentences
- Each sentence is one amazing, specific, real fact
- No intro like "In this video" or "Welcome"
- No outro like "Subscribe" or "Like"
- Each fact must be surprising and specific with real numbers or details
- Write in simple, clear English
- Return ONLY the 5 sentences, one per line, no numbering, no bullet points`,
        },
        {
          role: "user",
          content: `Write a short YouTube script about: "${topic}"`,
        },
      ],
      max_tokens: 500,
      temperature: 0.8,
    });

    const script = response.choices[0].message.content.trim();
    console.log("✅ AI Script generated");
    return script;

  } catch (error) {
    console.error("❌ Groq error:", error.message);

    return `${topic} is one of the most fascinating subjects in the world.
Scientists continue to make incredible discoveries about ${topic} every year.
Many of these discoveries completely change how we understand our universe.
Researchers have found surprising connections between ${topic} and everyday life.
These amazing facts about ${topic} will completely change the way you see the world.`;
  }
}

module.exports = { generateScript };