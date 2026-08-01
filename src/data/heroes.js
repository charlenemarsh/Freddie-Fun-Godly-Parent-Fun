/* ===========================================================================
   heroes.js — THE FIVE HEROES YOU CAN PLAY AS
   ---------------------------------------------------------------------------
   SAFE TO EDIT WITHOUT CODING. Pure content.

   Important: which hero you pick changes NOTHING about your result. It is
   pure flavour — the game never says so, and it never should.

   Each hero has:
     lane          which direction on the character-select plus (UP/RIGHT/DOWN/LEFT/CENTRE)
     name          displayed name
     palette       {skin, hair, top, bottom, accent, trim} — colours the shared rig
     hairStyle     which hair shape the rig draws: curls, straight, mop, ponytail, short
     prop          what they carry: pen, knife, pipes, spear, sword
     signatureFx   the effect that follows them around (Tier 2)
     flavourLine   types out under their pedestal on the select screen
     accentHud     tints the HUD in their colour
   =========================================================================== */

const HEROES = {

  percy: {
    key: 'percy',
    lane: 'CENTRE',
    name: 'Percy Jackson',
    palette: { skin: '#C98A5E', hair: '#241C1A', top: '#E87A2C', bottom: '#2F4763', accent: '#4FD1D9', trim: '#F7EBD3' },
    hairStyle: 'mop',
    prop: 'pen',
    signatureFx: 'water',
    flavourLine: 'The sea does not like to be restrained.',
    accentHud: '#4FD1D9',
  },

  annabeth: {
    key: 'annabeth',
    lane: 'UP',
    name: 'Annabeth Chase',
    palette: { skin: '#E0B48C', hair: '#E8C15E', top: '#E87A2C', bottom: '#4A5560', accent: '#C8CFD6', trim: '#F2E2A8' },
    hairStyle: 'curls',
    prop: 'knife',
    signatureFx: 'blueprint',
    flavourLine: 'You have to see the whole building before you lay one brick.',
    accentHud: '#C8CFD6',
  },

  grover: {
    key: 'grover',
    lane: 'LEFT',
    name: 'Grover Underwood',
    palette: { skin: '#B9784A', hair: '#5A3A22', top: '#3E8E5A', bottom: '#6B5236', accent: '#8ED17F', trim: '#E2543A' },
    hairStyle: 'curlsShort',
    prop: 'pipes',
    signatureFx: 'bloom',
    flavourLine: 'Everything living is talking. Most people just do not listen.',
    accentHud: '#8ED17F',
  },

  clarisse: {
    key: 'clarisse',
    lane: 'RIGHT',
    name: 'Clarisse La Rue',
    palette: { skin: '#8E5A3C', hair: '#3A2418', top: '#B33A2A', bottom: '#3A3A3A', accent: '#E2543A', trim: '#F2B544' },
    hairStyle: 'ponytail',
    prop: 'spear',
    signatureFx: 'sparks',
    flavourLine: 'Talk later. Move now.',
    accentHud: '#E2543A',
  },

  luke: {
    key: 'luke',
    lane: 'DOWN',
    name: 'Luke Castellan',
    palette: { skin: '#D9A46F', hair: '#C79A54', top: '#E87A2C', bottom: '#454F5C', accent: '#9B6BD9', trim: '#C8CFD6' },
    hairStyle: 'short',
    prop: 'sword',
    signatureFx: 'shadowstep',
    flavourLine: 'Everyone here is somebody\'s unfinished business.',
    accentHud: '#9B6BD9',
  },

};

const HERO_KEYS = ['percy', 'annabeth', 'grover', 'clarisse', 'luke'];
