// Split on sentence-ending punctuation followed by whitespace (or on line breaks),
// so decimals like "3.5%" stay intact.
function splitIntoSentences(script) {
  return script
    .split(/\n+|(?<=[.!?])\s+/)
    .map(s => s.trim().replace(/[.!?]+$/, ""))
    .filter(s => s.length > 0);
}

module.exports = { splitIntoSentences };
