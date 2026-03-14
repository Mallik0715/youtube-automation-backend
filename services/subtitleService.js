// const fs = require("fs");
// const path = require("path");

// function secondsToTimestamp(sec) {
//   const h = String(Math.floor(sec / 3600)).padStart(2, "0");
//   const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
//   const s = String(Math.floor(sec % 60)).padStart(2, "0");
//   const ms = "000";
//   return `${h}:${m}:${s},${ms}`;
// }

// function generateSubtitles(sentences) {
//   const output = path.join(__dirname, "../storage/subtitles.srt");

//   let start = 0;
//   const duration = 4; // seconds per sentence

//   let content = "";

//   sentences.forEach((sentence, i) => {
//     const end = start + duration;

//     content += `${i + 1}\n`;
//     content += `${secondsToTimestamp(start)} --> ${secondsToTimestamp(end)}\n`;
//     content += `${sentence}\n\n`;

//     start = end;
//   });

//   fs.writeFileSync(output, content);

//   return output;
// }

// module.exports = { generateSubtitles };




const fs = require("fs");
const path = require("path");

function secondsToSrtTimestamp(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  const ms = String(Math.round((sec % 1) * 1000)).padStart(3, "0");
  return `${h}:${m}:${s},${ms}`;
}

// Parse VTT timestamp to seconds
function vttTimeToSeconds(time) {
  const parts = time.split(":");
  let seconds = 0;
  if (parts.length === 3) {
    seconds = parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
  } else if (parts.length === 2) {
    seconds = parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
  }
  return seconds;
}

// Parse edge-tts VTT file into word timings
function parseVTT(vttPath) {
  if (!fs.existsSync(vttPath)) return null;

  const content = fs.readFileSync(vttPath, "utf8");
  const blocks = content.split("\n\n").filter(b => b.trim() && !b.startsWith("WEBVTT"));

  const words = [];
  for (const block of blocks) {
    const lines = block.trim().split("\n");
    const timeLine = lines.find(l => l.includes("-->"));
    const textLine = lines[lines.length - 1];

    if (timeLine && textLine) {
      const [startStr, endStr] = timeLine.split("-->").map(t => t.trim());
      words.push({
        start: vttTimeToSeconds(startStr),
        end: vttTimeToSeconds(endStr),
        word: textLine.trim()
      });
    }
  }
  return words;
}

// Match sentences to word timings
function matchSentencesToTimings(sentences, words) {
  if (!words || words.length === 0) return null;

  const result = [];
  let wordIndex = 0;

  for (const sentence of sentences) {
    const sentenceWords = sentence
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    let startTime = null;
    let endTime = null;
    let matched = 0;

    for (let i = wordIndex; i < words.length && matched < sentenceWords.length; i++) {
      const vttWord = words[i].word.toLowerCase().replace(/[^a-z0-9]/g, "");
      const sentWord = sentenceWords[matched].replace(/[^a-z0-9]/g, "");

      if (vttWord === sentWord || vttWord.includes(sentWord) || sentWord.includes(vttWord)) {
        if (startTime === null) startTime = words[i].start;
        endTime = words[i].end;
        matched++;
        wordIndex = i + 1;
      }
    }

    if (startTime !== null) {
      result.push({ sentence, start: startTime, end: endTime });
    }
  }

  return result;
}

async function generateSubtitles(sentences) {
  const output = path.join(__dirname, "../storage/subtitles.srt");
  const vttPath = path.join(__dirname, "../storage/audio/words.vtt");

  let content = "";

  // ✅ Try to use real word timings from edge-tts VTT
  const words = parseVTT(vttPath);
  const timings = words ? matchSentencesToTimings(sentences, words) : null;

  if (timings && timings.length === sentences.length) {
    console.log("✅ Using real audio timings for subtitles");

    timings.forEach((item, i) => {
      content += `${i + 1}\n`;
      content += `${secondsToSrtTimestamp(item.start)} --> ${secondsToSrtTimestamp(item.end)}\n`;
      content += `${item.sentence}\n\n`;
    });

  } else {
    // Fallback: estimate based on word count
    console.log("⚠️ Using estimated timings for subtitles");

    let start = 0;
    sentences.forEach((sentence, i) => {
      const wordCount = sentence.split(" ").length;
      const duration = Math.max(2, wordCount * 0.4); // ~0.4 seconds per word
      const end = start + duration;

      content += `${i + 1}\n`;
      content += `${secondsToSrtTimestamp(start)} --> ${secondsToSrtTimestamp(end)}\n`;
      content += `${sentence}\n\n`;

      start = end;
    });
  }

  fs.writeFileSync(output, content);
  return output;
}

module.exports = { generateSubtitles };
