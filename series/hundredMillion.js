// "The $100 Million Test" - narrated, 10 parts. Every part ends with an A/B choice and asks viewers to comment.
// The story is pre-written: each part follows one of the two options. The narration never claims
// how viewers voted - it just carries on with what Leo did.
// Cast: Leo (B) the hero · Zara (E) his best friend · Mira (C) his mom · Victor (F) Hale's nephew
//       Bruno (D) the bank manager / Hale's lawyer · Max (A) another of the ten
const { L, V, N, CARD, seg } = require("./helpers");

module.exports = {
  id: "hundred-million",
  title: "The $100 Million Test",
  interactive: true,
  hero: "Leo",
  voices: { A: { voice: "en-AU-WilliamMultilingualNeural", rate: "+10%", pitch: "+0Hz" } }, // Max, distinct from the narrator
  music: "suspense",
  hashtags: ["#shorts", "#whatwouldyoudo", "#story", "#animation", "#100million"],
  tags: ["what would you do", "100 million dollars", "choose your path", "money story"],
  description: "One night, a broke delivery rider wakes up to $100,000,000 in his bank account. You decide what he does next.",
  parts: [
    {
      title: "The Notification",
      hook: "He woke up to *$100,000,000* in his bank account",
      choice: { question: "What should Leo do?", a: "Call the bank right now", b: "Spend a little and test it" },
      segments: [
        seg("home", true, ["B"], [
          N("Leo had forty-three dollars in his bank account.", { focus: "B", emotion: "worried" }),
          N("Rent was due Friday. His mom needed surgery he couldn't pay for.", { focus: "B", emotion: "worried" }),
          CARD("3:07 AM"),
          N("Then his phone buzzed.", { focus: "B", emotion: "surprised" }),
          L("B", "surprised", "One hundred... MILLION?!", { fx: "shake" }),
          N("Credited. One hundred million dollars. The sender was just one letter. H.", { focus: "B", emotion: "surprised" }),
          N("He refreshed the app five times. It was still there.", { focus: "B", emotion: "worried" }),
        ]),
        seg("home", true, ["B", "E"], [
          N("He called his best friend Zara. She came over in her pyjamas.", { focus: "E", emotion: "worried" }),
          L("E", "worried", "Leo. Banks don't make hundred-million-dollar mistakes."),
          L("B", "worried", "Then what is this?"),
          N("Before she could answer, a second message arrived.", { focus: "B", emotion: "surprised" }),
          V("robot", "It's not a mistake. Spend it wisely. H.", { sfx: "boom" }),
        ]),
      ],
    },
    {
      title: "It's Not a Mistake",
      follows: "a", // the option of the previous part's choice this part continues with
      hook: "The bank said the *$100 million* was really his",
      choice: { question: "What should Leo do first?", a: "Pay for his mom's surgery", b: "Hide the money and act normal" },
      segments: [
        seg("office", false, ["B", "D"], [
          N("Leo called the bank at nine sharp. They asked him to come in. Now.", { focus: "B", emotion: "worried" }),
          L("B", "worried", "There's a mistake. A hundred million dollars landed in my account."),
          N("The manager typed for a long time. Then he looked up.", { focus: "D" }),
          L("D", "neutral", "No mistake, sir. The transfer is legal, taxed and final. It's yours."),
          L("B", "surprised", "Mine? From who?"),
          L("D", "smug", "I'm not allowed to say. But he asked me to give you this."),
          N("An envelope. Inside, one handwritten line.", { focus: "B", emotion: "surprised" }),
          N("You have thirty days. Show me who you really are.", { focus: "B", emotion: "worried" }),
        ], { seated: ["D"] }),
        seg("street", false, ["B"], [
          N("Outside, a black car was parked across the street.", { focus: "B", emotion: "worried" }),
          N("When Leo started walking... it started driving.", { focus: "B", emotion: "worried", sfx: "footsteps" }),
        ]),
      ],
    },
    {
      title: "The Man in the Suit",
      follows: "a", // the option of the previous part's choice this part continues with
      hook: "A stranger offered him *$1 million* to give back the rest",
      choice: { question: "What should Leo do?", a: "Take the deal and keep $1 million", b: "Refuse and find out who H is" },
      segments: [
        seg("home", false, ["B", "C"], [
          N("Leo went straight to the hospital and paid for his mom's surgery. In full.", { focus: "B", emotion: "happy" }),
          L("C", "worried", "Leo. Where did you get this money?"),
          L("B", "happy", "I'll explain later, Mom. Just get better."),
          N("It was the first lie he had ever told her.", { focus: "C", emotion: "worried" }),
        ]),
        seg("street", true, ["B", "F"], [
          N("That night, the black car was waiting outside his building.", { focus: "B", emotion: "worried" }),
          N("A man in an expensive suit stepped out.", { focus: "F", emotion: "smug" }),
          L("F", "smug", "Leo. You have something that belongs to my family."),
          L("F", "neutral", "Send back ninety-nine million. Keep one. Nobody gets hurt."),
          L("B", "worried", "And if I don't?"),
          L("F", "smug", "Then you lose everything. Starting with your mom's nice new hospital bed.", { fx: "shake" }),
          N("He gave Leo twenty-four hours.", { focus: "F", emotion: "smug" }),
        ]),
      ],
    },
    {
      title: "Who Is H?",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "He found out *who* sent him $100 million...",
      choice: { question: "What should Leo do?", a: "Find the other nine winners", b: "Go straight to the police" },
      segments: [
        seg("cafe", false, ["B", "E"], [
          N("Leo said no. He wasn't giving anything back until he knew who H was.", { focus: "B", emotion: "smug" }),
          N("Zara traced the transfer. It came from the Hale Foundation.", { focus: "E", emotion: "surprised" }),
          L("E", "surprised", "Arthur Hale. The billionaire. Leo... he died four days ago."),
          L("B", "worried", "A dead man sent me a hundred million dollars?"),
          N("And the man in the suit? Victor Hale. His nephew. Next in line for everything.", { focus: "E", emotion: "worried" }),
        ]),
        seg("home", true, ["B", "E"], [
          N("Then the news came on.", { focus: "B", emotion: "worried" }),
          V("radio", "Breaking news. Nine other people received one hundred million dollars from Arthur Hale. On the same night."),
          N("And one of them had just gone missing.", { focus: "B", emotion: "surprised", fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Ten",
      follows: "a", // the option of the previous part's choice this part continues with
      hook: "Six of the ten *gave the money back*. Then he found out why.",
      choice: { question: "Should Leo go?", a: "Go and watch the video", b: "Don't go, it's a trap" },
      segments: [
        seg("cafe", false, ["B", "A", "E"], [
          N("Zara found a forum post. Anyone else get money from H?", { focus: "E", emotion: "smug" }),
          N("Only one reply. A guy named Max. He agreed to meet.", { focus: "A", emotion: "worried" }),
          L("A", "worried", "Victor visited all of us. Six already gave the money back."),
          L("B", "surprised", "Six? Why?"),
          L("A", "worried", "He knew things. Our families. Our secrets. Everything."),
          N("Four left. Leo, Max, and two strangers too scared to answer.", { focus: "B", emotion: "worried" }),
        ]),
        seg("street", false, ["B"], [
          N("Walking home, Leo's phone rang. It was the bank manager.", { focus: "B", emotion: "surprised" }),
          V("D", "Mister Hale left a video. Only for the ones who kept the money. Tonight. Come alone.", { fx: "radio" }),
          N("At the same moment, Max texted. Don't go. It's a trap.", { focus: "B", emotion: "worried", sfx: "boom" }),
        ]),
      ],
    },
    {
      title: "The Dead Man's Video",
      follows: "a", // the option of the previous part's choice this part continues with
      hook: "A dead billionaire left him a *secret video*",
      choice: { question: "What should Leo do with the money?", a: "Give it to people who need it", b: "Invest it and make it grow" },
      segments: [
        seg("office", true, ["B", "D"], [
          N("Leo went anyway. Alone. Just like the man said.", { focus: "B", emotion: "worried", sfx: "footsteps" }),
          N("The bank manager wasn't just a manager. He was Arthur Hale's lawyer.", { focus: "D", emotion: "smug" }),
          L("D", "neutral", "Mister Hale recorded this the week before he died."),
          V("radio", "If you're watching this, you didn't give it back. Good."),
          V("radio", "Ten strangers. A hundred million each. Whoever uses it best inherits everything I own."),
          L("B", "surprised", "Everything?"),
          L("D", "neutral", "Forty billion dollars.", { fx: "shake" }),
          V("radio", "My nephew Victor will try to stop you. Don't let him."),
        ], { seated: ["D"] }),
      ],
    },
    {
      title: "Frozen",
      follows: "a", // the option of the previous part's choice this part continues with
      hook: "He gave away millions. Then his account was *frozen*.",
      choice: { question: "What should Leo do?", a: "Sign and walk away", b: "Fight Victor in court" },
      segments: [
        seg("street", false, ["B", "E"], [
          N("Leo started giving. Quietly.", { focus: "B", emotion: "happy" }),
          N("He paid off his neighbours' debts. He rebuilt the school down the street.", { focus: "B", emotion: "happy" }),
          N("Somebody filmed it. By Friday, the mystery giver had two million followers.", { focus: "E", emotion: "happy" }),
          L("E", "happy", "Leo, you're famous! Everyone's talking about you!"),
        ]),
        seg("cafe", false, ["B", "E"], [
          N("Then his card was declined. For a four-dollar coffee.", { focus: "B", emotion: "surprised" }),
          N("His account was frozen. Every last dollar.", { focus: "B", emotion: "worried", fx: "shake" }),
          V("F", "Sign the papers, Leo. Or stay broke forever.", { fx: "radio" }),
          L("E", "worried", "Leo... maybe you should just sign."),
          N("Zara had never said anything like that before.", { focus: "B", emotion: "worried" }),
        ]),
      ],
    },
    {
      title: "The Message",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "He saw *one text* on his best friend's phone...",
      choice: { question: "What should Leo do?", a: "Confront Zara right now", b: "Pretend he never saw it" },
      segments: [
        seg("office", false, ["B", "D"], [
          N("Leo didn't sign. He went back to Hale's lawyer.", { focus: "B", emotion: "smug" }),
          L("D", "neutral", "Freezing your account is illegal. But we need proof Victor did it."),
          L("B", "smug", "Then I'll get him to say it."),
        ], { seated: ["D"] }),
        seg("home", true, ["B", "E"], [
          N("The plan. Meet Victor at the old harbour. Record everything.", { focus: "B", emotion: "smug" }),
          L("E", "happy", "I'm coming with you. You're not doing this alone."),
          N("She hugged him. Her phone lit up on the table.", { focus: "B" }),
          N("One new message. From Victor.", { focus: "B", emotion: "surprised", fx: "shake" }),
          V("robot", "Bring him at midnight. Your money is ready."),
          N("Zara. His best friend since they were seven. Had sold him.", { focus: "E", emotion: "worried" }),
        ]),
      ],
    },
    {
      title: "Midnight at the Harbour",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "His best friend *sold him out*. So he set a trap.",
      choice: { question: "What should Leo do about Zara?", a: "Forgive her", b: "Never speak to her again" },
      segments: [
        seg("shore", true, ["B", "E", "F"], [
          N("Leo said nothing. He smiled, and walked to the harbour with Zara.", { focus: "B" }),
          N("Victor was waiting.", { focus: "F", emotion: "smug", sfx: "footsteps" }),
          L("F", "smug", "Good work, Zara. Now sign, Leo. Or your mother's bills get very complicated."),
          L("B", "neutral", "So you froze my account? And scared off the other six?"),
          L("F", "smug", "Of course. That money belongs to my family. Nobody stops me."),
          L("B", "smug", "Thanks, Victor. You just said that to two million people."),
          N("Leo turned his phone around. A live stream. Two million viewers.", { focus: "B", emotion: "smug", fx: "shake" }),
          N("Somewhere behind them, sirens.", { focus: "F", emotion: "surprised" }),
          L("E", "worried", "Leo... I'm sorry. I owed so much money. I panicked."),
        ]),
      ],
    },
    {
      title: "The Inheritance",
      follows: "a", // the option of the previous part's choice this part continues with
      hook: "The will was read. Who gets the *$40 billion*?",
      choice: { question: "Who sent that message?", a: "Arthur Hale is still alive", b: "Someone else is running the game" },
      segments: [
        seg("shore", true, ["B", "E"], [
          N("Leo forgave her. Not because she deserved it. Because he remembered who they were at seven.", { focus: "B" }),
          L("B", "neutral", "Money already took enough from us, Zara."),
        ]),
        seg("office", false, ["B", "D"], [
          N("A week later, the will was read.", { focus: "D" }),
          L("D", "neutral", "Six gave the money back out of fear. Two hid it. One bought a yacht."),
          L("D", "smug", "One gave sixty million to strangers. And forgave the friend who sold him."),
          L("D", "happy", "Leo. The forty billion is yours.", { fx: "shake" }),
          N("Leo walked out a billionaire. Then his phone buzzed.", { focus: "B", emotion: "happy" }),
          V("robot", "Well done, Leo. Now choose the next ten. H."),
          N("Sent... one minute ago.", { focus: "B", emotion: "surprised", fx: "shake" }),
        ], { seated: ["D"] }),
      ],
    },
  ],
};
