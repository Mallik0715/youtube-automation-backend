// Painted background images, one per place + lighting. File: assets/backgrounds/<key>.jpg
// e.g. "office" -> office.jpg, "office_night" -> office_night.jpg (1080x1920, vertical).
//
// scripts/generateBackgrounds.js makes free AI placeholders from these prompts.
// To upgrade one: paste STYLE + its prompt into Microsoft Designer / Bing Image Creator (or Ideogram),
// pick the best image, save it as assets/backgrounds/<key>.jpg (same name), commit and push.
// If an image is missing, the video falls back to the code-drawn version of that scene.

const STYLE =
  "2D cartoon animation background art, clean illustration with soft shading, rich colours, " +
  "empty scene with no people and no text, eye-level view, vertical 9:16 composition, " +
  "open floor space in the lower third";

const NIGHT = ", at night, dark blue moonlit tones, warm lamp light, cosy shadows";

const PLACES = {
  office: "modern office interior, big window with a city skyline, wooden desk with laptop, bookshelf, potted plants",
  meeting: "corporate meeting room, long table with chairs, whiteboard with charts, glass wall, potted plant",
  cafe: "cosy coffee shop interior, counter with espresso machine, chalkboard menu, hanging warm lights, wooden floor",
  home: "cosy living room, sofa, big window with curtains, floor lamp, framed pictures, wooden floor",
  street: "city street with shops and apartment buildings, sidewalk, street lamps, a few trees",
  gate: "old stone archway entrance to a small mountain village, dirt road, mountains behind, old red car parked",
  village: "quiet old mountain village street, small stone houses with wooden doors, cobblestones, mountains behind",
  room: "small old wooden guest bedroom in a village house, bed, lantern on a table, window, wooden door",
  well: "old stone well with a wooden roof and a rope, village square, trees, mountains",
  tunnel: "ancient underground stone tunnel with carved symbols on the walls, torches, dark passage ahead",
  temple: "hidden ancient underground temple chamber, stone pillars, a glowing golden sun emblem, torches",
  museum: "grand museum hall, marble floor, paintings on the walls, a glass display case on a pedestal in the centre",
  forest: "deep pine forest clearing, tall trees, ferns, a path, soft fog",
  cabin: "inside a wooden log cabin, stone fireplace with fire, window, wooden table, rug",
  cave: "inside a large dark rocky cave, stalactites, a big nest of branches on the floor, light from the entrance",
  shore: "rocky island shore, calm sea, a tall red and white lighthouse on the rocks, small wooden rowboat on the sand",
  lighthouse: "inside the lamp room at the top of a lighthouse, a huge glass lens, round windows to the sea, old desk with a logbook",
  deck: "deck of a small wooden boat at sea, railing, mast and ropes, open ocean horizon",
  desert: "wide desert with sand dunes, an old metal radio tower, a cactus, clear sky",
  radio: "inside an old abandoned 1970s radio station, consoles with dials and switches, reel-to-reel tapes, map on the wall",
  train: "inside an old-fashioned night train carriage, red velvet seats, windows, luggage racks, warm lamps",
  snow: "snowy mountain top, a small red research hut with an antenna, deep snow, peaks",
  icecave: "inside a blue glacier ice cave, icicles, a giant dark shape frozen inside the ice wall",
  underwater: "deep underwater scene, an old sunken wooden shipwreck, seaweed, sandy sea floor, light rays from above",
  // "Day 1 of..." series: everyday places
  bedroom: "teenage boy's small bedroom, single bed with a pillow, study desk with books and a lamp, posters on the wall, window with curtains",
  classroom: "school classroom, rows of wooden desks and chairs, green chalkboard, big windows, notice board",
  canteen: "school canteen, long tables with benches, food counter with trays, menu board, windows",
  corridor: "school corridor, rows of blue metal lockers, notice boards, long hallway with windows",
  shop: "small mobile phone shop interior, glass display counter with smartphones, shelves of phone boxes, bright signs",
  bank: "bank hall interior, marble floor, teller counters with glass windows, a big vault door at the back",
  hospital: "hospital corridor, white walls, a hospital bed seen through a doorway, chairs for waiting, soft lights",
  mall: "shopping mall interior, shop fronts with glass windows, escalator, shiny floor, hanging lights",
  lift: "inside a small elevator, metal walls, button panel with floor numbers, handrail, closed doors",
  island: "small tropical desert island beach, palm trees, white sand, calm turquoise sea, a wrecked wooden boat",
};

// Every place + lighting combination the series use
const KEYS = [
  "office", "office_night", "meeting", "cafe", "home", "home_night", "street",
  "gate", "gate_night", "village", "room_night", "well", "tunnel_night", "temple_night",
  "museum_night", "forest", "forest_night", "cabin", "cabin_night", "cave_night",
  "shore", "shore_night", "lighthouse_night", "deck", "deck_night", "desert", "radio",
  "train", "train_night", "snow", "snow_night", "icecave_night", "underwater",
  "bedroom", "classroom", "canteen", "corridor", "shop", "bank", "hospital", "mall", "lift", "island",
];

function promptFor(key) {
  const night = key.endsWith("_night");
  const place = night ? key.slice(0, -"_night".length) : key;
  if (!PLACES[place]) throw new Error(`No background prompt for "${place}"`);
  return `${STYLE}, ${PLACES[place]}${night ? NIGHT : ""}`;
}

module.exports = { STYLE, NIGHT, PLACES, KEYS, promptFor };
