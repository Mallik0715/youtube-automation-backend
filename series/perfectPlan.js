// "The Perfect Plan" - narrated, 10 parts, A/B choice at the end of each part.
// Two best friends, a $10 million diamond, and a plan that was never theirs. A story about loyalty
// (no real how-to: the "heist" is told at story level and goes wrong immediately).
// Cast: Max (A) owes dangerous money · Leo (B) night guard at the museum · Victor (F) the loan shark
//       Zara (E) the museum curator · Bruno (D) a retired thief
const { L, V, N, CARD, seg } = require("./helpers");

module.exports = {
  id: "perfect-plan",
  title: "The Perfect Plan",
  interactive: true,
  hero: "Max",
  music: "suspense",
  // Max's usual voice is the narrator's; give him his own
  voices: { A: { voice: "en-AU-WilliamMultilingualNeural", rate: "+10%", pitch: "+0Hz" } },
  hashtags: ["#shorts", "#heist", "#friendship", "#whatwouldyoudo", "#story"],
  tags: ["what would you do", "heist story", "best friends", "betrayal", "choose your path"],
  description: "Two best friends. One $10 million diamond. A plan that was never theirs. You decide what they do next.",
  parts: [
    {
      title: "Seven Days",
      hook: "His best friend asked him to help *steal a $10 million diamond*",
      choice: { question: "What should Leo do?", a: "Help his best friend", b: "Say no and walk away" },
      segments: [
        seg("street", true, ["A", "F"], [
          N("Max owed fifty thousand dollars. To the wrong man.", { focus: "A", emotion: "worried" }),
          L("F", "smug", "Seven days, Max. Then I stop asking nicely."),
          N("His name was Victor. Nobody had ever paid him late. Twice.", { focus: "F", emotion: "smug" }),
        ]),
        seg("home", true, ["A", "B"], [
          N("So Max went to the one person he trusted. His best friend since school. Leo.", { focus: "B" }),
          N("Leo worked nights as a security guard. At the city museum.", { focus: "B", emotion: "worried" }),
          L("A", "worried", "There's a diamond in your museum. Ten million dollars. Nobody would get hurt."),
          L("B", "surprised", "Max. Are you out of your mind?", { fx: "shake" }),
          L("A", "worried", "Seven days, Leo. Or I'm dead."),
        ]),
      ],
    },
    {
      title: "One Condition",
      follows: "a", // the option of the previous part's choice this part continues with
      hook: "Every *perfect plan* has one mistake",
      choice: { question: "What should they do?", a: "Bring the old thief in", b: "Do it just the two of them" },
      segments: [
        seg("home", true, ["A", "B"], [
          N("Leo didn't sleep. By morning, he had an answer.", { focus: "B", emotion: "worried" }),
          L("B", "neutral", "One night. One time. And nobody gets hurt. Ever."),
          L("A", "happy", "Deal. I swear."),
        ]),
        seg("cabin", true, ["A", "B", "D"], [
          N("Max knew a man who knew things. Bruno. Forty years a thief. Never caught.", { focus: "D", emotion: "smug" }),
          L("D", "smug", "Every perfect plan has one mistake, boys. Find it before it finds you."),
          L("D", "neutral", "I want thirty percent."),
          N("Thirty percent of ten million. For one piece of advice.", { focus: "A", emotion: "worried" }),
          L("B", "worried", "Max... how does he know where I work?", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Already Gone",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "They came to steal the diamond. *Someone got there first.*",
      choice: { question: "What should they do?", a: "Run before the police come", b: "Stay and find out who did it" },
      segments: [
        seg("museum", true, ["A", "B"], [
          N("They didn't trust Bruno. So it was just the two of them.", { focus: "A", emotion: "worried" }),
          N("Friday. Midnight. Leo on shift. Max slipped in through the staff door.", { focus: "B", emotion: "worried", sfx: "footsteps" }),
          N("Leo looked at the glass case in the middle of the hall... and froze.", { focus: "B", emotion: "surprised" }),
          L("B", "surprised", "Max. It's EMPTY.", { fx: "shake" }),
          N("The ten million dollar diamond was already gone.", { focus: "A", emotion: "surprised" }),
          N("Then every alarm in the building went off at once.", { focus: "B", emotion: "worried", sfx: "boom" }),
        ]),
      ],
    },
    {
      title: "The Curator",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "The real thief was *the last person anyone would suspect*",
      choice: { question: "What should they do?", a: "Follow her", b: "Call the police and tell the truth" },
      segments: [
        seg("museum", true, ["A", "B"], [
          N("Max wanted to run. Leo grabbed his arm.", { focus: "A", emotion: "worried" }),
          L("B", "neutral", "If we run, it's on camera. It's my shift. They'll blame me."),
          N("So they hid. And waited.", { focus: "B", emotion: "worried" }),
        ]),
        seg("museum", true, ["A", "B", "E"], [
          N("A woman walked out of the dark. Calm. Like she owned the place.", { focus: "E", emotion: "smug", sfx: "footsteps" }),
          N("Zara. The museum's own curator. The diamond in her hand.", { focus: "E", emotion: "smug", fx: "shake" }),
          L("A", "surprised", "She's stealing it from her own museum?"),
          N("She slipped out a side door. Two minutes before the police arrived.", { focus: "B", emotion: "worried" }),
        ]),
      ],
    },
    {
      title: "The Setup",
      follows: "a", // the option of the previous part's choice this part continues with
      hook: "He realised his debt was *a trap all along*",
      choice: { question: "What should Max do?", a: "Grab the diamond", b: "Record everything and leave" },
      segments: [
        seg("shore", true, ["A", "B"], [
          N("They followed her car to the old harbour.", { focus: "A", emotion: "worried" }),
        ]),
        seg("shore", true, ["A", "E", "F"], [
          N("And waiting by a black boat... Victor.", { focus: "F", emotion: "smug", sfx: "boom" }),
          L("E", "neutral", "Here. Now my brother's debt is paid."),
          L("F", "smug", "And tomorrow, the police will arrest a security guard named Leo."),
          N("Max went cold.", { focus: "A", emotion: "surprised" }),
          N("His debt. The seven days. All of it was planned. Victor needed someone to blame.", { focus: "A", emotion: "worried" }),
          N("And Max had led him straight to his best friend.", { focus: "A", emotion: "worried", fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Deal",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "Betray your best friend. *Or lose everything.*",
      choice: { question: "What should Max do?", a: "Take Victor's deal", b: "Refuse and protect Leo" },
      segments: [
        seg("shore", true, ["A", "B"], [
          N("Max filmed everything. Then they ran.", { focus: "A", emotion: "worried", sfx: "footsteps" }),
          N("But Max's phone died before the video saved.", { focus: "A", emotion: "surprised", fx: "shake" }),
        ]),
        seg("home", false, ["A", "B"], [
          N("At six AM, the police came for Leo.", { focus: "B", emotion: "worried", sfx: "knock" }),
          L("B", "worried", "Max. Tell them. Tell them what we saw."),
        ]),
        seg("street", false, ["A", "F"], [
          N("That afternoon, a black car stopped next to Max.", { focus: "F", emotion: "smug" }),
          L("F", "smug", "Tell the police Leo did it. Your debt disappears. Today."),
          N("Fifty thousand dollars. Gone. All he had to do was betray his best friend.", { focus: "A", emotion: "worried" }),
        ]),
      ],
    },
    {
      title: "On the Run",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "He said *no* to the most dangerous man in the city",
      choice: { question: "How should Max save Leo?", a: "Steal the diamond back", b: "Get Zara to confess" },
      segments: [
        seg("street", true, ["A", "F"], [
          L("A", "smug", "No deal, Victor. Leo would never do it to me."),
          L("F", "smug", "Then you have one day left. Not seven."),
          N("Max ran. Victor's men followed.", { focus: "A", emotion: "worried", sfx: "footsteps" }),
        ]),
        seg("cabin", true, ["A", "D"], [
          N("He had nowhere left to go. Except the one man he didn't trust.", { focus: "D" }),
          L("D", "smug", "I told you, boy. Every perfect plan has one mistake."),
          L("A", "worried", "And what was ours?"),
          L("D", "neutral", "It wasn't yours. It was Victor's. He trusted Zara."),
          N("Bruno smiled. He knew something.", { focus: "D", emotion: "smug", fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Zara's Secret",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "The thief was *being blackmailed too*",
      choice: { question: "What should Max do?", a: "Go to the boat alone", b: "Get Leo out of jail first" },
      segments: [
        seg("cafe", false, ["A", "E"], [
          N("Max found Zara at a quiet cafe. She looked like she hadn't slept either.", { focus: "E", emotion: "worried" }),
          L("A", "neutral", "Your brother owes Victor. Just like me."),
          N("Her hands started to shake.", { focus: "E", emotion: "worried" }),
          L("E", "worried", "He said he'd hurt him. I had no choice."),
          L("A", "neutral", "Then help me. Tell the police the truth."),
          L("E", "worried", "They'll never believe me. Not without the diamond."),
          N("And the diamond was on Victor's boat. Leaving the country. Tonight.", { focus: "A", emotion: "surprised", fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Midnight at the Harbour",
      follows: "a", // the option of the previous part's choice this part continues with
      hook: "He walked onto the boat *alone*",
      choice: { question: "What should Max do?", a: "Take the diamond and run", b: "Hand it to the police" },
      segments: [
        seg("deck", true, ["A"], [
          N("Rain. Midnight. Max climbed onto Victor's boat. Alone.", { focus: "A", emotion: "worried", sfx: "thunder" }),
          N("The diamond was sitting in an open case. Too easy.", { focus: "A", emotion: "surprised" }),
        ]),
        seg("deck", true, ["A", "F"], [
          L("F", "smug", "Every perfect plan has one mistake, Max. Yours was coming here."),
          L("A", "smug", "No. Yours was saying all that out loud."),
          N("Zara was on the dock. With a microphone. And six police officers.", { focus: "A", emotion: "smug", fx: "shake" }),
          L("F", "worried", "Take the diamond, Max. Ten million. Just let me go."),
        ]),
      ],
    },
    {
      title: "One Mistake",
      follows: "b", // the option of the previous part's choice this part continues with
      hook: "The diamond came home. *Or did it?*",
      choice: { question: "Where is the real diamond?", a: "Bruno has it", b: "It was never real" },
      segments: [
        seg("deck", true, ["A", "F"], [
          N("Max didn't even look at the diamond. He handed it to the police.", { focus: "A", emotion: "neutral" }),
          N("Victor was arrested on his own boat.", { focus: "F", emotion: "worried", sfx: "boom" }),
        ]),
        seg("street", false, ["A", "B"], [
          N("The next morning, Leo walked out of jail. Max was waiting.", { focus: "B", emotion: "happy" }),
          L("B", "happy", "You could have taken the deal."),
          L("A", "happy", "And lose the only friend who'd say no to stealing a diamond?"),
          N("The museum paid Max a reward. Exactly fifty thousand dollars.", { focus: "A", emotion: "happy" }),
        ]),
        seg("museum", true, ["D"], [
          N("And Bruno? He was at the museum, after closing. Staring at the diamond in its case.", { focus: "D", emotion: "smug" }),
          L("D", "smug", "Every perfect plan has one mistake."),
          N("He patted his pocket. And winked.", { focus: "D", emotion: "smug", fx: "shake" }),
        ]),
      ],
    },
  ],
};
