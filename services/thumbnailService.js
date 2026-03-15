
// const { createCanvas, loadImage } = require("canvas");
// const fs = require("fs");
// const path = require("path");
// const Groq = require("groq-sdk");

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// function roundRect(ctx, x, y, w, h, r) {
//   ctx.beginPath();
//   ctx.moveTo(x + r, y);
//   ctx.arcTo(x + w, y, x + w, y + h, r);
//   ctx.arcTo(x + w, y + h, x, y + h, r);
//   ctx.arcTo(x, y + h, x, y, r);
//   ctx.arcTo(x, y, x + w, y, r);
//   ctx.closePath();
// }

// // Step 1: Groq generates the image prompt + text
// async function generateThumbnailPrompt(topic) {
//   const response = await groq.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     messages: [
//       {
//         role: "system",
//         content: `You are a YouTube thumbnail designer. Return ONLY valid JSON, no markdown, no backticks.`,
//       },
//       {
//         role: "user",
//         content: `Create a YouTube thumbnail concept for: "${topic}"

// Return this exact JSON:
// {
//   "imagePrompt": "detailed image generation prompt, cinematic, dramatic lighting, 4k, no text",
//   "topLabel": "short 2-3 word top label",
//   "mainText": "SHOCKING main text max 4 words ALL CAPS",
//   "bottomText": "short curiosity hook max 6 words",
//   "emoji": "one relevant emoji"
// }`,
//       },
//     ],
//     max_tokens: 300,
//     temperature: 0.8,
//   });

//   const raw = response.choices[0].message.content.trim();
//   return JSON.parse(raw);
// }

// // Step 2: Pollinations generates the AI image
// async function fetchAIImage(prompt) {
//   const encodedPrompt = encodeURIComponent(
//     `${prompt}, cinematic, dramatic, high quality, no text, no watermark`
//   );
//   const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${Date.now()}`;
  
//   console.log("🎨 Generating AI image...");
//   const image = await loadImage(url);
//   console.log("✅ AI Image fetched!");
//   return image;
// }

// // Draw text with outline
// function drawOutlineText(ctx, text, x, y, fillColor, strokeColor, lineWidth = 8) {
//   ctx.strokeStyle = strokeColor;
//   ctx.lineWidth = lineWidth;
//   ctx.lineJoin = "round";
//   ctx.strokeText(text, x, y);
//   ctx.fillStyle = fillColor;
//   ctx.fillText(text, x, y);
// }

// // Word wrap helper
// function wrapText(ctx, text, maxWidth) {
//   const words = text.split(" ");
//   const lines = [];
//   let currentLine = "";
//   for (const word of words) {
//     const testLine = currentLine ? `${currentLine} ${word}` : word;
//     if (ctx.measureText(testLine).width > maxWidth && currentLine) {
//       lines.push(currentLine);
//       currentLine = word;
//     } else {
//       currentLine = testLine;
//     }
//   }
//   lines.push(currentLine);
//   return lines;
// }

// async function generateThumbnail(topic) {
//   console.log("🖼️ Generating AI thumbnail for:", topic);

//   const width = 1280;
//   const height = 720;
//   const canvas = createCanvas(width, height);
//   const ctx = canvas.getContext("2d");

//   // Step 1: Get Groq generated content
//   let thumbnailData;
//   try {
//     thumbnailData = await generateThumbnailPrompt(topic);
//     console.log("✅ Thumbnail concept:", thumbnailData.mainText);
//   } catch (err) {
//     console.error("❌ Groq thumbnail error:", err.message);
//     thumbnailData = {
//       imagePrompt: `dramatic cinematic scene about ${topic}, dark background, epic lighting`,
//       topLabel: "AMAZING FACTS",
//       mainText: topic.toUpperCase().slice(0, 30),
//       bottomText: "WATCH TILL THE END!",
//       emoji: "🔥",
//     };
//   }

//   // Step 2: Get AI generated background image
//   let bgImage;
//   try {
//     bgImage = await fetchAIImage(thumbnailData.imagePrompt);
//     ctx.drawImage(bgImage, 0, 0, width, height);
//   } catch (err) {
//     console.error("❌ Pollinations error:", err.message);
//     // Fallback gradient background
//     const gradient = ctx.createLinearGradient(0, 0, width, height);
//     gradient.addColorStop(0, "#0f0c29");
//     gradient.addColorStop(0.5, "#302b63");
//     gradient.addColorStop(1, "#24243e");
//     ctx.fillStyle = gradient;
//     ctx.fillRect(0, 0, width, height);
//   }

//   // Step 3: Dark overlay for text readability
//   const overlay = ctx.createLinearGradient(0, 0, 0, height);
//   overlay.addColorStop(0, "rgba(0,0,0,0.55)");
//   overlay.addColorStop(0.5, "rgba(0,0,0,0.25)");
//   overlay.addColorStop(1, "rgba(0,0,0,0.75)");
//   ctx.fillStyle = overlay;
//   ctx.fillRect(0, 0, width, height);

//   // Step 4: TOP LABEL BADGE
//   const badgeText = `${thumbnailData.emoji} ${thumbnailData.topLabel.toUpperCase()}`;
//   ctx.font = "bold 28px Sans";
//   const badgeW = ctx.measureText(badgeText).width + 50;
//   const badgeH = 50;
//   const badgeX = 60;
//   const badgeY = 50;

//   // Badge background
//   ctx.beginPath();
//   ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 25);
//   ctx.fillStyle = "#f59e0b";
//   ctx.fill();

//   ctx.fillStyle = "#000000";
//   ctx.font = "bold 26px Sans";
//   ctx.textAlign = "left";
//   ctx.fillText(badgeText, badgeX + 25, badgeY + 33);

//   // Step 5: MAIN TEXT (center)
//   ctx.textAlign = "center";
//   ctx.font = "bold 110px Sans";
//   const lines = wrapText(ctx, thumbnailData.mainText, 1100);
//   const lineHeight = 120;
//   const totalH = lines.length * lineHeight;
//   const startY = height / 2 - totalH / 2 + 60;

//   lines.forEach((line, i) => {
//     drawOutlineText(ctx, line, width / 2, startY + i * lineHeight, "#ffffff", "#000000", 14);
//   });

//   // Step 6: BOTTOM BANNER
//   const bannerGrad = ctx.createLinearGradient(0, height - 100, 0, height);
//   bannerGrad.addColorStop(0, "rgba(0,0,0,0)");
//   bannerGrad.addColorStop(1, "rgba(0,0,0,0.9)");
//   ctx.fillStyle = bannerGrad;
//   ctx.fillRect(0, height - 100, width, 100);

//   ctx.font = "bold 36px Sans";
//   ctx.textAlign = "center";
//   drawOutlineText(
//     ctx,
//     `👇 ${thumbnailData.bottomText.toUpperCase()}`,
//     width / 2,
//     height - 28,
//     "#f59e0b",
//     "#000000",
//     6
//   );

//   // Step 7: Save
//   const outputPath = path.join(__dirname, "../storage/thumbnail.jpg");
//   const buffer = canvas.toBuffer("image/jpeg", { quality: 0.95 });
//   fs.writeFileSync(outputPath, buffer);

//   console.log("✅ AI Thumbnail saved:", outputPath);
//   return outputPath;
// }

// module.exports = { generateThumbnail };

const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
  "unsplashQuery": "2-3 word search query for unsplash photo",
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

// ✅ Primary: Unsplash
async function fetchUnsplashImage(query) {
  console.log("🖼️ Fetching Unsplash image for:", query);
  const response = await fetch(
    `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape`,
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    }
  );
  if (!response.ok) throw new Error(`Unsplash error: ${response.status}`);
  const data = await response.json();
  const imageUrl = data.urls.regular;
  console.log("✅ Unsplash image found!");
  return loadImage(imageUrl);
}

// ✅ Fallback: Pollinations with retry
async function fetchPollinationsImage(prompt, retries = 3) {
  const encodedPrompt = encodeURIComponent(
    `${prompt}, cinematic, dramatic, high quality, no text, no watermark`
  );
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${Date.now()}`;
      console.log(`🎨 Pollinations attempt ${attempt}/${retries}...`);
      const image = await Promise.race([
        loadImage(url),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout after 30s")), 30000)
        ),
      ]);
      console.log("✅ Pollinations image fetched!");
      return image;
    } catch (err) {
      console.error(`❌ Pollinations attempt ${attempt} failed: ${err.message}`);
      if (attempt < retries) {
        await new Promise(res => setTimeout(res, 5000));
      }
    }
  }
  throw new Error("All Pollinations attempts failed");
}

function drawOutlineText(ctx, text, x, y, fillColor, strokeColor, lineWidth = 8) {
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = "round";
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fillColor;
  ctx.fillText(text, x, y);
}

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
      unsplashQuery: topic,
      topLabel: "AMAZING FACTS",
      mainText: topic.toUpperCase().slice(0, 30),
      bottomText: "WATCH TILL THE END!",
      emoji: "🔥",
    };
  }

  // Step 2: Try Unsplash → Pollinations → Gradient fallback
  let bgImage = null;
  try {
    bgImage = await fetchUnsplashImage(thumbnailData.unsplashQuery || topic);
  } catch (err) {
    console.error("❌ Unsplash failed:", err.message);
    console.log("⚠️ Trying Pollinations as fallback...");
    try {
      bgImage = await fetchPollinationsImage(thumbnailData.imagePrompt);
    } catch (err2) {
      console.error("❌ Pollinations also failed:", err2.message);
      console.log("⚠️ Using gradient fallback...");
    }
  }

  if (bgImage) {
    ctx.drawImage(bgImage, 0, 0, width, height);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#0f0c29");
    gradient.addColorStop(0.5, "#302b63");
    gradient.addColorStop(1, "#24243e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  // Step 3: Dark overlay
  const overlay = ctx.createLinearGradient(0, 0, 0, height);
  overlay.addColorStop(0, "rgba(0,0,0,0.60)");
  overlay.addColorStop(0.4, "rgba(0,0,0,0.30)");
  overlay.addColorStop(1, "rgba(0,0,0,0.85)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, width, height);

  // Step 4: Left color bar
  const barGrad = ctx.createLinearGradient(0, 0, 0, height);
  barGrad.addColorStop(0, "#f59e0b");
  barGrad.addColorStop(1, "#ef4444");
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, 0, 12, height);

  // Step 5: Top label badge
  const badgeText = `${thumbnailData.emoji} ${thumbnailData.topLabel.toUpperCase()}`;
  ctx.font = "bold 30px Sans";
  const badgeW = ctx.measureText(badgeText).width + 60;
  const badgeH = 55;
  const badgeX = 40;
  const badgeY = 40;

  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 10;

  const badgeGrad = ctx.createLinearGradient(badgeX, 0, badgeX + badgeW, 0);
  badgeGrad.addColorStop(0, "#f59e0b");
  badgeGrad.addColorStop(1, "#ef4444");
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 30);
  ctx.fillStyle = badgeGrad;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px Sans";
  ctx.textAlign = "left";
  ctx.fillText(badgeText, badgeX + 28, badgeY + 37);

  // Step 6: Main text with glow
  ctx.textAlign = "center";
  ctx.font = "bold 115px Sans";
  const lines = wrapText(ctx, thumbnailData.mainText, 1150);
  const lineHeight = 125;
  const totalH = lines.length * lineHeight;
  const startY = height / 2 - totalH / 2 + 70;

  lines.forEach((line, i) => {
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 25;
    drawOutlineText(ctx, line, width / 2, startY + i * lineHeight, "#ffffff", "#000000", 16);
    ctx.shadowBlur = 0;
  });

  // Step 7: Bottom banner
  const bannerGrad = ctx.createLinearGradient(0, height - 110, 0, height);
  bannerGrad.addColorStop(0, "rgba(0,0,0,0)");
  bannerGrad.addColorStop(1, "rgba(0,0,0,0.95)");
  ctx.fillStyle = bannerGrad;
  ctx.fillRect(0, height - 110, width, 110);

  // Divider line
  const lineGrad = ctx.createLinearGradient(60, 0, width - 60, 0);
  lineGrad.addColorStop(0, "rgba(245,158,11,0)");
  lineGrad.addColorStop(0.5, "rgba(245,158,11,1)");
  lineGrad.addColorStop(1, "rgba(245,158,11,0)");
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, height - 105);
  ctx.lineTo(width - 60, height - 105);
  ctx.stroke();

  // Bottom text
  ctx.font = "bold 38px Sans";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0,0,0,0.8)";
  ctx.shadowBlur = 10;
  drawOutlineText(
    ctx,
    `👇 ${thumbnailData.bottomText.toUpperCase()}`,
    width / 2,
    height - 30,
    "#f59e0b",
    "#000000",
    6
  );
  ctx.shadowBlur = 0;

  // Step 8: Watermark
  ctx.font = "bold 22px Sans";
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillText("FACTS DAILY", width - 30, 35);

  // Step 9: Save
  const outputPath = path.join(__dirname, "../storage/thumbnail.jpg");
  const buffer = canvas.toBuffer("image/jpeg", { quality: 0.95 });
  fs.writeFileSync(outputPath, buffer);

  console.log("✅ AI Thumbnail saved:", outputPath);
  return outputPath;
}

module.exports = { generateThumbnail };