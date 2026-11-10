// Series 7 - "The Last Radio Message": mystery across time. Scenes: home, desert, radio.
// Planted clue: Leo fixed his grandpa's radio, Max is the one who "wants answers" -> Dr. Hale is Max's grandfather.
const { L, V, seg } = require("./helpers");

module.exports = {
  id: "last-radio-message",
  title: "The Last Radio Message",
  music: "suspense",
  hashtags: ["#shorts", "#mystery", "#story", "#animation", "#psychology"],
  description: "An old radio picks up a message: 'If you hear this, the year is 1979.' Then it gives coordinates.",
  parts: [
    {
      title: "Static",
      hook: "An old radio said: *'If you hear this, it's 1979'*",
      segments: [
        seg("home", true, ["A", "B"], [
          L("B", "happy", "Max, I fixed the old radio from the flea market!"),
          V("radio", "...if you hear this... the year is 1979..."),
          L("A", "surprised", "That's a recording. Has to be."),
          V("radio", "...thirty-four north... one sixteen west..."),
          L("B", "worried", "Why would a recording from 1979 give coordinates?"),
          L("A", "neutral", "Only one way to find out."),
          L("B", "surprised", "Max... it's two hours from here. In the desert.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Station",
      hook: "The abandoned radio station was *still broadcasting*",
      segments: [
        seg("desert", false, ["A", "B"], [
          L("B", "worried", "Nothing out here for miles. Just sand and that tower."),
          L("A", "neutral", "Abandoned for forty years, I bet."),
        ]),
        seg("radio", false, ["A", "B"], [
          L("B", "surprised", "Everything's covered in dust... except the microphone."),
          L("A", "surprised", "The equipment is warm. Someone turned it on."),
          V("radio", "...if you hear this... the year is 1979..."),
          L("B", "worried", "The message is playing. Live. From right here."),
          L("A", "worried", "But there's nobody here.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Logbook",
      hook: "His notebook said *two boys* would come. They came.",
      segments: [
        seg("radio", false, ["A", "B"], [
          L("B", "neutral", "A logbook. 'Doctor Hale. Radio research.'"),
          L("A", "neutral", "Last entry: June 1979. Then nothing."),
          L("B", "worried", "Everyone says he vanished in the desert."),
          L("A", "neutral", "'Vanished' usually means 'moved away and nobody checked'. Stories love mysteries."),
          L("B", "surprised", "Wait. One more page."),
          L("B", "worried", "'Two boys will come. Tell them to look under the floor.'"),
          L("A", "surprised", "How could he know we'd come?", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Under the Floor",
      hook: "Under the floor was a *photo* that shouldn't exist",
      segments: [
        seg("radio", false, ["A", "B"], [
          L("B", "neutral", "Loose board. There's a box under it."),
          L("A", "neutral", "A time capsule. Letters, maps... and a photo."),
          L("B", "surprised", "Max. That's US. In this photo. Next to the tower."),
          L("A", "neutral", "Don't jump to conclusions. Everything looks predictable once you know the ending. That's hindsight bias."),
          L("B", "worried", "It says 1979 on the back, Max!"),
          L("A", "surprised", "...And the man in the middle is wearing my grandpa's watch.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Family",
      hook: "The truth about the *1979 photo*",
      segments: [
        seg("home", true, ["A", "B"], [
          L("A", "neutral", "I called my dad. Doctor Hale was my grandfather."),
          L("B", "surprised", "So he never vanished!"),
          L("A", "neutral", "He moved to the city and never talked about the desert again."),
          L("B", "neutral", "And the two boys in the photo?"),
          L("A", "happy", "My dad and my uncle. As kids. They look exactly like us."),
          L("A", "happy", "Grandpa set the radio for his family to find. One day."),
          L("B", "happy", "Coolest family secret ever."),
          V("radio", "...if you hear this... the year is 2049..."),
          L("B", "surprised", "Max. Did that radio just say 2049?", { fx: "shake" }),
        ]),
      ],
    },
  ],
};
