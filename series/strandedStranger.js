// "Stranded With a Stranger" - Day 1 stranded on an island with one stranger. Trust them or go alone?
// BRANCHING: from Day 2, each part opens with what happened after the option most viewers voted for.
// Cast: Maya (E) the hero · Daniel (F) the stranger in a torn suit · Rook (D) leader of the men on the boat
const { L, N, seg } = require("./helpers");

module.exports = {
  id: "stranded-stranger",
  title: "Stranded With a Stranger",
  interactive: true,
  branching: true,
  choiceStyle: "wwyd",
  unit: "Day",
  hero: "Maya",
  heroCode: "E",
  music: "suspense",
  names: { E: "Maya", F: "Daniel", D: "Rook" },
  looks: {
    E: { shirt: "#E2E2DA", shirtDark: "#B9B9AE", sleeve: "#E2E2DA", pants: "#3A6B8C" },
    F: { shirt: "#4A4A55", shirtDark: "#34343D", sleeve: "#4A4A55", pants: "#34343D", hair: "#5a5a5a" },
    D: { cap: "#1f3b2c", shirt: "#3B5A45", sleeve: "#3B5A45", overalls: "#4a3b2a", shirtDark: "#3a2e20" },
  },
  hashtags: ["#shorts", "#whatwouldyoudo", "#day1", "#survival", "#story"],
  tags: ["what would you do", "day 1 stranded on an island", "survival story", "stranger", "you decide", "choose your path"],
  description: "Day 1: Maya wakes up on a desert island with one stranger - and a locked briefcase he won't let go of. Trust him or go alone? The most votes in the comments decide the next day.",
  parts: [
    {
      title: "The Briefcase",
      hook: "Day 1: Stranded on an island with *one stranger*",
      choice: { question: "What would you do?", a: "Team up with Daniel and share everything", b: "Take your half of the water and go alone" },
      segments: [
        seg("island", false, ["E"], [
          N("Day 1. Maya woke up on a white beach. Her boat was gone.", { focus: "E", emotion: "surprised" }),
          N("No phone. No people. Just footprints in the sand.", { focus: "E", emotion: "worried" }),
        ]),
        seg("island", false, ["E", "F"], [
          N("They led to a man in a torn suit, holding a locked briefcase.", { focus: "F", emotion: "worried" }),
          L("F", "worried", "I'm Daniel. My plane went down. You're the only other one."),
          N("He had one bottle of water. He offered her half.", { focus: "F", emotion: "neutral" }),
          N("But he kept the briefcase pressed to his chest. And he wouldn't say what was inside.", { focus: "E", emotion: "worried" }),
        ]),
      ],
    },
    {
      title: "Thirst",
      follows: "a",
      hook: "Day 2: The only water on the island *smelled wrong*",
      choice: { question: "What would you do?", a: "Drink the stream water anyway", b: "Climb the cliff for coconuts" },
      ifA: [
        seg("island", false, ["E", "F"], [
          N("They built a shelter together. Daniel worked hard. Never complained.", { focus: "F", emotion: "neutral" }),
          N("But that night, Maya heard him whispering to the briefcase.", { focus: "E", emotion: "worried" }),
        ]),
      ],
      ifB: [
        seg("island", false, ["E"], [
          N("Maya walked alone to the far side of the island.", { focus: "E", emotion: "neutral" }),
          N("By sunset, her water was gone.", { focus: "E", emotion: "worried" }),
        ]),
      ],
      segments: [
        seg("forest", false, ["E", "F"], [
          N("Day 2. The sun was brutal. Thirst was the real enemy now.", { focus: "E", emotion: "worried" }),
          N("Daniel found coconuts. At the top of a crumbling cliff.", { focus: "F", emotion: "neutral" }),
          N("Maya found a stream. But the water smelled strange.", { focus: "E", emotion: "worried" }),
          L("F", "worried", "One of us has to risk it. Today."),
        ]),
      ],
    },
    {
      title: "Gone",
      follows: "b",
      hook: "Day 3: She woke up. *He was gone.* So was the briefcase.",
      choice: { question: "What would you do?", a: "Light a fire to signal the boat", b: "Follow Daniel's footprints first" },
      ifA: [
        seg("island", true, ["E", "F"], [
          N("Maya drank. By night, she was shaking with fever.", { focus: "E", emotion: "scared" }),
          N("Daniel sat beside her until morning. He never let go of her hand.", { focus: "F", emotion: "worried" }),
        ]),
      ],
      ifB: [
        seg("forest", false, ["E", "F"], [
          N("Maya climbed. Halfway up, a rock gave way.", { focus: "E", emotion: "scared", fx: "shake" }),
          N("She hung by one hand. Until Daniel grabbed her wrist and pulled her up.", { focus: "F", emotion: "worried" }),
        ]),
      ],
      segments: [
        seg("island", false, ["E"], [
          N("Day 3. When Maya woke up, Daniel was gone.", { focus: "E", emotion: "surprised" }),
          N("So was the briefcase. His footprints led into the jungle.", { focus: "E", emotion: "worried" }),
          N("Then she heard it. A motor. A boat, far out at sea.", { focus: "E", emotion: "surprised", sfx: "whoosh" }),
        ]),
      ],
    },
    {
      title: "Flashlights",
      follows: "a",
      hook: "Day 4: Men came to the island *looking for him*",
      choice: { question: "What would you do?", a: "Hide with Daniel in the cave", b: "Wave to the men for rescue" },
      ifA: [
        seg("island", false, ["E"], [
          N("The smoke rose high into the sky. The boat turned toward the island.", { focus: "E", emotion: "happy" }),
          N("Then it turned away.", { focus: "E", emotion: "crying" }),
        ]),
      ],
      ifB: [
        seg("cave", false, ["E", "F"], [
          N("The footprints ended at a cave. Inside, Daniel was opening the briefcase.", { focus: "F", emotion: "surprised" }),
          N("He slammed it shut the moment he saw her.", { focus: "F", emotion: "scared", fx: "shake" }),
        ]),
      ],
      segments: [
        seg("cave", true, ["E", "F"], [
          N("Day 4. That night, Daniel finally talked.", { focus: "F", emotion: "worried" }),
          L("F", "worried", "This case has proof. Of what my boss did."),
          L("F", "scared", "People will do anything to get it back."),
        ]),
        seg("island", true, ["E"], [
          N("Then, flashlights on the beach. Three men from a boat. Searching.", { focus: "E", emotion: "scared" }),
        ]),
      ],
    },
    {
      title: "The Camp",
      follows: "a",
      hook: "Day 5: The men had a radio. *And a boat.*",
      choice: { question: "What would you do?", a: "Steal the radio tonight", b: "Steal the boat tonight" },
      ifA: [
        seg("cave", true, ["E", "F"], [
          N("They hid in the dark. The men walked right past the cave.", { focus: "E", emotion: "scared" }),
          N("One of them said: Find the man with the case.", { focus: "F", emotion: "scared" }),
        ]),
      ],
      ifB: [
        seg("island", true, ["E", "D"], [
          N("Maya ran out, waving. The leader smiled. His name was Rook.", { focus: "D", emotion: "smug" }),
          L("D", "smug", "Seen a man in a suit?"),
          N("She lied. They left. But now they knew her face.", { focus: "E", emotion: "worried" }),
        ]),
      ],
      segments: [
        seg("forest", false, ["E", "F"], [
          N("Day 5. Daniel found the men's camp on the north beach.", { focus: "F", emotion: "neutral" }),
          N("A radio on a crate. A small boat tied to the rocks.", { focus: "E", emotion: "surprised" }),
          L("F", "worried", "We only get one try. Tonight."),
        ]),
      ],
    },
    {
      title: "Victor Hale",
      follows: "b",
      hook: "Day 6: The name inside his suit was *on the news*",
      choice: { question: "What would you do?", a: "Confront him", b: "Pretend you didn't see it" },
      ifA: [
        seg("island", true, ["E"], [
          N("Maya crept in and grabbed the radio. She called for help.", { focus: "E", emotion: "worried" }),
          N("A voice answered: Coast guard. Hold on. Four days.", { focus: "E", emotion: "relieved" }),
        ]),
      ],
      ifB: [
        seg("island", true, ["E", "F"], [
          N("Daniel tried the boat. No key.", { focus: "F", emotion: "worried" }),
          N("A dog started barking. They ran for their lives.", { focus: "E", emotion: "scared", sfx: "footsteps" }),
        ]),
      ],
      segments: [
        seg("cave", false, ["E", "F"], [
          N("Day 6. While Daniel slept, Maya found a label inside his jacket.", { focus: "E", emotion: "surprised" }),
          N("It didn't say Daniel. It said Victor Hale.", { focus: "E", emotion: "scared", fx: "shake" }),
          N("The man on the news. Accused of stealing 50 million dollars.", { focus: "F", emotion: "neutral" }),
        ]),
      ],
    },
    {
      title: "The Storm",
      follows: "a",
      hook: "Day 7: The storm left *everyone stranded together*",
      choice: { question: "What would you do?", a: "Accept Rook's truce", b: "Refuse and stay hidden" },
      ifA: [
        seg("cave", false, ["E", "F"], [
          L("E", "angry", "Who are you really?"),
          L("F", "worried", "The news lied. I took the proof. Not the money."),
        ]),
      ],
      ifB: [
        seg("cave", false, ["E", "F"], [
          N("Maya said nothing. But she started sleeping with one eye open.", { focus: "E", emotion: "worried" }),
        ]),
      ],
      segments: [
        seg("island", true, ["E", "F"], [
          N("Day 7. A storm hit the island.", { focus: "E", emotion: "scared", sfx: "thunder" }),
          N("The cave flooded. The men's boat smashed against the rocks.", { focus: "F", emotion: "scared", fx: "shake" }),
        ]),
        seg("island", false, ["E", "F", "D"], [
          N("Now everyone was stranded. Rook walked over with empty hands.", { focus: "D", emotion: "neutral" }),
          L("D", "neutral", "Truce. Until help comes."),
        ]),
      ],
    },
    {
      title: "The Code",
      follows: "a",
      hook: "Day 8: The code to the briefcase was *her birthday*",
      choice: { question: "What would you do?", a: "Open the briefcase", b: "Go and find Daniel" },
      ifA: [
        seg("island", true, ["E", "F", "D"], [
          N("They shared one fire with the men. Nobody slept.", { focus: "E", emotion: "worried" }),
          N("Rook never stopped staring at the briefcase.", { focus: "D", emotion: "smug" }),
        ]),
      ],
      ifB: [
        seg("forest", true, ["E", "F"], [
          N("They hid in the trees. The men had the only fire.", { focus: "E", emotion: "worried" }),
          N("Maya shivered all night. Daniel gave her his jacket.", { focus: "F", emotion: "worried" }),
        ]),
      ],
      segments: [
        seg("island", false, ["E"], [
          N("Day 8. In the morning, Daniel was gone again. The briefcase lay at her feet.", { focus: "E", emotion: "surprised" }),
          N("A message in the sand: If I'm not back, open it. The code is your birthday.", { focus: "E", emotion: "scared" }),
          N("Maya froze. She had never told him her birthday.", { focus: "E", emotion: "scared", fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Photo",
      follows: "a",
      hook: "Day 9: Inside the briefcase was *a photo of her*",
      choice: { question: "What would you do?", a: "Give Rook the briefcase to stop him", b: "Run with the briefcase to the ship" },
      ifA: [
        seg("island", false, ["E"], [
          N("The case clicked open. Papers. Bank records. And one old photo.", { focus: "E", emotion: "surprised" }),
          N("A little girl on a man's shoulders. The girl was Maya.", { focus: "E", emotion: "crying" }),
        ]),
      ],
      ifB: [
        seg("forest", false, ["E", "F"], [
          N("She found him at the cliff, staring at the sea.", { focus: "F", emotion: "worried" }),
          L("F", "crying", "I should have told you on Day 1."),
        ]),
      ],
      segments: [
        seg("island", false, ["E", "F"], [
          N("Day 9. Daniel was her father. He left when she was five.", { focus: "F", emotion: "crying" }),
          N("He had been on that plane to find her.", { focus: "E", emotion: "crying" }),
          N("Then a horn. A ship on the horizon. The coast guard.", { focus: "E", emotion: "surprised", sfx: "boom" }),
          N("And Rook was running straight for the briefcase.", { focus: "E", emotion: "scared", fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Rescue",
      follows: "b",
      hook: "Day 10: Rescue came. And so did *handcuffs*",
      choice: { question: "What would you do?", a: "Tell them he's your father and he's innocent", b: "Stay silent and let the law decide" },
      ifA: [
        seg("island", false, ["E", "D"], [
          N("Maya threw the case at Rook's feet. He grabbed it, laughing.", { focus: "D", emotion: "smug" }),
          N("Daniel smiled. The papers were blank. He'd hidden the real ones in his shoe.", { focus: "E", emotion: "surprised" }),
        ]),
      ],
      ifB: [
        seg("island", false, ["E", "F", "D"], [
          N("Maya ran. Rook was faster. Daniel tackled him into the waves.", { focus: "F", emotion: "angry", fx: "shake" }),
          N("Maya reached the boat with the case held high.", { focus: "E", emotion: "relieved" }),
        ]),
      ],
      segments: [
        seg("deck", false, ["E", "F"], [
          N("Day 10. On the ship, an officer took Daniel's arm. Victor Hale. You're under arrest.", { focus: "F", emotion: "worried" }),
          N("Daniel looked at Maya. Nobody else knew who he really was.", { focus: "E", emotion: "crying" }),
          L("F", "worried", "Your choice, Maya. It always was."),
        ]),
      ],
    },
  ],
};
