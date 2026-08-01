/* ===========================================================================
   realms.js — THE FIVE PLACES YOU RUN THROUGH
   ---------------------------------------------------------------------------
   SAFE TO EDIT WITHOUT CODING (the words and the colours, at least).

   Each realm has:
     name          shown on the intro card and in the HUD
     subtitle      the smaller line under the name on the intro card
     palette       the five colours that define the whole realm
     cssVars       fed straight into CSS custom properties
     art           which drawing function builds the six parallax layers
     particles     {kind, count, ...} — the canvas particle system for this realm
     ambient       {tint, fog, rayStrength} — the light treatment
     collectibles  which items float in the lanes here (see art/symbols.js)
     npcs          creatures that appear beside the path and react as you pass
     transitionOut the full-screen flourish that ends this realm
     runSpeed      how fast the world scrolls, in px per second
   =========================================================================== */

const REALMS = [

  {
    id: 1,
    name: 'Camp Half-Blood',
    subtitle: 'Long Island Sound · golden hour',
    palette: { a: '#F2B544', b: '#E2543A', c: '#2E6B4F', d: '#87C5E8', e: '#F7EBD3' },
    cssVars: { '--r-sky-top': '#8FCBEC', '--r-sky-bot': '#FFD9A0', '--r-ground': '#5E8B4C',
               '--r-glow': '#FFE6A8', '--r-ink': '#3A2A18' },
    art: 'realm1',
    particles: { kind: 'dust', count: 90, drift: 12, rise: -6, size: [1, 2.6], colour: '#FFF0C4', alpha: [0.15, 0.55] },
    ambient: { rays: 0.85, rayColour: '#FFE9AE', fog: 0.10, fogColour: '#FFD9A0', vignette: 0.42 },
    collectibles: ['drachma', 'ambrosia', 'riptide', 'fleeceTuft', 'bronzeShield', 'laurelCrown'],
    npcs: ['centaur', 'pegasus', 'camper', 'satyr'],
    transitionOut: 'trunkDive',
    runSpeed: 330,
  },

  {
    id: 2,
    name: 'The Forest',
    subtitle: 'Beyond the cabins · nobody goes alone',
    palette: { a: '#123B2A', b: '#3E8E5A', c: '#8ED17F', d: '#FFD98A', e: '#0C1B2A' },
    cssVars: { '--r-sky-top': '#0C1B2A', '--r-sky-bot': '#2B5940', '--r-ground': '#173626',
               '--r-glow': '#FFD98A', '--r-ink': '#08160F' },
    art: 'realm2',
    particles: { kind: 'fireflies', count: 70, drift: 8, rise: -3, size: [1.4, 3.2], colour: '#FFD98A', alpha: [0.2, 1] },
    ambient: { rays: 0.55, rayColour: '#BFE9A8', fog: 0.34, fogColour: '#2B5940', vignette: 0.58 },
    collectibles: ['reedPipes', 'owlFeather', 'ambrosia', 'drachma', 'fleeceTuft', 'laurelCrown'],
    npcs: ['dryad', 'myrmeke', 'wolf', 'satyr'],
    transitionOut: 'waveCrash',
    runSpeed: 300,
  },

  {
    id: 3,
    name: 'The Sea & Shore',
    subtitle: 'Down past the surf line · keep breathing',
    palette: { a: '#0A2A43', b: '#1E7A8C', c: '#4FD1D9', d: '#F7C9C0', e: '#EDE6F2' },
    cssVars: { '--r-sky-top': '#041A2C', '--r-sky-bot': '#1E7A8C', '--r-ground': '#0A2A43',
               '--r-glow': '#4FD1D9', '--r-ink': '#02121F' },
    art: 'realm3',
    particles: { kind: 'bubbles', count: 80, drift: 5, rise: -34, size: [1.5, 5], colour: '#CFF8FF', alpha: [0.12, 0.6] },
    ambient: { rays: 0.7, rayColour: '#9FF0FF', fog: 0.30, fogColour: '#1E7A8C', vignette: 0.5, caustics: 0.55 },
    collectibles: ['bluePearl', 'riptide', 'nectar', 'drachma', 'irisPrism', 'wingedSandal'],
    npcs: ['hippocampus', 'naiad', 'jellyfish', 'fishSchool'],
    transitionOut: 'whirlpool',
    runSpeed: 270,
  },

  {
    id: 4,
    name: 'The Underworld',
    subtitle: 'Across the Styx · the Fields of Asphodel',
    palette: { a: '#0B0A10', b: '#E8E2D0', c: '#FF6B35', d: '#9B6BD9', e: '#4EE59A' },
    cssVars: { '--r-sky-top': '#07060B', '--r-sky-bot': '#171225', '--r-ground': '#100D18',
               '--r-glow': '#9B6BD9', '--r-ink': '#040306' },
    art: 'realm4',
    particles: { kind: 'ash', count: 110, drift: 10, rise: 16, size: [1, 2.8], colour: '#E8E2D0', alpha: [0.1, 0.45] },
    ambient: { rays: 0.3, rayColour: '#9B6BD9', fog: 0.42, fogColour: '#171225', vignette: 0.7 },
    collectibles: ['pomegranateSeed', 'styxVial', 'drachma', 'helm', 'bronzeGear', 'owlFeather'],
    npcs: ['spirit', 'cerberus', 'charon', 'spirit'],
    transitionOut: 'lightningWhite',
    runSpeed: 250,
  },

  {
    id: 5,
    name: 'Mount Olympus',
    subtitle: 'Six hundred floors above Manhattan',
    palette: { a: '#FDFBF5', b: '#E3B23C', c: '#F5CBD8', d: '#7B5FC4', e: '#8FE3F2' },
    cssVars: { '--r-sky-top': '#7B5FC4', '--r-sky-bot': '#F5CBD8', '--r-ground': '#FDFBF5',
               '--r-glow': '#FFF3C4', '--r-ink': '#4A3A5E' },
    art: 'realm5',
    particles: { kind: 'motes', count: 95, drift: 14, rise: -10, size: [1, 3.4], colour: '#FFF6D8', alpha: [0.2, 0.8] },
    ambient: { rays: 1.0, rayColour: '#FFF3C4', fog: 0.22, fogColour: '#F5CBD8', vignette: 0.3, bloom: 0.8 },
    collectibles: ['lightningShard', 'laurelCrown', 'nectar', 'lyreString', 'bronzeGear', 'irisPrism'],
    npcs: ['pegasus', 'hestia', 'muse', 'eagle'],
    transitionOut: 'skyDescent',
    runSpeed: 320,
  },

];
