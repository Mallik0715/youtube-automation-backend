// Series 2 - "The Tuesday That Won't End": time loop. Reuses home / cafe / street.
// Planted clue: Leo says Max "forgot" his birthday last Tuesday -> Max's unfinished thing (Part 5).
const { L, CARD, seg } = require("./helpers");

module.exports = {
  id: "tuesday-loop",
  title: "The Tuesday That Won't End",
  music: "suspense",
  hashtags: ["#shorts", "#timeloop", "#story", "#animation", "#psychology"],
  description: "Leo wakes up on the same Tuesday. Again. And again. The only way out is something nobody wants to say.",
  parts: [
    {
      title: "Same Day Again",
      hook: "He woke up on the *same Tuesday*... for the 4th time",
      segments: [
        seg("home", false, ["A", "B"], [
          L("B", "worried", "Max. Today already happened."),
          L("A", "smug", "Good morning to you too."),
          L("B", "worried", "In five seconds, you spill coffee on your new shirt."),
          L("A", "surprised", "How did you... it's brand new!", { fx: "shake" }),
          L("B", "worried", "Next, a song comes on. The one you hate."),
          L("A", "neutral", "That's deja vu. One theory says your brain files the moment as a memory a split second early."),
          L("B", "worried", "It's not deja vu. It's the fourth time. And last Tuesday you even forgot my birthday."),
        ]),
        seg("home", true, ["A", "B"], [
          CARD("11:11 PM", "shake"),
          L("B", "surprised", "Max, the clock! It's happening!"),
        ]),
        seg("home", false, ["A", "B"], [
          L("B", "worried", "...It's Tuesday. Again.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Proof",
      hook: "He predicted his best friend's *whole day*. Every second.",
      segments: [
        seg("cafe", false, ["A", "B"], [
          L("B", "neutral", "The bus is late. A man drops his phone. You order a muffin."),
          L("A", "smug", "I never order muff..."),
          L("A", "surprised", "...I'll have a muffin, please."),
          L("B", "smug", "Told you. You do the same things every day."),
          L("A", "neutral", "Most of our day runs on autopilot. Habits decide before we do."),
          L("B", "worried", "So if nothing changes, Tuesday never ends."),
          L("A", "smug", "Coincidence, Leo. Tomorrow will be Wednesday."),
        ]),
        seg("home", false, ["A", "B"], [
          L("A", "surprised", "Leo, wake up. Something's wrong."),
          L("B", "worried", "Let me guess. It's Tuesday."),
          L("A", "surprised", "Yes! But why do I remember yesterday too?", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Barista",
      hook: "Only *one person* in town acts different every day",
      segments: [
        seg("street", false, ["A", "B"], [
          L("A", "worried", "Now we're both stuck. Same day. Same people."),
          L("B", "neutral", "Same words too. Watch. That man says 'nice weather'."),
          L("A", "surprised", "He said it. Exactly the same way."),
          L("B", "worried", "Everyone repeats. Except the barista."),
        ]),
        seg("cafe", false, ["A", "E", "B"], [
          L("E", "smug", "Morning. Muffin again, Max?"),
          L("A", "surprised", "How do you know my order?"),
          L("E", "neutral", "Yesterday you wore blue. Today, red. You're changing too."),
          L("B", "worried", "Wait. You remember the days?"),
          L("E", "worried", "Remember them? This is loop number forty-seven for me.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Unfinished Thing",
      hook: "The loop only breaks if someone *finishes* this",
      segments: [
        seg("cafe", false, ["A", "E", "B"], [
          L("E", "neutral", "Forty-seven Tuesdays. I finally found the pattern."),
          L("B", "worried", "Tell us. Please. I can't eat another muffin."),
          L("E", "neutral", "The loop ends when someone finishes what they left undone."),
          L("A", "neutral", "That's the Zeigarnik effect. Unfinished things stick in your mind. They won't let go."),
          L("B", "happy", "So I finish my stuff! My novel! My gym plan!"),
          L("E", "smug", "I tried all of mine. Nothing."),
          L("E", "worried", "And it's not yours either, Leo."),
          L("B", "surprised", "Max... what did YOU leave unfinished?"),
          L("A", "worried", "...I think it's me.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Wednesday",
      hook: "One sentence ended the *time loop*. Can you guess it?",
      segments: [
        seg("home", true, ["A", "B"], [
          L("A", "worried", "Your birthday. Last Tuesday. I didn't forget it."),
          L("A", "worried", "I planned a whole surprise. Then I got scared it was too much, and I cancelled."),
          L("A", "neutral", "I'm sorry, Leo. You're my best friend. I should have just said it."),
          L("B", "happy", "Max... that's the nicest thing you've ever said."),
          CARD("11:11 PM"),
          L("B", "surprised", "The clock... it kept going!"),
        ]),
        seg("cafe", false, ["A", "E", "B"], [
          L("B", "happy", "Zara! It worked! It's Wednesday!"),
          L("E", "smug", "I know. Here. Your coffee."),
          L("A", "surprised", "Leo... read the cup.", { fx: "shake" }),
          L("B", "worried", "It says... 'See you Thursday.'"),
        ]),
      ],
    },
  ],
};
