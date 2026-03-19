
// const Groq = require("groq-sdk");

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// async function generateScript(topic) {
//   try {
//     console.log("🤖 Generating AI script for:", topic);

//     const response = await groq.chat.completions.create({
//       model: "llama-3.3-70b-versatile", // free + high quality
//       messages: [
//         {
//           role: "system",
//           content: `You are a YouTube script writer for a facts channel.
// Rules:
// - Exactly 5 sentences
// - Each sentence is one amazing, specific, real fact
// - No intro like "In this video" or "Welcome"
// - No outro like "Subscribe" or "Like"
// - Each fact must be surprising and specific with real numbers or details
// - Write in simple, clear English
// - Return ONLY the 5 sentences, one per line, no numbering, no bullet points`,
//         },
//         {
//           role: "user",
//           content: `Write a short YouTube script about: "${topic}"`,
//         },
//       ],
//       max_tokens: 500,
//       temperature: 0.8,
//     });

//     const script = response.choices[0].message.content.trim();
//     console.log("✅ AI Script generated");
//     return script;

//   } catch (error) {
//     console.error("❌ Groq error:", error.message);

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
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a viral YouTube Shorts script writer.
Rules:
- Exactly 5 sentences
- ALWAYS start with "Did you know..." as the first sentence hook
- Each sentence is one shocking, surprising, specific real fact
- Use real numbers, percentages, and specific details
- Make it sound unbelievable but true
- No intro like "In this video" or "Welcome"
- No outro like "Subscribe" or "Like"
- Write in simple, clear conversational English
- Return ONLY the 5 sentences, one per line, no numbering, no bullet points`,
        },
        {
          role: "user",
          content: `Write a viral YouTube Shorts script about: "${topic}"`,
        },
      ],
      max_tokens: 500,
      temperature: 0.9,
    });

    const script = response.choices[0].message.content.trim();
    console.log("✅ AI Script generated");
    return script;

  } catch (error) {
    console.error("❌ Groq error:", error.message);
    return `Did you know ${topic} is one of the most shocking things ever discovered?
Scientists found something completely unexpected about ${topic} that changes everything.
The numbers behind ${topic} will absolutely blow your mind.
Researchers discovered a surprising connection between ${topic} and everyday life.
These facts about ${topic} will completely change the way you see the world.`;
  }
}

module.exports = { generateScript };