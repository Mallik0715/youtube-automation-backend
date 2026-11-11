// Comedy series - "Office Life": relatable work situations, each part a standalone sketch with a punchline.
// Cast: Leo (B) the overworked employee, Victor (F) the boss, Zara (E) a coworker, Max (A) Leo's friend who explains.
const { L, CARD, seg } = require("./helpers");

module.exports = {
  id: "office-life",
  title: "Office Life",
  kind: "comedy",
  music: null, // light background music from assets/music
  hashtags: ["#shorts", "#office", "#relatable", "#comedy", "#psychology"],
  description: "Relatable office moments, animated - with the real psychology behind them.",
  parts: [
    {
      title: "One Small Change",
      hook: "When your boss asks for 'one *small* change' at 5:59 PM",
      segments: [
        seg("office", false, ["B", "F"], [
          L("F", "happy", "Leo! Quick one. Tiny change before you go."),
          L("B", "worried", "Victor, it's five fifty-nine."),
          L("F", "smug", "Just make the logo bigger. And smaller. At the same time."),
          L("B", "surprised", "Bigger AND smaller?"),
          L("F", "neutral", "And make it pop. You know. Pop."),
        ], { seated: ["F"] }),
        seg("office", true, ["A", "B"], [
          L("B", "worried", "Three hours later. Version forty-seven."),
          L("A", "neutral", "That's choice overload. The more options people see, the harder it gets to pick one."),
        ]),
        seg("office", true, ["B", "F"], [
          L("F", "happy", "Perfect! Let's go with version one."),
          L("B", "surprised", "VERSION ONE?!", { fx: "shake" }),
        ], { seated: ["F"] }),
      ],
    },
    {
      title: "The Idea Thief",
      hook: "When your coworker presents *your idea* in the meeting",
      segments: [
        seg("meeting", false, ["E", "F", "B"], [
          L("E", "happy", "So I had an idea. What if customers could order with one click?"),
          L("F", "happy", "Brilliant, Zara! That's promotion material!"),
          L("B", "surprised", "That's the idea I told you at lunch. Word for word."),
          L("E", "smug", "Great minds think alike, Leo."),
        ], { seated: ["F"] }),
        seg("office", false, ["A", "B"], [
          L("B", "worried", "She stole my idea. In front of everyone."),
          L("A", "neutral", "Next time, email your ideas first. A timestamp beats an argument."),
          L("A", "smug", "And now? Ask her a question only the real owner could answer."),
        ]),
        seg("meeting", false, ["E", "F", "B"], [
          L("B", "smug", "Zara, how does one-click ordering handle refunds?"),
          L("E", "worried", "It... handles them... with... one click?"),
          L("F", "smug", "Leo. You're leading the project.", { fx: "shake" }),
        ], { seated: ["F"] }),
      ],
    },
    {
      title: "Could Have Been an Email",
      hook: "When the meeting could have been an *email*",
      segments: [
        seg("meeting", false, ["A", "F", "B"], [
          L("F", "happy", "Thanks for coming to this two-hour meeting."),
          L("B", "worried", "Two hours?"),
          L("F", "neutral", "Item one. Should we have fewer meetings?"),
          L("A", "smug", "Do we need a meeting about that meeting?"),
          L("F", "happy", "Great idea! Let's schedule one!"),
          CARD("2 HOURS LATER"),
          L("B", "worried", "So... what did we decide?"),
          L("F", "happy", "To meet again tomorrow."),
        ], { seated: ["F"] }),
        seg("office", false, ["A", "B"], [
          L("A", "neutral", "In big groups, everyone assumes someone else will decide. It's called diffusion of responsibility."),
          L("A", "smug", "Fix: small meetings, one decision-maker. And snacks."),
        ]),
      ],
    },
    {
      title: "We're a Family",
      hook: "When your boss says *'we're a family here'*",
      segments: [
        seg("office", false, ["B", "F"], [
          L("F", "happy", "Leo, remember. We're not a company. We're a family."),
          L("B", "happy", "Aw. So... family dinner?"),
          L("F", "neutral", "No. Family working Saturday."),
          L("B", "worried", "Unpaid?"),
          L("F", "smug", "Families don't count hours, Leo."),
        ], { seated: ["F"] }),
        seg("cafe", false, ["A", "B"], [
          L("A", "neutral", "Warm words make big asks feel normal. That's framing. Same request, nicer wrapping."),
          L("A", "smug", "So ask for it in writing. A real family won't mind."),
        ]),
        seg("office", false, ["B", "F"], [
          L("B", "smug", "Victor, could you email me the Saturday plan? With the overtime pay?"),
          L("F", "worried", "...Actually, Saturday is cancelled.", { fx: "shake" }),
        ], { seated: ["F"] }),
      ],
    },
    {
      title: "The Raise",
      hook: "How to ask for a *raise*. The smart way.",
      segments: [
        seg("office", false, ["A", "B"], [
          L("B", "worried", "I'm asking for a raise today. I'm terrified."),
          L("A", "neutral", "Say your number first. The first number becomes the anchor. Everything after moves around it."),
          L("A", "smug", "Aim high but believable. And bring proof."),
        ]),
        seg("office", false, ["B", "F"], [
          L("B", "neutral", "Victor, I fixed the website, saved our biggest client, and ran three projects."),
          L("B", "smug", "I'd like a twenty percent raise."),
          L("F", "worried", "Twenty? I was thinking five."),
          L("B", "neutral", "Let's meet at fifteen."),
          L("F", "happy", "...Fifteen. Deal."),
        ], { seated: ["F"] }),
        seg("cafe", false, ["A", "B"], [
          L("B", "happy", "I GOT IT! Fifteen percent!"),
          L("A", "surprised", "Wait. You asked for twenty? I only asked for five last year!", { fx: "shake" }),
        ]),
      ],
    },
  ],
};
