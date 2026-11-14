// "The 5 PM Lift" - Day 1 stuck in a lift with your worst enemy. Every day at 5 PM, it happens again.
// BRANCHING: from Day 2, each part opens with what happened after the option most viewers voted for.
// Cast: Ryan (A) the hero · Derek (F) his worst enemy at work · Gus (D) the old building janitor
const { L, N, seg } = require("./helpers");

module.exports = {
  id: "lift-enemy",
  title: "The 5 PM Lift",
  interactive: true,
  branching: true,
  choiceStyle: "wwyd",
  unit: "Day",
  hero: "Ryan",
  heroCode: "A",
  music: "suspense",
  names: { A: "Ryan", F: "Derek", D: "Gus" },
  looks: {
    A: { shirt: "#5B6B7A", shirtDark: "#46535F", sleeve: "#5B6B7A", strings: "#E6ECF2", hair: "#5a3a1f" },
    D: { cap: "#3b4f7a", overalls: "#3b4f7a", shirt: "#9aa3ad", sleeve: "#9aa3ad", shirtDark: "#2c3b5c", hair: "#d8d8d8" },
  },
  hashtags: ["#shorts", "#whatwouldyoudo", "#day1", "#mystery", "#story"],
  tags: ["what would you do", "day 1 stuck in a lift", "worst enemy", "elevator mystery", "you decide", "choose your path"],
  description: "Day 1: Ryan gets stuck in the office lift with the one person he hates. Then a voice speaks from the speaker - and it happens again every day at 5 PM. The most votes in the comments decide the next day.",
  parts: [
    {
      title: "Ten Minutes",
      hook: "Day 1: Stuck in a lift with *my worst enemy*",
      choice: { question: "What would you do?", a: "Confess something first", b: "Make Derek confess" },
      segments: [
        seg("office", false, ["A", "F"], [
          N("Day 1. Ryan hated one person. Derek. He stole Ryan's idea, and Ryan's promotion.", { focus: "F", emotion: "smug" }),
        ]),
        seg("lift", false, ["A", "F"], [
          N("5 PM. The lift stopped between floors 13 and 14. Only two people inside.", { focus: "A", emotion: "surprised", fx: "shake" }),
          L("F", "angry", "Great. Of all people."),
          N("No alarm. No signal. Then the speaker crackled.", { focus: "A", emotion: "worried", sfx: "boom" }),
          N("A voice said: Ten minutes. One of you tells the truth, and the doors open.", { focus: "A", emotion: "scared" }),
        ]),
      ],
    },
    {
      title: "Give Something Up",
      follows: "b",
      hook: "Day 2: 5 PM. *Same lift. Same enemy.*",
      choice: { question: "What would you do?", a: "Offer to quit your job", b: "Give Derek your big project" },
      ifA: [
        seg("lift", false, ["A", "F"], [
          L("A", "worried", "Last year, I deleted your presentation. On purpose."),
          N("The doors opened. Derek stared at him. He didn't move.", { focus: "F", emotion: "surprised" }),
        ]),
      ],
      ifB: [
        seg("lift", false, ["A", "F"], [
          L("A", "angry", "Say it, Derek. You stole my idea."),
          N("Derek looked at the floor. Then he nodded. The doors opened.", { focus: "F", emotion: "worried" }),
        ]),
      ],
      segments: [
        seg("office", false, ["A"], [
          N("Day 2. Ryan took the stairs all day. Fourteen floors.", { focus: "A", emotion: "neutral" }),
          N("At 4:59, his boss called him up to the top floor. Lift only.", { focus: "A", emotion: "worried" }),
        ]),
        seg("lift", false, ["A", "F"], [
          N("Derek was already inside. 5 PM. The lift stopped.", { focus: "F", emotion: "scared", fx: "shake" }),
          N("The voice said: Today, one of you gives something up.", { focus: "A", emotion: "scared" }),
        ]),
      ],
    },
    {
      title: "Thirty Years",
      follows: "a",
      hook: "Day 3: That lift has stopped *for thirty years*",
      choice: { question: "What would you do?", a: "Ignore the lift's next order", b: "Find who is behind the speaker" },
      ifA: [
        seg("lift", false, ["A", "F"], [
          L("A", "neutral", "I'll quit. You can have the job."),
          N("The doors opened. Derek grabbed his arm.", { focus: "F", emotion: "worried" }),
          L("F", "worried", "Don't. You're the best on the team."),
        ]),
      ],
      ifB: [
        seg("lift", false, ["A", "F"], [
          N("Ryan handed Derek his biggest project. Months of work.", { focus: "A", emotion: "worried" }),
          L("F", "surprised", "Why would you do that?"),
        ]),
      ],
      segments: [
        seg("radio", false, ["A", "D"], [
          N("Day 3. Ryan found Gus, the old janitor, in the basement control room.", { focus: "D", emotion: "neutral" }),
          L("D", "scared", "That lift's been stopping for thirty years. Always two people. Always enemies."),
          N("And what happens if they don't do what it says?", { focus: "A", emotion: "worried" }),
          L("D", "worried", "Nobody ever found out."),
        ]),
      ],
    },
    {
      title: "Why You Hate Him",
      follows: "a",
      hook: "Day 4: The lift asked *why he really hates him*",
      choice: { question: "What would you do?", a: "Help Derek", b: "Use his secret against him" },
      ifA: [
        seg("lift", false, ["A", "F"], [
          N("At 5 PM, Ryan ignored the voice. The lights went out.", { focus: "A", emotion: "scared" }),
          N("The lift dropped a whole floor. Derek screamed. Ryan gave in.", { focus: "F", emotion: "scared", fx: "shake" }),
        ]),
      ],
      ifB: [
        seg("radio", false, ["A"], [
          N("Ryan searched the control room for a microphone.", { focus: "A", emotion: "worried" }),
          N("Nothing. Just dust. Nobody had touched it in years.", { focus: "A", emotion: "scared" }),
        ]),
      ],
      segments: [
        seg("lift", false, ["A", "F"], [
          N("Day 4. The voice said: Tell him why you really hate him.", { focus: "A", emotion: "angry" }),
          L("A", "angry", "Because everything is easy for you."),
          N("Derek laughed. Not a happy laugh.", { focus: "F", emotion: "crying" }),
          L("F", "crying", "My dad's in hospital. I work two jobs to pay for it."),
        ]),
      ],
    },
    {
      title: "Who Gets Fired",
      follows: "a",
      hook: "Day 5: The lift said *one of them gets fired*",
      choice: { question: "What would you do?", a: "Choose yourself", b: "Choose Derek" },
      ifA: [
        seg("hospital", false, ["A", "F"], [
          N("Ryan covered Derek's work, so Derek could sit with his dad.", { focus: "A", emotion: "neutral" }),
          N("Derek didn't say thank you. He just nodded. That was enough.", { focus: "F", emotion: "relieved" }),
        ]),
      ],
      ifB: [
        seg("office", false, ["A"], [
          N("Ryan told the boss about Derek's second job.", { focus: "A", emotion: "smug" }),
          N("The boss didn't care. Ryan felt sick all day.", { focus: "A", emotion: "worried" }),
        ]),
      ],
      segments: [
        seg("lift", false, ["A", "F"], [
          N("Day 5. 5 PM. The lift stopped. The voice was colder today.", { focus: "A", emotion: "scared", fx: "shake" }),
          N("One of you will be fired tomorrow. You decide who.", { focus: "F", emotion: "scared" }),
        ]),
      ],
    },
    {
      title: "1995",
      follows: "b",
      hook: "Day 6: An old newspaper. *Two enemies. One lift. One survivor.*",
      choice: { question: "What would you do?", a: "Ask Gus about 1995", b: "Search the old building records" },
      ifA: [
        seg("lift", false, ["A", "F"], [
          L("A", "neutral", "Me. Fire me."),
          N("The next morning, nobody was fired. Nobody even knew.", { focus: "A", emotion: "surprised" }),
        ]),
      ],
      ifB: [
        seg("lift", false, ["A", "F"], [
          L("A", "worried", "Him."),
          L("F", "neutral", "Fair."),
          N("The next morning, nobody was fired. It had never been real.", { focus: "A", emotion: "surprised" }),
        ]),
      ],
      segments: [
        seg("radio", false, ["A"], [
          N("Day 6. In the janitor's room, Ryan found a yellow newspaper from 1995.", { focus: "A", emotion: "surprised" }),
          N("Two coworkers trapped in this building's lift. A fire. Only one came out.", { focus: "A", emotion: "scared" }),
          N("The survivor's photo was Gus.", { focus: "A", emotion: "scared", fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Hello, Old Friend",
      follows: "a",
      hook: "Day 7: The voice in the lift *asked for Gus*",
      choice: { question: "What would you do?", a: "Bring Gus into the lift", b: "Keep Gus away, it could be a trap" },
      ifA: [
        seg("radio", false, ["A", "D"], [
          N("Gus sat down slowly. His hands were shaking.", { focus: "D", emotion: "crying" }),
          L("D", "crying", "His name was Tom. We hated each other. I got out. He didn't."),
        ]),
      ],
      ifB: [
        seg("office", false, ["A"], [
          N("The records said: Tom Reyes. Died in the lift, 1995.", { focus: "A", emotion: "worried" }),
          N("There was an old recording of Tom's voice. Ryan pressed play. It was the voice from the lift.", { focus: "A", emotion: "scared", fx: "shake" }),
        ]),
      ],
      segments: [
        seg("lift", false, ["A", "F"], [
          N("Day 7. 5 PM. But today, the voice sounded different. Softer.", { focus: "A", emotion: "surprised" }),
          N("It said: Is Gus there? Bring me Gus.", { focus: "F", emotion: "scared" }),
        ]),
      ],
    },
    {
      title: "Two Days Left",
      follows: "a",
      hook: "Day 8: *Two days left.* Then the lift stops forever.",
      choice: { question: "What would you do?", a: "Shut the lift down for good", b: "Ride it one more time and end this" },
      ifA: [
        seg("lift", false, ["A", "F", "D"], [
          N("Gus stepped inside. The doors closed behind him.", { focus: "D", emotion: "scared" }),
          N("The voice said: Hello, old friend. Gus started to cry.", { focus: "D", emotion: "crying" }),
        ]),
      ],
      ifB: [
        seg("lift", false, ["A", "F"], [
          N("Ryan kept Gus away. The lift dropped two floors in the dark.", { focus: "A", emotion: "scared", fx: "shake" }),
          N("Ryan and Derek held on to each other. Enemies, holding on.", { focus: "F", emotion: "scared" }),
        ]),
      ],
      segments: [
        seg("lift", false, ["A", "F"], [
          N("Day 8. The voice made its last announcement.", { focus: "A", emotion: "worried" }),
          N("Two days left. Then this lift stops forever. With or without you inside.", { focus: "A", emotion: "scared", fx: "shake" }),
          L("F", "worried", "Ryan. Whatever you decide, I'm with you."),
        ]),
      ],
    },
    {
      title: "Sorry",
      follows: "b",
      hook: "Day 9: Thirty years late, *someone finally said sorry*",
      choice: { question: "What would you do?", a: "Forgive Derek for everything", b: "Tell Derek you still can't trust him" },
      ifA: [
        seg("radio", false, ["A", "D"], [
          N("Ryan went to cut the power. Gus stopped him.", { focus: "D", emotion: "worried" }),
          L("D", "worried", "If you shut it down, he never gets to finish."),
        ]),
      ],
      ifB: [
        seg("lift", false, ["A", "F"], [
          N("Ryan and Derek stepped into the lift together. On purpose this time.", { focus: "A", emotion: "worried" }),
        ]),
      ],
      segments: [
        seg("lift", false, ["A", "F", "D"], [
          N("Day 9. At 5 PM, Gus joined them in the lift.", { focus: "D", emotion: "worried" }),
          L("D", "crying", "Tom. I'm sorry. I should have gone back for you."),
          N("The lights turned warm. The voice said: Now it's their turn.", { focus: "A", emotion: "surprised" }),
          N("Ryan looked at Derek. The man who took everything from him.", { focus: "F", emotion: "worried" }),
        ]),
      ],
    },
    {
      title: "The Last Ride",
      follows: "a",
      hook: "Day 10: The truth about *the voice in the lift*",
      choice: { question: "What would you do?", a: "Report Gus", b: "Keep his secret and let the lift run" },
      ifA: [
        seg("lift", false, ["A", "F"], [
          L("A", "neutral", "I forgive you, Derek."),
          L("F", "crying", "I'll tell the boss whose idea it really was."),
        ]),
      ],
      ifB: [
        seg("lift", false, ["A", "F"], [
          L("A", "angry", "I can't trust you. Not yet."),
          L("F", "neutral", "Then I'll earn it."),
        ]),
      ],
      segments: [
        seg("radio", false, ["A", "D"], [
          N("Day 10. Ryan went down to the control room one last time.", { focus: "A", emotion: "neutral" }),
          N("Behind a loose panel: a microphone. A tape player. And Gus's old jacket.", { focus: "A", emotion: "surprised", fx: "shake" }),
          L("D", "worried", "I play Tom's voice. Two enemies a year. So no one ends up like us."),
          N("Gus held out his wrists, ready.", { focus: "D", emotion: "crying" }),
        ]),
      ],
    },
  ],
};
