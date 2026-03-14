// function splitIntoSentences(script) {

//   const sentences = script
//     .replace(/\n/g, " ")
//     .split(".")
//     .map(s => s.trim())
//     .filter(s => s.length > 0);

//   return sentences;
// }

// module.exports = {
//   splitIntoSentences
// };





function splitIntoSentences(script) {

  const sentences = script
    .replace(/\n/g, " ")
    .split(".")
    .map(s => s.trim())
    .filter(s => s.length > 0);

  return sentences;
}

module.exports = { splitIntoSentences };