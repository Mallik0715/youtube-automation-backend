const stopWords = [
  "the","is","are","a","an","we","to","this","that",
  "in","on","at","of","for","and","today","will",
  "going","talk","about","stay","till","video","explore",
  "some","interesting","insights"
];

function extractKeyword(sentence) {

  const words = sentence
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter(word => !stopWords.includes(word));

  return words.slice(0,2).join(" ");
}

module.exports = {
  extractKeyword
};