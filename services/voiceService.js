
// const { exec } = require("child_process");
// const path = require("path");
// const fs = require("fs");

// async function generateVoice(script) {

//   const outputPath = path.join(
//     __dirname,
//     "../storage/audio/voice.mp3"
//   );

//   // Remove newlines and quotes that break shell command
//   const cleanScript = script
//     .replace(/\n/g, " ")
//     .replace(/"/g, "")
//     .trim();

//   const command = `python -m edge_tts --voice en-US-AriaNeural --text "${cleanScript}" --write-media "${outputPath}"`;

//   console.log("Generating voice...");
//   console.log(command);

//   return new Promise((resolve, reject) => {

//     exec(command, (error, stdout, stderr) => {

//       if (error) {
//         console.log("TTS error:", error);
//         reject(error);
//         return;
//       }

//       if (!fs.existsSync(outputPath)) {
//         console.log(stderr);
//         reject("voice.mp3 not created");
//         return;
//       }

//       console.log("Voice generated:", outputPath);

//       resolve(outputPath);

//     });

//   });

// }

// module.exports = { generateVoice };









const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

async function generateVoice(script) {
  const outputPath = path.join(__dirname, "../storage/audio/voice.mp3");
  const wordsPath = path.join(__dirname, "../storage/audio/words.json");

  const cleanScript = script
    .replace(/\n/g, " ")
    .replace(/"/g, "")
    .trim();

  // ✅ Also generate word boundaries file for subtitle timing
  const command = `python -m edge_tts --voice en-US-AriaNeural --text "${cleanScript}" --write-media "${outputPath}" --write-subtitles "${wordsPath.replace(".json", ".vtt")}"`;

  console.log("Generating voice...");
  console.log(command);

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log("TTS error:", error);
        reject(error);
        return;
      }

      if (!fs.existsSync(outputPath)) {
        reject("voice.mp3 not created");
        return;
      }

      console.log("Voice generated:", outputPath);
      resolve(outputPath);
    });
  });
}

module.exports = { generateVoice };