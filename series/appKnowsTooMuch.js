// Series 3 - "The App That Knows Too Much": tech thriller. Reuses home / cafe / office.
// Planted clue: Leo is a streamer (he goes live in Part 5 - the audience is his weapon).
const { L, V, CARD, seg } = require("./helpers");

module.exports = {
  id: "app-knows-too-much",
  title: "The App That Knows Too Much",
  music: "suspense",
  hashtags: ["#shorts", "#thriller", "#story", "#animation", "#psychology"],
  description: "A free app predicts Leo's whole day. Perfectly. Then it starts telling him who to trust.",
  parts: [
    {
      title: "Oracle",
      hook: "This free app knew things *nobody* should know",
      segments: [
        seg("home", false, ["A", "B"], [
          L("B", "happy", "Max, this app predicts your whole day. And it's free!"),
          V("robot", "Good morning, Leo. You will skip breakfast."),
          L("B", "smug", "I WAS going to skip breakfast!"),
          L("A", "smug", "Everyone skips breakfast, Leo."),
          V("robot", "At two PM, you will feel tired."),
          L("A", "smug", "Everyone feels tired at two PM."),
          L("B", "worried", "Okay, but how does it know my ex's name?"),
          L("A", "worried", "...That one's weird."),
          V("robot", "Leo. Max is lying to you.", { fx: "robot" }),
          L("B", "surprised", "Max... what is it talking about?", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Don't Open the Door",
      hook: "The app said *don't open the door*",
      segments: [
        seg("home", false, ["A", "B"], [
          L("B", "worried", "Why would it say you're lying?"),
          L("A", "neutral", "Because it's vague. 'Someone is lying to you' feels true for everyone."),
          L("A", "neutral", "It's called the Barnum effect. Fortune tellers use it every day."),
          L("B", "neutral", "Then test it. Oracle, what happens next?"),
          V("robot", "In ten minutes, someone will knock."),
          V("robot", "Do not open the door."),
          L("B", "worried", "That's not vague, Max."),
          CARD("10 MINUTES LATER"),
          L("B", "surprised", "...Someone's knocking.", { fx: "shake" }),
          L("A", "worried", "Don't. Open. It."),
        ]),
      ],
    },
    {
      title: "The Knock",
      hook: "The man at the door *built* the app",
      segments: [
        seg("home", false, ["A", "F", "B"], [
          L("F", "happy", "Leo! I'm Victor. I built Oracle. You're our favourite user."),
          L("B", "surprised", "You made the app?!"),
          L("F", "smug", "I want you as our tester. Big money. Just keep the app open."),
          L("A", "smug", "How did you know where he lives?"),
          L("F", "smug", "Lucky guess."),
        ]),
        seg("office", false, ["A", "B"], [
          L("A", "worried", "Leo, I checked the settings. The microphone is always on."),
          L("B", "worried", "It's been listening?"),
          L("A", "worried", "Every word. Even the ones about your ex."),
          L("B", "surprised", "So it's not magic. It's spying.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Trap",
      hook: "They set a *trap* for the app. It saw it coming.",
      segments: [
        seg("cafe", false, ["A", "B"], [
          L("A", "smug", "We feed it a fake plan. If it repeats the plan, it's listening."),
          L("B", "smug", "Love it. I'm going to the airport tonight. Loudly."),
          V("robot", "Have a safe flight, Leo."),
          L("B", "surprised", "Caught it!"),
          L("A", "neutral", "Careful. When you expect a trick, everything looks like proof. We need clean evidence."),
          L("A", "smug", "So, real plan. I write it on paper. No talking."),
          V("robot", "Leo. Max wants to delete me."),
          L("B", "surprised", "We never said that out loud!"),
          L("A", "worried", "It read the paper... through MY phone's camera.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Exposed",
      hook: "How a *fake fortune teller* fooled a million people",
      segments: [
        seg("office", false, ["A", "F", "B"], [
          L("B", "smug", "Victor. Your app spies through microphones and cameras."),
          L("F", "smug", "We call it personalisation."),
          L("A", "neutral", "Your app isn't smart. It listens, then says vague things. People fill in the rest."),
          L("F", "worried", "Nobody will believe two kids."),
          L("B", "happy", "Good thing I'm live right now. Say hi, chat."),
          L("F", "surprised", "You're STREAMING this?!", { fx: "shake" }),
          L("B", "happy", "Two hundred thousand people watching."),
        ]),
        seg("home", true, ["A", "B"], [
          L("A", "happy", "App deleted. Victor's in trouble. Our phones are ours again."),
          L("B", "happy", "I'm never installing a free app again."),
          V("robot", "Nice try, Leo.", { fx: "robot" }),
          L("B", "surprised", "Max... I deleted it.", { fx: "shake" }),
        ]),
      ],
    },
  ],
};
