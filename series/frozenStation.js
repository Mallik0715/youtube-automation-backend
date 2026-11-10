// Series 9 - "The Frozen Station": survival + creature. Scenes: snow, cabin, icecave.
// Planted clue: food vanishes but Bruno "locked it himself" (Part 1) -> he was moving it to safety (Part 5).
const { L, seg } = require("./helpers");

module.exports = {
  id: "frozen-station",
  title: "The Frozen Station",
  music: "suspense",
  hashtags: ["#shorts", "#survival", "#mystery", "#animation", "#psychology"],
  description: "A research station on a frozen mountain. A storm. Supplies vanishing. And something huge in the ice.",
  parts: [
    {
      title: "The Storm",
      hook: "Someone at the station was *sabotaging* them",
      segments: [
        seg("snow", false, ["A", "B"], [
          L("B", "happy", "Max! A real research station on top of a mountain!"),
          L("A", "neutral", "And a storm arriving in two hours."),
        ]),
        seg("cabin", true, ["A", "E", "D"], [
          L("E", "worried", "Half our food is gone. Again."),
          L("D", "neutral", "I locked it myself. Nobody came in."),
        ]),
        seg("cabin", true, ["A", "E", "B"], [
          L("B", "worried", "Maybe someone counted wrong?"),
          L("E", "worried", "We didn't. Someone took it."),
          L("A", "neutral", "Then we radio for help."),
          L("B", "surprised", "Max... the radio cable. Someone cut it.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Blame",
      hook: "Under stress, they *turned on each other*",
      segments: [
        seg("cabin", true, ["A", "E", "D"], [
          L("E", "smug", "It's Bruno. He was on the night shift."),
          L("D", "worried", "It wasn't me! Zara keeps secrets in her lab."),
        ]),
        seg("cabin", true, ["A", "B"], [
          L("B", "worried", "Everyone's blaming everyone."),
          L("A", "neutral", "Stress does that. Scared groups hunt for someone to blame. It feels like control."),
        ]),
        seg("cabin", true, ["A", "D", "B"], [
          L("D", "neutral", "I'm going outside. I'll prove I'm not the problem."),
          L("A", "worried", "Bruno, the storm! You'll get lost!"),
          L("B", "surprised", "He's gone. And his tracks are already disappearing.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Ice Cave",
      hook: "His tracks led to something *frozen in the ice*",
      segments: [
        seg("snow", true, ["A", "B"], [
          L("B", "worried", "Footprints. Bruno went this way."),
          L("A", "neutral", "Into that cave. Come on."),
        ]),
        seg("icecave", true, ["A", "B"], [
          L("B", "surprised", "Max... what IS that?"),
          L("A", "surprised", "Something huge. Frozen in the ice."),
          L("B", "worried", "Is that... an eye?"),
          L("A", "neutral", "Ice bends light. It's probably a rock."),
          L("B", "surprised", "Max. The ice is cracking. From the inside.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Zara's Secret",
      hook: "The scientist *knew* about it all along",
      segments: [
        seg("icecave", true, ["A", "E", "B"], [
          L("E", "worried", "Don't touch it! You'll ruin everything!"),
          L("B", "surprised", "Zara?! You knew about this?!"),
          L("E", "neutral", "I found it last year. An ancient animal. Perfectly frozen. The discovery of a lifetime."),
          L("A", "neutral", "And you hid it. Even from your own team."),
          L("E", "worried", "If anyone knew, they'd take the credit. My name would vanish."),
          L("A", "neutral", "Fear of losing credit makes good people do strange things."),
          L("B", "surprised", "Guys... its eye. It just opened.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Thaw",
      hook: "Who was *really* stealing the food?",
      segments: [
        seg("icecave", true, ["A", "D", "B"], [
          L("D", "happy", "There you are! Out! Now! The glacier is cracking!"),
          L("B", "surprised", "Bruno! You're alive!"),
          L("D", "neutral", "I've been moving food to the safe cave. The station is in an avalanche zone."),
          L("A", "neutral", "So the 'thief' was saving us. And the cracking was the glacier."),
        ]),
        seg("snow", false, ["A", "E", "B"], [
          L("E", "happy", "We're safe. And I'm sharing the discovery. With all of you."),
          L("B", "worried", "Max... look at the photo we took inside."),
          L("A", "surprised", "Its eye was open. In this one... it's closed. It BLINKED.", { fx: "shake" }),
        ]),
      ],
    },
  ],
};
