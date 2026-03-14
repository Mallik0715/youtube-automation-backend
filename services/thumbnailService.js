// const { createCanvas } = require("canvas");
// const fs = require("fs");
// const path = require("path");

// async function generateThumbnail(topic) {
//   console.log("🖼️ Generating thumbnail for:", topic);

//   const width = 1280;
//   const height = 720;

//   const canvas = createCanvas(width, height);
//   const ctx = canvas.getContext("2d");

//   // Background gradient
//   const gradient = ctx.createLinearGradient(0, 0, width, height);
//   gradient.addColorStop(0, "#0f0c29");
//   gradient.addColorStop(0.5, "#302b63");
//   gradient.addColorStop(1, "#24243e");
//   ctx.fillStyle = gradient;
//   ctx.fillRect(0, 0, width, height);

//   // Grid pattern overlay
//   ctx.strokeStyle = "rgba(255,255,255,0.03)";
//   ctx.lineWidth = 1;
//   for (let x = 0; x < width; x += 40) {
//     ctx.beginPath();
//     ctx.moveTo(x, 0);
//     ctx.lineTo(x, height);
//     ctx.stroke();
//   }
//   for (let y = 0; y < height; y += 40) {
//     ctx.beginPath();
//     ctx.moveTo(0, y);
//     ctx.lineTo(width, y);
//     ctx.stroke();
//   }

//   // Glowing circle
//   const glowGradient = ctx.createRadialGradient(640, 360, 50, 640, 360, 400);
//   glowGradient.addColorStop(0, "rgba(99, 102, 241, 0.3)");
//   glowGradient.addColorStop(1, "rgba(99, 102, 241, 0)");
//   ctx.fillStyle = glowGradient;
//   ctx.fillRect(0, 0, width, height);

//   // Top label
//   ctx.fillStyle = "#f59e0b";
//   ctx.font = "bold 36px Sans";
//   ctx.textAlign = "center";
//   ctx.fillText("🔥 AMAZING FACTS", width / 2, 100);

//   // Divider line
//   ctx.strokeStyle = "#f59e0b";
//   ctx.lineWidth = 3;
//   ctx.beginPath();
//   ctx.moveTo(200, 120);
//   ctx.lineTo(1080, 120);
//   ctx.stroke();

//   // Main topic text (word wrap)
//   ctx.fillStyle = "#ffffff";
//   ctx.font = "bold 80px Sans";
//   ctx.textAlign = "center";

//   const words = topic.split(" ");
//   const lines = [];
//   let currentLine = "";

//   for (const word of words) {
//     const testLine = currentLine ? `${currentLine} ${word}` : word;
//     const metrics = ctx.measureText(testLine);
//     if (metrics.width > 1100 && currentLine) {
//       lines.push(currentLine);
//       currentLine = word;
//     } else {
//       currentLine = testLine;
//     }
//   }
//   lines.push(currentLine);

//   const lineHeight = 90;
//   const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
//   lines.forEach((line, i) => {
//     ctx.fillText(line, width / 2, startY + i * lineHeight);
//   });

//   // Bottom accent line
//   ctx.strokeStyle = "#6366f1";
//   ctx.lineWidth = 3;
//   ctx.beginPath();
//   ctx.moveTo(200, height - 120);
//   ctx.lineTo(1080, height - 120);
//   ctx.stroke();

//   // Bottom label
//   ctx.fillStyle = "#6366f1";
//   ctx.font = "bold 32px Sans";
//   ctx.textAlign = "center";
//   ctx.fillText("WATCH TILL THE END!", width / 2, height - 80);

//   // Save thumbnail
//   const outputPath = path.join(__dirname, "../storage/thumbnail.jpg");
//   const buffer = canvas.toBuffer("image/jpeg", { quality: 0.95 });
//   fs.writeFileSync(outputPath, buffer);

//   console.log("✅ Thumbnail saved:", outputPath);
//   return outputPath;
// }

// module.exports = { generateThumbnail };



const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Step 1: Groq generates the image prompt + text
async function generateThumbnailPrompt(topic) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a YouTube thumbnail designer. Return ONLY valid JSON, no markdown, no backticks.`,
      },
      {
        role: "user",
        content: `Create a YouTube thumbnail concept for: "${topic}"

Return this exact JSON:
{
  "imagePrompt": "detailed image generation prompt, cinematic, dramatic lighting, 4k, no text",
  "topLabel": "short 2-3 word top label",
  "mainText": "SHOCKING main text max 4 words ALL CAPS",
  "bottomText": "short curiosity hook max 6 words",
  "emoji": "one relevant emoji"
}`,
      },
    ],
    max_tokens: 300,
    temperature: 0.8,
  });

  const raw = response.choices[0].message.content.trim();
  return JSON.parse(raw);
}

// Step 2: Pollinations generates the AI image
async function fetchAIImage(prompt) {
  const encodedPrompt = encodeURIComponent(
    `${prompt}, cinematic, dramatic, high quality, no text, no watermark`
  );
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${Date.now()}`;
  
  console.log("🎨 Generating AI image...");
  const image = await loadImage(url);
  console.log("✅ AI Image fetched!");
  return image;
}

// Draw text with outline
function drawOutlineText(ctx, text, x, y, fillColor, strokeColor, lineWidth = 8) {
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = "round";
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fillColor;
  ctx.fillText(text, x, y);
}

// Word wrap helper
function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return lines;
}

async function generateThumbnail(topic) {
  console.log("🖼️ Generating AI thumbnail for:", topic);

  const width = 1280;
  const height = 720;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Step 1: Get Groq generated content
  let thumbnailData;
  try {
    thumbnailData = await generateThumbnailPrompt(topic);
    console.log("✅ Thumbnail concept:", thumbnailData.mainText);
  } catch (err) {
    console.error("❌ Groq thumbnail error:", err.message);
    thumbnailData = {
      imagePrompt: `dramatic cinematic scene about ${topic}, dark background, epic lighting`,
      topLabel: "AMAZING FACTS",
      mainText: topic.toUpperCase().slice(0, 30),
      bottomText: "WATCH TILL THE END!",
      emoji: "🔥",
    };
  }

  // Step 2: Get AI generated background image
  let bgImage;
  try {
    bgImage = await fetchAIImage(thumbnailData.imagePrompt);
    ctx.drawImage(bgImage, 0, 0, width, height);
  } catch (err) {
    console.error("❌ Pollinations error:", err.message);
    // Fallback gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#0f0c29");
    gradient.addColorStop(0.5, "#302b63");
    gradient.addColorStop(1, "#24243e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  // Step 3: Dark overlay for text readability
  const overlay = ctx.createLinearGradient(0, 0, 0, height);
  overlay.addColorStop(0, "rgba(0,0,0,0.55)");
  overlay.addColorStop(0.5, "rgba(0,0,0,0.25)");
  overlay.addColorStop(1, "rgba(0,0,0,0.75)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, width, height);

  // Step 4: TOP LABEL BADGE
  const badgeText = `${thumbnailData.emoji} ${thumbnailData.topLabel.toUpperCase()}`;
  ctx.font = "bold 28px Sans";
  const badgeW = ctx.measureText(badgeText).width + 50;
  const badgeH = 50;
  const badgeX = 60;
  const badgeY = 50;

  // Badge background
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 25);
  ctx.fillStyle = "#f59e0b";
  ctx.fill();

  ctx.fillStyle = "#000000";
  ctx.font = "bold 26px Sans";
  ctx.textAlign = "left";
  ctx.fillText(badgeText, badgeX + 25, badgeY + 33);

  // Step 5: MAIN TEXT (center)
  ctx.textAlign = "center";
  ctx.font = "bold 110px Sans";
  const lines = wrapText(ctx, thumbnailData.mainText, 1100);
  const lineHeight = 120;
  const totalH = lines.length * lineHeight;
  const startY = height / 2 - totalH / 2 + 60;

  lines.forEach((line, i) => {
    drawOutlineText(ctx, line, width / 2, startY + i * lineHeight, "#ffffff", "#000000", 14);
  });

  // Step 6: BOTTOM BANNER
  const bannerGrad = ctx.createLinearGradient(0, height - 100, 0, height);
  bannerGrad.addColorStop(0, "rgba(0,0,0,0)");
  bannerGrad.addColorStop(1, "rgba(0,0,0,0.9)");
  ctx.fillStyle = bannerGrad;
  ctx.fillRect(0, height - 100, width, 100);

  ctx.font = "bold 36px Sans";
  ctx.textAlign = "center";
  drawOutlineText(
    ctx,
    `👇 ${thumbnailData.bottomText.toUpperCase()}`,
    width / 2,
    height - 28,
    "#f59e0b",
    "#000000",
    6
  );

  // Step 7: Save
  const outputPath = path.join(__dirname, "../storage/thumbnail.jpg");
  const buffer = canvas.toBuffer("image/jpeg", { quality: 0.95 });
  fs.writeFileSync(outputPath, buffer);

  console.log("✅ AI Thumbnail saved:", outputPath);
  return outputPath;
}

module.exports = { generateThumbnail };