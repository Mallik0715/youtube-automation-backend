// Series 4 - "The Missing Diamond of Room 7": whodunit. Scenes: museum, office.
// Planted clues: the glass case is still locked (Part 1) -> the diamond in it was already fake (Part 4).
const { L, CARD, seg } = require("./helpers");

module.exports = {
  id: "missing-diamond",
  title: "The Missing Diamond",
  music: "suspense",
  hashtags: ["#shorts", "#mystery", "#whodunit", "#animation", "#psychology"],
  description: "The lights go out for ten seconds at a museum party. When they come back, the diamond is gone. Three suspects. One liar.",
  parts: [
    {
      title: "Ten Seconds of Dark",
      hook: "The lights went out for *10 seconds*. The diamond vanished.",
      segments: [
        seg("museum", true, ["A", "B"], [
          L("B", "happy", "Max, a real museum party! Free snacks!"),
          L("A", "smug", "You're here for the famous diamond. Admit it."),
          CARD("LIGHTS OUT", "shake"),
          L("B", "surprised", "It's gone! The diamond is GONE!", { fx: "shake" }),
        ]),
        seg("museum", true, ["E", "F", "D"], [
          L("E", "worried", "Nobody leaves! I'm the curator. Nobody leaves this room!"),
          L("F", "smug", "Don't look at me. I buy diamonds. I don't steal them."),
          L("D", "neutral", "I guarded the door the whole time. Nobody passed me."),
        ]),
        seg("museum", true, ["A", "B"], [
          L("A", "neutral", "Three suspects. Ten seconds."),
          L("B", "worried", "Max. Look at the glass case."),
          L("A", "surprised", "It's still locked. Nobody opened it.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Read the Room",
      hook: "Liars *don't* look away. Here's what they really do.",
      segments: [
        seg("museum", true, ["A", "E", "B"], [
          L("B", "smug", "Easy. The liar won't look us in the eye."),
          L("A", "neutral", "That's a myth. Liars don't look away more. Many hold eye contact on purpose, to look honest."),
          L("E", "neutral", "I didn't take it. I've protected that diamond for years."),
        ]),
        seg("office", true, ["A", "D", "B"], [
          L("D", "neutral", "Here's the camera footage. I never left the door."),
          L("B", "surprised", "There's Bruno at the door."),
          L("B", "surprised", "And... there's Bruno at the case. Same second."),
          L("A", "surprised", "He's in two places at once.", { fx: "shake" }),
          L("D", "worried", "That's impossible. I never moved!"),
        ]),
      ],
    },
    {
      title: "The Loop",
      hook: "The camera *lied*. Then they checked his bag.",
      segments: [
        seg("office", true, ["A", "D", "B"], [
          L("A", "neutral", "The timestamps repeat. Someone looped the footage."),
          L("B", "surprised", "So someone hacked the cameras before the lights went out."),
          L("D", "worried", "Only staff know the camera password."),
          L("A", "smug", "Or someone who paid the staff."),
        ]),
        seg("museum", true, ["A", "F", "B"], [
          L("F", "smug", "Gentlemen, I'm leaving. I have a flight."),
          L("B", "smug", "Mind if we check your bag?"),
          L("F", "worried", "That's... private property."),
          L("B", "surprised", "Max! THE DIAMOND! It's in his bag!", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Fake",
      hook: "The diamond everyone chased was *never real*",
      segments: [
        seg("museum", true, ["A", "F", "B"], [
          L("F", "worried", "I have no idea how that got there!"),
          L("A", "neutral", "Everyone's sure it's him. He looks guilty. He sounds guilty."),
          L("A", "neutral", "But we trust confidence more than evidence. Let's check first."),
        ]),
        seg("museum", true, ["A", "E", "B"], [
          L("B", "neutral", "Zara, is it real?"),
          L("E", "surprised", "It's glass. A fake. A very good fake."),
          L("B", "surprised", "Then where's the real one?"),
          L("E", "worried", "The real one... hasn't been in that case for three years.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Trap",
      hook: "The thief was the *last person* they suspected",
      segments: [
        seg("museum", true, ["A", "E", "B"], [
          L("A", "smug", "You knew it was fake. Because you swapped it, Zara."),
          L("E", "neutral", "Three years ago, I heard a buyer planning to steal it."),
          L("B", "surprised", "Victor!"),
          L("E", "smug", "So I hid the real one and put out a fake. Tonight was my trap."),
          L("A", "happy", "And Victor got caught holding a piece of glass."),
        ]),
        seg("museum", true, ["A", "F", "B"], [
          L("F", "worried", "...I want my lawyer."),
          L("B", "happy", "Case closed! Snacks?"),
          L("A", "surprised", "Leo. What's in your coat pocket?"),
          L("B", "surprised", "Max... it's the REAL diamond.", { fx: "shake" }),
        ]),
      ],
    },
  ],
};
