// "Don't Answer After 9" - original 5-part mystery series.
//
// Cast:  A = Max (the skeptic who explains the psychology)   B = Leo (wannabe treasure-hunter YouTuber)
//        C = Mira (old woman of Hollowmere)                    D = Bruno (the village mechanic)
//        V = an offscreen voice. `voiceOf` picks whose voice it uses; fx "echo" makes it eerie.
//
// Segments set the place: scene (see remotion/Background.jsx), night (dark lighting), cast (who is on screen, left to right).
// A line can be { card: "9:00 PM" } for a silent title card, fx: "shake" for a camera shake.
//
// Planted clues (keep consistent if you edit):
// - Part 1: Leo is LIVESTREAMING, and Max says "Leo... come outside..." on stream -> the "ghost" replays it (Part 4).
// - Part 1: the car dies right at the gate, and Bruno "will fix it" -> he broke it on purpose (Part 4/5).
// - Part 3: a still-warm candle in the tunnel -> people were down there recently (Part 5).

module.exports = {
  id: "dont-answer-after-9",
  title: "Don't Answer After 9",
  music: "suspense",
  hashtags: ["#shorts", "#mystery", "#story", "#animation", "#psychology"],
  description:
    "Max and Leo get stuck in Hollowmere, a mountain village with one rule: if someone calls your name after 9 PM, don't answer.\n" +
    "An original animated mystery series in 5 parts - with real psychology hidden in every episode.",
  parts: [
    /* ======================= PART 1 ======================= */
    {
      title: "The Rule",
      segments: [
        {
          scene: "gate", night: false, cast: ["A", "B"],
          lines: [
            { speaker: "B", emotion: "happy", text: "We're LIVE, chat! Day one of the treasure hunt. The map says the treasure is in Hollowmere!" },
            { speaker: "A", emotion: "smug", text: "Leo, the map you bought online says 'printed in 2023' on the back." },
            { speaker: "B", emotion: "surprised", text: "And the car just died. Right at the village gate. Perfect timing." },
            { speaker: "A", emotion: "worried", text: "Leo... come outside... and help me push this car. Stop filming." },
          ],
        },
        {
          scene: "gate", night: false, cast: ["A", "C", "B"],
          lines: [
            { speaker: "C", emotion: "neutral", text: "You boys can sleep at my house tonight. Bruno, our mechanic, will fix your car tomorrow." },
            { speaker: "C", emotion: "worried", text: "But in Hollowmere, there is one rule." },
            { speaker: "B", emotion: "happy", text: "No shoes inside?" },
            { speaker: "C", emotion: "worried", text: "After nine o'clock, if someone calls your name... do not answer." },
            { speaker: "A", emotion: "smug", text: "And what happens if we answer?" },
            { speaker: "C", emotion: "neutral", text: "Then it knows you are home." },
          ],
        },
        {
          scene: "room", night: true, cast: ["A", "B"],
          lines: [
            { speaker: "B", emotion: "happy", text: "Chat, the creepy village has a creepy rule. I love it!" },
            { speaker: "A", emotion: "smug", text: "Of course you do. Tell people NOT to do something, and they want it even more. Psychologists call it reactance." },
            { card: "9:00 PM", fx: "shake" },
            { speaker: "B", emotion: "worried", text: "Max... did every light in the village just go out?" },
            { speaker: "A", emotion: "neutral", text: "It's a village, Leo. People sleep early." },
            { speaker: "V", voiceOf: "A", fx: "echo", text: "Leo... come outside..." },
            { speaker: "B", emotion: "surprised", fx: "shake", text: "Max... why are you calling me from outside?" },
            { speaker: "A", emotion: "surprised", text: "Leo. I'm sitting right here." },
          ],
        },
      ],
    },

    /* ======================= PART 2 ======================= */
    {
      title: "Come Tomorrow",
      segments: [
        {
          scene: "village", night: false, cast: ["A", "B"],
          lines: [
            { speaker: "B", emotion: "worried", text: "Last night, something called my name. In YOUR voice, Max." },
            { speaker: "A", emotion: "neutral", text: "Your brain was scared. A scared brain finds patterns everywhere. Voices in the wind, faces in the dark." },
            { speaker: "B", emotion: "surprised", text: "Then explain THAT." },
            { speaker: "A", emotion: "surprised", text: "Every door in the village says... 'Come tomorrow'?" },
          ],
        },
        {
          scene: "village", night: false, cast: ["A", "C", "B"],
          lines: [
            { speaker: "C", emotion: "neutral", text: "We write it every night. So it leaves... and comes back tomorrow instead." },
            { speaker: "B", emotion: "worried", text: "Mira... our door doesn't have it." },
            { speaker: "C", emotion: "worried", text: "No. It doesn't. And Bruno says your car needs three more days." },
            { speaker: "B", emotion: "worried", text: "Max. Did my scared brain also make these footprints?" },
            { speaker: "A", emotion: "worried", text: "They go around our room. Twice." },
          ],
        },
        {
          scene: "well", night: false, cast: ["A", "B"],
          lines: [
            { speaker: "A", emotion: "neutral", text: "And they end here. At the old well." },
            { speaker: "B", emotion: "worried", text: "There's a rope going all the way down." },
            { speaker: "A", emotion: "smug", text: "Relax. It's probably for a bucket." },
            { speaker: "B", emotion: "surprised", fx: "shake", text: "Max. The rope is moving." },
            { speaker: "A", emotion: "surprised", text: "Something down there... just pulled it." },
          ],
        },
      ],
    },

    /* ======================= PART 3 ======================= */
    {
      title: "The Well",
      segments: [
        {
          scene: "well", night: false, cast: ["A", "B"],
          lines: [
            { speaker: "B", emotion: "worried", text: "Something pulled the rope. And I'm the one going down there?" },
            { speaker: "A", emotion: "smug", text: "It's your treasure hunt. Your forty-dollar map." },
            { speaker: "B", emotion: "worried", text: "Fine. If I don't come back, delete my search history." },
          ],
        },
        {
          scene: "tunnel", night: true, cast: ["A", "B"],
          lines: [
            { speaker: "B", emotion: "surprised", text: "Max! There's a tunnel down here. With carvings on the walls!" },
            { speaker: "A", emotion: "surprised", text: "These carvings are ancient. Hundreds of years old, maybe more." },
            { speaker: "B", emotion: "happy", text: "Treasure! I KNEW the map was real!" },
            { speaker: "A", emotion: "neutral", text: "Focus, Leo. When you're scared or excited, you get tunnel vision. You stop seeing what's around you." },
            { speaker: "B", emotion: "smug", text: "Max, I'm in a literal tunnel." },
            { speaker: "A", emotion: "worried", text: "Then look down. This candle is still warm. Someone was here a minute ago." },
            { speaker: "B", emotion: "surprised", text: "And there's a notebook!" },
            { speaker: "A", emotion: "worried", text: "Read the last page." },
            { speaker: "B", emotion: "worried", fx: "shake", text: "It's today's date. And under it... our names." },
          ],
        },
      ],
    },

    /* ======================= PART 4 ======================= */
    {
      title: "The Recording",
      segments: [
        {
          scene: "room", night: true, cast: ["A", "B"],
          lines: [
            { speaker: "B", emotion: "worried", text: "Someone wrote our names in a notebook. Under a well. Today." },
            { speaker: "A", emotion: "neutral", text: "Tonight we record it. Whatever is out there, the phone will catch it." },
            { speaker: "B", emotion: "worried", text: "That's literally how every horror movie starts." },
            { card: "9:00 PM", fx: "shake" },
            { speaker: "V", voiceOf: "A", fx: "echo", text: "Leo... come outside..." },
            { speaker: "V", voiceOf: "B", fx: "echo", text: "We're live, chat! Day one of the treasure hunt!" },
            { speaker: "B", emotion: "surprised", text: "Wait. That's MY voice. That's from my livestream!" },
            { speaker: "A", emotion: "surprised", text: "It's not a ghost. Someone is playing your own videos back at us." },
            { speaker: "A", emotion: "neutral", text: "We expected a ghost, so every clue looked like a ghost. That's confirmation bias." },
            { speaker: "B", emotion: "worried", text: "Then who is standing at our door?" },
          ],
        },
        {
          scene: "room", night: true, cast: ["A", "D", "B"],
          lines: [
            { speaker: "D", emotion: "neutral", hooded: true, text: "You should not have opened that notebook." },
            { speaker: "B", emotion: "surprised", fx: "shake", text: "YOU? You're Bruno! The mechanic who couldn't fix our car!" },
            { speaker: "D", emotion: "smug", text: "Oh, I can fix it just fine. I'm the one who broke it." },
          ],
        },
      ],
    },

    /* ======================= PART 5 ======================= */
    {
      title: "The Guardians",
      final: true,
      segments: [
        {
          scene: "room", night: true, cast: ["A", "D", "B"],
          lines: [
            { speaker: "B", emotion: "worried", text: "You broke our car on purpose? Why?!" },
            { speaker: "D", emotion: "neutral", text: "To keep you here. Until we knew what kind of treasure hunter you were." },
          ],
        },
        {
          scene: "temple", night: true, cast: ["A", "C", "B"],
          lines: [
            { speaker: "C", emotion: "neutral", text: "You came for treasure. So look." },
            { speaker: "B", emotion: "surprised", text: "Whoa. It's a whole hidden temple." },
            { speaker: "C", emotion: "neutral", text: "For six hundred years, our families have guarded this place." },
            { speaker: "A", emotion: "surprised", text: "So the voices, the chalk on the doors, the rule... it was all you?" },
            { speaker: "C", emotion: "smug", text: "A scary story keeps away more thieves than any lock." },
            { speaker: "A", emotion: "smug", text: "Because people believe a scary story before they ever check the facts." },
            { speaker: "B", emotion: "worried", text: "But how did you even know we were coming?" },
            { speaker: "C", emotion: "happy", text: "You told the whole internet, Leo. The map. The village. And then you went live." },
            { speaker: "B", emotion: "worried", text: "...Yeah. I did do that." },
            { speaker: "A", emotion: "smug", text: "Rule one of treasure hunting: don't livestream the treasure hunt." },
            { speaker: "B", emotion: "happy", text: "I'm deleting the video. This place should stay a secret." },
            { speaker: "C", emotion: "happy", text: "Then Hollowmere welcomes you. Any time you like. Before nine." },
          ],
        },
        {
          scene: "gate", night: true, cast: ["A", "B"],
          lines: [
            { card: "8:59 PM" },
            { speaker: "A", emotion: "happy", text: "Car works. Let's get out of here before nine." },
            { speaker: "B", emotion: "happy", text: "Best trip ever. No ghosts. Just a very dramatic village." },
            { speaker: "V", voiceOf: "child", fx: "echo", text: "Max..." },
            { speaker: "A", emotion: "surprised", fx: "shake", text: "Leo. Did you hear that?" },
            { speaker: "B", emotion: "worried", text: "It came from inside the car. And the car is empty." },
            { speaker: "B", emotion: "surprised", text: "Max... it's one minute past nine." },
          ],
        },
      ],
    },
  ],
};
