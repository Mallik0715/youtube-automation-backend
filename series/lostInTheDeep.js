// Series 10 - "Lost in the Deep": ocean survival. Scenes: deck, underwater.
// Planted clue: "only three of us on the boat" vs. the cut line -> wet footprints that aren't theirs (sting).
const { L, seg } = require("./helpers");

module.exports = {
  id: "lost-in-the-deep",
  title: "Lost in the Deep",
  music: "suspense",
  hashtags: ["#shorts", "#ocean", "#survival", "#animation", "#psychology"],
  description: "Max and Leo dive for a 200-year-old shipwreck. Then someone cuts the only line back to the boat.",
  parts: [
    {
      title: "The Wreck",
      hook: "They dove for treasure. Then someone *cut the line*.",
      segments: [
        seg("deck", false, ["A", "C", "B"], [
          L("C", "neutral", "The Silver Gull. Two hundred years at the bottom of the sea."),
          L("B", "happy", "Treasure! REAL treasure!"),
          L("C", "neutral", "Stay together. When your air is low, follow the anchor line up."),
        ]),
        seg("underwater", false, ["A", "B"], [
          L("B", "happy", "Max! The wreck! It's HUGE!"),
          L("A", "neutral", "Quick look, then up. Nice and slow."),
          L("B", "worried", "Max... the anchor line is floating."),
          L("A", "surprised", "Somebody cut it.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Breathe",
      hook: "Panic burns your *air*. Here's how divers survive.",
      segments: [
        seg("underwater", false, ["A", "B"], [
          L("B", "worried", "How do we find the boat?! I'm breathing so fast!"),
          L("A", "neutral", "Stop. Slow breaths. Panic burns through your air much faster."),
          L("A", "neutral", "In for four. Out for six. Your heart slows down with your breath."),
          L("B", "neutral", "In for four... out for six... okay. Okay."),
          L("A", "neutral", "Good. Bubbles go up. We follow them. Slowly."),
          L("B", "surprised", "Max. Something just swam past. Something big."),
          L("A", "worried", "Bigger than the boat.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Giant",
      hook: "A *giant* was circling them in the dark",
      segments: [
        seg("underwater", false, ["A", "B"], [
          L("B", "worried", "It's circling us."),
          L("A", "neutral", "A giant squid. They're real. But they almost never go near divers."),
          L("B", "worried", "ALMOST?!"),
          L("A", "neutral", "Stay still. Big, fast movements look like a threat."),
          L("B", "happy", "It's... leaving. It's actually leaving."),
          L("A", "neutral", "Okay. Up. Slowly."),
          L("B", "surprised", "Max... the wreck's door. It just opened by itself.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Letter",
      hook: "Inside the wreck: gold... and a *200-year-old letter*",
      segments: [
        seg("underwater", false, ["A", "B"], [
          L("B", "surprised", "Max. Gold coins. A whole chest!"),
          L("A", "neutral", "And a sealed bottle. With a letter."),
          L("B", "neutral", "'To whoever finds this. The Silver Gull did not sink in a storm.'"),
          L("A", "surprised", "'Our first mate cut the anchor line and took the gold.'"),
          L("B", "worried", "Someone cut the line. Just like today."),
          L("B", "surprised", "Max. My air alarm.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Surface",
      hook: "The person who cut the line was *on the boat*",
      segments: [
        seg("deck", false, ["A", "C", "B"], [
          L("B", "happy", "We made it! With almost no air left!"),
          L("C", "worried", "I thought I'd lost you! The line snapped!"),
          L("A", "smug", "It didn't snap. It was cut. Clean."),
          L("A", "happy", "And this letter just solved a two-hundred-year-old mystery."),
          L("C", "worried", "But... only the three of us were on this boat."),
          L("C", "surprised", "Look. Wet footprints. Leading off the boat. Into the sea."),
          L("B", "worried", "Max... those footprints aren't ours.", { fx: "shake" }),
        ]),
      ],
    },
  ],
};
