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

function timeToSeconds(time) {
  const parts = time.replace(",", ".").split(":");
  let seconds = 0;
  if (parts.length === 3) {
    seconds = parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
  } else if (parts.length === 2) {
    seconds = parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
  }
  return seconds;
}

function parseSubtitles(filePath) {
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, "utf8");
  const blocks = content.split("\n\n").filter(b => b.trim() && !b.startsWith("WEBVTT"));

  const sentences = [];
  for (const block of blocks) {
    const lines = block.trim().split("\n");
    const timeLine = lines.find(l => l.includes("-->"));
    const textLine = lines[lines.length - 1];

    if (timeLine && textLine) {
      const [startStr, endStr] = timeLine.split("-->").map(t => t.trim());
      sentences.push({
        start: timeToSeconds(startStr),
        end: timeToSeconds(endStr),
        text: textLine.trim()
      });
    }
  }
  return sentences;
}

async function generateSubtitles(sentences) {
  const output = path.join(__dirname, "../storage/subtitles.srt");
  const vttPath = path.join(__dirname, "../storage/audio/words.vtt");

  let content = "";
  const audioSentences = parseSubtitles(vttPath);

  let chunkCount = 1;
  const WORDS_PER_CHUNK = 7;

  if (audioSentences && audioSentences.length > 0) {
    console.log(`✅ Using real audio timings to interpolate ${WORDS_PER_CHUNK}-word stylish subtitles`);
    
    for (const audioSentence of audioSentences) {
      const words = audioSentence.text.split(" ").filter(w => w.trim());
      if (words.length === 0) continue;

      const duration = audioSentence.end - audioSentence.start;
      const timePerWord = duration / words.length;

      for (let i = 0; i < words.length; i += WORDS_PER_CHUNK) {
        const chunkWords = words.slice(i, i + WORDS_PER_CHUNK);
        const text = chunkWords.join(" ");
        
        const chunkStart = audioSentence.start + (i * timePerWord);
        const chunkEnd = chunkStart + (timePerWord * chunkWords.length);

        content += `${chunkCount}\n`;
        content += `${secondsToSrtTimestamp(chunkStart)} --> ${secondsToSrtTimestamp(chunkEnd)}\n`;
        content += `${text.toUpperCase()}\n\n`;
        chunkCount++;
      }
    }
  } else {
    console.log(`⚠️ Using purely estimated timings for ${WORDS_PER_CHUNK}-word stylish subtitles`);
    let start = 0;
    
    sentences.forEach((sentence) => {
      const sentenceWords = sentence.split(" ").filter(w => w.trim());
      for (let i = 0; i < sentenceWords.length; i += WORDS_PER_CHUNK) {
        const chunkWords = sentenceWords.slice(i, i + WORDS_PER_CHUNK);
        const text = chunkWords.join(" ");
        
        // Estimate 0.35s per word
        const duration = chunkWords.length * 0.35; 
        const end = start + duration;

        content += `${chunkCount}\n`;
        content += `${secondsToSrtTimestamp(start)} --> ${secondsToSrtTimestamp(end)}\n`;
        content += `${text.toUpperCase()}\n\n`;
        
        start = end;
        chunkCount++;
      }
    });
  }

  fs.writeFileSync(output, content);
  return output;
}

module.exports = { generateSubtitles };
