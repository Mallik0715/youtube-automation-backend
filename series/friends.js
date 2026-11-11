// Comedy series - "Friends": relatable friend-group moments, each part a standalone sketch with a punchline.
// Cast: Max (A) explains the psychology, Leo (B) is the friend who does the thing, Zara (E) the third friend.
const { L, seg } = require("./helpers");

module.exports = {
  id: "friends",
  title: "Friends",
  kind: "comedy",
  music: null,
  hashtags: ["#shorts", "#friends", "#relatable", "#comedy", "#psychology"],
  description: "That one friend. Animated - with the real psychology behind what they do.",
  parts: [
    {
      title: "Five Minutes Away",
      hook: "When your friend says he's *'5 minutes away'*",
      segments: [
        seg("cafe", false, ["A", "E"], [
          L("E", "neutral", "Leo says he's five minutes away."),
          L("A", "smug", "He said that forty minutes ago."),
        ]),
        seg("home", false, ["B"], [
          L("B", "happy", "Leaving now! Right after a shower. And breakfast. Where are my shoes?"),
        ]),
        seg("cafe", false, ["A", "E"], [
          L("A", "neutral", "That's the planning fallacy. We picture the perfect version of our plan and forget the shoes."),
          L("E", "smug", "So next time we tell him to come an hour early."),
        ]),
        seg("cafe", false, ["A", "E", "B"], [
          L("B", "happy", "Sorry! Traffic was crazy!"),
          L("A", "smug", "Leo. You live next door.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Splitting the Bill",
      hook: "When the bill comes and your friend *only had water*",
      segments: [
        seg("cafe", false, ["A", "E", "B"], [
          L("B", "happy", "Great dinner! Let's just split it equally."),
          L("E", "worried", "Leo, I had water. You had three steaks."),
          L("B", "smug", "Friendship isn't about math, Zara."),
          L("A", "neutral", "We judge others by what they do, but ourselves by what we meant. It feels fair from the inside."),
          L("E", "smug", "Okay. Next time I order three steaks, and we split."),
          L("B", "surprised", "...Separate bills it is.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Be Honest",
      hook: "When your friend asks your opinion... but already *decided*",
      segments: [
        seg("home", false, ["A", "B"], [
          L("B", "happy", "Should I get a haircut? Be honest."),
          L("A", "neutral", "Honestly? Keep it. It suits you."),
          L("B", "worried", "Hmm. But what if I go really short?"),
          L("A", "neutral", "Then short is fine too."),
          L("B", "smug", "Cool. I booked it yesterday."),
          L("A", "smug", "Then why did you ask?"),
          L("A", "neutral", "People often ask for advice just to feel sure about a choice they've already made."),
          L("B", "happy", "Exactly. So tell me it's a great choice."),
          L("A", "happy", "It's a great choice, Leo."),
        ]),
      ],
    },
    {
      title: "No Spoilers",
      hook: "When someone says *'no spoilers'*... then spoils it",
      segments: [
        seg("home", true, ["A", "E", "B"], [
          L("B", "worried", "Nobody spoil the finale. I'm watching it tonight."),
          L("E", "happy", "Promise. My lips are sealed."),
          L("A", "smug", "Zara can't keep a secret for five minutes."),
          L("E", "worried", "I CAN! I won't even say the brother was the villain all along!"),
          L("B", "surprised", "ZARA!", { fx: "shake" }),
          L("A", "neutral", "Funny thing. Some studies found people enjoy stories just as much, even when spoiled."),
          L("B", "worried", "Does not feel that way right now."),
          L("E", "happy", "Then I definitely won't mention the twist at the end."),
          L("B", "surprised", "THERE'S MORE?!", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Charger",
      hook: "When your friend *borrows* your charger. Forever.",
      segments: [
        seg("home", false, ["A", "B"], [
          L("B", "worried", "Max, where's my charger?"),
          L("A", "smug", "Which one? You've bought five this month."),
          L("B", "worried", "Zara borrowed the first one. Then the second. Then the third."),
        ]),
        seg("home", false, ["A", "E", "B"], [
          L("E", "happy", "Hey! Can I borrow a charger?"),
          L("B", "smug", "Sure. Right after you return the other four."),
          L("E", "surprised", "Four? I thought those were gifts!"),
          L("A", "neutral", "Once something is in your hands, your brain values it more. That's the endowment effect."),
          L("E", "happy", "Exactly. So technically, they're mine now."),
          L("B", "surprised", "That's NOT how psychology works, Zara!", { fx: "shake" }),
        ]),
      ],
    },
  ],
};
