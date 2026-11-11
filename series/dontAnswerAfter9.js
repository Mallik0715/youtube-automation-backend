// Series 1 - "Don't Answer After 9": village mystery.
// Planted clues: Leo is LIVESTREAMING in Part 1 and Max says "Leo... come outside" on stream -> the "ghost"
// replays it in Part 4. The car dies at the gate and Bruno "will fix it" -> he broke it (Part 4/5).
const { L, V, CARD, seg } = require("./helpers");

module.exports = {
  id: "dont-answer-after-9",
  title: "Don't Answer After 9",
  music: "suspense",
  hashtags: ["#shorts", "#mystery", "#story", "#animation", "#psychology"],
  description: "Max and Leo get stuck in Hollowmere, a mountain village with one rule: if someone calls your name after 9 PM, don't answer.",
  parts: [
    {
      title: "The Rule",
      hook: "Never answer if someone calls your *name* after 9 PM",
      segments: [
        seg("gate", false, ["A", "B"], [
          L("B", "happy", "We're LIVE, chat! The treasure map says it's buried in Hollowmere!"),
          L("A", "smug", "Leo, your map says 'printed 2023' on the back."),
          L("B", "surprised", "And the car just died. Right at the village gate."),
          L("A", "worried", "Leo... come outside and help me push. Stop filming."),
        ]),
        seg("gate", false, ["A", "C", "B"], [
          L("C", "neutral", "Stay at my house tonight. Bruno will fix your car tomorrow."),
          L("C", "worried", "But remember our rule. After nine, if someone calls your name... do not answer."),
          L("A", "smug", "And if we do?"),
          L("C", "neutral", "Then it knows you're home."),
        ]),
        seg("room", true, ["A", "B"], [
          L("A", "smug", "Tell people not to do something, and they want it more. That's called reactance."),
          CARD("9:00 PM", "shake"),
          V("A", "Leo... come outside..."),
          L("B", "surprised", "Max... why are you calling me from outside?", { fx: "shake" }),
          L("A", "surprised", "Leo. I'm sitting right here."),
        ]),
      ],
    },
    {
      title: "Come Tomorrow",
      hook: "Every door in the village had the same *warning*... except theirs",
      segments: [
        seg("village", false, ["A", "B"], [
          L("B", "worried", "Something called my name last night. In YOUR voice."),
          L("A", "neutral", "Scared brains find patterns. Voices in the wind, faces in shadows."),
          L("B", "surprised", "Then explain the doors."),
          L("A", "surprised", "Every door says... 'Come tomorrow'?"),
        ]),
        seg("village", false, ["A", "C", "B"], [
          L("C", "neutral", "We write it every night. So it leaves... and comes back tomorrow."),
          L("B", "worried", "Our door doesn't have it."),
          L("C", "worried", "No. It doesn't. And Bruno says your car needs three more days."),
          L("B", "worried", "Max. Footprints. All around our room. Twice."),
        ]),
        seg("well", false, ["A", "B"], [
          L("A", "neutral", "They stop here. At the old well."),
          L("A", "smug", "That rope? Probably for a bucket."),
          L("B", "surprised", "Max... the rope just moved.", { fx: "shake" }),
          L("A", "surprised", "Something down there pulled it."),
        ]),
      ],
    },
    {
      title: "The Well",
      hook: "He climbed down the well... and found his own *name*",
      segments: [
        seg("well", false, ["A", "B"], [
          L("B", "worried", "Something pulled the rope. And I'm the one going down?"),
          L("A", "smug", "Your treasure hunt. Your forty-dollar map."),
          L("B", "worried", "Fine. If I don't come back, delete my search history."),
        ]),
        seg("tunnel", true, ["A", "B"], [
          L("B", "surprised", "Max! A tunnel! With carvings everywhere!"),
          L("A", "surprised", "These are ancient. Hundreds of years old."),
          L("B", "happy", "Treasure! The map was real!"),
          L("A", "neutral", "Careful. Excitement gives you tunnel vision. You miss what's right in front of you."),
          L("B", "smug", "Max, I'm literally in a tunnel."),
          L("A", "worried", "Then look down. This candle is still warm."),
          L("B", "surprised", "And a notebook!"),
          L("B", "worried", "Last page. Today's date... and our names.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Recording",
      hook: "The ghost was using *his own voice* against him",
      segments: [
        seg("room", true, ["A", "B"], [
          L("B", "worried", "Our names. In a notebook. Under a well."),
          L("A", "neutral", "Tonight we record whatever calls us."),
          L("B", "worried", "That's how every horror movie starts."),
          CARD("9:00 PM", "shake"),
          V("A", "Leo... come outside..."),
          V("B", "We're LIVE, chat! The treasure map says..."),
          L("B", "surprised", "That's MY voice. From my livestream!"),
          L("A", "surprised", "It's not a ghost. Someone is replaying your videos."),
          L("A", "neutral", "We expected a ghost, so every clue looked like one. That's confirmation bias."),
        ]),
        seg("room", true, ["A", "D", "B"], [
          L("D", "neutral", "You should not have opened that notebook.", { hooded: true, sfx: "footsteps" }),
          L("B", "surprised", "Bruno?! The mechanic?!", { fx: "shake" }),
          L("D", "smug", "I never fixed your car, Leo. I'm the one who broke it."),
        ]),
      ],
    },
    {
      title: "The Guardians",
      hook: "This village *lied* to every visitor for 600 years. Here's why",
      segments: [
        seg("room", true, ["A", "D", "B"], [
          L("B", "worried", "You broke our car on purpose?!"),
          L("D", "neutral", "To keep you here. Until we knew what kind of treasure hunter you were."),
        ]),
        seg("temple", true, ["A", "C", "B"], [
          L("C", "neutral", "You wanted treasure. Look."),
          L("B", "surprised", "A hidden temple..."),
          L("C", "neutral", "Our families have guarded it for six hundred years."),
          L("A", "surprised", "The voices, the chalk, the rule... that was all you?"),
          L("C", "smug", "A scary story keeps away more thieves than any lock."),
          L("A", "smug", "Because people believe a scary story before they check the facts."),
          L("C", "happy", "And you told the whole internet you were coming, Leo. Live."),
          L("B", "happy", "...Okay. Video deleted. This place stays secret."),
        ]),
        seg("gate", true, ["A", "B"], [
          CARD("8:59 PM"),
          L("A", "happy", "Car works. Let's go before nine."),
          V("child", "Max..."),
          L("A", "surprised", "Leo... did you hear that?", { fx: "shake" }),
          L("B", "worried", "It came from inside the car. The empty car."),
        ]),
      ],
    },
  ],
};
