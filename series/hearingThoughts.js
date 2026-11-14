// "I Can Hear Your Thoughts" - Day 1 of hearing everyone's thoughts.
// BRANCHING: from Day 2, each part opens with what happened after the option most viewers voted for.
// TH() lines are thoughts: read by the narrator, captioned "<name> · thinks", camera on the thinker.
// Cast: Noah (B) the hero · Jake (A) his best friend · Lily (E) a classmate · Nana Rose (C) his grandmother
//       Mr. Grant (D) the landlord · Mr. Vale (F) the man in the purple suit
const { L, N, TH, seg } = require("./helpers");

module.exports = {
  id: "hearing-thoughts",
  title: "I Can Hear Your Thoughts",
  interactive: true,
  branching: true,
  choiceStyle: "wwyd",
  unit: "Day",
  hero: "Noah",
  heroCode: "B",
  music: "suspense",
  names: { B: "Noah", A: "Jake", E: "Lily", C: "Nana Rose", D: "Mr. Grant", F: "Mr. Vale" },
  looks: {
    B: { shirt: "#7A4FB0", shirtDark: "#5B3A86", sleeve: "#7A4FB0" },
    A: { shirt: "#2E7D4F", shirtDark: "#215C3A", sleeve: "#2E7D4F", strings: "#DDEFE3" },
  },
  hashtags: ["#shorts", "#whatwouldyoudo", "#day1", "#superpower", "#story"],
  tags: ["what would you do", "day 1 of hearing thoughts", "superpower story", "mind reading", "you decide", "choose your path"],
  description: "Day 1: Noah hits his head and wakes up hearing everyone's thoughts - including what his best friend is hiding. The most votes in the comments decide the next day.",
  parts: [
    {
      title: "The Voices",
      hook: "Day 1: He can hear *everyone's thoughts*",
      choice: { question: "What would you do?", a: "Ask Jake what he did", b: "Keep quiet and keep listening" },
      segments: [
        seg("park", false, ["B", "A"], [
          N("Day 1. Noah got hit in the head by a football.", { focus: "B", emotion: "surprised", fx: "shake" }),
          N("When he opened his eyes, the whole park was talking. But nobody's lips were moving.", { focus: "B", emotion: "scared" }),
          N("He could hear their thoughts.", { focus: "B", emotion: "surprised" }),
          L("A", "happy", "You okay, buddy?"),
          N("That's what his best friend Jake said. But inside his head...", { focus: "A", emotion: "neutral" }),
          TH("A", "I hope he never finds out what I did.", { emotion: "worried" }),
        ]),
      ],
    },
    {
      title: "The Answers",
      follows: "b",
      hook: "Day 2: The stolen exam answers were *in his locker*",
      choice: { question: "What would you do?", a: "Expose Jake in front of everyone", b: "Take the blame for your best friend" },
      ifA: [
        seg("park", false, ["B", "A"], [
          L("B", "worried", "Jake. What did you do?"),
          N("Jake laughed it off. But his thoughts were screaming.", { focus: "A", emotion: "happy" }),
          TH("A", "He knows. How does he know?", { emotion: "scared" }),
        ]),
      ],
      ifB: [
        seg("park", false, ["B", "A"], [
          N("Noah said nothing. He just listened.", { focus: "B", emotion: "neutral" }),
          N("All evening, Jake's mind kept circling back to two words.", { focus: "A", emotion: "worried" }),
          TH("A", "The answers.", { emotion: "worried" }),
        ]),
      ],
      segments: [
        seg("classroom", false, ["B", "E"], [
          N("Day 2. In class, Lily sat down next to him.", { focus: "E", emotion: "neutral" }),
          TH("E", "Please notice me. Please.", { emotion: "worried" }),
          N("Then the teacher stormed in. Someone stole the final exam answers.", { focus: "B", emotion: "surprised" }),
        ]),
        seg("corridor", false, ["B", "A"], [
          N("They searched every locker. The answers were in Noah's.", { focus: "B", emotion: "scared", fx: "shake" }),
          TH("A", "I'm sorry, buddy.", { emotion: "crying" }),
        ]),
      ],
    },
    {
      title: "Nana's Secret",
      follows: "b",
      hook: "Day 3: His grandmother was *hiding something huge*",
      choice: { question: "What would you do?", a: "Tell Nana you heard her thought", b: "Secretly find a way to help" },
      ifA: [
        seg("corridor", false, ["B", "A"], [
          L("B", "angry", "It was Jake. He put them there."),
          N("Jake went white. He was suspended for two weeks.", { focus: "A", emotion: "scared" }),
          TH("A", "How did he know?", { emotion: "scared" }),
        ]),
      ],
      ifB: [
        seg("corridor", false, ["B", "A"], [
          N("Noah took the blame. Suspended for a week.", { focus: "B", emotion: "worried" }),
          TH("A", "I owe him. Forever.", { emotion: "crying" }),
        ]),
      ],
      segments: [
        seg("home", true, ["B", "C"], [
          N("Day 3. At dinner, Nana Rose laughed at his jokes like always.", { focus: "C", emotion: "happy" }),
          N("But her thoughts were quiet. And scared.", { focus: "C", emotion: "worried" }),
          TH("C", "How do I tell him we're losing the house?", { emotion: "crying" }),
        ]),
      ],
    },
    {
      title: "The Landlord",
      follows: "a",
      hook: "Day 4: The landlord was *lying*. Noah heard every word.",
      choice: { question: "What would you do?", a: "Call him out in front of Nana", b: "Find proof first" },
      ifA: [
        seg("home", true, ["B", "C"], [
          L("B", "worried", "Nana. I heard you. About the house."),
          N("Nana dropped her fork. She stared at him.", { focus: "C", emotion: "surprised", fx: "shake" }),
          TH("C", "He can hear. Just like I could.", { emotion: "scared" }),
        ]),
      ],
      ifB: [
        seg("home", false, ["B"], [
          N("Noah started washing cars after school. Fifty dollars a day.", { focus: "B", emotion: "neutral" }),
          N("Nowhere near enough.", { focus: "B", emotion: "worried" }),
        ]),
      ],
      segments: [
        seg("home", false, ["B", "C", "D"], [
          N("Day 4. Mr. Grant, the landlord, came with papers to sign.", { focus: "D", emotion: "smug" }),
          L("D", "smug", "Just sign here, Rose. It's for your own good."),
          TH("D", "The old lady will never know these papers are fake.", { emotion: "smug" }),
        ]),
      ],
    },
    {
      title: "Outside the Window",
      follows: "b",
      hook: "Day 5: A stranger's thought: *Tomorrow, the boy disappears*",
      choice: { question: "What would you do?", a: "Wake Nana and tell her", b: "Stay up and watch the window" },
      ifA: [
        seg("home", false, ["B", "C", "D"], [
          L("B", "angry", "Those papers are fake."),
          N("Grant's smile vanished. He left without a word.", { focus: "D", emotion: "angry" }),
          TH("D", "Who told the boy?", { emotion: "angry" }),
        ]),
      ],
      ifB: [
        seg("office", false, ["B", "D"], [
          N("Noah followed Grant to his office. And stood close enough to hear him think.", { focus: "B", emotion: "worried" }),
          TH("D", "Safe code. Four, one, nine, seven.", { emotion: "smug" }),
          N("Inside the safe: the real papers. The house was never his to sell.", { focus: "B", emotion: "surprised" }),
        ]),
      ],
      segments: [
        seg("bedroom", true, ["B"], [
          N("Day 5. That night, Noah couldn't sleep.", { focus: "B", emotion: "worried" }),
          N("Then a thought drifted in through the window. A voice he had never heard.", { focus: "B", emotion: "scared" }),
          N("Tomorrow, the boy disappears.", { focus: "B", emotion: "scared", fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Silent Man",
      follows: "b",
      hook: "Day 6: The only man whose thoughts he *couldn't hear*",
      choice: { question: "What would you do?", a: "Go with Mr. Vale", b: "Shut the door on him" },
      ifA: [
        seg("home", true, ["B", "C"], [
          N("Noah woke Nana and told her everything.", { focus: "B", emotion: "scared" }),
          N("She didn't look surprised. Only tired.", { focus: "C", emotion: "worried" }),
          L("C", "worried", "So it's started again."),
        ]),
      ],
      ifB: [
        seg("street", true, ["F"], [
          N("At 3 AM, a man in a purple suit stood under the street lamp. Looking up at Noah's window.", { focus: "F", emotion: "smug" }),
          N("Then he was gone.", { focus: "F", emotion: "neutral" }),
        ]),
      ],
      segments: [
        seg("home", false, ["B", "F"], [
          N("Day 6. In the morning, the man in the purple suit knocked on the door.", { focus: "F", emotion: "smug" }),
          L("F", "happy", "I'm Mr. Vale. I run a school for gifted children."),
          N("Noah listened for his thoughts. And heard nothing. Total silence.", { focus: "B", emotion: "scared", fx: "shake" }),
          N("The only person in the world he couldn't hear.", { focus: "F", emotion: "smug" }),
        ]),
      ],
    },
    {
      title: "Too Loud",
      follows: "b",
      hook: "Day 7: The voices got louder. Then *Nana spoke inside his head*",
      choice: { question: "What would you do?", a: "Let Nana teach you to control it", b: "Call Mr. Vale for help" },
      ifA: [
        seg("street", false, ["B", "C", "F"], [
          N("Noah walked to Mr. Vale's car.", { focus: "B", emotion: "neutral" }),
          N("Nana ran out barefoot, shouting his name. Noah stopped. Vale drove away alone.", { focus: "C", emotion: "scared" }),
        ]),
      ],
      ifB: [
        seg("home", false, ["B", "F"], [
          N("Noah shut the door. Vale slid a card under it.", { focus: "B", emotion: "worried" }),
          N("It said: When the voices get too loud, call me.", { focus: "B", emotion: "scared" }),
        ]),
      ],
      segments: [
        seg("bedroom", true, ["B", "C"], [
          N("Day 7. That night, the voices got louder. Hundreds. Then thousands.", { focus: "B", emotion: "scared", fx: "shake" }),
          N("Noah fell to the floor, holding his head.", { focus: "B", emotion: "crying" }),
          N("Then one voice cut through all of them. Clear. Calm.", { focus: "C", emotion: "worried" }),
          TH("C", "Noah. Listen only to me.", { emotion: "neutral" }),
          N("Nana could hear thoughts too. She always could.", { focus: "B", emotion: "surprised" }),
        ]),
      ],
    },
    {
      title: "Being Followed",
      follows: "a",
      hook: "Day 8: The landlord and the silent man were *working together*",
      choice: { question: "What would you do?", a: "Tell Lily your secret", b: "Push Lily away to keep her safe" },
      ifA: [
        seg("bedroom", false, ["B", "C"], [
          L("C", "neutral", "Pick one voice. Like a radio station."),
          N("For the first time in a week, Noah's head was quiet.", { focus: "B", emotion: "relieved" }),
        ]),
      ],
      ifB: [
        seg("office", false, ["B", "F"], [
          N("Mr. Vale held out a small white pill. It stops the noise, he said.", { focus: "F", emotion: "smug" }),
          N("For one second, Vale's mind slipped open.", { focus: "B", emotion: "surprised" }),
          TH("F", "Take it, and you're mine.", { emotion: "smug" }),
        ]),
      ],
      segments: [
        seg("corridor", false, ["B", "E"], [
          N("Day 8. At school, Lily finally spoke to him.", { focus: "E", emotion: "worried" }),
          TH("E", "Noah, there's a car outside. It's been following you all week.", { emotion: "scared" }),
          N("Noah looked out of the window. Mr. Grant. And Mr. Vale. In the same car.", { focus: "B", emotion: "scared", fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Nana Is Gone",
      follows: "b",
      hook: "Day 9: Nana was gone. The note said *come alone*",
      choice: { question: "What would you do?", a: "Go alone like the note says", b: "Bring Jake and Lily with you" },
      ifA: [
        seg("corridor", false, ["B", "E"], [
          L("B", "worried", "I can hear what people think."),
          L("E", "happy", "I know. I've been thinking it at you all week."),
        ]),
      ],
      ifB: [
        seg("corridor", false, ["B", "E"], [
          L("B", "angry", "Just leave me alone, Lily."),
          N("Lily walked away crying.", { focus: "E", emotion: "crying" }),
          TH("E", "I know you don't mean it.", { emotion: "crying" }),
        ]),
      ],
      segments: [
        seg("home", false, ["B", "A"], [
          N("Day 9. Jake was waiting at Noah's front door. Pale.", { focus: "A", emotion: "scared" }),
          L("A", "scared", "The door was open. Your Nana's gone."),
          N("On the table, a note: Come alone. The old office tower. Midnight.", { focus: "B", emotion: "scared", fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Last Voice",
      follows: "a",
      hook: "Day 10: For the first time, he heard *the silent man think*",
      choice: { question: "What would you do?", a: "Join Vale to bring Nana home", b: "Turn every voice in the city against Vale" },
      ifA: [
        seg("street", true, ["B"], [
          N("Noah went alone. Every step, the city whispered in his head.", { focus: "B", emotion: "worried" }),
        ]),
      ],
      ifB: [
        seg("street", true, ["B", "A", "E"], [
          N("Jake and Lily walked beside him. Their thoughts said the same thing.", { focus: "B", emotion: "worried" }),
          TH("E", "We're not leaving you.", { emotion: "neutral" }),
        ]),
      ],
      segments: [
        seg("office", true, ["B", "C", "F"], [
          N("Day 10. Nana sat calmly in a chair. Mr. Vale stood beside her.", { focus: "F", emotion: "smug" }),
          L("F", "smug", "Join me, Noah. And she goes home tonight."),
          N("Noah listened harder than ever. And for the first time, he heard Vale think.", { focus: "B", emotion: "surprised", fx: "shake" }),
          TH("F", "Why can't I stop him?", { emotion: "scared" }),
        ]),
      ],
    },
  ],
};
