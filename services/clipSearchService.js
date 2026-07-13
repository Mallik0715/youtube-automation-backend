
// const axios = require("axios");

// const API_KEY = process.env.PIXABAY_API_KEY;

// async function searchClips(topic) {

//   try {

//     const query = topic.split(" ").pop().toLowerCase();

//     const response = await axios.get(
//       `https://pixabay.com/api/videos/?key=${API_KEY}&q=${query}&per_page=5`
//     );

//     const videos = response.data.hits;

//     if (!videos || videos.length === 0) return [];

//     const clips = videos.map(video => video.videos.medium.url);

//     return clips;

//   } catch (error) {

//     console.log("Pixabay error:", error.message);
//     return [];

//   }

// }

// module.exports = { searchClips };





const axios = require("axios");
const { extractKeyword } = require("./keywordService");

const API_KEY = process.env.PIXABAY_API_KEY;

// Generic, always-safe visual fallback terms - broad enough that Pixabay
// almost always has matching stock footage, used only if everything else fails.
const FALLBACK_QUERIES = ["brain", "science", "thinking", "people", "abstract"];

async function pixabaySearch(query) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/videos/?key=${API_KEY}&q=${encodeURIComponent(query)}&per_page=5`
    );
    const videos = response.data.hits;
    if (!videos || videos.length === 0) return [];
    return videos.map(video => video.videos.medium.url);
  } catch (error) {
    console.log(`Pixabay error for query "${query}":`, error.message);
    return [];
  }
}

async function searchClips(topic) {
  // 1st attempt: clean keyword extracted from the topic (e.g. "psychology procrastinate")
  const primaryQuery = extractKeyword(topic);
  console.log(`🔍 Searching clips for: "${primaryQuery}"`);
  let clips = await pixabaySearch(primaryQuery);
  if (clips.length > 0) return clips;

  // 2nd attempt: try just the single most meaningful word (last non-stopword)
  const words = primaryQuery.split(" ").filter(Boolean);
  if (words.length > 1) {
    const singleWordQuery = words[0]; // first extracted keyword, usually the stronger noun
    console.log(`⚠️ No results, retrying with: "${singleWordQuery}"`);
    clips = await pixabaySearch(singleWordQuery);
    if (clips.length > 0) return clips;
  }

  // 3rd attempt: generic safe fallback terms, so the pipeline never gets 0 clips
  for (const fallback of FALLBACK_QUERIES) {
    console.log(`⚠️ Still no results, trying fallback: "${fallback}"`);
    clips = await pixabaySearch(fallback);
    if (clips.length > 0) return clips;
  }

  console.log("❌ No clips found after all fallback attempts.");
  return [];
}

module.exports = { searchClips };
