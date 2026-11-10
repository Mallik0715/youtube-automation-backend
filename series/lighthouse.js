// Series 6 - "The Lighthouse That Lights Itself": ghost mystery. Scenes: shore, lighthouse, deck.
// Planted clue: the keeper's logbook in the old handwriting (Part 2) -> his daughter keeps it going (Part 4).
const { L, V, CARD, seg } = require("./helpers");

module.exports = {
  id: "lighthouse",
  title: "The Lighthouse",
  music: "suspense",
  hashtags: ["#shorts", "#ghost", "#mystery", "#animation", "#psychology"],
  description: "An empty lighthouse turns on by itself every night at 3:33 AM. Max and Leo row out to find out who - or what - is inside.",
  parts: [
    {
      title: "3:33 AM",
      hook: "This empty lighthouse turns on by itself every night at *3:33*",
      segments: [
        seg("shore", false, ["A", "B"], [
          L("B", "happy", "Max, that lighthouse has been empty for thirty years."),
          L("A", "smug", "And yet you say it lights up every night."),
          L("B", "neutral", "At exactly three thirty-three. Locals won't go near it."),
        ]),
        seg("shore", true, ["A", "B"], [
          CARD("3:33 AM", "shake"),
          L("B", "surprised", "Max! It's on! The light is ON!"),
          L("A", "surprised", "Someone's up there. Let's go."),
        ]),
        seg("deck", true, ["A", "B"], [
          L("B", "worried", "Rowing to a haunted lighthouse at three AM. Great plan."),
          L("A", "surprised", "The door... it's locked. From the inside.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Logbook",
      hook: "The keeper died 30 years ago. His logbook was *updated yesterday*",
      segments: [
        seg("lighthouse", true, ["A", "B"], [
          L("B", "worried", "We climbed in through a window. Totally normal."),
          L("A", "surprised", "Leo. The keeper's logbook."),
          L("B", "neutral", "'Light checked. Sea calm. All ships safe.'"),
          L("A", "worried", "Dated yesterday. Same handwriting as thirty years ago."),
          L("B", "worried", "A ghost who loves paperwork?"),
          L("A", "neutral", "Or someone who wants this place to feel haunted."),
          L("B", "worried", "Max... footsteps. Upstairs.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "The Face",
      hook: "They saw a *face* in the lighthouse window",
      segments: [
        seg("lighthouse", true, ["A", "B"], [
          L("B", "surprised", "There! A face in the window!"),
          L("A", "neutral", "Look again. It's your reflection and the lamp."),
          L("A", "neutral", "That's pareidolia. Our brains see faces everywhere. Clouds, sockets, windows."),
          L("B", "smug", "So no ghost."),
          L("A", "neutral", "No ghost. But fresh oil and a new timer. Someone keeps this light working."),
        ]),
        seg("deck", true, ["A", "B"], [
          L("B", "surprised", "Max! The storm took our boat!", { fx: "shake" }),
          L("A", "worried", "Then we're stuck here. With whoever lights this place."),
        ]),
      ],
    },
    {
      title: "The Keeper's Daughter",
      hook: "The lighthouse ghost was an *old woman* with a secret",
      segments: [
        seg("lighthouse", true, ["A", "C", "B"], [
          L("C", "neutral", "You're the ones who broke my window."),
          L("B", "surprised", "GHOST! ...Wait. You have shoes."),
          L("C", "neutral", "I'm Mira. The keeper was my father."),
          L("C", "worried", "One night he was sick, and the light went dark. A ship hit the rocks."),
          L("C", "worried", "He never forgave himself. I've lit it every night since."),
          L("A", "neutral", "Guilt can keep people repeating the same thing for decades."),
          V("radio", "Mayday! Mayday! We can't see the coast!"),
          L("B", "surprised", "A ship. Heading for the rocks. Right now.", { fx: "shake" }),
        ]),
      ],
    },
    {
      title: "Guide Them Home",
      hook: "The ship they saved sank *30 years ago*",
      segments: [
        seg("lighthouse", true, ["A", "C", "B"], [
          L("C", "worried", "The beam is jammed! It won't turn!"),
          L("A", "neutral", "Leo, push the lens! Mira, keep them talking!"),
          V("radio", "We see it! We see the light!"),
          L("B", "happy", "They're turning away from the rocks!"),
          L("C", "happy", "You saved them. Like my father couldn't."),
        ]),
        seg("shore", false, ["A", "C", "B"], [
          L("A", "happy", "The captain sent a thank-you message."),
          L("B", "neutral", "Their ship is called... the Northern Star."),
          L("C", "surprised", "The Northern Star... sank thirty years ago.", { fx: "shake" }),
        ]),
      ],
    },
  ],
};
