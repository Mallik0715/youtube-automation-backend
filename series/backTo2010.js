// "Back to 2010" - narrated, 10 parts, A/B choice at the end of each part.
// Zara wakes up in 2010 with every memory of the next 16 years. Bitcoin, a lost friend, a stolen
// notebook of the future, and a watchmaker who knows far too much.
// Cast: Zara (E) the hero · Leo (B) her best friend · Mira (C) her mom · Bruno (D) the old watchmaker
//       Victor (F) a millionaire investor
const { L, V, N, CARD, seg } = require("./helpers");

module.exports = {
  id: "back-to-2010",
  title: "Back to 2010",
  interactive: true,
  hero: "Zara",
  music: "suspense",
  hashtags: ["#shorts", "#timetravel", "#bitcoin", "#whatwouldyoudo", "#story"],
  tags: ["what would you do", "back to 2010", "time travel story", "bitcoin", "choose your path"],
  description: "She woke up in 2010 with all her memories of the future. Bitcoin at less than a cent. You decide what she does next.",
  parts: [
    {
      title: "The Crash",
      hook: "She woke up in *2010*. With every memory of the future.",
      choice: { question: "What should Zara do first?", a: "Buy Bitcoin with all her savings", b: "Get her mom to a doctor" },
      segments: [
        seg("street", true, ["E"], [
          N("March, 2026. Zara was thirty-four, broke, and alone.", { focus: "E", emotion: "worried" }),
          L("E", "worried", "If only I could go back. Just once."),
          N("Then, headlights.", { focus: "E", emotion: "surprised" }),
          CARD("CRASH", "shake", "boom"),
        ]),
        seg("home", false, ["E"], [
          N("She woke up in her teenage bedroom. Posters on the wall. A flip phone on the bed.", { focus: "E", emotion: "surprised" }),
          N("The date on the phone. March, 2010.", { focus: "E", emotion: "surprised" }),
          L("E", "surprised", "Twenty TEN?!", { fx: "shake" }),
        ]),
        seg("home", false, ["E", "C"], [
          N("Then her mom walked in. Her mom, who passed away in 2019.", { focus: "C", emotion: "happy" }),
          L("C", "happy", "Breakfast, sleepyhead! You'll be late for school!"),
          N("Zara remembered everything. Every crash. Every trend. And one thing worth more than all of it.", { focus: "E" }),
          N("Bitcoin. Right now, it cost less than one cent.", { focus: "E", emotion: "smug" }),
        ]),
      ],
    },
    {
      title: "Less Than a Cent",
      follows: "a", // the option of the previous part's choice this part continues with
      hook: "She bought *20,000 Bitcoin* for $200",
      choice: { question: "What should Zara do?", a: "Ask the old man how he knows", b: "Ignore him and run" },
      segments: [
        seg("home", true, ["E"], [
          N("That night, Zara emptied her piggy bank. Two hundred dollars.", { focus: "E", emotion: "smug" }),
          N("Back then, Bitcoin was a nerdy experiment. Strangers sold it on forums for almost nothing.", { focus: "E" }),
          N("By morning, she owned twenty thousand Bitcoin. In 2026, worth over a billion dollars.", { focus: "E", emotion: "happy", fx: "shake" }),
        ]),
        seg("cafe", false, ["E", "B"], [
          N("She told her best friend Leo. Well, some of it.", { focus: "B" }),
          L("B", "smug", "Magic internet money? Zara, people use that to buy pizza."),
          N("He was right. Two months later, someone paid ten thousand Bitcoin for two pizzas.", { focus: "B", emotion: "smug" }),
          L("E", "smug", "Trust me, Leo. Remember this day."),
        ]),
        seg("cafe", false, ["E", "D"], [
          N("On her way out, an old man grabbed her wrist.", { focus: "D", emotion: "worried" }),
          L("D", "worried", "Second time around, Zara? Careful. Every change has a price.", { fx: "shake" }),
          N("She had never seen him before in her life.", { focus: "E", emotion: "worried" }),
        ]),
      ],
    },
    {
      title: "Who Are You?",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "She changed the past. Her best friend *forgot she existed*.",
      choice: { question: "What should Zara do?", a: "Make Leo remember her", b: "Find the old man" },
      segments: [
        seg("street", false, ["E"], [
          N("Zara pulled free and ran. Just a crazy old man, she told herself.", { focus: "E", emotion: "worried", sfx: "footsteps" }),
          N("But that night, she couldn't sleep.", { focus: "E", emotion: "worried" }),
        ]),
        seg("cafe", false, ["E", "B"], [
          N("The next morning, Leo was at their cafe. Same table. Same hoodie.", { focus: "B" }),
          L("E", "happy", "Leo! Pizza money, remember?"),
          L("B", "worried", "Sorry... do I know you?", { fx: "shake" }),
          N("Leo. Her best friend since she was six. Had never met her.", { focus: "E", emotion: "surprised" }),
          L("E", "worried", "It's me. Zara. We built a treehouse. You broke your arm falling out of it."),
          L("B", "worried", "I broke my arm falling off a bike. Alone."),
          N("Ten years of friendship. Gone overnight.", { focus: "E", emotion: "worried" }),
        ]),
      ],
    },
    {
      title: "The Watchmaker",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "The old man knew *exactly* what she did",
      choice: { question: "What should Zara do?", a: "Destroy the Bitcoin", b: "Keep it and win Leo back herself" },
      segments: [
        seg("street", false, ["E"], [
          N("Zara searched the city for three days. Then she saw it. A tiny watch shop she had never noticed.", { focus: "E", emotion: "surprised" }),
        ]),
        seg("room", true, ["E", "D"], [
          N("Hundreds of clocks. All ticking at once. And the old man, waiting.", { focus: "D" }),
          L("D", "neutral", "I warned you. Time keeps its balance."),
          L("D", "neutral", "You took a fortune from the future. So time took something back."),
          L("E", "worried", "It took LEO?", { fx: "shake" }),
          L("D", "neutral", "Destroy the Bitcoin, and he remembers you again."),
          N("Over a billion dollars. Or her best friend.", { focus: "E", emotion: "worried" }),
        ]),
      ],
    },
    {
      title: "Strangers Again",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "She had to make her best friend *like her again*. From zero.",
      choice: { question: "What should Zara tell Victor?", a: "The truth", b: "Lie and say it was luck" },
      segments: [
        seg("cafe", false, ["E", "B"], [
          N("Zara kept the Bitcoin. If time took Leo, she would win him back. The hard way.", { focus: "E", emotion: "smug" }),
          N("She sat at his table every day. Told his favourite jokes before he could.", { focus: "B", emotion: "happy" }),
          L("B", "happy", "Weird. It feels like I've known you forever."),
          L("E", "happy", "Maybe you have."),
        ]),
        seg("home", false, ["E", "C"], [
          N("And this time, she dragged her mom to a doctor. Nine years early. They caught it in time.", { focus: "C", emotion: "happy" }),
        ]),
        CARD_SEG("2013"),
        seg("office", false, ["E", "F"], [
          N("Bitcoin hit a thousand dollars. Zara was twenty, and worth twenty million.", { focus: "E", emotion: "happy" }),
          N("Then a millionaire investor named Victor asked to meet her.", { focus: "F", emotion: "smug" }),
          L("F", "smug", "You bought at less than a cent. Nobody knew. So how did YOU know?", { fx: "shake" }),
        ], { seated: ["F"] }),
      ],
    },
    {
      title: "The Notebook",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "Someone stole her *notebook of the future*",
      choice: { question: "What should Zara do?", a: "Steal the notebook back", b: "Go to the police" },
      segments: [
        seg("office", false, ["E", "F"], [
          L("E", "smug", "Lucky guess."),
          L("F", "smug", "Nobody guesses that lucky."),
          N("Victor smiled. Zara did not like that smile.", { focus: "F", emotion: "smug" }),
        ], { seated: ["F"] }),
        seg("home", true, ["E", "B"], [
          N("Zara had one secret. A notebook. Every big event from 2013 to 2026. Every crash. Every winner.", { focus: "E" }),
          N("That night, her room was torn apart. The notebook was gone.", { focus: "E", emotion: "surprised", fx: "shake" }),
          L("B", "worried", "Zara, what was in it?"),
          L("E", "worried", "The future, Leo. All of it."),
          N("The next morning, Victor made his first impossible bet. And won.", { focus: "E", emotion: "worried" }),
        ]),
      ],
    },
    {
      title: "Midnight Break-In",
      follows: "a", // the option of the previous part's choice this part continues with
      hook: "She broke into a millionaire's office to *steal back the future*",
      choice: { question: "What should Zara do?", a: "Burn the notebook", b: "Use it to beat Victor first" },
      segments: [
        seg("office", true, ["E", "B"], [
          N("At midnight, Zara and Leo slipped into Victor's office.", { focus: "E", emotion: "worried", sfx: "footsteps" }),
          N("The notebook was right there on his desk. Open.", { focus: "B", emotion: "surprised" }),
          N("But one page was new. Written in Zara's own handwriting.", { focus: "E", emotion: "surprised", fx: "shake" }),
          N("It said: Don't trust the watchmaker.", { focus: "E", emotion: "worried" }),
          L("B", "surprised", "You wrote that?"),
          L("E", "worried", "Not yet, I didn't."),
        ]),
        seg("office", true, ["E", "B", "F"], [
          N("The lights came on.", { focus: "F", emotion: "smug", sfx: "boom" }),
          L("F", "smug", "Take it. I've already copied every page."),
        ]),
      ],
    },
    {
      title: "Burn It",
      follows: "a", // the option of the previous part's choice this part continues with
      hook: "She *burned* the only map of the future",
      choice: { question: "Is the old man telling the truth?", a: "Believe him", b: "Run" },
      segments: [
        seg("home", true, ["E", "B"], [
          N("Zara burned it. Every page.", { focus: "E", emotion: "smug" }),
          L("B", "worried", "Victor still has a copy."),
          L("E", "smug", "Then I'll make sure none of it comes true."),
          N("Every choice she made sent ripples through time. One by one, Victor's pages stopped coming true.", { focus: "E", emotion: "smug" }),
          N("He bet everything on a page that never happened. He lost it all in a single day.", { focus: "B", emotion: "happy", fx: "shake" }),
        ]),
        seg("room", true, ["E", "D"], [
          N("But one line still haunted her. Don't trust the watchmaker. So she went back.", { focus: "E", emotion: "worried", sfx: "footsteps" }),
          L("E", "worried", "Who are you? Really?"),
          N("The old man took off his cap. And she knew that scar.", { focus: "D" }),
          L("D", "neutral", "It's me, Zara. Leo. From 2040.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "From 2040",
      follows: "a", // the option of the previous part's choice this part continues with
      hook: "The old man was her best friend. *From the future.*",
      choice: { question: "What should Zara do?", a: "Let old Leo go", b: "Beg him to stay" },
      segments: [
        seg("room", true, ["E", "D"], [
          L("D", "worried", "In my world, you died in that crash. I spent fourteen years building a way to send you back."),
          L("E", "surprised", "YOU sent me back?"),
          L("E", "worried", "Then why doesn't young Leo remember me?"),
          L("D", "neutral", "Two of me can't remember you at the same time. Time won't allow it."),
          N("Don't trust the watchmaker. Now she understood why she'd written it.", { focus: "E", emotion: "worried" }),
          L("D", "worried", "If I leave this time forever, he gets every memory back. And I disappear.", { fx: "shake" }),
          N("To save young Leo, she had to lose old Leo.", { focus: "D", emotion: "worried" }),
        ]),
      ],
    },
    {
      title: "The Night of the Crash",
      follows: "a", // the option of the previous part's choice this part continues with
      hook: "March 2026. *The night of the crash.* Again.",
      choice: { question: "Why did future Zara send that message?", a: "To warn her about something", b: "To take her place" },
      segments: [
        seg("room", true, ["E", "D"], [
          L("D", "happy", "Make it a good life this time, Zara."),
          N("A blink, and he was gone. Only one watch was still ticking on the table.", { focus: "E", emotion: "worried" }),
        ]),
        seg("cafe", false, ["E", "B"], [
          L("B", "surprised", "Zara?! Pizza money! Where have you BEEN?!", { fx: "shake" }),
          N("He remembered. Everything. The treehouse. The broken arm. All of it.", { focus: "E", emotion: "happy" }),
        ]),
        CARD_SEG("MARCH 2026"),
        seg("street", true, ["E", "B"], [
          N("Sixteen years later. The same road. The same night. Leo in the passenger seat.", { focus: "E", emotion: "worried" }),
          N("Zara stopped the car one second early. The truck roared past.", { focus: "B", emotion: "surprised", sfx: "whoosh" }),
          N("They were alive. Then her phone buzzed.", { focus: "E", emotion: "happy" }),
          V("robot", "New message. From Zara. Sent from 2040."),
        ]),
      ],
    },
  ],
};

// A silent black title card ("2013") as its own scene, shown between two places
function CARD_SEG(text) {
  return seg("home", true, ["E"], [CARD(text)]);
}
