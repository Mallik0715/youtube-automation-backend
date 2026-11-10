// Series 8 - "The Night Train": twist thriller. Scene: train.
// Planted clue: Leo "booked something at 2 AM" (Part 4) -> the show; the grey-coat man is never explained (sting).
const { L, CARD, seg } = require("./helpers");

module.exports = {
  id: "night-train",
  title: "The Night Train",
  music: "suspense",
  hashtags: ["#shorts", "#thriller", "#twist", "#animation", "#psychology"],
  description: "Every time the night train enters a tunnel, another passenger disappears. Then it stops stopping.",
  parts: [
    {
      title: "Last Train",
      hook: "Every tunnel, *one more passenger* disappears",
      segments: [
        seg("train", true, ["A", "B"], [
          L("B", "happy", "Last train home. Nearly empty. Nice."),
          L("A", "neutral", "There were twenty people when we got on."),
          CARD("TUNNEL", "shake"),
          L("B", "surprised", "Max... where did that family go?"),
          L("A", "worried", "They were right there. Before the tunnel."),
          CARD("TUNNEL", "shake"),
          L("B", "worried", "The old man too. Gone."),
          L("B", "worried", "Max. We're the only ones left. And the train isn't stopping.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Question",
      hook: "The conductor asked them *one question*",
      segments: [
        seg("train", true, ["A", "F", "B"], [
          L("F", "smug", "Tickets, please. Ah. The last two."),
          L("B", "worried", "Where is everyone? Why aren't we stopping?"),
          L("F", "neutral", "This train stops when you answer the question."),
          L("A", "smug", "What question?"),
          L("F", "neutral", "Everyone else answered. Honestly. Quickly."),
          L("B", "worried", "Just tell us the question!"),
          L("F", "smug", "What... did you lose?", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Mirror Carriage",
      hook: "In the next carriage... they found *themselves*",
      segments: [
        seg("train", true, ["A", "B"], [
          L("B", "worried", "'What did you lose?' My keys? My mind?"),
          L("A", "neutral", "He wants us scared. Scared people say anything."),
          L("B", "surprised", "Max. Next carriage. Look."),
          L("A", "surprised", "That's us. Sitting there. Same clothes."),
          L("A", "neutral", "It's a trick. Watch where he wants us to look. That's misdirection. Magicians use it."),
          L("B", "neutral", "So they're actors?"),
          L("A", "worried", "Then why did the other me just blink... out of sync?", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Show",
      hook: "It was all a *show*... except for one passenger",
      segments: [
        seg("train", true, ["A", "F", "B"], [
          L("F", "happy", "Bravo! You found the twist!"),
          L("B", "surprised", "WHAT twist?!"),
          L("F", "happy", "The Midnight Mystery Train. An interactive horror show. You booked it."),
          L("B", "worried", "...I did book something at two AM last week."),
          L("A", "smug", "You booked a horror show half asleep."),
          L("F", "happy", "The missing passengers? Actors. Hiding in the luggage car."),
          L("A", "neutral", "Then who's the man in the grey coat?"),
          L("F", "worried", "Grey coat? There's no man in a grey coat in our show.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Final Stop",
      hook: "Look at the *photo* at the end. Look closely.",
      segments: [
        seg("train", true, ["A", "F", "B"], [
          L("F", "worried", "I checked the cast list. No grey coat."),
          L("B", "worried", "He was RIGHT there! Now he's gone."),
          L("A", "neutral", "Tired brains fill in gaps. We've been scared for an hour."),
          L("F", "happy", "Final stop! Photo time, everyone!"),
        ]),
        seg("train", false, ["A", "B"], [
          L("B", "happy", "Best weird night ever. Let's see the photo."),
          L("A", "happy", "We look terrified. Perfect."),
          L("B", "worried", "Max... who's standing behind us?"),
          L("A", "surprised", "A man... in a grey coat.", { fx: "shake" }),
        ]),
      ],
    },
  ],
};
