const fs = require("fs");
const path = require("path");

function timeToSeconds(time) {
  const parts = time.replace(",", ".").split(":").map(parseFloat);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

// Reads the sentence timings edge-tts writes next to the voice file
function parseTimings(filePath) {
  if (!fs.existsSync(filePath)) return null;

  // edge-tts writes CRLF line endings on Windows; normalize before splitting into cues
  const content = fs.readFileSync(filePath, "utf8").replace(/\r\n?/g, "\n");
  const blocks = content.split(/\n{2,}/).filter(b => b.trim() && !b.startsWith("WEBVTT"));

  const cues = [];
  for (const block of blocks) {
    const lines = block.trim().split("\n");
    const timeIndex = lines.findIndex(l => l.includes("-->"));
    if (timeIndex === -1) continue;
    const text = lines.slice(timeIndex + 1).join(" ").trim();
    if (!text) continue;
    const [startStr, endStr] = lines[timeIndex].split("-->").map(t => t.trim());
    cues.push({ start: timeToSeconds(startStr), end: timeToSeconds(endStr), text });
  }
  return cues;
}

function chunkCue(start, end, text, wordsPerChunk) {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const perWord = (end - start) / words.length;
  const chunks = [];
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    const chunkWords = words.slice(i, i + wordsPerChunk);
    const chunkStart = start + i * perWord;
    chunks.push({
      start: chunkStart,
      end: chunkStart + chunkWords.length * perWord,
      text: chunkWords.join(" ").toUpperCase(),
    });
  }
  return chunks;
}

// ASS time format: h:mm:ss.cc
function secondsToAssTimestamp(sec) {
  const totalCs = Math.max(0, Math.round(sec * 100));
  const h = Math.floor(totalCs / 360000);
  const m = String(Math.floor((totalCs % 360000) / 6000)).padStart(2, "0");
  const s = String(Math.floor((totalCs % 6000) / 100)).padStart(2, "0");
  const cs = String(totalCs % 100).padStart(2, "0");
  return `${h}:${m}:${s}.${cs}`;
}

// ASS (not SRT) so the caption style is exact and matches the video size.
// Vertical: big captions in the lower third, above the Shorts UI. Horizontal: classic bottom captions.
// Colours are &HAABBGGRR.
function assHeader(width, height) {
  const vertical = height > width;
  const fontSize = vertical ? 88 : 64;
  const marginV = vertical ? 520 : 70;
  const outline = vertical ? 6 : 4;
  return `[Script Info]
ScriptType: v4.00+
PlayResX: ${width}
PlayResY: ${height}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Caption,Arial,${fontSize},&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,${outline},2,2,80,80,${marginV},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;
}

function assEvent(start, end, text) {
  // Braces start override blocks in ASS; never let them through from the script
  const safe = text.replace(/[{}]/g, "");
  return `Dialogue: 0,${secondsToAssTimestamp(start)},${secondsToAssTimestamp(end)},Caption,,0,0,0,,${safe}`;
}

/**
 * Writes storage/subtitles.ass, timed from edge-tts's sentence timings when available.
 * @param {string[]} sentences - fallback when no audio timings exist (e.g. a TTS without timings)
 * @param {{width?: number, height?: number, wordsPerChunk?: number}} [options]
 */
async function generateSubtitles(sentences, options = {}) {
  const { width = 1080, height = 1920 } = options;
  // Short chunks read fast on a phone; horizontal videos can show more words at once
  const wordsPerChunk = options.wordsPerChunk || (height > width ? 3 : 5);

  const output = path.join(__dirname, "../storage/subtitles.ass");
  const vttPath = path.join(__dirname, "../storage/audio/words.vtt");

  const chunks = [];
  const cues = parseTimings(vttPath);

  if (cues && cues.length > 0) {
    console.log("✅ Using real audio timings for subtitles");
    for (const cue of cues) chunks.push(...chunkCue(cue.start, cue.end, cue.text, wordsPerChunk));
  } else {
    console.log("⚠️ No audio timings found, estimating subtitle timing");
    let t = 0;
    for (const sentence of sentences) {
      const duration = sentence.split(/\s+/).length * 0.38;
      chunks.push(...chunkCue(t, t + duration, sentence, wordsPerChunk));
      t += duration;
    }
  }

  const events = chunks.map(c => assEvent(c.start, c.end, c.text));
  fs.writeFileSync(output, assHeader(width, height) + events.join("\n") + "\n");
  return output;
}

module.exports = { generateSubtitles };
