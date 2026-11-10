// Series 5 - "The Creature of Blackwood": creature mystery. Scenes: forest, cabin, cave.
// Planted clue: Bruno's scary "never cross the river" rule (Part 2) protects his traps (Part 4/5).
const { L, seg } = require("./helpers");

module.exports = {
  id: "creature-blackwood",
  title: "The Creature of Blackwood",
  music: "suspense",
  hashtags: ["#shorts", "#creature", "#mystery", "#animation", "#psychology"],
  description: "A camping trip. Giant footprints. Eyes eight feet off the ground. And a ranger with one strange rule.",
  parts: [
    {
      title: "Footprints",
      hook: "Their camera caught *eyes* 8 feet off the ground",
      segments: [
        seg("forest", false, ["A", "B"], [
          L("B", "happy", "Camping in Blackwood! No phones, no worries!"),
          L("A", "surprised", "Leo. Look at this footprint."),
          L("B", "worried", "That's... longer than my whole leg."),
        ]),
        seg("forest", true, ["A", "B"], [
          L("B", "worried", "Max. That howl. It's close."),
          L("A", "neutral", "Probably a wolf. Sound travels far at night."),
        ]),
        seg("cabin", true, ["A", "B"], [
          L("B", "worried", "Let's check the trail camera."),
          L("B", "surprised", "Something walked past at three AM."),
          L("A", "surprised", "Those eyes are eight feet off the ground."),
          L("B", "worried", "And they're looking right at the camera.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Past the River",
      hook: "The ranger had one rule: *never cross the river*",
      segments: [
        seg("cabin", false, ["A", "D", "B"], [
          L("D", "neutral", "I'm Bruno, the ranger. You boys saw something?"),
          L("B", "worried", "Eyes. Eight feet tall."),
          L("D", "neutral", "Then listen. Never cross the river. Nobody comes back the same."),
          L("A", "neutral", "When we can't see a danger, the brain imagines the worst one. The unknown is scarier than the truth."),
          L("D", "smug", "Tell that to the last guy."),
        ]),
        seg("forest", true, ["A", "B"], [
          L("B", "worried", "Max... our food bag is gone."),
          L("A", "surprised", "Drag marks. Going toward the river."),
          L("B", "worried", "And across it.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Cave",
      hook: "They followed the tracks into a *cave*. Big mistake.",
      segments: [
        seg("forest", false, ["A", "B"], [
          L("B", "worried", "We're crossing the river, aren't we."),
          L("A", "neutral", "Our food is over there. And I want answers."),
        ]),
        seg("cave", true, ["A", "B"], [
          L("B", "surprised", "A nest. A giant nest."),
          L("A", "worried", "And bones. Small animal bones."),
          L("B", "worried", "Max... the nest is still warm."),
          L("A", "neutral", "Whatever lives here left minutes ago."),
          L("B", "surprised", "Or it didn't leave.", { fx: "shake" }),
          L("A", "surprised", "Leo. Don't turn around. Something is blocking the entrance."),
        ]),
      ],
    },
    {
      title: "Gentle Giant",
      hook: "The *monster* was the one who needed saving",
      segments: [
        seg("cave", true, ["A", "B"], [
          L("B", "worried", "It's... not attacking us."),
          L("A", "neutral", "It's limping. Look at its leg. It's caught in a metal trap."),
          L("B", "worried", "It's not a monster. It's hurt."),
          L("A", "neutral", "We judge by looks first. Big and dark means danger. The brain decides before we think."),
          L("B", "happy", "Easy, big guy. We're going to help you."),
          L("A", "happy", "There. The trap is open."),
          L("B", "surprised", "Max, there's writing on the trap."),
          L("A", "surprised", "Initials. B. R. ... Bruno. The Ranger.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Real Monster",
      hook: "The ranger's scary *rule* was hiding a secret",
      segments: [
        seg("cabin", true, ["A", "D", "B"], [
          L("B", "smug", "Your trap, Bruno."),
          L("D", "worried", "...A creature like that is worth a fortune to collectors."),
          L("A", "neutral", "So you made up the scary rule. To keep people away from your traps."),
          L("D", "worried", "Scary stories work better than fences."),
          L("B", "happy", "Not anymore. The park police are on their way."),
        ]),
        seg("forest", false, ["A", "B"], [
          L("A", "happy", "The creature's safe. The traps are gone."),
          L("B", "happy", "One last trail camera photo. For memories."),
          L("B", "worried", "Max... zoom in."),
          L("A", "surprised", "Two pairs of eyes. There's ANOTHER one.", { fx: "shake" }),
        ]),
      ],
    },
  ],
};
