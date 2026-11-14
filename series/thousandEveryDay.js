// "$1,000 Every Day" - Day 1 of getting $1,000 every morning, but you can't tell anyone.
// BRANCHING: from Day 2 on, each part opens with what happened after the option most viewers voted for
// (ifA / ifB), then continues with the shared story. follows = the default when there are too few votes.
// Only the narrator speaks; L() lines are read by the narrator while that character acts them out.
// Cast: Rahul (A) the hero · Arjun (B) his best friend · Dadi (C) his grandmother · Kaka (D) the canteen cook
//       Priya (E) the class topper · Mr. Mehta (F) the man in the purple suit
const { L, N, seg } = require("./helpers");

module.exports = {
  id: "thousand-every-day",
  title: "$1,000 Every Day",
  interactive: true,
  branching: true,
  choiceStyle: "wwyd", // "A: ... B: ... What would you do? Comment A or B."
  unit: "Day",
  hero: "Rahul",
  heroCode: "A",
  music: "suspense",
  names: { A: "Rahul", B: "Arjun", C: "Dadi", D: "Kaka", E: "Priya", F: "Mr. Mehta" },
  // Same character designs, recoloured for this story
  looks: {
    A: { skin: "#C68B5E", hair: "#141414", shirt: "#3E6FB0", shirtDark: "#2C5286", sleeve: "#3E6FB0", strings: "#E8EEF8" },
    B: { skin: "#B97F55", hair: "#1c1410" },
    C: { skin: "#C99070", hair: "#ECECEC", shawl: "#D2691E", shirt: "#7A3E5A", shirtDark: "#5E2E45", sleeve: "#7A3E5A" },
    D: { skin: "#B57A52", cap: "#F2F2F2", shirt: "#E8E2D0", sleeve: "#E8E2D0", overalls: "#C9C2B0", shirtDark: "#A39C8A" },
    E: { skin: "#C48A60", hair: "#141414" },
    F: { skin: "#D6A47C" },
  },
  hashtags: ["#shorts", "#whatwouldyoudo", "#day1", "#money", "#story"],
  tags: ["what would you do", "day 1 of", "$1000 every day", "secret money", "choose your path", "you decide"],
  description: "Day 1: Rahul wakes up with $1,000 on his pillow and a note: every morning, but tell anyone and it stops forever. You decide what he does - the most votes in the comments decide the next day.",
  parts: [
    {
      title: "The Note",
      hook: "Day 1: He gets *$1,000 every morning*. He can't tell anyone.",
      choice: { question: "What would you do?", a: "Buy Arjun the phone, and risk him asking where the money came from", b: "Say nothing, and keep the secret safe" },
      segments: [
        seg("bedroom", false, ["A"], [
          N("Day 1. Rahul woke up with $1,000 on his pillow. And a note.", { focus: "A", emotion: "surprised" }),
          N("The note said: Every morning. Tell anyone, and it stops forever.", { focus: "A", emotion: "worried" }),
          N("He counted it twice. It was real.", { focus: "A", emotion: "happy" }),
          N("He hid the cash inside his school bag and went to class.", { focus: "A", emotion: "smug" }),
        ]),
        seg("canteen", false, ["A", "B"], [
          N("At lunch, his best friend Arjun was crying.", { focus: "B", emotion: "crying" }),
          L("B", "crying", "My phone's broken. My dad is going to kill me."),
          N("A new phone cost $300. Rahul had $1,000 in his bag.", { focus: "A", emotion: "worried" }),
          N("Then Arjun looked up.", { focus: "B", emotion: "neutral" }),
          L("B", "surprised", "Why are you smiling?", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "I Saw You",
      follows: "a",
      hook: "Day 2: The note knew *what he did yesterday*",
      choice: { question: "What would you do?", a: "Give Dadi the money, and make up a story", b: "Pay the landlord yourself, in secret" },
      ifA: [
        seg("shop", false, ["A", "B"], [
          N("Rahul bought Arjun the best phone in the shop.", { focus: "A", emotion: "happy" }),
          L("B", "surprised", "Bro. That's $300. Where did you get it?"),
          N("Birthday money, Rahul lied. His birthday was in March.", { focus: "A", emotion: "worried" }),
        ]),
      ],
      ifB: [
        seg("canteen", false, ["A", "B"], [
          N("Rahul said nothing. Arjun got grounded for a month.", { focus: "B", emotion: "crying" }),
          N("All night, Rahul stared at the bag. He couldn't sleep.", { focus: "A", emotion: "worried" }),
        ]),
      ],
      segments: [
        seg("bedroom", false, ["A"], [
          N("Day 2. Another $1,000 on the pillow.", { focus: "A", emotion: "surprised" }),
          N("But today, the note had one more line.", { focus: "A", emotion: "worried" }),
          N("I saw what you did.", { focus: "A", emotion: "scared", fx: "shake" }),
        ]),
        seg("home", false, ["A", "C"], [
          N("Downstairs, Dadi was counting coins on the kitchen table.", { focus: "C", emotion: "worried" }),
          L("C", "crying", "The landlord wants $800 by Friday. Or we're out."),
          N("Rahul had the money. But how could he give it without telling her?", { focus: "A", emotion: "worried" }),
        ]),
      ],
    },
    {
      title: "The Topper",
      follows: "b",
      hook: "Day 3: The smartest girl in school *knows his secret*",
      choice: { question: "What would you do?", a: "Pay Priya to stay quiet", b: "Call her bluff and say nothing" },
      ifA: [
        seg("home", false, ["A", "C"], [
          N("Rahul handed Dadi $800. He said he won it in a school quiz.", { focus: "A", emotion: "smug" }),
          N("Dadi looked at him for a long time. Then she hugged him. She didn't believe a word.", { focus: "C", emotion: "smug" }),
        ]),
      ],
      ifB: [
        seg("street", false, ["A"], [
          N("Rahul went to the landlord himself and paid in cash.", { focus: "A", emotion: "neutral" }),
          N("The landlord counted it twice and grinned. Your grandmother didn't send this, did she?", { focus: "A", emotion: "worried" }),
        ]),
      ],
      segments: [
        seg("bedroom", false, ["A"], [
          N("Day 3. $1,000. And a new note: People are starting to notice.", { focus: "A", emotion: "worried" }),
        ]),
        seg("classroom", false, ["A", "E"], [
          N("In class, Priya slid into the seat next to him. The smartest girl in school.", { focus: "E", emotion: "smug" }),
          L("E", "smug", "I saw you yesterday. With a lot of cash."),
          L("E", "smug", "Give me a cut. Or I tell everyone."),
          N("If anyone found out, the money would stop forever.", { focus: "A", emotion: "scared" }),
        ]),
      ],
    },
    {
      title: "The Black Car",
      follows: "b",
      hook: "Day 4: No money. Just *a man outside his window*",
      choice: { question: "What would you do?", a: "Follow the black car tomorrow", b: "Hide the money and lie low" },
      ifA: [
        seg("corridor", false, ["A", "E"], [
          N("Behind the lockers, Rahul slipped Priya $200.", { focus: "A", emotion: "worried" }),
          L("E", "happy", "Nice. Same time tomorrow."),
          N("She was never going to stop.", { focus: "A", emotion: "scared" }),
        ]),
      ],
      ifB: [
        seg("corridor", false, ["A", "E"], [
          L("A", "neutral", "I don't know what you're talking about."),
          N("Priya just smiled. An hour later, she was whispering to half the class.", { focus: "E", emotion: "smug" }),
        ]),
      ],
      segments: [
        seg("bedroom", false, ["A"], [
          N("Day 4. Rahul checked the pillow.", { focus: "A", emotion: "neutral" }),
          N("Nothing. No money. No note.", { focus: "A", emotion: "scared", fx: "shake" }),
          N("Then he saw it. Outside his window, a black car.", { focus: "A", emotion: "surprised" }),
        ]),
        seg("street", false, ["F"], [
          N("A man in a purple suit was looking straight at him.", { focus: "F", emotion: "smug" }),
          N("That night, the money came. Under his door. With a note: Someone else knows. Fix it.", { focus: "F", emotion: "neutral" }),
        ]),
      ],
    },
    {
      title: "Mr. Mehta",
      follows: "a",
      hook: "Day 5: The man who delivers the money *finally speaks*",
      choice: { question: "What would you do?", a: "Ask to meet his boss", b: "Take the money and ask no questions" },
      ifA: [
        seg("street", false, ["A"], [
          N("Rahul skipped the school bus and followed the black car on his bicycle.", { focus: "A", emotion: "worried" }),
          N("It stopped outside an old bank.", { focus: "A", emotion: "surprised" }),
        ]),
      ],
      ifB: [
        seg("bedroom", false, ["A"], [
          N("Rahul hid the cash inside an old school trophy. And stayed home.", { focus: "A", emotion: "worried" }),
          N("At noon, the black car stopped outside his house.", { focus: "A", emotion: "scared" }),
        ]),
      ],
      segments: [
        seg("street", false, ["A", "F"], [
          N("Day 5. The man in the purple suit stepped out.", { focus: "F", emotion: "smug" }),
          L("F", "smug", "Rahul. I'm Mr. Mehta. I deliver your money."),
          L("F", "neutral", "My boss watches how you spend it. Every single dollar."),
          N("He held out the day's $1,000. And waited.", { focus: "F", emotion: "neutral" }),
          N("Who was his boss? And what did he want from a schoolboy?", { focus: "A", emotion: "worried" }),
        ]),
      ],
    },
    {
      title: "The Bag Falls",
      follows: "b",
      hook: "Day 6: *Bundles of cash* fell out in front of everyone",
      choice: { question: "What would you do?", a: "Tell Arjun everything, and risk losing the money forever", b: "Lie to your best friend again" },
      ifA: [
        seg("street", false, ["A", "F"], [
          L("A", "worried", "I want to meet your boss."),
          N("Mr. Mehta smiled. Not yet. Keep the secret four more days.", { focus: "F", emotion: "smug" }),
        ]),
      ],
      ifB: [
        seg("street", false, ["A", "F"], [
          N("Rahul took the money and said nothing.", { focus: "A", emotion: "neutral" }),
          L("F", "smug", "Good. Four more days."),
        ]),
      ],
      segments: [
        seg("canteen", false, ["A", "B", "D"], [
          N("Day 6. At lunch, Arjun grabbed Rahul's bag to borrow a pen.", { focus: "B", emotion: "neutral" }),
          N("Bundles of cash fell onto the canteen floor.", { focus: "A", emotion: "scared", fx: "shake" }),
          L("B", "surprised", "Rahul. What is this?"),
          N("Half the canteen turned. Even Kaka, the old cook, stopped stirring.", { focus: "D", emotion: "surprised" }),
        ]),
      ],
    },
    {
      title: "The Hospital",
      follows: "a",
      hook: "Day 7: Dadi needs *$5,000 tonight*",
      choice: { question: "What would you do?", a: "Pay the hospital in cash, and face the questions", b: "Call Mr. Mehta and beg for help" },
      ifA: [
        seg("canteen", false, ["A", "B"], [
          N("Rahul told Arjun everything. The pillow. The notes. The purple suit.", { focus: "A", emotion: "worried" }),
          N("Arjun just laughed. You're the worst liar ever. I knew on Day 1.", { focus: "B", emotion: "happy" }),
          N("Next morning, the pillow was empty.", { focus: "A", emotion: "scared" }),
        ]),
      ],
      ifB: [
        seg("canteen", false, ["A", "B"], [
          L("A", "worried", "It's fake money. For the school play."),
          N("Arjun didn't say a word. He just walked away.", { focus: "B", emotion: "angry" }),
        ]),
      ],
      segments: [
        seg("home", false, ["A", "C"], [
          N("Day 7. That afternoon, Dadi collapsed in the kitchen.", { focus: "C", emotion: "worried", fx: "shake" }),
        ]),
        seg("hospital", false, ["A"], [
          N("The doctor said she needed an operation. $5,000. Tonight.", { focus: "A", emotion: "crying" }),
          N("Rahul had saved almost exactly that.", { focus: "A", emotion: "worried" }),
          N("But a schoolboy paying $5,000 in cash? Everyone would ask questions.", { focus: "A", emotion: "scared" }),
        ]),
      ],
    },
    {
      title: "Dadi Knows",
      follows: "a",
      hook: "Day 8: Dadi woke up and said *I know who sends the money*",
      choice: { question: "What would you do?", a: "Ask Dadi who it is", b: "Find out yourself, and keep Dadi out of it" },
      ifA: [
        seg("hospital", false, ["A", "F"], [
          N("Rahul paid in cash. Twenty minutes later, a police officer was asking questions.", { focus: "A", emotion: "scared" }),
          N("Then Mr. Mehta walked in, said three words to the officer, and the officer left.", { focus: "F", emotion: "smug" }),
        ]),
      ],
      ifB: [
        seg("hospital", false, ["A", "F"], [
          N("Rahul called the number on the last note. Mr. Mehta arrived in ten minutes.", { focus: "F", emotion: "neutral" }),
          N("He paid the whole bill. Then he left without a word.", { focus: "A", emotion: "relieved" }),
        ]),
      ],
      segments: [
        seg("hospital", false, ["A", "C"], [
          N("Day 8. The operation worked. Dadi opened her eyes.", { focus: "C", emotion: "relieved" }),
          L("C", "smug", "You paid for this, didn't you?"),
          N("Rahul froze.", { focus: "A", emotion: "scared" }),
          L("C", "smug", "Don't worry, beta. I know who sends the money.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Cook",
      follows: "b",
      hook: "Day 9: The secret billionaire was *the school cook*",
      choice: { question: "What would you do?", a: "Give him back every dollar", b: "Ask him why he chose you" },
      ifA: [
        seg("hospital", false, ["A", "C"], [
          L("A", "worried", "Who is it, Dadi?"),
          N("She pointed out of the window. At the school across the road. At the canteen.", { focus: "C", emotion: "smug" }),
        ]),
      ],
      ifB: [
        seg("corridor", false, ["A"], [
          N("Rahul went back to where it all started. Day 1. The canteen.", { focus: "A", emotion: "worried" }),
        ]),
      ],
      segments: [
        seg("canteen", false, ["A", "D"], [
          N("Day 9. Kaka, the old canteen cook, was waiting for him.", { focus: "D", emotion: "smug" }),
          L("D", "smug", "Took you long enough, Rahul."),
          N("Kaka wasn't just a cook. He was Mr. Kapoor. One of the richest men in the country.", { focus: "D", emotion: "smug", fx: "shake" }),
          L("D", "neutral", "On Day 1, I saw a boy with $1,000 look at his crying friend."),
          L("D", "neutral", "I wanted to know what he'd do next."),
        ]),
      ],
    },
    {
      title: "The Fortune",
      follows: "a",
      hook: "Day 10: A billionaire offered him *everything*",
      choice: { question: "What would you do?", a: "Take the fortune and keep the secret forever", b: "Turn it down and stay a normal kid" },
      ifA: [
        seg("canteen", false, ["A", "D"], [
          N("Rahul put every dollar he had left on the counter.", { focus: "A", emotion: "neutral" }),
          L("D", "happy", "That's exactly why I chose you."),
        ]),
      ],
      ifB: [
        seg("canteen", false, ["A", "D"], [
          L("A", "worried", "Why me?"),
          L("D", "smug", "Because you never once spent it on yourself."),
        ]),
      ],
      segments: [
        seg("meeting", false, ["A", "D", "F"], [
          N("Day 10. Mr. Mehta drove Rahul to a tall glass tower.", { focus: "F", emotion: "neutral" }),
          N("Mr. Kapoor had no children. And very little time left.", { focus: "D", emotion: "worried" }),
          L("D", "neutral", "My fortune goes to someone who does right when no one is watching."),
          N("He slid one paper across the table. A billion dollars. One signature.", { focus: "A", emotion: "surprised", fx: "shake" }),
        ]),
      ],
    },
  ],
};
