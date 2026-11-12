// "Two Friends Find $2 Million" - narrated, 10 parts, A/B choice at the end of each part.
// Two best friends find a bag of stolen cash in the woods. Secrets, a lie between friends, an
// investigator, a robber who wants it back, and a grandma who is smarter than all of them.
// Cast: Zara (E) the hero · Max (A) her best friend · Mira (C) Zara's grandma, a retired bank teller
//       Victor (F) an insurance investigator · Bruno (D) one of the robbers
const { L, V, N, CARD, seg } = require("./helpers");

module.exports = {
  id: "the-bag",
  title: "Two Friends Find $2 Million",
  interactive: true,
  hero: "Zara",
  music: "suspense",
  // Max's usual voice is the narrator's; give him his own
  voices: { A: { voice: "en-AU-WilliamMultilingualNeural", rate: "+10%", pitch: "+0Hz" } },
  hashtags: ["#shorts", "#whatwouldyoudo", "#bestfriends", "#money", "#story"],
  tags: ["what would you do", "found 2 million dollars", "best friends", "money story", "choose your path"],
  description: "Two best friends find a bag with $2,000,000 in the woods. And a phone inside that won't stop ringing. You decide what they do next.",
  parts: [
    {
      title: "The Bag",
      hook: "Two friends found a bag with *$2,000,000* in the woods",
      choice: { question: "What should they do?", a: "Answer the phone", b: "Take the bag and run" },
      segments: [
        seg("forest", true, ["A", "E"], [
          N("Max and Zara were camping. Best friends since they were ten. Both completely broke.", { focus: "E" }),
          N("Just after midnight, they heard a crash. Then a car speeding away.", { focus: "A", emotion: "worried", sfx: "boom" }),
          N("In the bushes, where it had been, lay a black bag.", { focus: "E", emotion: "surprised" }),
          L("A", "surprised", "Zara. That's... that's MONEY.", { fx: "shake" }),
          N("Bundles of hundred dollar bills. Two million dollars.", { focus: "E", emotion: "surprised" }),
          N("And at the bottom of the bag, a phone. Ringing.", { focus: "A", emotion: "worried" }),
          L("E", "worried", "Max. Whoever owns this... wants it back."),
        ]),
      ],
    },
    {
      title: "37 Missed Calls",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "The phone in the bag said: *We're coming for it.*",
      choice: { question: "What should they do?", a: "Give it to the police", b: "Keep it and hide it" },
      segments: [
        seg("home", true, ["A", "E"], [
          N("They ran. All the way back to Max's apartment.", { focus: "A", emotion: "worried", sfx: "footsteps" }),
          N("They counted it twice. Exactly two million dollars.", { focus: "E", emotion: "happy" }),
          L("A", "happy", "One million each, Zara. ONE MILLION."),
          N("Then the news came on.", { focus: "E", emotion: "worried" }),
          V("radio", "An armoured truck was robbed tonight. Two million dollars. The robbers escaped into the forest."),
          N("The phone had thirty-seven missed calls. Then one text.", { focus: "A", emotion: "surprised" }),
          V("robot", "Keep it safe. We're coming for it.", { fx: "robot", sfx: "boom" }),
        ]),
      ],
    },
    {
      title: "The Watch",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "They promised not to spend *a single dollar*. Then he did.",
      choice: { question: "What should Zara do?", a: "Confront Max", b: "Move the money without telling him" },
      segments: [
        seg("home", true, ["A", "E"], [
          N("They kept it. And they made one rule.", { focus: "E", emotion: "smug" }),
          L("E", "neutral", "Nobody spends a single dollar. Not for a whole year."),
          L("A", "neutral", "A whole year. I swear."),
          N("They threw the phone in the river. And hid the bag under Max's floor.", { focus: "A" }),
        ]),
        seg("cafe", false, ["A", "E"], [
          N("Two days later, Max showed up with a shiny new watch.", { focus: "A", emotion: "happy" }),
          L("E", "surprised", "Max! Where did you get that?", { fx: "shake" }),
          L("A", "smug", "Relax. It's one watch. Nobody's going to notice."),
          N("But stores have cameras. And stolen money has serial numbers.", { focus: "E", emotion: "worried" }),
        ]),
      ],
    },
    {
      title: "Where's the Money?",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "She hid the money from her *best friend*",
      choice: { question: "What should Zara tell him?", a: "The truth", b: "Lie and say it's still there" },
      segments: [
        seg("home", true, ["E"], [
          N("Zara said nothing. That night, while Max slept, she took the bag.", { focus: "E", emotion: "worried", sfx: "footsteps" }),
        ]),
        seg("cabin", true, ["E", "C"], [
          N("She drove it to the one place nobody would look. Her grandma's cabin in the hills.", { focus: "C", emotion: "happy" }),
          L("C", "happy", "Zara, sweetheart! At two in the morning?"),
          L("E", "neutral", "Just storing some old things, Grandma. Don't open it."),
          N("Grandma smiled. She didn't ask a single question. That should have worried her.", { focus: "C", emotion: "smug" }),
        ]),
        seg("home", false, ["E"], [
          N("At seven AM, Max called. Panicking.", { focus: "E", emotion: "surprised" }),
          V("A", "Zara! A man came to my door asking about a bag. And the money's GONE!", { fx: "radio" }),
        ]),
      ],
    },
    {
      title: "The Handshake",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "She saw her best friend *shaking hands with the enemy*",
      choice: { question: "What should Zara do?", a: "Walk in and confront them", b: "Follow the man in the suit" },
      segments: [
        seg("home", false, ["E"], [
          L("E", "worried", "Gone? It... it must still be there, Max. Look again."),
          N("The first lie she had ever told him.", { focus: "E", emotion: "worried" }),
        ]),
        seg("street", false, ["E"], [
          N("That afternoon, she walked past their favourite cafe. And stopped.", { focus: "E", emotion: "surprised" }),
        ]),
        seg("cafe", false, ["A", "F"], [
          N("Max was inside. With a man in an expensive suit.", { focus: "F", emotion: "smug" }),
          L("F", "smug", "So we have a deal, Max?"),
          N("They shook hands.", { focus: "A", emotion: "neutral", fx: "shake" }),
          N("Was her best friend selling her out?", { focus: "A", emotion: "worried" }),
        ]),
      ],
    },
    {
      title: "The Investigator",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "The man in the suit *wasn't who she thought*",
      choice: { question: "What should Zara do?", a: "Call Max and tell him everything", b: "Go to the cabin alone" },
      segments: [
        seg("street", false, ["E", "F"], [
          N("Zara followed the man in the suit. Straight to the police station.", { focus: "E", emotion: "surprised" }),
          N("He wasn't a robber. He was Victor. An insurance investigator.", { focus: "F", emotion: "neutral" }),
          L("F", "neutral", "Return the money, and there's a legal reward. Ten percent. Two hundred thousand dollars."),
        ]),
        seg("street", false, ["E"], [
          N("Max hadn't sold her out. He was trying to get them a legal reward.", { focus: "E", emotion: "worried" }),
          N("And she had lied to him.", { focus: "E", emotion: "worried" }),
          N("Then a text arrived. From an unknown number.", { focus: "E", emotion: "surprised" }),
          V("robot", "Nice cabin. Your grandma makes good tea.", { fx: "robot", sfx: "boom" }),
        ]),
      ],
    },
    {
      title: "Tea With a Robber",
      follows: "a", // the option of the previous part's choice this part continues with
      hook: "A robber was *having tea with her grandma*",
      choice: { question: "What should they do?", a: "Give him the bag", b: "Trick him with a fake bag" },
      segments: [
        seg("street", true, ["A", "E"], [
          N("Zara called Max. And told him everything. The bag. The cabin. The lie.", { focus: "E", emotion: "worried" }),
          L("A", "neutral", "I don't care right now. Where's the cabin? I'm driving."),
        ]),
        seg("cabin", true, ["E", "C", "D"], [
          N("They burst through the door. And froze.", { focus: "E", emotion: "surprised", sfx: "boom" }),
          N("Grandma was sitting by the fire. Drinking tea. With one of the robbers.", { focus: "D", emotion: "smug" }),
          L("D", "smug", "Your grandma's a tough negotiator."),
          L("C", "happy", "Bruno here only wants his bag, dear. Then he'll leave."),
          L("D", "smug", "You have five minutes."),
        ]),
      ],
    },
    {
      title: "Newspaper",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "They tricked the robber. Then they *opened the real bag*.",
      choice: { question: "Who has the real money?", a: "Grandma", b: "The investigator" },
      segments: [
        seg("cabin", true, ["A", "E", "D"], [
          N("Max had an idea. Under his coat, he'd brought a second black bag. Full of old newspaper.", { focus: "A", emotion: "smug" }),
          N("They swapped them in the dark of the hallway.", { focus: "E", emotion: "worried" }),
          L("A", "neutral", "Here. Take it and go."),
          N("Bruno grabbed it. And drove off into the night.", { focus: "D", emotion: "smug", sfx: "whoosh" }),
        ]),
        seg("cabin", true, ["A", "E", "C"], [
          L("A", "happy", "We did it! We actually did it!"),
          N("Zara unzipped the real bag. Just to be sure.", { focus: "E" }),
          N("It was full of newspaper too.", { focus: "E", emotion: "surprised", fx: "shake" }),
          L("C", "smug", "Looking for something, dears?"),
        ]),
      ],
    },
    {
      title: "Grandma Knew",
      follows: "a", // the option of the previous part's choice this part continues with
      hook: "Grandma was *one step ahead of everyone*",
      choice: { question: "How should they split the reward?", a: "Fifty-fifty", b: "Give it all to Grandma" },
      segments: [
        seg("cabin", true, ["A", "E", "C"], [
          L("C", "smug", "Forty years as a bank teller. I know stolen money when I see it."),
          N("Grandma had swapped the bag the very first night. The real money was locked in her woodshed.", { focus: "C", emotion: "smug" }),
          L("C", "neutral", "And I called that nice investigator this morning."),
        ]),
        seg("street", true, ["A", "E", "F"], [
          N("An hour later, Bruno was stopped at a police roadblock. With a bag of newspaper.", { focus: "F", emotion: "smug" }),
          L("F", "happy", "Every dollar is back. The reward is yours. Two hundred thousand. Legally."),
          N("Max and Zara looked at each other. The friendship had almost broken. Now this.", { focus: "E", emotion: "happy" }),
        ]),
      ],
    },
    {
      title: "The Last Call",
      follows: "a", // the option of the previous part's choice this part continues with
      hook: "The money was gone. Then *the phone rang again*.",
      choice: { question: "Who is calling?", a: "The robbers' boss", b: "Someone who knows Grandma's secret" },
      segments: [
        seg("cafe", false, ["A", "E"], [
          N("They split it fifty-fifty. A hundred thousand each.", { focus: "E", emotion: "happy" }),
          L("E", "worried", "Max. I'm sorry I lied to you."),
          L("A", "smug", "I'm sorry too. About the watch."),
          L("A", "happy", "It was fake. Twenty dollars from a market. I wanted to see if you trusted me."),
          L("E", "smug", "Well. I didn't."),
          N("They laughed until the whole cafe stared.", { focus: "A", emotion: "happy" }),
        ]),
        seg("cabin", true, ["C"], [
          N("Back at the cabin, Grandma was counting something. One single bundle of cash.", { focus: "C", emotion: "smug" }),
          N("Then a phone rang. The phone they threw in the river.", { focus: "C", emotion: "surprised", fx: "shake" }),
          L("C", "smug", "Hello? Yes. I've been expecting your call."),
        ]),
      ],
    },
  ],
};
