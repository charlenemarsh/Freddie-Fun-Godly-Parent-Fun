/* ===========================================================================
   questions.js — THE FIFTEEN JUNCTIONS
   ---------------------------------------------------------------------------
   SAFE TO EDIT WITHOUT CODING — but read this box first.

   Each question is one junction in the world. Five options laid out in a plus:
   UP, RIGHT, DOWN, LEFT and CENTRE.

     prompt        the question. In-world, second person, present tense.
                   Under 22 words. Never "which do you prefer".
     visualOnly    true = the options show NO TEXT AT ALL, only the drawing.
                   Questions 1, 5, 8 and 13 must stay visualOnly.
     art           which drawing to show: {k: kind, id: which one}
                   The drawings live in art/symbols.js
     label         under 5 words. Ignored entirely when visualOnly is true.
     gods          which gods this option feeds, and how strongly (1-3)
     traits        which of the six axes it feeds (0-2 each)
                   VALOR WISDOM WILD CRAFT HEART SHADOW

   THE THREE RULES YOU MUST NOT BREAK
     1. Every option must feed at least one god. No filler options.
     2. No option may be the obviously "correct" one. If one answer sounds
        like the good answer, rewrite it.
     3. After ANY edit here, run:  node simulate.js
        Every god has to land between 3% and 14%. If one drifts out, adjust
        rarityMultiplier in gods.js — do not distort the questions.

   Question 15 counts double. That is deliberate; it is the one that decides.
   =========================================================================== */

const QUESTIONS = [

  /* ---------- REALM 1 · CAMP HALF-BLOOD -------------------------- */

  // Q1 — COLOUR. Pure visual: five bead cords, no words at all.
  {
    id: 1, realmId: 1, kind: 'colour', visualOnly: true,
    prompt: 'Chiron holds out five bead cords from five different summers. Which one do you take?',
    options: [
      { dir: 'UP',      art: { k: 'swatch', id: 'stormWhite' },   label: '',
        gods: { zeus: 3, hecate: 1 },                 traits: { VALOR: 1, SHADOW: 1 } },
      { dir: 'RIGHT',   art: { k: 'swatch', id: 'warRed' },       label: '',
        gods: { ares: 3, hephaestus: 1 },             traits: { VALOR: 2 } },
      { dir: 'DOWN',    art: { k: 'swatch', id: 'deepTeal' },     label: '',
        gods: { poseidon: 3, iris: 1 },               traits: { WILD: 2 } },
      { dir: 'LEFT',    art: { k: 'swatch', id: 'harvestGreen' }, label: '',
        gods: { demeter: 3, dionysus: 1 },            traits: { WILD: 1, HEART: 1 } },
      { dir: 'CENTRE',  art: { k: 'swatch', id: 'sunGold' },      label: '',
        gods: { apollo: 3, hermes: 1 },               traits: { HEART: 1, CRAFT: 1 } },
    ],
  },

  // Q2 — PLACE. Where you go when nobody is watching.
  {
    id: 2, realmId: 1, kind: 'place', visualOnly: false,
    prompt: 'First free hour at camp. Five paths, nobody checking. Where do you actually go?',
    options: [
      { dir: 'RIGHT',   art: { k: 'scene', id: 'climbingWall' },     label: 'The lava wall',
        gods: { ares: 3, zeus: 2 },                   traits: { VALOR: 2, WILD: 1 } },
      { dir: 'DOWN',    art: { k: 'scene', id: 'forge' },            label: 'The forge',
        gods: { hephaestus: 3, athena: 1 },           traits: { CRAFT: 2 } },
      { dir: 'LEFT',    art: { k: 'scene', id: 'canoeLake' },        label: 'The canoe lake',
        gods: { poseidon: 3, hermes: 1 },             traits: { WILD: 2 } },
      { dir: 'CENTRE',  art: { k: 'scene', id: 'strawberryFields' }, label: 'The strawberry rows',
        gods: { demeter: 3, dionysus: 2 },            traits: { WILD: 1, HEART: 1 } },
      { dir: 'UP',      art: { k: 'scene', id: 'libraryLoft' },      label: 'The attic library',
        gods: { athena: 3, hecate: 2 },               traits: { WISDOM: 2, SHADOW: 1 } },
    ],
  },

  // Q3 — SCENARIO. Capture the flag, going badly.
  {
    id: 3, realmId: 1, kind: 'scenario', visualOnly: false,
    prompt: 'Capture the flag. Ten minutes left, your team is losing. What do you actually do?',
    options: [
      { dir: 'DOWN',    art: { k: 'act', id: 'charge' },  label: 'Charge the bridge',
        gods: { ares: 3, zeus: 1 },                   traits: { VALOR: 2, WILD: 1 } },
      { dir: 'LEFT',    art: { k: 'act', id: 'replan' },  label: 'Rewrite the plan',
        gods: { athena: 3, nemesis: 1 },              traits: { WISDOM: 2, CRAFT: 1 } },
      { dir: 'UP',      art: { k: 'act', id: 'sneak' },   label: 'Slip round the back',
        gods: { hermes: 3, hades: 1 },                traits: { SHADOW: 1, WISDOM: 1 } },
      { dir: 'RIGHT',   art: { k: 'act', id: 'guard' },   label: 'Hold our own flag',
        gods: { hephaestus: 2, demeter: 2, nemesis: 1 }, traits: { CRAFT: 1, HEART: 1, VALOR: 1 } },
      { dir: 'CENTRE',  art: { k: 'act', id: 'rally' },   label: 'Get everyone shouting',
        gods: { dionysus: 3, apollo: 2, aphrodite: 1 }, traits: { HEART: 2, WILD: 1 } },
    ],
  },

  /* ---------- REALM 2 · THE FOREST ------------------------------- */

  // Q4 — ANIMAL.
  {
    id: 4, realmId: 2, kind: 'animal', visualOnly: false,
    prompt: 'Something has been keeping pace with you in the trees. It steps into the light.',
    options: [
      { dir: 'UP',      art: { k: 'animal', id: 'hawk' },         label: 'A still hawk',
        gods: { nemesis: 3, zeus: 2 },                traits: { SHADOW: 1, VALOR: 1, WISDOM: 1 } },
      { dir: 'LEFT',    art: { k: 'animal', id: 'boar' },         label: 'A scarred boar',
        gods: { ares: 3, demeter: 1 },                traits: { VALOR: 2, WILD: 1 } },
      { dir: 'DOWN',    art: { k: 'animal', id: 'hellhoundPup' }, label: 'A hellhound pup',
        gods: { hades: 3, hecate: 2 },                traits: { SHADOW: 2, HEART: 1 } },
      { dir: 'CENTRE',  art: { k: 'animal', id: 'stag' },         label: 'A white stag',
        gods: { demeter: 3, apollo: 1 },              traits: { WILD: 2, HEART: 1 } },
      { dir: 'RIGHT',   art: { k: 'animal', id: 'owl' },          label: 'An unblinking owl',
        gods: { athena: 3, hecate: 1 },               traits: { WISDOM: 2, SHADOW: 1 } },
    ],
  },

  // Q5 — PATTERN. Pure visual: carvings in the bark, no words.
  {
    id: 5, realmId: 2, kind: 'pattern', visualOnly: true,
    prompt: 'Every tree on this path carries the same five carvings. Which one do you follow?',
    options: [
      { dir: 'RIGHT',   art: { k: 'pattern', id: 'lightningFracture' }, label: '',
        gods: { zeus: 3, ares: 1 },                   traits: { VALOR: 2 } },
      { dir: 'CENTRE',  art: { k: 'pattern', id: 'honeycomb' },         label: '',
        gods: { iris: 3, hephaestus: 2 },             traits: { CRAFT: 2, HEART: 1 } },
      { dir: 'DOWN',    art: { k: 'pattern', id: 'webWeave' },          label: '',
        gods: { hecate: 3, athena: 2 },               traits: { WISDOM: 1, SHADOW: 2 } },
      { dir: 'LEFT',    art: { k: 'pattern', id: 'oliveBranch' },       label: '',
        gods: { demeter: 3, apollo: 2 },              traits: { WILD: 1, HEART: 1 } },
      { dir: 'UP',      art: { k: 'pattern', id: 'meander' },           label: '',
        gods: { hermes: 3, hephaestus: 1 },           traits: { CRAFT: 1, WISDOM: 1 } },
    ],
  },

  // Q6 — DANGER. The tunnels go quiet.
  {
    id: 6, realmId: 2, kind: 'scenario', visualOnly: false,
    prompt: 'The ant tunnels ahead go quiet. Everyone stops. Everyone looks at you.',
    options: [
      { dir: 'DOWN',    art: { k: 'act', id: 'climbView' }, label: 'Climb for a view',
        gods: { athena: 2, hermes: 2 },               traits: { WISDOM: 2, WILD: 1 } },
      { dir: 'CENTRE',  art: { k: 'act', id: 'standFront' }, label: 'Step in front',
        gods: { ares: 3, nemesis: 2 },                traits: { VALOR: 2, HEART: 1 } },
      { dir: 'UP',      art: { k: 'act', id: 'goSilent' },  label: 'Go completely still',
        gods: { hades: 3, hecate: 2 },                traits: { SHADOW: 2 } },
      { dir: 'RIGHT',   art: { k: 'act', id: 'goAround' },  label: 'Find a way round',
        gods: { hermes: 2, demeter: 2, poseidon: 1 }, traits: { WILD: 2, WISDOM: 1 } },
      { dir: 'LEFT',    art: { k: 'act', id: 'makeLaugh' }, label: 'Break the tension',
        gods: { dionysus: 3, aphrodite: 2 },          traits: { HEART: 2, VALOR: 1 } },
    ],
  },

  /* ---------- REALM 3 · THE SEA & SHORE -------------------------- */

  // Q7 — SCENE. Five doorways in a drowned temple.
  {
    id: 7, realmId: 3, kind: 'place', visualOnly: false,
    prompt: 'You surface inside a drowned temple. Five doorways, five different lights beyond.',
    options: [
      { dir: 'UP',      art: { k: 'scene', id: 'sunShaft' },      label: 'Up towards the sun',
        gods: { apollo: 3, zeus: 2 },                 traits: { HEART: 1, VALOR: 1 } },
      { dir: 'LEFT',    art: { k: 'scene', id: 'kelpCathedral' }, label: 'The kelp cathedral',
        gods: { demeter: 2, dionysus: 3 },            traits: { WILD: 2, HEART: 1 } },
      { dir: 'DOWN',    art: { k: 'scene', id: 'darkTrench' },    label: 'The dark trench',
        gods: { hades: 3, hecate: 2 },                traits: { SHADOW: 2, VALOR: 1 } },
      { dir: 'RIGHT',   art: { k: 'scene', id: 'sunkenShip' },    label: 'The sunken warship',
        gods: { ares: 2, hephaestus: 3 },             traits: { CRAFT: 2, VALOR: 1 } },
      { dir: 'CENTRE',  art: { k: 'scene', id: 'pearlCavern' },   label: 'The pearl cavern',
        gods: { aphrodite: 3, iris: 2, poseidon: 1 }, traits: { HEART: 2, WISDOM: 1 } },
    ],
  },

  // Q8 — COLOUR / LIGHT. Pure visual: no words.
  {
    id: 8, realmId: 3, kind: 'colour', visualOnly: true,
    prompt: 'The water keeps changing colour where the light hits it. Which water would you stay in?',
    options: [
      { dir: 'CENTRE',  art: { k: 'light', id: 'goldShafts' },    label: '',
        gods: { apollo: 3, iris: 2 },                 traits: { HEART: 2 } },
      { dir: 'LEFT',    art: { k: 'light', id: 'coralShallows' }, label: '',
        gods: { aphrodite: 3, demeter: 1 },           traits: { HEART: 1, WILD: 1 } },
      { dir: 'UP',      art: { k: 'light', id: 'greenAbyss' },    label: '',
        gods: { hades: 2, nemesis: 3 },               traits: { SHADOW: 2 } },
      { dir: 'DOWN',    art: { k: 'light', id: 'stormChop' },     label: '',
        gods: { zeus: 3, poseidon: 2 },               traits: { VALOR: 1, WILD: 2 } },
      { dir: 'RIGHT',   art: { k: 'light', id: 'cyanCaustics' },  label: '',
        gods: { poseidon: 3, hermes: 1 },             traits: { WILD: 2, CRAFT: 1 } },
    ],
  },

  // Q9 — RESCUE. Six seconds.
  {
    id: 9, realmId: 3, kind: 'scenario', visualOnly: false,
    prompt: 'A hippocampus is tangled in a net, and something enormous is coming. Six seconds, maybe.',
    options: [
      { dir: 'DOWN',    art: { k: 'act', id: 'signal' },   label: 'Signal for help',
        gods: { iris: 3, apollo: 2 },                 traits: { HEART: 2, WISDOM: 1 } },
      { dir: 'UP',      art: { k: 'act', id: 'cutFree' },  label: 'Cut it free, fast',
        gods: { ares: 2, poseidon: 3 },               traits: { VALOR: 2, WILD: 1 } },
      { dir: 'RIGHT',   art: { k: 'act', id: 'faceIt' },   label: 'Turn and wait',
        gods: { nemesis: 2, hades: 2, ares: 1 },      traits: { VALOR: 2, SHADOW: 1 } },
      { dir: 'LEFT',    art: { k: 'act', id: 'untie' },    label: 'Work the knots',
        gods: { hephaestus: 3, athena: 2 },           traits: { CRAFT: 2, WISDOM: 1 } },
      { dir: 'CENTRE',  art: { k: 'act', id: 'calmIt' },   label: 'Keep it calm',
        gods: { demeter: 3, aphrodite: 2 },           traits: { HEART: 2, WILD: 1 } },
    ],
  },

  /* ---------- REALM 4 · THE UNDERWORLD --------------------------- */

  // Q10 — SYMBOL. One warms under your hand.
  {
    id: 10, realmId: 4, kind: 'pattern', visualOnly: false,
    prompt: 'The palace gates are covered in carved symbols. One of them warms under your hand.',
    options: [
      { dir: 'LEFT',    art: { k: 'pattern', id: 'constellation' }, label: 'Constellation lines',
        gods: { zeus: 2, hecate: 3 },                 traits: { WISDOM: 2, SHADOW: 1 } },
      { dir: 'UP',      art: { k: 'pattern', id: 'bronzeScales' }, label: 'Hammered bronze',
        gods: { hephaestus: 3, ares: 2 },             traits: { CRAFT: 2, VALOR: 1 } },
      { dir: 'RIGHT',   art: { k: 'pattern', id: 'pomegranate' },  label: 'Pomegranate seeds',
        gods: { hades: 3, demeter: 2 },               traits: { SHADOW: 2, HEART: 1 } },
      { dir: 'CENTRE',  art: { k: 'pattern', id: 'waves' },        label: 'Crashing waves',
        gods: { poseidon: 3, iris: 1 },               traits: { WILD: 2 } },
      { dir: 'DOWN',    art: { k: 'pattern', id: 'laurel' },       label: 'A laurel wreath',
        gods: { apollo: 3, nemesis: 2 },              traits: { HEART: 1, CRAFT: 1, VALOR: 1 } },
    ],
  },

  // Q11 — TREASURE. He will know.
  {
    id: 11, realmId: 4, kind: 'object', visualOnly: false,
    prompt: 'The vault is open by accident. You may take exactly one thing, and he will know.',
    options: [
      { dir: 'DOWN',    art: { k: 'object', id: 'stormCrown' }, label: 'A crown of storms',
        gods: { zeus: 3, dionysus: 2 },               traits: { VALOR: 2, WILD: 1 } },
      { dir: 'RIGHT',   art: { k: 'object', id: 'blade' },      label: 'An unbreakable blade',
        gods: { ares: 3, hephaestus: 2 },             traits: { VALOR: 1, CRAFT: 2 } },
      { dir: 'LEFT',    art: { k: 'object', id: 'key' },        label: 'A key to anywhere',
        gods: { hecate: 3, hermes: 3 },               traits: { WISDOM: 2, SHADOW: 1 } },
      { dir: 'UP',      art: { k: 'object', id: 'seed' },       label: 'A seed that always grows',
        gods: { demeter: 3, poseidon: 1 },            traits: { WILD: 2, HEART: 1 } },
      { dir: 'CENTRE',  art: { k: 'object', id: 'mirror' },     label: 'A mirror that never lies',
        gods: { aphrodite: 3, nemesis: 2, athena: 1 }, traits: { HEART: 1, WISDOM: 1, SHADOW: 1 } },
    ],
  },

  // Q12 — MORAL. It will cost you something real.
  {
    id: 12, realmId: 4, kind: 'scenario', visualOnly: false,
    prompt: 'A spirit begs you to carry one message back up. Doing it will cost you something real.',
    options: [
      { dir: 'UP',      art: { k: 'act', id: 'carryIt' },    label: 'Carry it regardless',
        gods: { iris: 3, ares: 2 },                   traits: { HEART: 2, VALOR: 2 } },
      { dir: 'RIGHT',   art: { k: 'act', id: 'askPrice' },   label: 'Ask the price first',
        gods: { hermes: 3, athena: 2 },               traits: { WISDOM: 2, CRAFT: 1 } },
      { dir: 'DOWN',    art: { k: 'act', id: 'stayListen' }, label: 'Stay and listen',
        gods: { hades: 3, demeter: 2 },               traits: { SHADOW: 2, HEART: 2 } },
      { dir: 'LEFT',    art: { k: 'act', id: 'otherWay' },   label: 'Find another way',
        gods: { hecate: 3, dionysus: 2 },             traits: { WISDOM: 1, WILD: 2 } },
      { dir: 'CENTRE',  art: { k: 'act', id: 'sayNo' },      label: 'Say no, kindly',
        gods: { nemesis: 3, aphrodite: 2 },           traits: { SHADOW: 1, HEART: 1, VALOR: 1 } },
    ],
  },

  /* ---------- REALM 5 · MOUNT OLYMPUS ---------------------------- */

  // Q13 — WEATHER. Pure visual: no words.
  {
    id: 13, realmId: 5, kind: 'weather', visualOnly: true,
    prompt: 'The sky over Olympus does whatever you are feeling. Looking at you, it becomes what?',
    options: [
      { dir: 'CENTRE',  art: { k: 'weather', id: 'lightningStorm' }, label: '',
        gods: { zeus: 3, ares: 2 },                   traits: { VALOR: 2, WILD: 1 } },
      { dir: 'RIGHT',   art: { k: 'weather', id: 'blazingSun' },    label: '',
        gods: { apollo: 3, hephaestus: 2 },           traits: { HEART: 1, CRAFT: 2 } },
      { dir: 'UP',      art: { k: 'weather', id: 'starNight' },     label: '',
        gods: { hades: 2, hecate: 3 },                traits: { SHADOW: 2, WISDOM: 1 } },
      { dir: 'LEFT',    art: { k: 'weather', id: 'greenRain' },     label: '',
        gods: { demeter: 3, poseidon: 2 },            traits: { WILD: 2, HEART: 1 } },
      { dir: 'DOWN',    art: { k: 'weather', id: 'aurora' },        label: '',
        gods: { iris: 3, aphrodite: 2, dionysus: 1 }, traits: { HEART: 2, WILD: 1 } },
    ],
  },

  // Q14 — GIFT. Only one.
  {
    id: 14, realmId: 5, kind: 'object', visualOnly: false,
    prompt: 'Every throne offers you one gift. You may accept exactly one of them.',
    options: [
      { dir: 'RIGHT',   art: { k: 'object', id: 'unbeatenFist' }, label: 'Never lose a fight',
        gods: { ares: 3, zeus: 2 },                   traits: { VALOR: 2 } },
      { dir: 'DOWN',    art: { k: 'object', id: 'makerHands' },   label: 'Make anything imagined',
        gods: { hephaestus: 3, athena: 2 },           traits: { CRAFT: 2, WISDOM: 1 } },
      { dir: 'LEFT',    art: { k: 'object', id: 'secretEye' },    label: 'Know every secret',
        gods: { hecate: 3, hades: 2 },                traits: { SHADOW: 2, WISDOM: 1 } },
      { dir: 'UP',      art: { k: 'object', id: 'safeCircle' },   label: 'Everyone you love, safe',
        gods: { demeter: 3, aphrodite: 2 },           traits: { HEART: 2, VALOR: 1 } },
      { dir: 'CENTRE',  art: { k: 'object', id: 'joyBurst' },     label: 'Be wildly happy',
        gods: { dionysus: 3, apollo: 2, iris: 1 },    traits: { HEART: 2, WILD: 2 } },
    ],
  },

  // Q15 — SELF-DEFINING. THIS ONE COUNTS DOUBLE.
  {
    id: 15, realmId: 5, kind: 'scenario', visualOnly: false, doubleWeight: true,
    prompt: 'Your parent finally speaks. One line. Which one puts a chill down your neck?',
    options: [
      { dir: 'LEFT',    art: { k: 'act', id: 'neverSmall' },     label: '"You were never small."',
        gods: { zeus: 3, nemesis: 2, ares: 1 },       traits: { VALOR: 2, SHADOW: 1 } },
      { dir: 'UP',      art: { k: 'act', id: 'watchedBuild' },   label: '"I watched you build."',
        gods: { hephaestus: 3, athena: 3 },           traits: { CRAFT: 2, WISDOM: 2 } },
      { dir: 'DOWN',    art: { k: 'act', id: 'keptSecrets' },    label: '"I kept your secrets."',
        gods: { hades: 3, hecate: 2, hermes: 1 },     traits: { SHADOW: 2, HEART: 1 } },
      { dir: 'RIGHT',   art: { k: 'act', id: 'madeGrow' },       label: '"You made things grow."',
        gods: { demeter: 3, poseidon: 2, dionysus: 2 }, traits: { WILD: 2, HEART: 1 } },
      { dir: 'CENTRE',  art: { k: 'act', id: 'broughtColour' },  label: '"You brought the colour."',
        gods: { aphrodite: 3, iris: 3, apollo: 1 },   traits: { HEART: 2, WILD: 1 } },
    ],
  },

];
