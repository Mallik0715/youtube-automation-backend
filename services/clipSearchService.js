const axios = require("axios");

const API_KEY = process.env.PIXABAY_API_KEY;

// Broad, always-available footage for this channel's niche, used only if the
// script-specific searches come back thin
const FALLBACK_QUERIES = ["couple talking", "woman thinking", "man thinking", "people city", "brain"];
const MIN_CLIPS = 6;
const MAX_CLIPS = 10;

async function pixabaySearch(query, perPage = 3) {
  try {
    const response = await axios.get("https://pixabay.com/api/videos/", {
      params: { key: API_KEY, q: query, per_page: perPage, safesearch: true },
      timeout: 15000,
    });
    return (response.data.hits || [])
      .map(video => video.videos.medium?.url || video.videos.small?.url)
      .filter(Boolean);
  } catch (error) {
    console.log(`Pixabay error for "${query}":`, error.message);
    return [];
  }
}

/**
 * @param {string[]} queries - script-specific searches from visualService, in script order
 * @param {{maxClips?: number, perQuery?: number, fallbackQueries?: string[]}} [options]
 */
async function searchClips(queries, options = {}) {
  const { maxClips = MAX_CLIPS, perQuery = 3, fallbackQueries = FALLBACK_QUERIES } = options;
  const minClips = Math.min(MIN_CLIPS * 2, Math.max(MIN_CLIPS, Math.ceil(maxClips / 2)));
  const groups = [];
  for (const query of queries) {
    const found = await pixabaySearch(query, perQuery);
    console.log(`🔍 "${query}": ${found.length} clips`);
    groups.push(found);
  }

  for (const query of fallbackQueries) {
    if (groups.flat().length >= minClips) break;
    console.log(`⚠️ Not enough clips yet, trying fallback: "${query}"`);
    groups.push(await pixabaySearch(query, perQuery));
  }

  // Round-robin so footage follows the script order instead of 3 near-identical clips in a row
  const picked = [];
  const longest = Math.max(0, ...groups.map(g => g.length));
  for (let i = 0; i < longest && picked.length < maxClips; i++) {
    for (const group of groups) {
      const url = group[i];
      if (url && !picked.includes(url) && picked.length < maxClips) picked.push(url);
    }
  }
  return picked;
}

module.exports = { searchClips, FALLBACK_QUERIES };
