// Makes each location match what the narration says happens there.
// A scene (segment) is scanned for words like "storm", "footprints", "a ship", "black car", "safe"...
// and the drawn location adds those things (remotion/Scenes.jsx). Some details stay once they exist
// (a shelter built on Day 2 is still there on Day 5). Single lines can also change the light:
// "the lights went out" -> dark, "the lights turned warm" -> warm glow.

const DETAILS = [
  ["storm", /\b(storms?|thunder|lightning|hurricane)\b/i],
  ["fog", /\b(fog|foggy|mist|misty|haze)\b/i],
  ["bell", /\b(bells?|rang|rings|ringing|chimed?)\b/i],
  ["rain", /\b(rain|raining|rained|downpour)\b/i],
  ["ship", /\b(ships?|coast guard|on the horizon)\b/i],
  ["boat", /\b(a boat|boat, far|far out at sea|a motor)\b/i],
  ["smoke", /\b(smoke|signal fire)\b/i],
  ["fire", /\b(fire|campfire|bonfire)\b/i],
  ["footprints", /\bfootprints?\b/i],
  ["shelter", /\bshelter\b/i],
  ["car", /\b(black car|a car|the car|car outside|car's)\b/i],
  ["safe", /\b(safe code|the safe|a safe)\b/i],
  ["papers", /\b(papers|documents|contract)\b/i],
  ["coins", /\bcoins?\b/i],
  ["dinner", /\b(dinner|breakfast|lunch|ate|eating)\b/i],
  ["flooded", /\bflood(ed|ing)?\b/i],
  ["stolen", /\b(was stolen|been stolen|stole the|empty case|case was empty|the diamond was gone)\b/i],
  ["newspaper", /\bnewspapers?\b/i],
  ["panel", /\b(loose panel|behind a panel|hidden panel)\b/i],
  ["microphone", /\b(microphone|tape player)\b/i],
];
// Once these appear in a place they stay there for the rest of the series
const STICKY = new Set(["shelter"]);

const LIGHT = [
  ["dark", /\b(lights? went out|lights? (?:cut|died|failed)|power (?:went|cut)|pitch dark|in the dark)\b/i],
  ["warm", /\b(lights? turned warm|warm light|lights? glowed)\b/i],
];

const textOf = (seg) => (seg.lines || []).map(l => l.text || l.card || "").join(" ");

// "the fog lifted" / "the storm passed": mentioned, but gone
const GONE = {
  fog: /\b(fog|mist)\s+(lifted|cleared|was gone|had gone|disappeared|faded)\b/i,
  storm: /\bstorm\s+(passed|ended|was over|stopped)\b/i,
};

function detailsFor(text) {
  return DETAILS.filter(([k, re]) => re.test(text) && !(GONE[k] && GONE[k].test(text))).map(([k]) => k);
}

/** Details that earlier parts already established for each place, e.g. { island: ["shelter"] } */
function stickyBefore(series, partIndex) {
  const out = {};
  for (const part of series.parts.slice(0, partIndex)) {
    for (const seg of [...(part.ifA || []), ...(part.ifB || []), ...(part.segments || [])]) {
      for (const k of detailsFor(textOf(seg))) {
        if (STICKY.has(k)) (out[seg.scene] = out[seg.scene] || new Set()).add(k);
      }
    }
  }
  return out;
}

// Mentioned anywhere in a part -> shown in every place of that part where it fits
// ("Outside his window, a black car." then the street scene: the car is parked there)
const PART_WIDE = { car: ["street", "bedroom"] };

/** The details a segment's location shows: its own words + the part's + anything sticky from before */
function segmentDetails(seg, sticky, partSegments = []) {
  const own = detailsFor(textOf(seg));
  const partWords = detailsFor(partSegments.map(textOf).join(" "));
  const wide = partWords.filter(k => (PART_WIDE[k] || []).includes(seg.scene));
  return [...new Set([...own, ...wide, ...((sticky[seg.scene] && [...sticky[seg.scene]]) || [])])];
}

// Movement in a line, acted out by the character the line is about:
//   out  - walks off screen ("walked away", "left", "ran out")
//   in   - walks into the shot ("walked in", "came over", "arrived")
//   pace - walks / runs on (a tracking shot in close-up): "followed", "ran", "climbed", "walked"
const MOVES = [
  ["out", /\b(walked away|walked out|walked off|ran away|ran off|ran out|stormed out|turned and left|left without|he left|she left)\b/i],
  ["in", /\b(walked back into|walked back in|walked in|walked into|walked over|walked up|came in|came over|came back|stepped in|stepped inside|stepped out|ran in|ran over|ran up|ran to|arrived|burst in|walked to|went back to)\b/i],
  ["pace", /\b(walked|walking|ran|running|followed|following|paced|climbed|hurried|rushed|raced|crept|went to|went alone)\b/i],
];
const RUNNING = /\b(ran|running|rushed|raced|sprinted|hurried|ran for)\b/i;

/** How the line's character moves: { move: "in"|"out"|"pace"|null, run: boolean } */
function lineMove(text) {
  const t = text || "";
  for (const [k, re] of MOVES) if (re.test(t)) return { move: k, run: RUNNING.test(t) };
  return { move: null, run: false };
}

/** Lighting change for one line: "dark" | "warm" | null */
function lineLight(text) {
  for (const [k, re] of LIGHT) if (re.test(text || "")) return k;
  return null;
}

module.exports = { segmentDetails, stickyBefore, lineLight, lineMove, detailsFor };
