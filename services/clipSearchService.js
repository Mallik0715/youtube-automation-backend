// const axios = require("axios");

// const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

// async function searchClip(query) {
//   try {

//     const response = await axios.get(
//       `https://api.pexels.com/videos/search?query=${query}&per_page=1`,
//       {
//         headers: {
//           Authorization: PEXELS_API_KEY
//         }
//       }
//     );

//     const video = response.data.videos[0];

//     if (!video) return null;

//     return video.video_files[0].link;

//   } catch (error) {
//     console.log("Clip search error:", error.message);
//     return null;
//   }
// }

// module.exports = {
//   searchClip
// };

const axios = require("axios");

const API_KEY = process.env.PIXABAY_API_KEY;

async function searchClips(topic) {

  try {

    const query = topic.split(" ").pop().toLowerCase();

    const response = await axios.get(
      `https://pixabay.com/api/videos/?key=${API_KEY}&q=${query}&per_page=5`
    );

    const videos = response.data.hits;

    if (!videos || videos.length === 0) return [];

    const clips = videos.map(video => video.videos.medium.url);

    return clips;

  } catch (error) {

    console.log("Pixabay error:", error.message);
    return [];

  }

}

module.exports = { searchClips };