/* ===========================================================================
   symbols.js — every drawing in the game
   ---------------------------------------------------------------------------
   All artwork is hand-authored SVG, written here, inline in the file. Nothing
   is fetched, traced, or borrowed. These are original interpretations of
   public-domain Greek mythology.

   Contents
     1. helpers
     2. option art — the 75 illustrations, one per answer  (Art.*)
     3. collectibles — the things you pick up in the lanes (Collect.*)
     4. god symbols — the sigil that ignites at the claiming (Sigil.*)
     5. creatures — sacred animals and the NPCs beside the path (Beast.*)
     6. UI glyphs — chevrons, sound, motion, the title crest  (Glyph.*)

   Every drawing must move. A still picture is a bug: use the .a-* animation
   classes from 01-styles.css, and stagger them with an inline
   style="animation-delay:-1.7s" so nothing pulses in lockstep.
   =========================================================================== */

/* ---- 1. helpers -------------------------------------------------------- */

let _uid = 0;
const uid = (p) => (p || 'x') + (++_uid).toString(36);

/* wrap inner markup as a square SVG */
function svgBox(inner, vb) {
  return '<svg viewBox="' + (vb || '0 0 100 100') + '" fill="none" ' +
         'xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
         inner + '</svg>';
}
/* a random-looking but stable delay so a grid of art never pulses in sync */
const dly = (n) => ' style="animation-delay:' + (-(n * 0.37) % 5).toFixed(2) + 's"';

/* linear gradient */
function lg(id, stops, x1, y1, x2, y2) {
  return '<linearGradient id="' + id + '" x1="' + (x1 || 0) + '" y1="' + (y1 || 0) +
    '" x2="' + (x2 || 0) + '" y2="' + (y2 === undefined ? 1 : y2) + '">' +
    stops.map((s) => '<stop offset="' + s[0] + '" stop-color="' + s[1] +
      (s[2] !== undefined ? '" stop-opacity="' + s[2] : '') + '"/>').join('') +
    '</linearGradient>';
}
/* radial gradient */
function rg(id, stops, cx, cy, r) {
  return '<radialGradient id="' + id + '" cx="' + (cx || 0.5) + '" cy="' + (cy || 0.5) +
    '" r="' + (r || 0.5) + '">' +
    stops.map((s) => '<stop offset="' + s[0] + '" stop-color="' + s[1] +
      (s[2] !== undefined ? '" stop-opacity="' + s[2] : '') + '"/>').join('') +
    '</radialGradient>';
}
/* the soft glow disc that sits behind most option art */
function halo(colour, cx, cy, r, op) {
  const g = uid('h');
  return '<defs>' + rg(g, [[0, colour, op === undefined ? 0.75 : op], [1, colour, 0]]) + '</defs>' +
    '<circle cx="' + (cx || 50) + '" cy="' + (cy || 50) + '" r="' + (r || 46) +
    '" fill="url(#' + g + ')" class="a-shimmer"' + dly(cx || 3) + '/>';
}
/* a repeating tile pattern, used by the pattern questions */
function tile(id, w, h, inner) {
  return '<pattern id="' + id + '" width="' + w + '" height="' + h +
    '" patternUnits="userSpaceOnUse">' + inner + '</pattern>';
}

/* =========================================================================
   2. OPTION ART — the 75 illustrations
   ========================================================================= */

const Art = {};

/* ---- Q1 · bead cords (pure visual) ------------------------------------ */

function beadCord(main, light, dark) {
  const gBead = uid('b'), gGlow = uid('b');
  // beads sit ON the cord, so work out where the cord actually is:
  // one quadratic curve from (16,28) through (50,84) to (84,28)
  const at = (t) => ({
    x: (1 - t) * (1 - t) * 16 + 2 * (1 - t) * t * 50 + t * t * 84,
    y: (1 - t) * (1 - t) * 28 + 2 * (1 - t) * t * 84 + t * t * 28,
  });
  let beads = '';
  const N = 7;
  for (let i = 0; i < N; i++) {
    const t = 0.09 + (i / (N - 1)) * 0.82;
    const p = at(t);
    const r = 8.4 - Math.abs(i - (N - 1) / 2) * 0.5;
    beads += '<g class="a-shimmer"' + dly(i * 3.1) + '>' +
      '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + r.toFixed(1) +
        '" fill="url(#' + gBead + ')"/>' +
      '<circle cx="' + (p.x - r * 0.3).toFixed(1) + '" cy="' + (p.y - r * 0.34).toFixed(1) +
        '" r="' + (r * 0.28).toFixed(1) + '" fill="' + light + '" opacity=".85"/></g>';
  }
  return svgBox(
    '<defs>' +
      rg(gBead, [[0, light], [0.5, main], [1, dark]], 0.34, 0.3, 0.78) +
      rg(gGlow, [[0, main, 0.55], [1, main, 0]]) +
    '</defs>' +
    '<circle cx="50" cy="52" r="50" fill="url(#' + gGlow + ')" class="a-shimmer"/>' +
    '<g class="a-sway" style="transform-origin:50% 14%">' +
      // the leather cord itself
      '<path d="M16 28 Q50 84 84 28" stroke="' + dark + '" stroke-width="3.4" fill="none" ' +
        'stroke-linecap="round"/>' +
      '<path d="M16 28 Q50 84 84 28" stroke="' + light + '" stroke-width="1" fill="none" ' +
        'opacity=".35"/>' +
      beads +
      // the knot at the top, so it reads as a thing you wear
      '<path d="M16 28 q-5 -8 2 -12 M84 28 q5 -8 -2 -12" stroke="' + dark + '" stroke-width="3" ' +
        'fill="none" stroke-linecap="round"/>' +
      '<circle cx="50" cy="12" r="5.4" fill="' + dark + '"/>' +
      '<circle cx="48.4" cy="10.6" r="1.8" fill="' + light + '" opacity=".7"/>' +
    '</g>');
}

Art.swatch = {
  stormWhite:   () => beadCord('#E8E4F0', '#FFFFFF', '#7B5FC4'),
  warRed:       () => beadCord('#E2543A', '#FFB98A', '#7A1F16'),
  deepTeal:     () => beadCord('#1E7A8C', '#7CE7F0', '#062334'),
  harvestGreen: () => beadCord('#5EA85C', '#B8EFA4', '#1D4A2C'),
  sunGold:      () => beadCord('#F2B544', '#FFF0BF', '#8A5A12'),
};

/* ---- Q2 + Q7 · places -------------------------------------------------- */

Art.scene = {};

Art.scene.climbingWall = () => {
  const g = uid('cw'), l = uid('cw');
  return svgBox(
    '<defs>' + lg(g, [[0, '#6A6560'], [1, '#33302C']]) +
      lg(l, [[0, '#FFD98A'], [0.5, '#FF6B35'], [1, '#B2200A']]) + '</defs>' +
    halo('#E2543A', 50, 52, 44, 0.42) +
    '<path d="M20 88 L26 16 L74 16 L80 88 Z" fill="url(#' + g + ')"/>' +
    '<path d="M52 16 L74 16 L80 88 L56 88 Z" fill="url(#' + l + ')" opacity=".92" class="a-flicker"/>' +
    // lava sheeting down one face
    '<path d="M56 20 q5 12 1 22 q-4 12 3 24 q4 10 0 20" stroke="#FFF0BF" stroke-width="1.6" ' +
      'opacity=".8" class="a-flicker"' + dly(2) + '/>' +
    // handholds
    '<g fill="#F2B544">' +
      '<circle cx="32" cy="34" r="3"/><circle cx="42" cy="52" r="2.6"/>' +
      '<circle cx="30" cy="66" r="2.8"/><circle cx="44" cy="76" r="2.4"/>' +
    '</g>' +
    '<g class="a-bob"><circle cx="37" cy="44" r="4.6" fill="#2E3A46"/>' +
      '<path d="M33 48 l-4 8 M41 48 l4 7 M32 43 l-6 -3 M42 43 l6 -5" ' +
        'stroke="#2E3A46" stroke-width="2.6" stroke-linecap="round"/></g>' +
    '<rect x="14" y="86" width="72" height="6" rx="2" fill="#3F5B34"/>');
};

Art.scene.forge = () => {
  const g = uid('fg');
  return svgBox(
    '<defs>' + rg(g, [[0, '#FFF3C4'], [0.4, '#FF8A3D'], [1, '#5A1E08', 0]]) + '</defs>' +
    halo('#FF8A3D', 50, 58, 44, 0.5) +
    '<rect x="14" y="60" width="72" height="30" rx="4" fill="#4A382B"/>' +
    '<rect x="20" y="52" width="60" height="12" rx="3" fill="#6B5340"/>' +
    '<ellipse cx="50" cy="58" rx="22" ry="10" fill="url(#' + g + ')" class="a-flicker"/>' +
    // anvil
    '<path d="M36 78 h28 l-4 6 h-20 z" fill="#8A8078"/>' +
    '<rect x="44" y="84" width="12" height="6" fill="#6E655E"/>' +
    // hammer mid-swing
    '<g class="a-swayFast" style="transform-origin:66% 88%">' +
      '<rect x="60" y="42" width="4" height="34" rx="2" fill="#7A5A34" transform="rotate(24 62 76)"/>' +
      '<rect x="52" y="34" width="18" height="10" rx="2" fill="#9A9188" transform="rotate(24 62 76)"/>' +
    '</g>' +
    // sparks
    '<g fill="#FFE9AE">' +
      '<circle cx="44" cy="52" r="1.4" class="a-rise"' + dly(1) + '/>' +
      '<circle cx="54" cy="50" r="1.1" class="a-rise"' + dly(4) + '/>' +
      '<circle cx="60" cy="55" r="1.3" class="a-rise"' + dly(7) + '/>' +
    '</g>' +
    '<path d="M22 52 v-22 h8 v22" stroke="#4A382B" stroke-width="3" fill="none"/>');
};

Art.scene.canoeLake = () => {
  const g = uid('cl'), s = uid('cl');
  return svgBox(
    '<defs>' + lg(g, [[0, '#8FD6E8'], [1, '#1E6B8C']]) +
      lg(s, [[0, '#FFF3C4'], [1, '#F2B544']]) + '</defs>' +
    halo('#87C5E8', 50, 54, 44, 0.5) +
    '<rect x="8" y="46" width="84" height="44" rx="6" fill="url(#' + g + ')"/>' +
    '<circle cx="72" cy="30" r="11" fill="url(#' + s + ')" class="a-pulse"/>' +
    // sun track on the water
    '<g class="a-flow">' +
      '<path d="M-6 60 q10 -3 20 0 t20 0 t20 0 t20 0 t20 0" stroke="#FFF0BF" ' +
        'stroke-width="1.8" opacity=".55" fill="none"/>' +
      '<path d="M-6 70 q10 3 20 0 t20 0 t20 0 t20 0 t20 0" stroke="#CFF3FF" ' +
        'stroke-width="1.4" opacity=".4" fill="none"/>' +
    '</g>' +
    '<g class="a-bob">' +
      '<path d="M28 62 q22 12 44 0 q-6 9 -22 9 t-22 -9z" fill="#C4682E"/>' +
      '<path d="M32 63 q18 8 36 0" stroke="#8A4418" stroke-width="1.4" fill="none"/>' +
      '<path d="M46 62 l-8 -12" stroke="#8A6238" stroke-width="2.2" stroke-linecap="round"/>' +
    '</g>' +
    '<path d="M0 46 h100" stroke="#2E6B4F" stroke-width="3"/>' +
    '<path d="M0 46 q14 -8 26 -1 q12 -9 24 -1 q14 -8 26 0 q12 -6 24 2" fill="#2E6B4F" opacity=".85"/>');
};

Art.scene.strawberryFields = () => {
  let rows = '';
  for (let i = 0; i < 4; i++) {
    const y = 56 + i * 10, sc = 1 + i * 0.12;
    rows += '<g class="a-sway"' + dly(i * 5) + ' style="transform-origin:50% ' + y + 'px">' +
      '<path d="M6 ' + y + ' q22 -6 44 0 t44 0" stroke="#2E6B4F" stroke-width="' + (2.4 * sc) +
        '" fill="none" opacity=".9"/>';
    for (let j = 0; j < 5; j++) {
      const x = 14 + j * 18 + (i % 2) * 6;
      rows += '<circle cx="' + x + '" cy="' + (y - 2) + '" r="' + (2.2 * sc) + '" fill="#E2543A"/>' +
        '<path d="M' + (x - 2.6) + ' ' + (y - 4.6) + ' h5.2" stroke="#1D4A2C" stroke-width="1.4"/>';
    }
    rows += '</g>';
  }
  return svgBox(
    '<defs>' + lg(uid('sf'), []) + '</defs>' +
    halo('#8ED17F', 50, 56, 44, 0.42) +
    '<rect x="0" y="0" width="100" height="52" fill="#9BD8F0" opacity=".55"/>' +
    '<path d="M0 52 q26 -14 50 -6 t50 4 v46 H0z" fill="#5E8B4C"/>' +
    '<circle cx="76" cy="20" r="9" fill="#FFE9AE" opacity=".85" class="a-pulse"/>' +
    rows);
};

Art.scene.libraryLoft = () => {
  let books = '';
  const cols = ['#8A3A2A', '#2E5B6B', '#7A6A2A', '#4A3A6B', '#3A6B4A'];
  for (let s = 0; s < 3; s++) {
    for (let i = 0; i < 9; i++) {
      const x = 20 + i * 6.6, y = 24 + s * 20;
      books += '<rect x="' + x + '" y="' + (y + (i % 3)) + '" width="5" height="' + (15 - (i % 3)) +
        '" rx="1" fill="' + cols[(i + s) % 5] + '" opacity=".95"/>';
    }
  }
  return svgBox(
    halo('#F2B544', 50, 48, 44, 0.4) +
    '<rect x="12" y="14" width="76" height="72" rx="4" fill="#3A2E22"/>' +
    books +
    '<g stroke="#5A4632" stroke-width="2.4">' +
      '<path d="M14 41 h72"/><path d="M14 61 h72"/><path d="M14 81 h72"/>' +
    '</g>' +
    // a candle, and dust in its light
    '<rect x="72" y="66" width="4" height="13" fill="#EDE0C4"/>' +
    '<ellipse cx="74" cy="63" rx="2.6" ry="4.4" fill="#FFD98A" class="a-flicker"/>' +
    '<g fill="#FFF0BF" opacity=".8">' +
      '<circle cx="66" cy="56" r="1" class="a-rise"' + dly(2) + '/>' +
      '<circle cx="78" cy="52" r=".9" class="a-rise"' + dly(6) + '/>' +
    '</g>' +
    // an owl watching from the top shelf
    '<g class="a-bob"><ellipse cx="26" cy="18" rx="6" ry="7" fill="#8A7A62"/>' +
      '<circle cx="23.6" cy="16" r="2" fill="#FFF3C4" class="a-blink"/>' +
      '<circle cx="28.4" cy="16" r="2" fill="#FFF3C4" class="a-blink"' + dly(1) + '/>' +
      '<circle cx="23.6" cy="16" r=".9" fill="#241C1A"/><circle cx="28.4" cy="16" r=".9" fill="#241C1A"/>' +
      '<path d="M26 18.5 l-1.6 2 h3.2z" fill="#E3B23C"/></g>');
};

Art.scene.sunShaft = () => {
  const g = uid('ss');
  return svgBox(
    '<defs>' + lg(g, [[0, '#FFF3C4', 0.95], [1, '#4FD1D9', 0]]) + '</defs>' +
    '<rect x="0" y="0" width="100" height="100" fill="#0E4A63"/>' +
    '<path d="M34 0 h32 l22 100 h-76z" fill="url(#' + g + ')" class="a-shimmer"/>' +
    '<circle cx="50" cy="6" r="13" fill="#FFF6DA" opacity=".9" class="a-pulse"/>' +
    '<g class="a-flow" opacity=".5">' +
      '<path d="M0 22 q12 -5 24 0 t24 0 t24 0 t24 0" stroke="#CFF8FF" stroke-width="1.4" fill="none"/>' +
    '</g>' +
    '<g fill="#CFF8FF" opacity=".7">' +
      '<circle cx="42" cy="70" r="1.8" class="a-rise"' + dly(1) + '/>' +
      '<circle cx="56" cy="80" r="1.4" class="a-rise"' + dly(5) + '/>' +
      '<circle cx="49" cy="60" r="1.1" class="a-rise"' + dly(8) + '/>' +
    '</g>');
};

Art.scene.kelpCathedral = () => {
  let kelp = '';
  for (let i = 0; i < 7; i++) {
    const x = 10 + i * 13.5;
    kelp += '<g class="a-sway"' + dly(i * 4) + ' style="transform-origin:' + x + 'px 100px">' +
      '<path d="M' + x + ' 100 q' + (i % 2 ? 8 : -8) + ' -34 ' + (i % 2 ? -3 : 3) + ' -66" ' +
      'stroke="#3E8E5A" stroke-width="' + (3.6 - i * 0.2) + '" stroke-linecap="round" fill="none" opacity=".92"/>' +
      '<path d="M' + x + ' 76 l6 -3 M' + x + ' 56 l-6 -3 M' + x + ' 38 l6 -3" ' +
      'stroke="#8ED17F" stroke-width="2" stroke-linecap="round"/></g>';
  }
  return svgBox(
    '<rect width="100" height="100" fill="#0A3A48"/>' +
    halo('#8ED17F', 50, 40, 42, 0.4) +
    '<path d="M22 0 h10 L28 100 h-14z" fill="#CFF8FF" opacity=".14" class="a-shimmer"/>' +
    '<path d="M64 0 h12 L78 100 h-16z" fill="#CFF8FF" opacity=".12" class="a-shimmer"' + dly(3) + '/>' +
    kelp);
};

Art.scene.darkTrench = () => {
  const g = uid('dt');
  return svgBox(
    '<defs>' + rg(g, [[0, '#4EE59A', 0.5], [1, '#020A10', 0]], 0.5, 0.9, 0.7) + '</defs>' +
    '<rect width="100" height="100" fill="#02101A"/>' +
    '<path d="M0 30 L34 100 h32 L100 30 v70 H0z" fill="#010A12"/>' +
    '<path d="M0 30 L34 100 M100 30 L66 100" stroke="#1E5A6B" stroke-width="1.6" opacity=".6"/>' +
    '<ellipse cx="50" cy="92" rx="34" ry="16" fill="url(#' + g + ')" class="a-pulse"/>' +
    // things that glow down there
    '<g fill="#4FD1D9">' +
      '<circle cx="40" cy="76" r="1.6" class="a-shimmer"' + dly(1) + '/>' +
      '<circle cx="58" cy="84" r="1.2" class="a-shimmer"' + dly(4) + '/>' +
      '<circle cx="50" cy="66" r="1" class="a-shimmer"' + dly(7) + '/>' +
    '</g>' +
    '<g fill="#CFF8FF" opacity=".45">' +
      '<circle cx="30" cy="60" r="1.2" class="a-rise"' + dly(2) + '/>' +
      '<circle cx="70" cy="52" r="1" class="a-rise"' + dly(6) + '/>' +
    '</g>');
};

Art.scene.sunkenShip = () => svgBox(
  '<rect width="100" height="100" fill="#0A3040"/>' +
  halo('#1E7A8C', 50, 56, 44, 0.42) +
  '<g class="a-sway" style="transform-origin:50% 88%">' +
    '<path d="M18 66 q32 16 64 0 l-8 20 h-48z" fill="#5A4030"/>' +
    '<path d="M22 68 q28 12 56 0" stroke="#3A2A1E" stroke-width="1.6" fill="none"/>' +
    '<rect x="46" y="30" width="4" height="38" fill="#6B4E38" transform="rotate(-8 48 66)"/>' +
    '<path d="M48 34 q18 6 14 22 q-10 -8 -16 -6z" fill="#C9BFA6" opacity=".7" class="a-shimmer"/>' +
    // shields along the rail
    '<g fill="#8A7A4A"><circle cx="30" cy="70" r="3.4"/><circle cx="42" cy="74" r="3.4"/>' +
      '<circle cx="58" cy="74" r="3.4"/><circle cx="70" cy="70" r="3.4"/></g>' +
  '</g>' +
  '<g fill="#CFF8FF" opacity=".5">' +
    '<circle cx="36" cy="50" r="1.4" class="a-rise"' + dly(3) + '/>' +
    '<circle cx="66" cy="44" r="1.1" class="a-rise"' + dly(7) + '/>' +
  '</g>');

Art.scene.pearlCavern = () => {
  const g = uid('pc');
  let pearls = '';
  [[34, 62, 7], [52, 70, 9], [68, 60, 6], [44, 78, 5], [62, 80, 4]].forEach((p, i) => {
    pearls += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + p[2] +
      '" fill="url(#' + g + ')" class="a-bob"' + dly(i * 3) + '/>' +
      '<circle cx="' + (p[0] - p[2] * .32) + '" cy="' + (p[1] - p[2] * .38) + '" r="' + (p[2] * .26) +
      '" fill="#fff" opacity=".85"/>';
  });
  return svgBox(
    '<defs>' + rg(g, [[0, '#FFFFFF'], [0.45, '#F7C9C0'], [1, '#B98CB4']], 0.35, 0.3, 0.8) + '</defs>' +
    '<rect width="100" height="100" fill="#123A4E"/>' +
    halo('#F7C9C0', 50, 62, 46, 0.5) +
    '<path d="M0 0 h100 v28 q-16 6 -24 -4 q-12 14 -26 2 q-14 12 -26 -2 q-12 8 -24 2z" fill="#0A2A3A"/>' +
    '<path d="M0 100 h100 v-16 q-18 -8 -30 2 q-16 -10 -30 0 q-16 -8 -40 4z" fill="#0A2A3A"/>' +
    pearls);
};

/* ---- Q4 · animals ------------------------------------------------------ */

Art.animal = {};

Art.animal.hawk = () => svgBox(
  halo('#C8CFD6', 50, 48, 44, 0.36) +
  '<g class="a-breathe">' +
    '<path d="M50 30 q22 6 30 30 q-16 -8 -30 -6z" fill="#6B5A44"/>' +
    '<path d="M50 30 q-22 6 -30 30 q16 -8 30 -6z" fill="#7A6850"/>' +
    '<ellipse cx="50" cy="46" rx="12" ry="20" fill="#8A7660"/>' +
    '<path d="M40 52 q10 6 20 0 q-8 12 -20 0z" fill="#C9BCA4"/>' +
    '<circle cx="50" cy="26" r="10" fill="#9A8770"/>' +
    '<path d="M42 22 q8 -6 16 0 q-8 -3 -16 0z" fill="#6B5A44"/>' +
    '<circle cx="46" cy="25" r="2.6" fill="#F2B544" class="a-blink"/>' +
    '<circle cx="54" cy="25" r="2.6" fill="#F2B544" class="a-blink"' + dly(1) + '/>' +
    '<circle cx="46" cy="25" r="1.2" fill="#120E0A"/><circle cx="54" cy="25" r="1.2" fill="#120E0A"/>' +
    '<path d="M50 29 l-4 4 l4 3 l4 -3z" fill="#E3B23C"/>' +
    '<path d="M44 66 v8 M56 66 v8" stroke="#E3B23C" stroke-width="2.4" stroke-linecap="round"/>' +
  '</g>');

Art.animal.boar = () => svgBox(
  halo('#E2543A', 50, 54, 44, 0.34) +
  '<g class="a-breathe">' +
    '<ellipse cx="52" cy="54" rx="28" ry="19" fill="#4A3A30"/>' +
    '<path d="M28 44 q8 -12 22 -8" stroke="#2E241C" stroke-width="3" fill="none"/>' +
    '<ellipse cx="26" cy="52" rx="14" ry="12" fill="#5A483C"/>' +
    '<ellipse cx="15" cy="55" rx="6" ry="5" fill="#7A5F4E"/>' +
    '<circle cx="13" cy="54" r="1.2" fill="#241C16"/><circle cx="17" cy="56" r="1.2" fill="#241C16"/>' +
    '<circle cx="26" cy="47" r="2.2" fill="#F2B544" class="a-blink"/>' +
    '<circle cx="26" cy="47" r="1" fill="#180F0A"/>' +
    // tusks
    '<path d="M18 60 q-5 -2 -4 -8" stroke="#EDE0C4" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
    '<path d="M23 61 q-4 -1 -3 -6" stroke="#EDE0C4" stroke-width="2" stroke-linecap="round" fill="none"/>' +
    '<path d="M22 40 l3 -6 l3 6z" fill="#2E241C"/>' +
    // legs + a flicking tail
    '<g stroke="#3A2C24" stroke-width="5" stroke-linecap="round">' +
      '<path d="M38 70 v10"/><path d="M50 72 v9"/><path d="M62 70 v10"/><path d="M72 66 v12"/></g>' +
    '<path d="M79 48 q7 -3 5 -10" stroke="#3A2C24" stroke-width="2.4" fill="none" ' +
      'class="a-tail" style="transform-origin:79px 48px"/>' +
    // scars
    '<path d="M44 44 l7 4 M56 42 l6 5" stroke="#8A6250" stroke-width="1.4" opacity=".8"/>' +
  '</g>');

Art.animal.hellhoundPup = () => svgBox(
  halo('#9B6BD9', 50, 54, 44, 0.42) +
  '<g class="a-breathe">' +
    '<ellipse cx="52" cy="62" rx="22" ry="16" fill="#1A1520"/>' +
    '<circle cx="34" cy="48" r="16" fill="#221B2A"/>' +
    '<path d="M22 38 l-3 -14 l13 7z" fill="#1A1520"/>' +
    '<path d="M46 36 l4 -14 l9 11z" fill="#1A1520"/>' +
    '<ellipse cx="21" cy="52" rx="7" ry="5.4" fill="#2E2438"/>' +
    '<circle cx="17" cy="51" r="1.8" fill="#0A0810"/>' +
    // ember eyes, blinking out of step
    '<circle cx="28" cy="45" r="3.4" fill="#FF6B35" class="a-blink"/>' +
    '<circle cx="40" cy="44" r="3.4" fill="#FF6B35" class="a-blink"' + dly(2) + '/>' +
    '<circle cx="28" cy="45" r="1.4" fill="#FFE9AE"/><circle cx="40" cy="44" r="1.4" fill="#FFE9AE"/>' +
    '<g stroke="#1A1520" stroke-width="6" stroke-linecap="round">' +
      '<path d="M40 74 v8"/><path d="M52 76 v7"/><path d="M64 74 v8"/></g>' +
    '<path d="M72 56 q10 -6 6 -16" stroke="#1A1520" stroke-width="3.4" fill="none" ' +
      'class="a-tail" style="transform-origin:72px 56px"/>' +
    '<path d="M24 58 q5 4 10 1" stroke="#9B6BD9" stroke-width="1.6" fill="none" opacity=".8"/>' +
  '</g>');

Art.animal.stag = () => svgBox(
  halo('#FFF0BF', 50, 50, 44, 0.44) +
  '<g class="a-breathe">' +
    // antlers
    '<g stroke="#E8DCC0" stroke-width="2.6" stroke-linecap="round" fill="none" class="a-sway" ' +
      'style="transform-origin:50% 40%">' +
      '<path d="M42 30 q-6 -12 -3 -20 M39 18 l-7 -5 M40 24 l-8 -2 M41 12 l4 -6"/>' +
      '<path d="M58 30 q6 -12 3 -20 M61 18 l7 -5 M60 24 l8 -2 M59 12 l-4 -6"/>' +
    '</g>' +
    '<ellipse cx="52" cy="66" rx="24" ry="15" fill="#EDE4D2"/>' +
    '<ellipse cx="44" cy="42" rx="9" ry="12" fill="#F5EEE0"/>' +
    '<ellipse cx="42" cy="50" rx="5.4" ry="4.4" fill="#E0D4BE"/>' +
    '<circle cx="39" cy="50" r="1.4" fill="#3A2C22"/>' +
    '<circle cx="40" cy="40" r="2.4" fill="#3A2C22" class="a-blink"/>' +
    '<path d="M50 34 q6 -3 7 3" stroke="#E0D4BE" stroke-width="4" stroke-linecap="round"/>' +
    '<g stroke="#EDE4D2" stroke-width="4.4" stroke-linecap="round">' +
      '<path d="M40 78 v10"/><path d="M52 80 v8"/><path d="M64 78 v10"/><path d="M72 74 v12"/></g>' +
    '<circle cx="60" cy="62" r="2" fill="#D8CCB4"/><circle cx="68" cy="68" r="1.6" fill="#D8CCB4"/>' +
  '</g>');

Art.animal.owl = () => svgBox(
  halo('#C8CFD6', 50, 50, 44, 0.4) +
  '<g class="a-breathe">' +
    '<ellipse cx="50" cy="58" rx="24" ry="28" fill="#7A6E5C"/>' +
    '<path d="M28 44 q22 -20 44 0 q-6 -22 -22 -22 t-22 22z" fill="#8A7E6A"/>' +
    '<path d="M30 20 l6 12 l-10 2z" fill="#7A6E5C"/>' +
    '<path d="M70 20 l-6 12 l10 2z" fill="#7A6E5C"/>' +
    '<circle cx="41" cy="44" r="10" fill="#C9BCA4"/>' +
    '<circle cx="59" cy="44" r="10" fill="#C9BCA4"/>' +
    '<g class="a-blink" style="transform-origin:50% 44%">' +
      '<circle cx="41" cy="44" r="6.6" fill="#F2B544"/>' +
      '<circle cx="59" cy="44" r="6.6" fill="#F2B544"/>' +
      '<circle cx="41" cy="44" r="3.2" fill="#150F0A"/>' +
      '<circle cx="59" cy="44" r="3.2" fill="#150F0A"/>' +
      '<circle cx="43" cy="42" r="1.2" fill="#fff" opacity=".9"/>' +
      '<circle cx="61" cy="42" r="1.2" fill="#fff" opacity=".9"/>' +
    '</g>' +
    '<path d="M50 48 l-4 6 l4 4 l4 -4z" fill="#E3B23C"/>' +
    '<g stroke="#5F5648" stroke-width="1.4" opacity=".8">' +
      '<path d="M38 66 q12 5 24 0"/><path d="M36 74 q14 6 28 0"/><path d="M40 82 q10 4 20 0"/></g>' +
    '<path d="M42 86 v5 M58 86 v5" stroke="#E3B23C" stroke-width="2.4" stroke-linecap="round"/>' +
  '</g>');

/* ---- Q5 + Q10 · patterns (these must move) ---------------------------- */

Art.pattern = {};

function patternCard(defs, patId, tint) {
  return svgBox('<defs>' + defs + '</defs>' +
    halo(tint, 50, 50, 46, 0.3) +
    '<rect x="8" y="8" width="84" height="84" rx="12" fill="#1A1510"/>' +
    '<rect x="8" y="8" width="84" height="84" rx="12" fill="url(#' + patId + ')"/>' +
    '<rect x="8" y="8" width="84" height="84" rx="12" fill="none" stroke="' + tint +
      '" stroke-width="1.4" opacity=".7"/>');
}

Art.pattern.lightningFracture = () => {
  const p = uid('p');
  return patternCard(
    tile(p, 34, 34,
      '<g class="a-flicker">' +
      '<path d="M14 0 L6 16 h8 L4 34" stroke="#FFF6C9" stroke-width="2" fill="none"/>' +
      '<path d="M30 4 L22 20 h7 L20 34" stroke="#E8E4F0" stroke-width="1.3" fill="none" opacity=".7"/>' +
      '</g>'), p, '#E8E4F0');
};

Art.pattern.honeycomb = () => {
  const p = uid('p');
  const hex = (x, y, o) => '<path d="M' + (x + 5) + ' ' + y + ' l5 3 v6 l-5 3 l-5 -3 v-6z" ' +
    'fill="none" stroke="#F2B544" stroke-width="1.5" opacity="' + o + '"/>';
  return patternCard(
    tile(p, 20, 24,
      '<g class="a-shimmer">' + hex(0, 0, 1) + hex(10, 12, .8) + hex(-10, 12, .8) + '</g>'),
    p, '#F2B544');
};

Art.pattern.webWeave = () => {
  const p = uid('p');
  return patternCard(
    tile(p, 40, 40,
      '<g class="a-shimmer" stroke="#C8CFD6" fill="none">' +
      '<path d="M20 20 L20 -4 M20 20 L44 20 M20 20 L20 44 M20 20 L-4 20 ' +
        'M20 20 L37 3 M20 20 L37 37 M20 20 L3 37 M20 20 L3 3" stroke-width=".8" opacity=".55"/>' +
      '<path d="M20 8 q9 3 12 12 q-3 9 -12 12 q-9 -3 -12 -12 q3 -9 12 -12z" stroke-width="1"/>' +
      '<path d="M20 1 q14 5 19 19 q-5 14 -19 19 q-14 -5 -19 -19 q5 -14 19 -19z" stroke-width=".9" opacity=".7"/>' +
      '</g>'), p, '#C8CFD6');
};

Art.pattern.oliveBranch = () => {
  const p = uid('p');
  return patternCard(
    tile(p, 30, 30,
      '<g class="a-sway" style="transform-origin:0 15px">' +
      '<path d="M0 22 q14 -10 30 -14" stroke="#5E8B4C" stroke-width="1.6" fill="none"/>' +
      '<ellipse cx="8" cy="16" rx="4" ry="2.2" fill="#8ED17F" transform="rotate(-30 8 16)"/>' +
      '<ellipse cx="17" cy="12" rx="4" ry="2.2" fill="#6EBF6A" transform="rotate(-24 17 12)"/>' +
      '<ellipse cx="25" cy="8" rx="4" ry="2.2" fill="#8ED17F" transform="rotate(-18 25 8)"/>' +
      '<circle cx="13" cy="19" r="2" fill="#3E6B3A"/><circle cx="22" cy="14" r="1.8" fill="#3E6B3A"/>' +
      '</g>'), p, '#8ED17F');
};

Art.pattern.meander = () => {
  const p = uid('p');
  return patternCard(
    tile(p, 28, 28,
      '<g class="a-flow">' +
      '<path d="M0 20 v-12 h20 v12 h-12 v-6 h6" stroke="#F2B544" stroke-width="2" fill="none"/>' +
      '<path d="M28 20 v-12" stroke="#F2B544" stroke-width="2" fill="none"/>' +
      '</g>'), p, '#F2B544');
};

Art.pattern.constellation = () => {
  const p = uid('p');
  return patternCard(
    tile(p, 44, 44,
      '<g class="a-shimmer">' +
      '<path d="M6 30 L16 14 L28 22 L38 8" stroke="#9B6BD9" stroke-width=".9" fill="none" opacity=".8"/>' +
      '<path d="M16 14 L22 34 L38 8" stroke="#7CD8F0" stroke-width=".7" fill="none" opacity=".55"/>' +
      '<circle cx="6" cy="30" r="1.8" fill="#FFF6DA"/><circle cx="16" cy="14" r="2.4" fill="#FFF6DA"/>' +
      '<circle cx="28" cy="22" r="1.5" fill="#E0C6FF"/><circle cx="38" cy="8" r="2.1" fill="#FFF6DA"/>' +
      '<circle cx="22" cy="34" r="1.3" fill="#7CD8F0"/>' +
      '</g>'), p, '#9B6BD9');
};

Art.pattern.bronzeScales = () => {
  const p = uid('p'), g = uid('sg');
  return patternCard(
    lg(g, [[0, '#FFD79A'], [0.5, '#C98A3D'], [1, '#6B4520']]) +
    tile(p, 22, 16,
      '<g class="a-shimmer">' +
      '<path d="M0 16 q5.5 -16 11 0 q5.5 -16 11 0" fill="url(#' + g + ')" opacity=".9"/>' +
      '<path d="M-11 8 q5.5 -16 11 0 q5.5 -16 11 0 q5.5 -16 11 0" fill="url(#' + g +
        ')" opacity=".65"/></g>'),
    p, '#FF8A3D');
};

Art.pattern.pomegranate = () => {
  const p = uid('p'), g = uid('pg');
  let seeds = '';
  [[8, 9], [15, 7], [22, 10], [11, 16], [19, 17], [26, 15], [6, 22], [15, 24], [24, 23]]
    .forEach((s, i) => {
      seeds += '<ellipse cx="' + s[0] + '" cy="' + s[1] + '" rx="2.8" ry="3.6" fill="url(#' + g +
        ')" class="a-shimmer"' + dly(i * 2.3) + ' transform="rotate(' + (i * 18 - 40) + ' ' +
        s[0] + ' ' + s[1] + ')"/>';
    });
  return patternCard(
    rg(g, [[0, '#FFB0A0'], [0.5, '#E2543A'], [1, '#7A1F16']], 0.35, 0.3, 0.8) +
    tile(p, 32, 32, seeds), p, '#E2543A');
};

Art.pattern.waves = () => {
  const p = uid('p');
  return patternCard(
    tile(p, 36, 20,
      '<g class="a-flow">' +
      '<path d="M0 14 q9 -11 18 0 t18 0 t18 0" stroke="#4FD1D9" stroke-width="2" fill="none"/>' +
      '<path d="M0 19 q9 -11 18 0 t18 0 t18 0" stroke="#1E7A8C" stroke-width="1.6" fill="none" opacity=".8"/>' +
      '<path d="M4 8 q6 -6 12 -1" stroke="#CFF8FF" stroke-width="1.2" fill="none" opacity=".7"/>' +
      '</g>'), p, '#4FD1D9');
};

Art.pattern.laurel = () => {
  const p = uid('p');
  let leaves = '';
  for (let i = 0; i < 6; i++) {
    leaves += '<ellipse cx="' + (4 + i * 6) + '" cy="' + (16 - i * 1.6) + '" rx="4.2" ry="2" ' +
      'fill="#D8C87A" opacity=".92" transform="rotate(' + (-24 - i * 3) + ' ' + (4 + i * 6) + ' ' +
      (16 - i * 1.6) + ')"/>';
    leaves += '<ellipse cx="' + (4 + i * 6) + '" cy="' + (24 - i * 1.6) + '" rx="4.2" ry="2" ' +
      'fill="#B8A44E" opacity=".85" transform="rotate(' + (24 + i * 3) + ' ' + (4 + i * 6) + ' ' +
      (24 - i * 1.6) + ')"/>';
  }
  return patternCard(
    tile(p, 36, 30,
      '<g class="a-sway" style="transform-origin:0 20px">' +
      '<path d="M0 20 q18 -6 36 -12" stroke="#8A7A2E" stroke-width="1.4" fill="none"/>' +
      leaves + '</g>'), p, '#E3B23C');
};

/* ---- Q8 · light and water (pure visual) -------------------------------- */

Art.light = {};

function waterCard(bg, inner, tint) {
  return svgBox(
    '<rect x="6" y="6" width="88" height="88" rx="14" fill="' + bg + '"/>' +
    '<g clip-path="inset(6px round 14px)">' + inner + '</g>' +
    '<rect x="6" y="6" width="88" height="88" rx="14" fill="none" stroke="' + tint +
      '" stroke-width="1.4" opacity=".7"/>');
}

Art.light.goldShafts = () => {
  const g = uid('gs');
  return waterCard('#0E4A5E',
    '<defs>' + lg(g, [[0, '#FFF6DA', 0.95], [1, '#FFF6DA', 0]]) + '</defs>' +
    '<g class="a-shimmer">' +
      '<path d="M18 0 h12 l-6 100 h-16z" fill="url(#' + g + ')"/>' +
      '<path d="M44 0 h16 l4 100 h-22z" fill="url(#' + g + ')" opacity=".85"/>' +
      '<path d="M74 0 h10 l14 100 h-18z" fill="url(#' + g + ')" opacity=".6"/>' +
    '</g>' +
    '<g fill="#FFF6DA" opacity=".7">' +
      '<circle cx="30" cy="70" r="1.4" class="a-rise"' + dly(1) + '/>' +
      '<circle cx="56" cy="80" r="1.2" class="a-rise"' + dly(5) + '/>' +
      '<circle cx="78" cy="64" r="1" class="a-rise"' + dly(8) + '/>' +
    '</g>', '#F2B544');
};

Art.light.coralShallows = () => {
  const g = uid('cs');
  return waterCard('#F7C9C0',
    '<defs>' + lg(g, [[0, '#FFEDE6'], [1, '#E88FA8']]) + '</defs>' +
    '<rect width="100" height="100" fill="url(#' + g + ')"/>' +
    '<g class="a-flow" opacity=".75">' +
      '<path d="M-10 40 q14 -8 28 0 t28 0 t28 0 t28 0" stroke="#fff" stroke-width="2.4" fill="none"/>' +
      '<path d="M-10 56 q14 8 28 0 t28 0 t28 0 t28 0" stroke="#FFF6DA" stroke-width="2" fill="none"/>' +
      '<path d="M-10 72 q14 -6 28 0 t28 0 t28 0 t28 0" stroke="#fff" stroke-width="1.6" fill="none" opacity=".7"/>' +
    '</g>' +
    '<g class="a-sway" style="transform-origin:50% 100%">' +
      '<path d="M26 100 q-4 -20 4 -28 q2 12 8 16 q-2 -14 6 -20 q4 18 -4 32z" fill="#E8607E" opacity=".9"/>' +
      '<path d="M72 100 q-6 -16 0 -24 q4 10 8 12 q0 -12 6 -16 q2 16 -4 28z" fill="#F28FA0" opacity=".85"/>' +
    '</g>', '#F5A8C0');
};

Art.light.greenAbyss = () => {
  const g = uid('ga');
  return waterCard('#020C0A',
    '<defs>' + rg(g, [[0, '#4EE59A', 0.75], [1, '#020C0A', 0]], 0.5, 0.78, 0.62) + '</defs>' +
    '<rect width="100" height="100" fill="#020C0A"/>' +
    '<ellipse cx="50" cy="78" rx="46" ry="30" fill="url(#' + g + ')" class="a-pulse"/>' +
    '<g class="a-flow" opacity=".5">' +
      '<path d="M-10 30 q14 6 28 0 t28 0 t28 0 t28 0" stroke="#1E7A6C" stroke-width="1.4" fill="none"/>' +
    '</g>' +
    '<g fill="#4EE59A">' +
      '<circle cx="34" cy="64" r="1.5" class="a-shimmer"' + dly(2) + '/>' +
      '<circle cx="62" cy="72" r="1.2" class="a-shimmer"' + dly(5) + '/>' +
      '<circle cx="48" cy="56" r="1" class="a-shimmer"' + dly(9) + '/>' +
    '</g>', '#4EE59A');
};

Art.light.stormChop = () => {
  const g = uid('sc');
  return waterCard('#2E3A46',
    '<defs>' + lg(g, [[0, '#5A6A78'], [1, '#16202A']]) + '</defs>' +
    '<rect width="100" height="100" fill="url(#' + g + ')"/>' +
    '<g class="a-wave">' +
      '<path d="M-12 44 q12 -14 24 -2 q12 12 24 -2 q12 -14 24 -2 q12 12 24 -2 v66 h-96z" ' +
        'fill="#3E5060" opacity=".95"/>' +
      '<path d="M-12 58 q12 -12 24 -1 q12 11 24 -2 q12 -12 24 -1 q12 11 24 -2 v50 h-96z" fill="#28323E"/>' +
    '</g>' +
    '<g stroke="#E8E4F0" stroke-width="2" fill="none" opacity=".9" class="a-flicker">' +
      '<path d="M40 6 L34 22 h8 L32 40"/></g>' +
    '<path d="M-4 42 q10 -6 20 -1 M56 50 q10 -6 20 -1" stroke="#DCE4EA" stroke-width="1.6" ' +
      'fill="none" opacity=".8"/>', '#87C5E8');
};

Art.light.cyanCaustics = () => {
  const p = uid('cc');
  return waterCard('#0A4C63',
    '<defs>' + tile(p, 40, 26,
      '<g class="a-shimmer" stroke="#7CE7F0" fill="none" stroke-width="1.6">' +
      '<path d="M0 13 q10 -13 20 0 t20 0" opacity=".9"/>' +
      '<path d="M-10 24 q10 -13 20 0 t20 0 t20 0" opacity=".6"/>' +
      '<path d="M-6 4 q10 -9 20 0 t20 0" opacity=".45"/></g>') + '</defs>' +
    '<rect width="100" height="100" fill="#0A4C63"/>' +
    '<g class="a-flow"><rect x="-30" width="180" height="100" fill="url(#' + p + ')"/></g>' +
    '<g fill="#CFF8FF" opacity=".6">' +
      '<circle cx="26" cy="72" r="1.8" class="a-rise"' + dly(1) + '/>' +
      '<circle cx="68" cy="60" r="1.4" class="a-rise"' + dly(6) + '/>' +
    '</g>', '#4FD1D9');
};

/* ---- Q13 · weather (pure visual) -------------------------------------- */

Art.weather = {};

Art.weather.lightningStorm = () => {
  const g = uid('ls');
  return waterCard('#1A2030',
    '<defs>' + lg(g, [[0, '#4A4458'], [1, '#12141E']]) + '</defs>' +
    '<rect width="100" height="100" fill="url(#' + g + ')"/>' +
    '<g class="a-driftX" opacity=".95">' +
      '<ellipse cx="34" cy="30" rx="24" ry="12" fill="#3A3448"/>' +
      '<ellipse cx="62" cy="26" rx="20" ry="11" fill="#443C56"/>' +
      '<ellipse cx="50" cy="36" rx="30" ry="11" fill="#2E2A3C"/>' +
    '</g>' +
    '<g class="a-flicker">' +
      '<path d="M52 42 L40 66 h11 L38 96" stroke="#FFF6C9" stroke-width="3" fill="none" ' +
        'stroke-linejoin="round"/>' +
      '<path d="M68 44 L60 62 h7 L56 82" stroke="#E8E4F0" stroke-width="1.8" fill="none" opacity=".7"/>' +
    '</g>' +
    '<g stroke="#8FA8C0" stroke-width="1.4" opacity=".5" class="a-flow">' +
      '<path d="M20 50 l-4 14 M30 56 l-4 14 M76 52 l-4 14 M86 58 l-4 14"/></g>', '#7B5FC4');
};

Art.weather.blazingSun = () => {
  const g = uid('bs');
  let rays = '';
  for (let i = 0; i < 12; i++) {
    rays += '<path d="M50 12 v10" stroke="#FFE9AE" stroke-width="3" stroke-linecap="round" ' +
      'transform="rotate(' + (i * 30) + ' 50 50)" opacity=".85"/>';
  }
  return waterCard('#F2B544',
    '<defs>' + rg(g, [[0, '#FFFFFF'], [0.4, '#FFE9AE'], [1, '#E2543A']], 0.5, 0.5, 0.6) + '</defs>' +
    '<rect width="100" height="100" fill="#E8952E"/>' +
    '<g class="a-spinSlow">' + rays + '</g>' +
    '<circle cx="50" cy="50" r="22" fill="url(#' + g + ')" class="a-pulse"/>' +
    '<g class="a-shimmer" opacity=".55">' +
      '<path d="M0 78 q25 -10 50 0 t50 0 v22 H0z" fill="#FFD98A"/></g>', '#FFC63D');
};

Art.weather.starNight = () => {
  let stars = '';
  for (let i = 0; i < 26; i++) {
    const x = (i * 37) % 96 + 2, y = (i * 61) % 84 + 6, r = 0.7 + (i % 3) * 0.6;
    stars += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#FFF6DA" class="a-shimmer"' +
      dly(i * 1.7) + '/>';
  }
  return waterCard('#080614',
    '<rect width="100" height="100" fill="#080614"/>' +
    '<ellipse cx="50" cy="100" rx="60" ry="34" fill="#1A1030" opacity=".9"/>' +
    stars +
    '<g class="a-driftX" opacity=".5">' +
      '<path d="M0 44 q30 -12 54 -4 q26 8 46 -4" stroke="#7B5FC4" stroke-width="10" ' +
        'fill="none" opacity=".35" stroke-linecap="round"/></g>' +
    '<path d="M22 26 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6z" fill="#E0C6FF" ' +
      'class="a-pulse"/>' +
    '<path d="M72 60 l1.2 3 l3 1.2 l-3 1.2 l-1.2 3 l-1.2 -3 l-3 -1.2 l3 -1.2z" fill="#B98CF0" ' +
      'class="a-pulse"' + dly(3) + '/>', '#9B6BD9');
};

Art.weather.greenRain = () => {
  let drops = '';
  for (let i = 0; i < 16; i++) {
    const x = (i * 23) % 94 + 3;
    drops += '<path d="M' + x + ' 0 v12" stroke="#CFF0D8" stroke-width="1.5" opacity=".7" ' +
      'class="a-rise" style="animation-delay:' + (-(i * 0.21)).toFixed(2) +
      's;animation-duration:1.6s"/>';
  }
  return waterCard('#2A5540',
    '<rect width="100" height="100" fill="#2A5540"/>' +
    '<ellipse cx="30" cy="18" rx="22" ry="9" fill="#4A7A5E" class="a-driftX"/>' +
    '<ellipse cx="66" cy="14" rx="18" ry="8" fill="#3E6B50" class="a-driftX"' + dly(3) + '/>' +
    drops +
    '<g class="a-sway" style="transform-origin:50% 100%">' +
      '<path d="M0 74 q26 -14 50 -6 t50 4 v28 H0z" fill="#3E8E5A"/>' +
      '<path d="M14 80 v-14 M28 84 v-16 M46 78 v-14 M64 82 v-15 M82 78 v-13" ' +
        'stroke="#8ED17F" stroke-width="2" stroke-linecap="round"/>' +
    '</g>' +
    '<circle cx="22" cy="70" r="2.4" fill="#FFD98A" class="a-pulse"/>' +
    '<circle cx="70" cy="72" r="2" fill="#FFD98A" class="a-pulse"' + dly(4) + '/>', '#8ED17F');
};

Art.weather.aurora = () => {
  const g1 = uid('au'), g2 = uid('au');
  return waterCard('#0C1030',
    '<defs>' +
      lg(g1, [[0, '#4EE59A', 0], [0.35, '#4EE59A', 0.75], [0.7, '#7CD8F0', 0.6], [1, '#7B5FC4', 0]], 0, 0, 0, 1) +
      lg(g2, [[0, '#F5A8C0', 0], [0.5, '#F5A8C0', 0.6], [1, '#7B5FC4', 0]], 0, 0, 0, 1) +
    '</defs>' +
    '<rect width="100" height="100" fill="#0C1030"/>' +
    '<g class="a-wave">' +
      '<path d="M-6 12 q22 22 44 4 q22 -18 44 6 v40 q-22 -20 -44 -2 q-22 18 -44 -6z" ' +
        'fill="url(#' + g1 + ')" class="a-shimmer"/>' +
    '</g>' +
    '<g class="a-wave" style="animation-delay:-2.2s">' +
      '<path d="M-6 34 q22 18 44 2 q22 -16 44 6 v28 q-22 -16 -44 0 q-22 14 -44 -6z" ' +
        'fill="url(#' + g2 + ')" opacity=".8" class="a-shimmer"' + dly(2) + '/>' +
    '</g>' +
    '<g fill="#FFF6DA">' +
      '<circle cx="18" cy="80" r="1" class="a-shimmer"/><circle cx="46" cy="88" r=".8" class="a-shimmer"' + dly(2) + '/>' +
      '<circle cx="78" cy="82" r="1.1" class="a-shimmer"' + dly(5) + '/></g>', '#7CD8F0');
};

/* ---- Q11 + Q14 · objects ---------------------------------------------- */

Art.object = {};

Art.object.stormCrown = () => {
  const g = uid('sc');
  return svgBox(
    '<defs>' + lg(g, [[0, '#FFF6DA'], [0.5, '#E3B23C'], [1, '#8A6220']]) + '</defs>' +
    halo('#7B5FC4', 50, 52, 44, 0.5) +
    '<g class="a-bob">' +
      '<path d="M22 66 L18 34 l14 12 L50 24 l18 22 l14 -12 l-4 32z" fill="url(#' + g + ')"/>' +
      '<rect x="22" y="66" width="56" height="8" rx="3" fill="#C9922E"/>' +
      '<circle cx="50" cy="70" r="3" fill="#7B5FC4"/>' +
      '<circle cx="34" cy="70" r="2.2" fill="#8FE3F2"/><circle cx="66" cy="70" r="2.2" fill="#8FE3F2"/>' +
      '<g class="a-flicker">' +
        '<path d="M50 22 L44 8 h6 L42 -2" stroke="#FFF6C9" stroke-width="2" fill="none" ' +
          'transform="translate(0,10)"/>' +
        '<path d="M30 34 l-6 -10 M70 34 l6 -10" stroke="#E0C6FF" stroke-width="1.6" opacity=".8"/>' +
      '</g>' +
    '</g>');
};

Art.object.blade = () => {
  const g = uid('bl');
  return svgBox(
    '<defs>' + lg(g, [[0, '#FFF6DA'], [0.45, '#C9BCA4'], [1, '#6B6258']], 0, 0, 1, 1) + '</defs>' +
    halo('#E2543A', 50, 50, 44, 0.42) +
    '<g class="a-bob">' +
      '<path d="M50 8 L58 24 v42 h-16 V24z" fill="url(#' + g + ')"/>' +
      '<path d="M50 8 L50 66" stroke="#8A8078" stroke-width="1.2" opacity=".7"/>' +
      '<rect x="32" y="66" width="36" height="6" rx="2.4" fill="#8A5A2E"/>' +
      '<rect x="46" y="72" width="8" height="16" rx="3" fill="#5A3A1E"/>' +
      '<circle cx="50" cy="90" r="4.4" fill="#E3B23C"/>' +
      '<path d="M50 88 l1 2 l2 1 l-2 1 l-1 2 l-1 -2 l-2 -1 l2 -1z" fill="#FFF6DA"/>' +
    '</g>' +
    '<path d="M56 14 l4 -6 M58 26 l7 -4" stroke="#FFF6DA" stroke-width="1.6" opacity=".85" ' +
      'class="a-shimmer"/>');
};

Art.object.key = () => {
  const g = uid('ky');
  return svgBox(
    '<defs>' + lg(g, [[0, '#FFF0BF'], [0.5, '#C98A3D'], [1, '#6B4520']]) + '</defs>' +
    halo('#B98CF0', 50, 50, 44, 0.5) +
    '<g class="a-sway" style="transform-origin:50% 20%">' +
      '<circle cx="50" cy="28" r="15" fill="none" stroke="url(#' + g + ')" stroke-width="6"/>' +
      '<circle cx="50" cy="28" r="6" fill="#1A1020"/>' +
      '<rect x="47" y="42" width="6" height="42" fill="url(#' + g + ')"/>' +
      '<rect x="53" y="66" width="11" height="5" fill="url(#' + g + ')"/>' +
      '<rect x="53" y="76" width="8" height="5" fill="url(#' + g + ')"/>' +
      '<circle cx="50" cy="28" r="9" fill="none" stroke="#B98CF0" stroke-width="1" ' +
        'opacity=".8" class="a-pulse"/>' +
    '</g>' +
    '<g fill="#E0C6FF"><circle cx="32" cy="56" r="1.4" class="a-rise"' + dly(1) + '/>' +
      '<circle cx="70" cy="48" r="1.1" class="a-rise"' + dly(5) + '/></g>');
};

Art.object.seed = () => {
  const g = uid('sd');
  return svgBox(
    '<defs>' + rg(g, [[0, '#FFF6DA'], [0.5, '#E3B23C'], [1, '#7A5A18']], 0.4, 0.35, 0.75) + '</defs>' +
    halo('#8ED17F', 50, 56, 44, 0.5) +
    '<g class="a-bob">' +
      '<ellipse cx="50" cy="60" rx="13" ry="17" fill="url(#' + g + ')"/>' +
      '<path d="M50 46 q-5 12 0 26 q5 -14 0 -26z" fill="#FFF6DA" opacity=".5"/>' +
      '<g class="a-sway" style="transform-origin:50% 46px">' +
        '<path d="M50 46 q0 -14 -2 -20" stroke="#3E8E5A" stroke-width="2.4" fill="none"/>' +
        '<path d="M48 32 q-12 -3 -14 -12 q13 1 15 10z" fill="#8ED17F"/>' +
        '<path d="M49 36 q12 -5 13 -14 q-13 2 -14 11z" fill="#6EBF6A"/>' +
      '</g>' +
      '<g stroke="#3E8E5A" stroke-width="1.6" opacity=".8">' +
        '<path d="M44 76 q-6 6 -8 12"/><path d="M56 76 q6 6 8 12"/></g>' +
    '</g>');
};

Art.object.mirror = () => {
  const g = uid('mr'), f = uid('mr');
  return svgBox(
    '<defs>' + lg(g, [[0, '#FFF6DA'], [0.5, '#C8CFD6'], [1, '#7A8894']], 0, 0, 1, 1) +
      lg(f, [[0, '#E3B23C'], [1, '#8A6220']]) + '</defs>' +
    halo('#F5A8C0', 50, 46, 44, 0.42) +
    '<g class="a-bob">' +
      '<ellipse cx="50" cy="42" rx="24" ry="28" fill="url(#' + f + ')"/>' +
      '<ellipse cx="50" cy="42" rx="19" ry="23" fill="url(#' + g + ')"/>' +
      '<path d="M36 30 q10 -6 20 2 q-12 2 -20 -2z" fill="#fff" opacity=".7" class="a-shimmer"/>' +
      '<path d="M40 54 q12 6 22 -4" stroke="#fff" stroke-width="1.6" opacity=".5" fill="none"/>' +
      '<rect x="46" y="68" width="8" height="20" rx="3" fill="url(#' + f + ')"/>' +
      '<ellipse cx="50" cy="90" rx="12" ry="4" fill="url(#' + f + ')"/>' +
    '</g>');
};

Art.object.unbeatenFist = () => svgBox(
  halo('#E2543A', 50, 52, 44, 0.46) +
  '<g class="a-bob">' +
    '<path d="M32 44 q0 -8 8 -8 h22 q8 0 8 8 v20 q0 12 -12 12 h-16 q-10 0 -10 -12z" fill="#C98A5E"/>' +
    '<path d="M34 46 h32 M34 54 h32 M34 62 h30" stroke="#A06B44" stroke-width="1.4" opacity=".8"/>' +
    '<path d="M30 50 q-6 2 -6 8 q0 6 6 7" fill="#B87A50"/>' +
    // bronze wrap
    '<path d="M30 66 q20 8 40 0 l2 8 q-22 8 -44 0z" fill="#C98A3D"/>' +
    '<path d="M30 70 q20 7 40 0" stroke="#8A5A20" stroke-width="1.2" fill="none"/>' +
  '</g>' +
  '<g class="a-flicker" stroke="#FFE9AE" stroke-width="2" stroke-linecap="round">' +
    '<path d="M24 34 l-6 -8 M50 28 v-9 M76 34 l6 -8"/></g>');

Art.object.makerHands = () => svgBox(
  halo('#FF8A3D', 50, 54, 44, 0.46) +
  '<g class="a-bob">' +
    '<path d="M24 62 q-4 -12 6 -14 q4 -10 12 -4 q6 -8 12 0 q10 -4 10 8 l2 10z" fill="#C98A5E"/>' +
    '<path d="M28 62 h40 q6 0 6 6 q0 8 -8 8 h-38 q-8 0 -8 -8 q0 -6 8 -6z" fill="#B87A50"/>' +
  '</g>' +
  // the thing being made, hovering and turning
  '<g class="a-spin" style="transform-origin:50% 34%">' +
    '<path d="M50 20 l7 5 v10 l-7 5 l-7 -5 v-10z" fill="#E3B23C"/>' +
    '<path d="M50 20 l7 5 l-7 5 l-7 -5z" fill="#FFF0BF"/>' +
  '</g>' +
  '<g fill="#FFE9AE"><circle cx="38" cy="44" r="1.2" class="a-rise"' + dly(1) + '/>' +
    '<circle cx="62" cy="46" r="1" class="a-rise"' + dly(4) + '/>' +
    '<circle cx="50" cy="50" r="1.3" class="a-rise"' + dly(7) + '/></g>');

Art.object.secretEye = () => {
  const g = uid('se');
  return svgBox(
    '<defs>' + rg(g, [[0, '#FFF6DA'], [0.35, '#B98CF0'], [1, '#1B1030']], 0.4, 0.4, 0.7) + '</defs>' +
    halo('#B98CF0', 50, 50, 44, 0.5) +
    '<g class="a-blink" style="transform-origin:50% 50%">' +
      '<path d="M12 50 q38 -30 76 0 q-38 30 -76 0z" fill="#EDE6F2"/>' +
      '<circle cx="50" cy="50" r="16" fill="url(#' + g + ')"/>' +
      '<circle cx="50" cy="50" r="7" fill="#0B0A10"/>' +
      '<circle cx="45" cy="45" r="3" fill="#fff" opacity=".8"/>' +
    '</g>' +
    '<path d="M12 50 q38 -30 76 0 q-38 30 -76 0z" fill="none" stroke="#B98CF0" stroke-width="2"/>' +
    '<g class="a-spinSlow" style="transform-origin:50% 50%" opacity=".8">' +
      '<circle cx="50" cy="24" r="1.6" fill="#7CFFD4"/>' +
      '<circle cx="76" cy="50" r="1.3" fill="#E0C6FF"/>' +
      '<circle cx="50" cy="76" r="1.6" fill="#7CFFD4"/>' +
      '<circle cx="24" cy="50" r="1.3" fill="#E0C6FF"/>' +
    '</g>');
};

Art.object.safeCircle = () => {
  const g = uid('sf');
  return svgBox(
    '<defs>' + rg(g, [[0, '#FFF6DA', 0.9], [1, '#8ED17F', 0]], 0.5, 0.5, 0.6) + '</defs>' +
    halo('#8ED17F', 50, 50, 44, 0.4) +
    '<circle cx="50" cy="52" r="32" fill="url(#' + g + ')" class="a-pulse"/>' +
    '<circle cx="50" cy="52" r="32" fill="none" stroke="#8ED17F" stroke-width="2" ' +
      'stroke-dasharray="4 5" class="a-spinSlow" style="transform-origin:50% 52%"/>' +
    // three small figures standing together inside it
    '<g class="a-breathe">' +
      '<circle cx="38" cy="48" r="5" fill="#E8C15E"/>' +
      '<path d="M32 68 q6 -14 12 0z" fill="#E87A2C"/>' +
      '<circle cx="50" cy="44" r="5.6" fill="#C98A5E"/>' +
      '<path d="M43 68 q7 -16 14 0z" fill="#3E8E5A"/>' +
      '<circle cx="62" cy="48" r="5" fill="#8E5A3C"/>' +
      '<path d="M56 68 q6 -14 12 0z" fill="#B33A2A"/>' +
    '</g>' +
    '<path d="M28 70 h44" stroke="#5E8B4C" stroke-width="3" stroke-linecap="round"/>');
};

Art.object.joyBurst = () => {
  let conf = '';
  const cols = ['#F5A8C0', '#8FE3F2', '#FFD98A', '#9B6BD9', '#8ED17F'];
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * 6.2832, r = 26 + (i % 3) * 8;
    const x = 50 + Math.cos(a) * r, y = 50 + Math.sin(a) * r;
    conf += '<rect x="' + (x - 2.4) + '" y="' + (y - 1.4) + '" width="4.8" height="2.8" rx="1" fill="' +
      cols[i % 5] + '" transform="rotate(' + (i * 37) + ' ' + x + ' ' + y + ')" class="a-pulse"' +
      dly(i * 2.1) + '/>';
  }
  return svgBox(
    halo('#F5CBD8', 50, 50, 46, 0.55) +
    '<g class="a-spinSlow" style="transform-origin:50% 50%">' + conf + '</g>' +
    '<g class="a-breathe">' +
      '<circle cx="50" cy="48" r="17" fill="#FFE9AE"/>' +
      '<circle cx="44" cy="44" r="2.4" fill="#5A3A1E" class="a-blink"/>' +
      '<circle cx="56" cy="44" r="2.4" fill="#5A3A1E" class="a-blink"' + dly(1) + '/>' +
      '<path d="M41 53 q9 10 18 0" stroke="#5A3A1E" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
      '<circle cx="38" cy="52" r="3" fill="#F5A8C0" opacity=".7"/>' +
      '<circle cx="62" cy="52" r="3" fill="#F5A8C0" opacity=".7"/>' +
    '</g>');
};

/* ---- Q3, Q6, Q9, Q12, Q15 · the twenty-five actions -------------------- */
/* These share a common visual grammar: a small figure in a lit moment. */

Art.act = {};

/* a tiny stick-and-shape hero used across the action cards */
function figure(x, y, s, col, pose) {
  const P = {
    stand:  'M0 0 v-14 M0 -6 l-7 6 M0 -6 l7 6 M0 -14 l-6 -8 M0 -14 l6 -8',
    run:    'M0 0 l-8 8 M0 0 l8 5 M0 -4 l-9 -6 M0 -4 l10 -3',
    reach:  'M0 0 l-6 9 M0 0 l7 8 M0 -6 l-9 -10 M0 -6 l10 -12',
    crouch: 'M0 0 l-8 4 M0 0 l8 4 M0 -3 l-8 -4 M0 -3 l8 -4',
    sit:    'M0 0 l-9 1 M0 0 l9 1 M0 -4 l-7 -5 M0 -4 l7 -5',
    open:   'M0 0 l-7 9 M0 0 l7 9 M0 -7 l-12 -6 M0 -7 l12 -6',
  }[pose || 'stand'];
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<path d="M0 0 v-16" stroke="' + col + '" stroke-width="4.4" stroke-linecap="round"/>' +
    '<path d="' + P + '" stroke="' + col + '" stroke-width="3.4" stroke-linecap="round" fill="none"/>' +
    '<circle cx="0" cy="-21" r="5" fill="' + col + '"/></g>';
}

function actCard(bg, inner, tint) {
  return svgBox(
    halo(tint, 50, 50, 46, 0.42) +
    '<circle cx="50" cy="50" r="40" fill="' + bg + '"/>' +
    '<circle cx="50" cy="50" r="40" fill="none" stroke="' + tint + '" stroke-width="1.6" opacity=".65"/>' +
    '<g clip-path="circle(40px at 50px 50px)">' + inner + '</g>');
}

Art.act.charge = () => actCard('#3A1810',
  '<path d="M10 74 h80 v26 h-80z" fill="#5A2A1A"/>' +
  '<g class="a-driftX">' + figure(44, 74, 1.15, '#FFD9A0', 'run') + '</g>' +
  '<path d="M62 56 l16 -8" stroke="#E3B23C" stroke-width="3" stroke-linecap="round"/>' +
  '<path d="M78 48 l6 -3 l-2 6z" fill="#FFF0BF"/>' +
  '<g class="a-flicker" stroke="#FF8A3D" stroke-width="2" opacity=".85">' +
    '<path d="M18 40 l10 6 M22 58 l12 3 M20 68 l12 -1"/></g>', '#E2543A');

Art.act.replan = () => actCard('#14202A',
  '<rect x="20" y="26" width="60" height="48" rx="3" fill="#1E3A4E"/>' +
  '<g class="a-shimmer" stroke="#8FE3F2" stroke-width="1.2" opacity=".9" fill="none">' +
    '<path d="M26 34 h48 M26 42 h30 M26 50 h40 M26 58 h26"/>' +
    '<rect x="52" y="46" width="22" height="18" rx="2"/>' +
    '<path d="M52 56 l22 -10"/></g>' +
  '<g class="a-driftY">' + figure(34, 84, 0.8, '#C8CFD6', 'reach') + '</g>' +
  '<path d="M74 20 l4 8 l8 -2 l-6 7 l5 7 l-9 -3 l-4 8 l-2 -9 l-9 -1 l8 -5z" fill="#FFF0BF" ' +
    'opacity=".9" class="a-pulse"/>', '#87C5E8');

Art.act.sneak = () => actCard('#101018',
  '<path d="M0 78 h100 v22 H0z" fill="#1A1A26"/>' +
  '<rect x="4" y="14" width="26" height="64" fill="#20202E"/>' +
  '<rect x="70" y="8" width="30" height="70" fill="#20202E"/>' +
  '<g class="a-driftX" opacity=".95">' + figure(50, 78, 0.95, '#5A6070', 'crouch') + '</g>' +
  '<ellipse cx="50" cy="80" rx="14" ry="3" fill="#000" opacity=".5"/>' +
  '<g class="a-flicker" fill="#FFD98A" opacity=".5">' +
    '<path d="M30 14 l40 0 l-14 64 h-12z"/></g>', '#9B6BD9');

Art.act.guard = () => actCard('#1E2A1A',
  '<path d="M0 80 h100 v20 H0z" fill="#2E4020"/>' +
  '<g class="a-breathe">' + figure(50, 80, 1.1, '#EDE0C4', 'stand') + '</g>' +
  '<g class="a-bob"><path d="M34 46 q0 -12 10 -14 q10 2 10 14 q0 14 -10 20 q-10 -6 -10 -20z" ' +
    'fill="#C98A3D" transform="translate(6 8)"/>' +
    '<circle cx="50" cy="60" r="4" fill="#FFF0BF" opacity=".85"/></g>' +
  '<g class="a-sway" style="transform-origin:78px 90px">' +
    '<rect x="76" y="30" width="3" height="58" fill="#8A6238"/>' +
    '<path d="M77.5 24 l5 10 h-10z" fill="#E2543A"/></g>', '#F2B544');

Art.act.rally = () => actCard('#2A1A34',
  '<path d="M0 82 h100 v18 H0z" fill="#3A2444"/>' +
  '<g class="a-driftY">' + figure(50, 80, 1.15, '#FFD9A0', 'open') + '</g>' +
  '<g class="a-breathe" opacity=".9">' +
    figure(24, 88, 0.7, '#8ED17F', 'open') + figure(76, 88, 0.7, '#8FE3F2', 'open') +
    figure(12, 92, 0.55, '#F5A8C0', 'stand') + figure(88, 92, 0.55, '#FFD98A', 'stand') +
  '</g>' +
  '<g class="a-pulse" fill="#FFF0BF">' +
    '<circle cx="34" cy="34" r="2.4"/><circle cx="50" cy="26" r="3"/><circle cx="66" cy="34" r="2.4"/></g>',
  '#9B6BD9');

Art.act.climbView = () => actCard('#16261E',
  '<path d="M0 100 L20 44 L40 100z" fill="#22402E"/>' +
  '<path d="M30 100 L58 24 L86 100z" fill="#2E5A40"/>' +
  '<g class="a-bob">' + figure(58, 30, 0.66, '#FFE9AE', 'reach') + '</g>' +
  '<path d="M0 62 q22 -8 44 -2 q24 6 56 -4" stroke="#8ED17F" stroke-width="1.6" fill="none" ' +
    'opacity=".5" class="a-wave"/>' +
  '<circle cx="80" cy="20" r="7" fill="#FFD98A" opacity=".8" class="a-pulse"/>', '#8ED17F');

Art.act.standFront = () => actCard('#2A1414',
  '<path d="M0 82 h100 v18 H0z" fill="#3E1E18"/>' +
  '<g opacity=".65" class="a-breathe">' + figure(72, 88, 0.72, '#7A6A5A', 'stand') +
    figure(84, 90, 0.6, '#6A5A4A', 'stand') + '</g>' +
  '<g class="a-breathe">' + figure(40, 84, 1.3, '#FFD9A0', 'open') + '</g>' +
  '<g class="a-flicker" opacity=".75">' +
    '<path d="M4 20 q12 26 0 52" stroke="#FF6B35" stroke-width="4" fill="none"/>' +
    '<path d="M14 30 q8 18 0 34" stroke="#E2543A" stroke-width="2.4" fill="none" opacity=".7"/></g>',
  '#E2543A');

Art.act.goSilent = () => actCard('#0E1018',
  '<path d="M0 84 h100 v16 H0z" fill="#161826"/>' +
  '<g>' + figure(50, 84, 1.1, '#3E4454', 'crouch') + '</g>' +
  // concentric hush rings, fading outward
  '<g fill="none" stroke="#9B6BD9" opacity=".5">' +
    '<circle cx="50" cy="52" r="14" class="a-pulse"' + dly(1) + '/>' +
    '<circle cx="50" cy="52" r="24" class="a-pulse"' + dly(4) + '/>' +
    '<circle cx="50" cy="52" r="34" class="a-pulse"' + dly(7) + '/></g>' +
  '<circle cx="50" cy="52" r="4" fill="#E0C6FF" class="a-shimmer"/>', '#9B6BD9');

Art.act.goAround = () => actCard('#182A20',
  '<circle cx="52" cy="56" r="20" fill="#2E4030"/>' +
  '<path d="M52 40 l6 10 h-12z" fill="#1E2C22"/>' +
  '<path d="M14 84 q6 -34 32 -40 q26 -6 40 22" stroke="#8ED17F" stroke-width="2.6" ' +
    'stroke-dasharray="5 5" fill="none" class="a-flow"/>' +
  '<path d="M84 62 l6 5 l-7 4z" fill="#8ED17F"/>' +
  '<g class="a-bob">' + figure(18, 88, 0.85, '#FFE9AE', 'run') + '</g>', '#8ED17F');

Art.act.makeLaugh = () => actCard('#2E1E38',
  '<path d="M0 84 h100 v16 H0z" fill="#3E2A4A"/>' +
  '<g class="a-driftY">' + figure(36, 84, 1.05, '#FFD9A0', 'open') + '</g>' +
  '<g class="a-breathe">' + figure(66, 86, 0.9, '#8FE3F2', 'stand') + '</g>' +
  // laughter, drawn as rising notes
  '<g class="a-rise" fill="#FFF0BF"' + dly(1) + '><circle cx="52" cy="42" r="2.6"/></g>' +
  '<g class="a-rise" fill="#F5A8C0"' + dly(4) + '><circle cx="60" cy="36" r="2"/></g>' +
  '<g class="a-rise" fill="#8ED17F"' + dly(7) + '><circle cx="46" cy="34" r="1.6"/></g>' +
  '<path d="M28 24 q10 12 20 0" stroke="#FFF0BF" stroke-width="2.4" fill="none" ' +
    'stroke-linecap="round" class="a-pulse"/>', '#F5CBD8');

Art.act.signal = () => actCard('#0E3A4E',
  '<path d="M0 86 h100 v14 H0z" fill="#134458"/>' +
  '<g class="a-driftY">' + figure(40, 86, 1.05, '#FFE9AE', 'reach') + '</g>' +
  // a bright arc of light thrown upward
  '<g class="a-shimmer">' +
    '<path d="M52 62 q22 -34 42 -18" stroke="#7CD8F0" stroke-width="3" fill="none" ' +
      'stroke-linecap="round"/>' +
    '<path d="M52 62 q20 -40 44 -30" stroke="#F5A8C0" stroke-width="2" fill="none" opacity=".8"/>' +
    '<path d="M52 62 q18 -28 38 -8" stroke="#FFF0BF" stroke-width="1.6" fill="none" opacity=".7"/>' +
  '</g>' +
  '<circle cx="94" cy="32" r="5" fill="#FFF6DA" class="a-pulse"/>', '#7CD8F0');

Art.act.cutFree = () => actCard('#0A3040',
  '<g class="a-sway" style="transform-origin:50% 20%" opacity=".85">' +
    '<path d="M20 20 L34 90 M40 18 L46 90 M60 18 L54 90 M80 20 L66 90" stroke="#5A7A6A" ' +
      'stroke-width="2"/>' +
    '<path d="M22 40 h56 M26 62 h48" stroke="#5A7A6A" stroke-width="2"/></g>' +
  '<g class="a-swayFast" style="transform-origin:36px 78px">' +
    '<rect x="34" y="40" width="4" height="36" rx="2" fill="#8A6238" transform="rotate(-30 36 76)"/>' +
    '<path d="M36 40 l7 -22 l-13 0z" fill="#C9BCA4" transform="rotate(-30 36 76)"/></g>' +
  '<g class="a-flicker" stroke="#FFF6DA" stroke-width="2" opacity=".9">' +
    '<path d="M46 30 l10 -8 M52 44 l12 -3"/></g>' +
  '<g class="a-bob">' + figure(34, 88, 0.8, '#FFE9AE', 'reach') + '</g>', '#4FD1D9');

Art.act.faceIt = () => actCard('#101820',
  '<path d="M0 86 h100 v14 H0z" fill="#182430"/>' +
  '<g class="a-breathe">' + figure(30, 86, 1.15, '#FFE9AE', 'stand') + '</g>' +
  // whatever is coming, kept as a silhouette — never a jump scare
  '<g class="a-driftX" opacity=".9">' +
    '<path d="M62 86 q0 -30 18 -34 q20 -4 22 34z" fill="#0A0E14"/>' +
    '<circle cx="76" cy="60" r="2.6" fill="#4EE59A" class="a-blink"/>' +
    '<circle cx="88" cy="58" r="2.6" fill="#4EE59A" class="a-blink"' + dly(2) + '/></g>' +
  '<path d="M42 66 h14" stroke="#C8CFD6" stroke-width="2.4" stroke-linecap="round"/>', '#4EE59A');

Art.act.untie = () => actCard('#1E2A2E',
  '<g class="a-spinSlow" style="transform-origin:50% 48%">' +
    '<path d="M32 48 q8 -18 18 0 q10 18 18 0 q-8 18 -18 0 q-10 -18 -18 0z" fill="none" ' +
      'stroke="#C9BCA4" stroke-width="3.4"/></g>' +
  '<path d="M30 48 q-12 6 -14 18" stroke="#C9BCA4" stroke-width="3" fill="none"/>' +
  '<path d="M70 48 q12 6 14 18" stroke="#C9BCA4" stroke-width="3" fill="none"/>' +
  '<g class="a-driftY">' + figure(50, 90, 0.72, '#FFE9AE', 'reach') + '</g>' +
  '<g fill="#FFF0BF" class="a-shimmer"><circle cx="38" cy="34" r="1.4"/>' +
    '<circle cx="64" cy="32" r="1.2"/></g>', '#C8CFD6');

Art.act.calmIt = () => actCard('#1A3428',
  '<g class="a-breathe">' +
    '<ellipse cx="62" cy="62" rx="24" ry="17" fill="#5A8A70"/>' +
    '<circle cx="40" cy="52" r="11" fill="#6A9A80"/>' +
    '<circle cx="36" cy="50" r="2.2" fill="#1A2C22" class="a-blink"/>' +
    '<path d="M32 56 q6 4 10 0" stroke="#1A2C22" stroke-width="1.4" fill="none"/>' +
    '<path d="M74 54 q10 -6 12 -16" stroke="#5A8A70" stroke-width="3" fill="none" class="a-tail" ' +
      'style="transform-origin:74px 54px"/></g>' +
  '<path d="M20 46 q8 4 14 2" stroke="#FFE9AE" stroke-width="3" stroke-linecap="round" fill="none" ' +
    'class="a-driftY"/>' +
  '<g class="a-pulse" fill="#FFF0BF" opacity=".7">' +
    '<circle cx="24" cy="38" r="1.6"/><circle cx="18" cy="52" r="1.2"/></g>', '#8ED17F');

Art.act.carryIt = () => actCard('#1A1428',
  '<path d="M0 88 h100 v12 H0z" fill="#241C36"/>' +
  '<g class="a-driftY">' + figure(44, 88, 1.1, '#FFE9AE', 'reach') + '</g>' +
  // a small light held carefully, all the way up
  '<g class="a-pulse" style="transform-origin:58px 44px">' +
    '<circle cx="58" cy="44" r="8" fill="#FFF6DA" opacity=".35"/>' +
    '<circle cx="58" cy="44" r="4" fill="#FFF6DA"/></g>' +
  '<path d="M58 52 v20" stroke="#FFE9AE" stroke-width="1.4" opacity=".5"/>' +
  '<g class="a-rise" fill="#E0C6FF"' + dly(2) + '><circle cx="70" cy="56" r="1.4"/></g>' +
  '<g class="a-rise" fill="#7CFFD4"' + dly(6) + '><circle cx="34" cy="52" r="1.2"/></g>', '#7CD8F0');

Art.act.askPrice = () => actCard('#20180E',
  '<g class="a-sway" style="transform-origin:50% 24%">' +
    '<path d="M50 22 v10" stroke="#C98A3D" stroke-width="2.6"/>' +
    '<path d="M26 32 h48" stroke="#C98A3D" stroke-width="2.6"/>' +
    '<path d="M26 32 l-8 14 h16z" fill="#E3B23C"/>' +
    '<path d="M74 32 l-8 14 h16z" fill="#E3B23C"/></g>' +
  '<g class="a-driftY">' + figure(50, 88, 0.85, '#FFE9AE', 'open') + '</g>' +
  '<g class="a-shimmer" fill="#FFF0BF"><circle cx="26" cy="52" r="2.4"/>' +
    '<circle cx="74" cy="52" r="2"/></g>' +
  '<text x="50" y="70" text-anchor="middle" font-size="15" fill="#E3B23C" ' +
    'font-family="Georgia,serif" class="a-shimmer">?</text>', '#F2B544');

Art.act.stayListen = () => actCard('#141024',
  '<path d="M0 88 h100 v12 H0z" fill="#1E1832"/>' +
  '<g class="a-breathe">' + figure(36, 88, 0.95, '#FFE9AE', 'sit') + '</g>' +
  '<g class="a-shimmer" opacity=".75">' + figure(66, 88, 0.9, '#B98CF0', 'sit') + '</g>' +
  '<g fill="none" stroke="#B98CF0" opacity=".55">' +
    '<path d="M52 62 q6 -6 0 -12" class="a-pulse"/>' +
    '<path d="M56 66 q10 -10 0 -20" class="a-pulse"' + dly(3) + '/></g>' +
  '<g class="a-rise" fill="#E0C6FF"' + dly(5) + '><circle cx="66" cy="58" r="1.4"/></g>', '#9B6BD9');

Art.act.otherWay = () => actCard('#181028',
  // a crossroads with a third, unlisted path
  '<path d="M50 100 V54 M50 54 L14 26 M50 54 L86 26" stroke="#4A3A5E" stroke-width="5" ' +
    'stroke-linecap="round" fill="none"/>' +
  '<path d="M50 54 q22 -6 30 -34" stroke="#7CFFD4" stroke-width="3" stroke-dasharray="4 5" ' +
    'fill="none" class="a-flow"/>' +
  '<g class="a-pulse"><circle cx="80" cy="20" r="6" fill="#7CFFD4" opacity=".35"/>' +
    '<circle cx="80" cy="20" r="2.6" fill="#CFFFF0"/></g>' +
  '<g class="a-driftY">' + figure(50, 88, 0.85, '#FFE9AE', 'reach') + '</g>' +
  '<g class="a-flicker" fill="#B98CF0"><circle cx="24" cy="34" r="2"/>' +
    '<circle cx="76" cy="36" r="1.6"/></g>', '#B98CF0');

Art.act.sayNo = () => actCard('#12201E',
  '<g class="a-breathe">' + figure(38, 88, 1.05, '#FFE9AE', 'open') + '</g>' +
  '<g class="a-shimmer" opacity=".7">' + figure(72, 90, 0.8, '#7CFFD4', 'stand') + '</g>' +
  // an open palm — refusal, offered kindly
  '<g class="a-driftY"><path d="M56 44 q0 -10 5 -10 q3 0 3 6 v6 q4 -6 7 -4 q3 2 0 8 ' +
    'q4 -3 6 0 q2 3 -2 8 q-4 6 -10 8 q-8 2 -11 -4 q-4 -8 2 -18z" fill="#FFD9A0"/></g>' +
  '<circle cx="66" cy="52" r="17" fill="none" stroke="#4EE59A" stroke-width="1.6" ' +
    'opacity=".6" class="a-pulse"/>', '#4EE59A');

Art.act.neverSmall = () => actCard('#181A2E',
  '<g class="a-breathe">' + figure(50, 92, 1.5, '#FFE9AE', 'stand') + '</g>' +
  // the shadow it casts is enormous
  '<path d="M50 92 L14 100 h72z" fill="#0A0C16" opacity=".8"/>' +
  '<g class="a-flicker" opacity=".9">' +
    '<path d="M50 30 L42 46 h7 L38 64" stroke="#FFF6C9" stroke-width="2.4" fill="none"/></g>' +
  '<g class="a-pulse" fill="none" stroke="#E8E4F0" opacity=".4">' +
    '<circle cx="50" cy="52" r="26"/><circle cx="50" cy="52" r="36"' + dly(3) + '/></g>', '#E8E4F0');

Art.act.watchedBuild = () => actCard('#221A12',
  '<rect x="18" y="70" width="64" height="6" rx="2" fill="#5A4632"/>' +
  // a small tower being stacked, block by block
  '<g class="a-bob"><rect x="38" y="58" width="24" height="12" rx="2" fill="#C98A3D"/></g>' +
  '<g class="a-bob"' + dly(2) + '><rect x="42" y="46" width="16" height="12" rx="2" fill="#E3B23C"/></g>' +
  '<g class="a-bob"' + dly(4) + '><rect x="45" y="34" width="10" height="12" rx="2" fill="#FFF0BF"/></g>' +
  '<g class="a-driftY">' + figure(24, 88, 0.75, '#FFE9AE', 'reach') + '</g>' +
  // and someone watching, quietly
  '<g class="a-shimmer" opacity=".55">' + figure(82, 88, 0.85, '#8FA8C0', 'stand') + '</g>' +
  '<g class="a-shimmer" stroke="#8FE3F2" stroke-width=".9" fill="none" opacity=".65">' +
    '<path d="M38 30 h24 M50 26 v8"/></g>', '#F2B544');

Art.act.keptSecrets = () => actCard('#100C1C',
  '<g class="a-bob">' +
    '<rect x="30" y="46" width="40" height="32" rx="4" fill="#2A2038"/>' +
    '<path d="M38 46 v-8 q0 -12 12 -12 t12 12 v8" stroke="#B98CF0" stroke-width="4" fill="none"/>' +
    '<circle cx="50" cy="60" r="5" fill="#E0C6FF"/>' +
    '<path d="M50 64 v7" stroke="#E0C6FF" stroke-width="2.6" stroke-linecap="round"/></g>' +
  '<g class="a-shimmer" fill="#7CFFD4" opacity=".7">' +
    '<circle cx="24" cy="40" r="1.6"/><circle cx="76" cy="36" r="1.3"/>' +
    '<circle cx="70" cy="82" r="1.2"/><circle cx="28" cy="80" r="1.4"/></g>' +
  '<circle cx="50" cy="60" r="30" fill="none" stroke="#9B6BD9" stroke-width="1.2" ' +
    'stroke-dasharray="3 6" class="a-spinSlow" style="transform-origin:50px 60px"/>', '#9B6BD9');

Art.act.madeGrow = () => actCard('#16301E',
  '<path d="M0 88 h100 v12 H0z" fill="#1E4028"/>' +
  '<g class="a-sway" style="transform-origin:50% 88px">' +
    '<path d="M50 88 v-40" stroke="#3E8E5A" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M50 70 q-16 -4 -20 -18 q17 1 20 14z" fill="#8ED17F"/>' +
    '<path d="M50 62 q16 -6 19 -20 q-17 3 -19 16z" fill="#6EBF6A"/>' +
    '<path d="M50 50 q-12 -6 -12 -18 q13 5 12 16z" fill="#8ED17F" opacity=".9"/>' +
    '<circle cx="50" cy="34" r="6" fill="#FFD98A" class="a-pulse"/></g>' +
  '<g class="a-driftY">' + figure(22, 90, 0.7, '#FFE9AE', 'reach') + '</g>' +
  '<g class="a-rise" fill="#8ED17F"' + dly(2) + '><circle cx="70" cy="60" r="1.6"/></g>' +
  '<g class="a-rise" fill="#FFD98A"' + dly(6) + '><circle cx="34" cy="54" r="1.3"/></g>', '#8ED17F');

Art.act.broughtColour = () => actCard('#1A1826',
  '<g class="a-wave">' +
    '<path d="M6 84 q44 -66 88 -14" stroke="#E2543A" stroke-width="5" fill="none" opacity=".9"/>' +
    '<path d="M8 88 q42 -60 84 -12" stroke="#F2B544" stroke-width="5" fill="none" opacity=".9"/>' +
    '<path d="M10 92 q40 -54 80 -10" stroke="#8ED17F" stroke-width="5" fill="none" opacity=".9"/>' +
    '<path d="M12 96 q38 -48 76 -8" stroke="#7CD8F0" stroke-width="5" fill="none" opacity=".9"/>' +
    '<path d="M14 100 q36 -42 72 -6" stroke="#9B6BD9" stroke-width="5" fill="none" opacity=".9"/>' +
  '</g>' +
  '<g class="a-driftY">' + figure(26, 96, 0.72, '#FFF6DA', 'open') + '</g>' +
  '<g class="a-pulse" fill="#FFF6DA"><circle cx="72" cy="26" r="2.6"/>' +
    '<circle cx="86" cy="40" r="1.8"' + dly(3) + '/></g>', '#F5CBD8');

/* =========================================================================
   3. COLLECTIBLES — the things floating in the lanes
   ========================================================================= */

const Collect = {
  drachma: () => svgBox('<circle cx="50" cy="50" r="34" fill="#E3B23C"/>' +
    '<circle cx="50" cy="50" r="27" fill="#C9922E"/>' +
    '<path d="M50 30 l6 12 l13 2 l-9 9 l2 13 l-12 -6 l-12 6 l2 -13 l-9 -9 l13 -2z" fill="#FFF0BF"/>'),
  ambrosia: () => svgBox('<rect x="24" y="30" width="52" height="40" rx="6" fill="#F7EBD3"/>' +
    '<path d="M24 46 h52 M50 30 v40" stroke="#E8C9A0" stroke-width="3"/>' +
    '<circle cx="37" cy="38" r="3" fill="#E2543A"/><circle cx="63" cy="60" r="3" fill="#E2543A"/>'),
  nectar: () => svgBox('<path d="M42 20 h16 v14 l10 20 v26 h-36 V54 l10 -20z" fill="#FFD98A"/>' +
    '<path d="M32 60 h36 v20 h-36z" fill="#F2B544"/>' +
    '<rect x="40" y="14" width="20" height="8" rx="3" fill="#C9922E"/>'),
  riptide: () => svgBox('<rect x="30" y="24" width="14" height="54" rx="6" fill="#2E4A5E" ' +
    'transform="rotate(20 50 50)"/>' +
    '<rect x="30" y="18" width="14" height="12" rx="5" fill="#4FD1D9" transform="rotate(20 50 50)"/>' +
    '<path d="M44 30 l6 3" stroke="#C9BCA4" stroke-width="3" transform="rotate(20 50 50)"/>'),
  yankeesCap: () => svgBox('<path d="M20 58 q0 -30 30 -30 t30 30z" fill="#2E4A6E"/>' +
    '<path d="M20 58 q-12 4 -14 12 h44z" fill="#24405E"/>' +
    '<path d="M46 34 h8 v14 h-8z" fill="#EDE6F2"/>'),
  reedPipes: () => svgBox('<g fill="#C9A05E">' +
    '<rect x="26" y="24" width="8" height="52" rx="3"/><rect x="38" y="28" width="8" height="48" rx="3"/>' +
    '<rect x="50" y="32" width="8" height="44" rx="3"/><rect x="62" y="36" width="8" height="40" rx="3"/></g>' +
    '<rect x="22" y="44" width="52" height="6" rx="3" fill="#8A6238"/>'),
  wingedSandal: () => svgBox('<path d="M28 62 h44 q6 0 6 6 t-6 6 h-44z" fill="#C9922E"/>' +
    '<path d="M34 62 l8 -14 M50 62 l6 -16 M64 62 l4 -12" stroke="#E3B23C" stroke-width="3"/>' +
    '<path d="M24 58 q-14 -12 -18 -2 q10 2 18 2z" fill="#F7EBD3" class="a-sway"/>' +
    '<path d="M76 58 q14 -12 18 -2 q-10 2 -18 2z" fill="#F7EBD3" class="a-sway"/>'),
  bluePearl: () => svgBox('<circle cx="50" cy="52" r="26" fill="#7CD8F0"/>' +
    '<circle cx="50" cy="52" r="26" fill="none" stroke="#CFF8FF" stroke-width="2" opacity=".7"/>' +
    '<circle cx="41" cy="43" r="8" fill="#FFFFFF" opacity=".75"/>'),
  bronzeShield: () => svgBox('<circle cx="50" cy="50" r="32" fill="#C98A3D"/>' +
    '<circle cx="50" cy="50" r="24" fill="none" stroke="#8A5A20" stroke-width="3"/>' +
    '<circle cx="50" cy="50" r="9" fill="#FFD79A"/>' +
    '<path d="M50 18 v12 M50 70 v12 M18 50 h12 M70 50 h12" stroke="#8A5A20" stroke-width="3"/>'),
  fleeceTuft: () => svgBox('<g fill="#F2D98A">' +
    '<circle cx="40" cy="46" r="13"/><circle cx="58" cy="42" r="15"/><circle cx="52" cy="60" r="14"/>' +
    '<circle cx="36" cy="60" r="11"/></g>' +
    '<circle cx="58" cy="38" r="4" fill="#FFF6DA" opacity=".8"/>'),
  owlFeather: () => svgBox('<path d="M50 16 q18 22 12 44 q-4 16 -12 24 q-8 -8 -12 -24 q-6 -22 12 -44z" ' +
    'fill="#C9BCA4"/><path d="M50 20 v62" stroke="#8A7E6A" stroke-width="2"/>' +
    '<path d="M50 34 l-9 6 M50 46 l9 6 M50 58 l-9 6" stroke="#8A7E6A" stroke-width="1.4"/>'),
  lightningShard: () => svgBox('<path d="M58 12 L34 54 h16 L42 88 L70 44 h-16z" fill="#FFF6C9"/>' +
    '<path d="M58 12 L34 54 h16 L42 88 L70 44 h-16z" fill="none" stroke="#E3B23C" stroke-width="2"/>'),
  pomegranateSeed: () => svgBox('<ellipse cx="50" cy="52" rx="20" ry="26" fill="#E2543A"/>' +
    '<ellipse cx="44" cy="44" rx="7" ry="9" fill="#FFB0A0" opacity=".75"/>' +
    '<path d="M50 26 l-5 -8 h10z" fill="#7A1F16"/>'),
  laurelCrown: () => svgBox('<path d="M22 62 q28 22 56 0" stroke="#8A7A2E" stroke-width="3" fill="none"/>' +
    '<g fill="#D8C87A">' +
    '<ellipse cx="30" cy="58" rx="8" ry="4" transform="rotate(-40 30 58)"/>' +
    '<ellipse cx="40" cy="66" rx="8" ry="4" transform="rotate(-20 40 66)"/>' +
    '<ellipse cx="60" cy="66" rx="8" ry="4" transform="rotate(20 60 66)"/>' +
    '<ellipse cx="70" cy="58" rx="8" ry="4" transform="rotate(40 70 58)"/></g>' +
    '<circle cx="50" cy="68" r="4" fill="#E3B23C"/>'),
  lyreString: () => svgBox('<path d="M32 76 q-8 -40 8 -56" stroke="#C9922E" stroke-width="5" fill="none"/>' +
    '<path d="M68 76 q8 -40 -8 -56" stroke="#C9922E" stroke-width="5" fill="none"/>' +
    '<path d="M28 74 h44" stroke="#8A6238" stroke-width="4"/>' +
    '<g stroke="#FFF6DA" stroke-width="1.6"><path d="M42 24 v50 M50 22 v52 M58 24 v50"/></g>'),
  bronzeGear: () => svgBox('<g class="a-spin" style="transform-origin:50px 50px">' +
    '<circle cx="50" cy="50" r="24" fill="#C98A3D"/>' +
    '<circle cx="50" cy="50" r="10" fill="#3A2A18"/>' +
    '<g fill="#C98A3D"><rect x="45" y="16" width="10" height="12" rx="2"/>' +
    '<rect x="45" y="72" width="10" height="12" rx="2"/>' +
    '<rect x="16" y="45" width="12" height="10" rx="2"/>' +
    '<rect x="72" y="45" width="12" height="10" rx="2"/></g></g>'),
  styxVial: () => svgBox('<path d="M40 24 h20 v16 l8 14 v26 q0 8 -8 8 h-20 q-8 0 -8 -8 V54 l8 -14z" ' +
    'fill="#1A2C28" stroke="#4EE59A" stroke-width="2"/>' +
    '<path d="M34 62 h32 v20 q0 6 -6 6 h-20 q-6 0 -6 -6z" fill="#4EE59A" opacity=".8" class="a-shimmer"/>' +
    '<rect x="38" y="18" width="24" height="8" rx="3" fill="#5A4632"/>'),
  irisPrism: () => svgBox('<path d="M50 16 L80 74 H20z" fill="#EDE6F2" opacity=".55"/>' +
    '<path d="M50 16 L80 74 H20z" fill="none" stroke="#CFF8FF" stroke-width="2"/>' +
    '<g class="a-shimmer"><path d="M50 44 L92 34" stroke="#E2543A" stroke-width="2.4"/>' +
    '<path d="M50 48 L94 44" stroke="#F2B544" stroke-width="2.4"/>' +
    '<path d="M50 52 L94 54" stroke="#8ED17F" stroke-width="2.4"/>' +
    '<path d="M50 56 L92 64" stroke="#7CD8F0" stroke-width="2.4"/></g>'),
  helm: () => svgBox('<path d="M28 70 q0 -40 22 -40 t22 40 q-10 8 -22 8 t-22 -8z" fill="#1A1520"/>' +
    '<path d="M28 70 q0 -40 22 -40 t22 40" fill="none" stroke="#9B6BD9" stroke-width="2"/>' +
    '<path d="M40 54 h6 v10 h-6z M54 54 h6 v10 h-6z" fill="#4EE59A" opacity=".9" class="a-shimmer"/>' +
    '<path d="M50 22 q10 2 12 10 q-12 -4 -24 0 q2 -8 12 -10z" fill="#9B6BD9"/>'),
};

/* =========================================================================
   4. GOD SYMBOLS — the sigil that ignites over your head at the claiming
   ========================================================================= */

function sigilFrame(inner, colour) {
  const g = uid('sf');
  return svgBox(
    '<defs>' + rg(g, [[0, colour, 0.55], [0.65, colour, 0.12], [1, colour, 0]]) + '</defs>' +
    '<circle cx="50" cy="50" r="50" fill="url(#' + g + ')"/>' +
    '<g class="spin" opacity=".55">' +
      '<circle cx="50" cy="50" r="44" fill="none" stroke="' + colour + '" stroke-width="1" ' +
        'stroke-dasharray="2 7"/>' +
      '<circle cx="50" cy="50" r="38" fill="none" stroke="' + colour + '" stroke-width=".8" ' +
        'stroke-dasharray="14 9"/>' +
    '</g>' +
    '<g stroke="' + colour + '" fill="none" stroke-width="3.2" stroke-linecap="round" ' +
      'stroke-linejoin="round">' + inner + '</g>');
}

const Sigil = {
  lightning: (c) => sigilFrame('<path d="M58 20 L38 52 h14 L42 80 L66 46 h-14z" fill="' + c +
    '" fill-opacity=".22"/>', c),
  trident: (c) => sigilFrame('<path d="M50 24 v56 M30 34 v14 q0 10 20 10 t20 -10 V34 M50 30 v28"/>' +
    '<path d="M26 30 l4 -8 l4 8 M46 26 l4 -8 l4 8 M66 30 l4 -8 l4 8"/>', c),
  helm: (c) => sigilFrame('<path d="M30 70 q0 -42 20 -42 t20 42 q-9 8 -20 8 t-20 -8z"/>' +
    '<path d="M42 52 v10 M58 52 v10"/>', c),
  owlSigil: (c) => sigilFrame('<path d="M28 46 q22 -22 44 0 M32 44 a20 26 0 1 0 36 0"/>' +
    '<circle cx="41" cy="46" r="7"/><circle cx="59" cy="46" r="7"/>' +
    '<path d="M50 52 l-4 6 l4 4 l4 -4z"/>', c),
  lyre: (c) => sigilFrame('<path d="M32 76 q-8 -42 8 -56 M68 76 q8 -42 -8 -56 M28 74 h44"/>' +
    '<path d="M42 26 v48 M50 22 v52 M58 26 v48" stroke-width="1.6"/>', c),
  spear: (c) => sigilFrame('<path d="M28 78 L72 24 M72 78 L28 24"/>' +
    '<path d="M72 24 l-3 -8 l8 3z" fill="' + c + '"/><path d="M28 24 l3 -8 l-8 3z" fill="' + c + '"/>', c),
  dove: (c) => sigilFrame('<path d="M34 58 q-10 -18 8 -24 q16 -6 24 8 q10 -4 12 4 q-4 6 -12 4 ' +
    'q2 16 -14 20 q-16 4 -18 -12z"/><path d="M42 46 q10 -10 20 -2"/><circle cx="60" cy="42" r="1.6" fill="' + c + '"/>', c),
  hammer: (c) => sigilFrame('<rect x="46" y="42" width="8" height="40" rx="3"/>' +
    '<rect x="26" y="24" width="48" height="20" rx="4"/><path d="M38 44 v-20 M62 44 v-20"/>', c),
  caduceus: (c) => sigilFrame('<path d="M50 22 v58"/>' +
    '<path d="M50 34 q-14 6 0 14 q14 8 0 16 q-14 8 0 14"/>' +
    '<path d="M50 34 q14 6 0 14 q-14 8 0 16 q14 8 0 14"/>' +
    '<path d="M38 26 q12 -12 24 0"/>', c),
  wheat: (c) => sigilFrame('<path d="M50 82 V28"/>' +
    '<path d="M50 34 q-12 2 -12 12 q12 0 12 -12 M50 34 q12 2 12 12 q-12 0 -12 -12"/>' +
    '<path d="M50 48 q-12 2 -12 12 q12 0 12 -12 M50 48 q12 2 12 12 q-12 0 -12 -12"/>' +
    '<path d="M50 62 q-12 2 -12 12 q12 0 12 -12 M50 62 q12 2 12 12 q-12 0 -12 -12"/>', c),
  thyrsus: (c) => sigilFrame('<path d="M50 84 V30"/>' +
    '<path d="M50 30 q-10 -10 -2 -16 q10 4 8 14 q8 -8 14 0 q-8 8 -16 4"/>' +
    '<path d="M50 44 q-14 -2 -14 10 q14 2 14 -10 M50 58 q14 -2 14 10 q-14 2 -14 -10"/>' +
    '<circle cx="40" cy="72" r="3" fill="' + c + '"/><circle cx="60" cy="76" r="3" fill="' + c + '"/>', c),
  torches: (c) => sigilFrame('<path d="M32 84 V46 M68 84 V46"/>' +
    '<path d="M32 46 q-8 -12 0 -22 q8 10 0 22z" fill="' + c + '" fill-opacity=".25"/>' +
    '<path d="M68 46 q-8 -12 0 -22 q8 10 0 22z" fill="' + c + '" fill-opacity=".25"/>' +
    '<path d="M32 62 h36"/>', c),
  scales: (c) => sigilFrame('<path d="M50 20 v56 M28 32 h44 M50 76 h-14 M50 76 h14"/>' +
    '<path d="M28 32 l-10 18 h20z"/><path d="M72 32 l-10 18 h20z"/>', c),
  rainbow: (c) => sigilFrame('<path d="M18 74 a32 32 0 0 1 64 0"/>' +
    '<path d="M26 74 a24 24 0 0 1 48 0" stroke-width="2.4"/>' +
    '<path d="M34 74 a16 16 0 0 1 32 0" stroke-width="1.8"/>' +
    '<circle cx="50" cy="30" r="3" fill="' + c + '"/>', c),
};

/* =========================================================================
   5. CREATURES — sacred animals and the NPCs beside the path
   ========================================================================= */

const Beast = {
  owl: Art.animal.owl,
  boar: Art.animal.boar,
  stag: Art.animal.stag,
  hawk: Art.animal.hawk,
  hellhoundPup: Art.animal.hellhoundPup,

  eagle: () => svgBox(halo('#FFF6C9', 50, 50, 44, 0.3) +
    '<g class="a-breathe"><path d="M50 34 q26 2 40 26 q-22 -8 -40 -6z" fill="#6B4E2E"/>' +
    '<path d="M50 34 q-26 2 -40 26 q22 -8 40 -6z" fill="#7A5C38"/>' +
    '<ellipse cx="50" cy="50" rx="12" ry="20" fill="#8A6A44"/>' +
    '<circle cx="50" cy="28" r="10" fill="#F7EBD3"/>' +
    '<circle cx="46" cy="26" r="2.4" fill="#3A2A18" class="a-blink"/>' +
    '<path d="M50 30 l-5 4 l5 4 l5 -4z" fill="#E3B23C"/></g>'),

  dolphin: () => svgBox(halo('#4FD1D9', 50, 50, 44, 0.34) +
    '<g class="a-bob"><path d="M14 56 q22 -26 52 -18 q22 6 22 16 q-18 -4 -26 6 q-16 18 -48 -4z" ' +
    'fill="#6FB8D0"/><path d="M20 58 q20 12 40 2 q-16 14 -40 -2z" fill="#CFE8F0"/>' +
    '<path d="M48 38 l6 -16 l10 14z" fill="#5AA0BC"/>' +
    '<path d="M88 54 l10 -10 l0 20z" fill="#5AA0BC" class="a-tail" style="transform-origin:88px 54px"/>' +
    '<circle cx="26" cy="52" r="2" fill="#16303C" class="a-blink"/>' +
    '<path d="M16 58 q6 3 12 1" stroke="#16303C" stroke-width="1.4" fill="none"/></g>'),

  swan: () => svgBox(halo('#FFF6DA', 50, 52, 44, 0.34) +
    '<g class="a-bob"><ellipse cx="54" cy="64" rx="26" ry="16" fill="#F7F3EA"/>' +
    '<path d="M36 60 q-6 -26 8 -32 q10 -4 12 4 q-8 0 -8 8 q0 12 4 20z" fill="#FBF8F2"/>' +
    '<circle cx="52" cy="30" r="2" fill="#3A2A18" class="a-blink"/>' +
    '<path d="M56 32 l7 2 l-7 3z" fill="#E3B23C"/>' +
    '<path d="M42 58 q16 -12 34 -2 q-14 12 -34 2z" fill="#EDE6D8"/></g>'),

  peacock: () => {
    let fan = '';
    for (let i = -4; i <= 4; i++) {
      fan += '<g transform="rotate(' + (i * 12) + ' 50 74)">' +
        '<path d="M50 74 v-44" stroke="#2E7A6E" stroke-width="2"/>' +
        '<ellipse cx="50" cy="30" rx="5" ry="7" fill="#1E6A8C"/>' +
        '<ellipse cx="50" cy="30" rx="2.6" ry="3.6" fill="#E3B23C"/></g>';
    }
    return svgBox(halo('#4FD1D9', 50, 54, 44, 0.34) +
      '<g class="a-sway" style="transform-origin:50% 74px">' + fan + '</g>' +
      '<g class="a-breathe"><ellipse cx="50" cy="74" rx="12" ry="14" fill="#1E5A8C"/>' +
      '<circle cx="50" cy="58" r="7" fill="#2E7AAC"/>' +
      '<circle cx="47" cy="56" r="1.8" fill="#0A1A2A" class="a-blink"/>' +
      '<path d="M50 44 v-6 M46 46 l-2 -6 M54 46 l2 -6" stroke="#4FD1D9" stroke-width="1.6"/>' +
      '<path d="M56 58 l7 2 l-7 3z" fill="#E3B23C"/></g>');
  },

  automatonOx: () => svgBox(halo('#FF8A3D', 50, 54, 44, 0.36) +
    '<g class="a-breathe"><rect x="24" y="46" width="52" height="28" rx="6" fill="#C98A3D"/>' +
    '<rect x="14" y="40" width="24" height="22" rx="5" fill="#B87A2E"/>' +
    '<path d="M16 40 q-6 -10 2 -12 q6 2 4 12 M34 40 q6 -10 -2 -12 q-6 2 -4 12" fill="#E8DCC0"/>' +
    '<circle cx="22" cy="50" r="2.6" fill="#FF6B35" class="a-shimmer"/>' +
    '<g stroke="#8A5A20" stroke-width="5" stroke-linecap="round">' +
    '<path d="M34 74 v10"/><path d="M48 74 v10"/><path d="M64 74 v10"/></g>' +
    '<circle cx="52" cy="58" r="6" fill="#8A5A20"/>' +
    '<g class="a-spin" style="transform-origin:52px 58px">' +
    '<path d="M52 52 v4 M52 60 v4 M46 58 h4 M54 58 h4" stroke="#FFD79A" stroke-width="2"/></g></g>'),

  mouse: () => svgBox(halo('#F2B544', 50, 56, 42, 0.3) +
    '<g class="a-breathe"><ellipse cx="54" cy="60" rx="22" ry="15" fill="#9A8A78"/>' +
    '<circle cx="32" cy="54" r="12" fill="#A99884"/>' +
    '<circle cx="26" cy="42" r="8" fill="#C4A898"/><circle cx="40" cy="40" r="8" fill="#C4A898"/>' +
    '<circle cx="24" cy="54" r="2" fill="#241C16" class="a-blink"/>' +
    '<ellipse cx="19" cy="58" rx="3" ry="2.4" fill="#E0A0A0"/>' +
    '<path d="M18 56 l-10 -4 M18 60 l-10 2" stroke="#C9BCA4" stroke-width="1"/>' +
    '<path d="M76 60 q14 -2 12 -16" stroke="#9A8A78" stroke-width="2.6" fill="none" ' +
    'class="a-tail" style="transform-origin:76px 60px"/></g>'),

  leopard: () => {
    let spots = '';
    [[42, 58], [54, 54], [64, 60], [50, 66], [70, 52], [36, 66]].forEach((p, i) => {
      spots += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.4" fill="none" stroke="#3A2A16" ' +
        'stroke-width="2" opacity=".85"/>';
    });
    return svgBox(halo('#9B6BD9', 50, 56, 44, 0.34) +
      '<g class="a-breathe"><ellipse cx="54" cy="60" rx="28" ry="16" fill="#E0A83E"/>' +
      spots +
      '<circle cx="26" cy="50" r="12" fill="#E8B84E"/>' +
      '<path d="M18 42 l-2 -8 l8 4z M34 40 l4 -8 l4 8z" fill="#C9922E"/>' +
      '<circle cx="21" cy="49" r="2.4" fill="#2E7A4E" class="a-blink"/>' +
      '<circle cx="30" cy="48" r="2.4" fill="#2E7A4E" class="a-blink"' + dly(2) + '/>' +
      '<path d="M25 55 l-3 3 l3 2 l3 -2z" fill="#3A2A16"/>' +
      '<g stroke="#D89A34" stroke-width="5" stroke-linecap="round">' +
      '<path d="M42 74 v9"/><path d="M56 76 v8"/><path d="M70 72 v10"/></g>' +
      '<path d="M80 56 q14 -8 8 -22" stroke="#E0A83E" stroke-width="3.4" fill="none" ' +
      'class="a-tail" style="transform-origin:80px 56px"/></g>');
  },

  serpent: () => svgBox(halo('#B98CF0', 50, 52, 44, 0.36) +
    '<g class="a-wave"><path d="M12 78 q18 -14 30 0 q12 14 26 -4 q10 -14 20 -4" ' +
    'stroke="#4E8A5E" stroke-width="11" fill="none" stroke-linecap="round"/>' +
    '<path d="M12 78 q18 -14 30 0 q12 14 26 -4 q10 -14 20 -4" stroke="#7EC08E" stroke-width="4" ' +
    'fill="none" stroke-linecap="round" opacity=".7" stroke-dasharray="5 7"/></g>' +
    '<g class="a-bob"><path d="M84 40 q10 -12 4 -20 q-12 -2 -14 10z" fill="#6EA87E"/>' +
    '<circle cx="82" cy="28" r="2" fill="#F2B544" class="a-blink"/>' +
    '<path d="M76 34 l-8 4 l8 1z" fill="#E2543A"/></g>'),

  honeybee: () => svgBox(halo('#F2B544', 50, 52, 42, 0.36) +
    '<g class="a-bob"><ellipse cx="52" cy="56" rx="20" ry="15" fill="#E3B23C"/>' +
    '<path d="M44 43 v26 M54 42 v28 M64 46 v20" stroke="#2A2018" stroke-width="5"/>' +
    '<circle cx="30" cy="52" r="10" fill="#3A2C1E"/>' +
    '<circle cx="26" cy="50" r="2.2" fill="#FFF6DA" class="a-blink"/>' +
    '<path d="M28 42 l-4 -10 M34 42 l3 -11" stroke="#3A2C1E" stroke-width="1.6"/>' +
    '<circle cx="24" cy="32" r="2" fill="#3A2C1E"/><circle cx="37" cy="31" r="2" fill="#3A2C1E"/>' +
    '<path d="M72 62 l8 6 l-9 2z" fill="#2A2018"/></g>' +
    '<g class="a-swayFast" style="transform-origin:50px 44px" opacity=".72">' +
    '<ellipse cx="44" cy="38" rx="13" ry="7" fill="#EDE6F2" transform="rotate(-24 44 38)"/>' +
    '<ellipse cx="60" cy="38" rx="13" ry="7" fill="#EDE6F2" transform="rotate(24 60 38)"/></g>'),

  /* --- NPCs that appear beside the running path --- */
  centaur: () => svgBox(
    '<g class="a-breathe"><ellipse cx="56" cy="60" rx="26" ry="15" fill="#8A5A34"/>' +
    '<g stroke="#7A4E2C" stroke-width="6" stroke-linecap="round">' +
    '<path d="M38 72 v16"/><path d="M52 74 v14"/><path d="M68 72 v16"/><path d="M78 68 v18"/></g>' +
    '<path d="M32 56 q-4 -22 4 -30" stroke="#C98A5E" stroke-width="11" stroke-linecap="round" fill="none"/>' +
    '<circle cx="36" cy="22" r="8" fill="#C98A5E"/>' +
    '<path d="M28 18 q8 -8 16 0 q-8 -3 -16 0z" fill="#4A3A2A"/>' +
    '<path d="M42 32 l16 -8" stroke="#8A6238" stroke-width="2.6"/>' +
    '<path d="M82 52 q10 -4 8 -14" stroke="#6B4020" stroke-width="3" fill="none" class="a-tail" ' +
    'style="transform-origin:82px 52px"/></g>'),

  pegasus: () => svgBox(
    '<g class="a-bob"><ellipse cx="54" cy="56" rx="24" ry="13" fill="#F2EDE2"/>' +
    '<path d="M32 52 q-6 -18 2 -24 q8 -2 8 6 q0 10 4 16z" fill="#F7F3EA"/>' +
    '<circle cx="36" cy="30" r="2" fill="#3A2A18" class="a-blink"/>' +
    '<path d="M40 34 l8 2 l-8 3z" fill="#E3B23C"/>' +
    '<g stroke="#E8E0D0" stroke-width="5" stroke-linecap="round">' +
    '<path d="M42 66 v14"/><path d="M56 68 v12"/><path d="M70 64 v16"/></g>' +
    '<path d="M76 52 q12 -6 10 -18" stroke="#F2EDE2" stroke-width="3" fill="none"/></g>' +
    '<g class="a-swayFast" style="transform-origin:56px 50px">' +
    '<path d="M50 48 q-8 -26 8 -34 q6 18 12 30z" fill="#FFFFFF" opacity=".92"/>' +
    '<path d="M56 46 q4 -22 18 -26 q-2 18 -6 28z" fill="#EDE6F2" opacity=".85"/></g>'),

  dryad: () => svgBox(
    '<path d="M34 100 V26 q0 -12 16 -12 t16 12 v74z" fill="#3A2A1E"/>' +
    '<path d="M40 100 V32 M60 100 V30" stroke="#2A1E14" stroke-width="2" opacity=".7"/>' +
    '<g class="a-breathe">' +
    '<ellipse cx="50" cy="46" rx="11" ry="14" fill="#4A3626"/>' +
    '<circle cx="45" cy="43" r="2.6" fill="#8ED17F" class="a-blink"/>' +
    '<circle cx="55" cy="43" r="2.6" fill="#8ED17F" class="a-blink"' + dly(2) + '/>' +
    '<path d="M45 54 q5 4 10 0" stroke="#2A1E14" stroke-width="1.6" fill="none"/></g>' +
    '<g class="a-sway" style="transform-origin:50% 20px">' +
    '<path d="M34 24 q-14 -8 -18 -20 q16 2 20 14z" fill="#3E8E5A"/>' +
    '<path d="M66 22 q14 -10 18 -22 q-16 2 -20 16z" fill="#5EA85C"/>' +
    '<path d="M50 14 q-4 -16 2 -22 q6 8 2 22z" fill="#8ED17F"/></g>'),

  myrmeke: () => svgBox(
    '<g class="a-breathe"><ellipse cx="64" cy="60" rx="20" ry="14" fill="#5A3A18"/>' +
    '<ellipse cx="44" cy="58" rx="11" ry="9" fill="#6B4820"/>' +
    '<circle cx="28" cy="54" r="11" fill="#7A5626"/>' +
    '<circle cx="24" cy="51" r="2.4" fill="#1A1008" class="a-shimmer"/>' +
    '<path d="M20 46 l-8 -12 M30 44 l4 -14" stroke="#7A5626" stroke-width="2.6" ' +
    'stroke-linecap="round" class="a-sway" style="transform-origin:26px 48px"/>' +
    '<path d="M18 58 l-10 4 M18 62 l-8 8" stroke="#4A2E10" stroke-width="3" stroke-linecap="round"/>' +
    '<g stroke="#5A3A18" stroke-width="3" stroke-linecap="round">' +
    '<path d="M40 66 l-6 14"/><path d="M52 68 l2 14"/><path d="M66 70 l8 12"/></g></g>'),

  wolf: () => svgBox(
    '<g class="a-breathe"><ellipse cx="56" cy="62" rx="24" ry="14" fill="#3A3E48"/>' +
    '<circle cx="34" cy="52" r="13" fill="#454A56"/>' +
    '<path d="M24 42 l-2 -12 l11 6z M42 40 l4 -12 l7 10z" fill="#3A3E48"/>' +
    '<ellipse cx="22" cy="56" rx="7" ry="5" fill="#2E323C"/>' +
    '<circle cx="18" cy="55" r="1.6" fill="#0A0C10"/>' +
    '<circle cx="30" cy="50" r="2.4" fill="#FFD98A" class="a-blink"/>' +
    '<g stroke="#3A3E48" stroke-width="5" stroke-linecap="round">' +
    '<path d="M44 74 v10"/><path d="M58 76 v9"/><path d="M70 74 v10"/></g>' +
    '<path d="M78 56 q12 -4 10 -16" stroke="#454A56" stroke-width="4" fill="none" class="a-tail" ' +
    'style="transform-origin:78px 56px"/></g>'),

  satyr: () => svgBox(
    '<g class="a-breathe"><path d="M42 96 V66 h16 v30" fill="#6B5236"/>' +
    '<path d="M42 66 h16 v-4 q0 -10 -8 -10 t-8 10z" fill="#3E8E5A"/>' +
    '<circle cx="50" cy="38" r="11" fill="#B9784A"/>' +
    '<path d="M40 30 q10 -10 20 0 q-10 -4 -20 0z" fill="#5A3A22"/>' +
    '<path d="M40 28 q-6 -10 0 -14 q4 6 2 14z M60 28 q6 -10 0 -14 q-4 6 -2 14z" fill="#C9BCA4"/>' +
    '<circle cx="46" cy="38" r="2" fill="#2A1E14" class="a-blink"/>' +
    '<circle cx="54" cy="38" r="2" fill="#2A1E14" class="a-blink"' + dly(2) + '/>' +
    '<path d="M46 44 q4 3 8 0" stroke="#2A1E14" stroke-width="1.4" fill="none"/>' +
    '<g stroke="#C9A05E" stroke-width="3"><path d="M62 58 v14 M67 58 v12 M72 58 v10"/></g></g>'),

  naiad: () => svgBox(
    '<g class="a-bob"><path d="M50 92 q-14 -10 -12 -30 q2 -18 12 -22 q10 4 12 22 q2 20 -12 30z" ' +
    'fill="#4FD1D9" opacity=".75"/>' +
    '<circle cx="50" cy="34" r="10" fill="#CFE8F0"/>' +
    '<path d="M40 30 q10 -12 20 0 q-4 -8 -10 -8 t-10 8z" fill="#1E7A8C"/>' +
    '<circle cx="46" cy="34" r="2" fill="#0A2A43" class="a-blink"/>' +
    '<circle cx="54" cy="34" r="2" fill="#0A2A43" class="a-blink"' + dly(1) + '/>' +
    '<path d="M46 40 q4 3 8 0" stroke="#0A2A43" stroke-width="1.2" fill="none"/>' +
    '<path d="M62 44 q14 -6 18 -18" stroke="#CFE8F0" stroke-width="3" fill="none" ' +
    'class="a-sway" style="transform-origin:62px 44px"/></g>'),

  hippocampus: () => svgBox(
    '<g class="a-bob"><path d="M22 44 q-6 -18 6 -24 q10 -2 10 8 q0 10 4 16z" fill="#4FD1D9"/>' +
    '<circle cx="26" cy="22" r="2" fill="#0A2A43" class="a-blink"/>' +
    '<path d="M30 26 l9 2 l-9 4z" fill="#1E7A8C"/>' +
    '<path d="M22 18 q10 -10 18 -4 q-10 0 -14 8z" fill="#CFF8FF" opacity=".8" class="a-sway"/>' +
    '<ellipse cx="50" cy="56" rx="26" ry="14" fill="#5AC0D0"/>' +
    '<path d="M74 54 q16 -8 22 -26 q2 22 -10 32 q10 6 8 22 q-14 -12 -22 -18z" fill="#4FD1D9" ' +
    'class="a-wave"/>' +
    '<path d="M36 66 q8 8 4 18 M52 70 q6 8 2 16" stroke="#3AA8B8" stroke-width="4" ' +
    'stroke-linecap="round" fill="none"/></g>'),

  jellyfish: () => svgBox(
    '<g class="a-bob"><path d="M26 46 q0 -24 24 -24 t24 24 q-12 8 -24 8 t-24 -8z" fill="#F7C9C0" ' +
    'opacity=".8"/>' +
    '<g class="a-wave" stroke="#EDE6F2" stroke-width="2.4" fill="none" opacity=".8">' +
    '<path d="M34 52 q-4 20 2 34"/><path d="M44 54 q4 22 -2 36"/>' +
    '<path d="M56 54 q-4 22 2 36"/><path d="M66 52 q4 20 -2 34"/></g>' +
    '<circle cx="42" cy="38" r="2.4" fill="#fff" opacity=".7"/></g>'),

  fishSchool: () => {
    let f = '';
    for (let i = 0; i < 9; i++) {
      const x = 12 + (i % 5) * 18, y = 30 + Math.floor(i / 5) * 24 + (i % 3) * 6;
      f += '<g class="a-driftX"' + dly(i * 2) + '><path d="M' + x + ' ' + y + ' q8 -5 14 0 q-6 5 -14 0z" ' +
        'fill="#7CD8F0"/><path d="M' + x + ' ' + y + ' l-5 -3 v6z" fill="#4FD1D9"/></g>';
    }
    return svgBox(f);
  },

  spirit: () => svgBox(
    '<g class="a-bob"><path d="M50 16 q18 0 18 26 q0 22 -6 34 q-4 8 -12 8 t-12 -8 q-6 -12 -6 -34 ' +
    'q0 -26 18 -26z" fill="#E8E2D0" opacity=".38"/>' +
    '<path d="M50 20 q14 0 14 22 q0 18 -5 28" stroke="#E8E2D0" stroke-width="1.4" fill="none" ' +
    'opacity=".55"/>' +
    '<circle cx="44" cy="42" r="2.6" fill="#9B6BD9" class="a-shimmer"/>' +
    '<circle cx="56" cy="42" r="2.6" fill="#9B6BD9" class="a-shimmer"' + dly(2) + '/></g>'),

  cerberus: () => svgBox(
    '<g class="a-breathe"><ellipse cx="54" cy="70" rx="34" ry="20" fill="#0E0C14"/>' +
    '<circle cx="26" cy="50" r="13" fill="#141020"/>' +
    '<circle cx="50" cy="42" r="14" fill="#181428"/>' +
    '<circle cx="74" cy="50" r="13" fill="#141020"/>' +
    '<g fill="#FF6B35">' +
    '<circle cx="21" cy="47" r="2.4" class="a-blink"/><circle cx="30" cy="47" r="2.4" class="a-blink"' + dly(1) + '/>' +
    '<circle cx="45" cy="39" r="2.6" class="a-blink"' + dly(2) + '/><circle cx="55" cy="39" r="2.6" class="a-blink"' + dly(3) + '/>' +
    '<circle cx="69" cy="47" r="2.4" class="a-blink"' + dly(4) + '/><circle cx="78" cy="47" r="2.4" class="a-blink"' + dly(5) + '/></g>' +
    '<g stroke="#0E0C14" stroke-width="8" stroke-linecap="round">' +
    '<path d="M34 88 v10"/><path d="M54 90 v8"/><path d="M74 88 v10"/></g></g>'),

  charon: () => svgBox(
    '<g class="a-bob"><path d="M8 74 q42 20 84 0 l-8 14 h-68z" fill="#2A2436"/>' +
    '<path d="M60 72 V26" stroke="#4A3E58" stroke-width="4"/>' +
    '<g class="a-sway" style="transform-origin:60px 72px">' +
    '<path d="M36 70 L18 90" stroke="#5A4E68" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M18 90 l-8 6 l4 -10z" fill="#4EE59A"/></g>' +
    '<path d="M50 72 q-6 -30 6 -36 q10 4 8 36z" fill="#1A1626"/>' +
    '<circle cx="56" cy="36" r="7" fill="#241E32"/>' +
    '<circle cx="54" cy="35" r="1.8" fill="#4EE59A" class="a-shimmer"/>' +
    '<circle cx="60" cy="35" r="1.8" fill="#4EE59A" class="a-shimmer"' + dly(2) + '/></g>' +
    '<circle cx="80" cy="30" r="5" fill="#FF6B35" class="a-flicker"/>'),

  hestia: () => svgBox(
    '<g class="a-breathe"><path d="M50 92 q-10 -6 -10 -22 q0 -14 10 -18 q10 4 10 18 q0 16 -10 22z" ' +
    'fill="#E2543A" opacity=".9"/>' +
    '<circle cx="50" cy="34" r="9" fill="#E8C1A0"/>' +
    '<path d="M41 30 q9 -10 18 0 q-4 -8 -9 -8 t-9 8z" fill="#7A4E28"/>' +
    '<circle cx="46" cy="34" r="1.8" fill="#2A1E14" class="a-blink"/>' +
    '<circle cx="54" cy="34" r="1.8" fill="#2A1E14" class="a-blink"' + dly(1) + '/></g>' +
    '<g class="a-flicker"><path d="M22 88 q4 -22 12 -26 q-2 12 4 16 q2 -14 8 -18 q4 20 -4 28z" ' +
    'fill="#FF8A3D"/><path d="M26 88 q4 -14 8 -16 q0 8 4 10 q0 -8 4 -10 q2 12 -2 16z" ' +
    'fill="#FFE9AE"/></g>'),

  muse: () => svgBox(
    '<g class="a-bob"><path d="M50 94 q-12 -8 -12 -26 q0 -16 12 -20 q12 4 12 20 q0 18 -12 26z" ' +
    'fill="#F5CBD8"/>' +
    '<circle cx="50" cy="36" r="9" fill="#EDD0B4"/>' +
    '<path d="M41 32 q9 -12 18 0 q-2 -10 -9 -10 t-9 10z" fill="#3A2A18"/>' +
    '<circle cx="46" cy="36" r="1.8" fill="#2A1E14" class="a-blink"/>' +
    '<circle cx="54" cy="36" r="1.8" fill="#2A1E14" class="a-blink"' + dly(2) + '/></g>' +
    '<g class="a-sway" style="transform-origin:70px 66px">' +
    '<path d="M64 66 q-6 -24 4 -32 M78 66 q6 -24 -4 -32" stroke="#E3B23C" stroke-width="3" fill="none"/>' +
    '<path d="M62 66 h18" stroke="#C9922E" stroke-width="3"/></g>' +
    '<g class="a-rise" fill="#FFF6DA"' + dly(2) + '><circle cx="80" cy="40" r="2"/></g>'),
};

/* =========================================================================
   6. UI GLYPHS
   ========================================================================= */

const Glyph = {
  chevron: (dir) => ({ UP: '▲', RIGHT: '▶', DOWN: '▼', LEFT: '◀', CENTRE: 'TAP' }[dir] || ''),

  soundOn: () => svgBox('<path d="M10 38 h14 L42 22 v56 L24 62 H10z" fill="currentColor"/>' +
    '<path d="M54 34 q10 16 0 32 M66 26 q18 24 0 48" stroke="currentColor" stroke-width="6" ' +
    'fill="none" stroke-linecap="round"/>'),
  soundOff: () => svgBox('<path d="M10 38 h14 L42 22 v56 L24 62 H10z" fill="currentColor"/>' +
    '<path d="M56 36 L84 64 M84 36 L56 64" stroke="currentColor" stroke-width="7" ' +
    'stroke-linecap="round"/>'),
  motion: () => svgBox('<circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" ' +
    'stroke-width="7" stroke-dasharray="10 9"/><circle cx="50" cy="50" r="9" fill="currentColor"/>'),
  motionOff: () => svgBox('<circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" ' +
    'stroke-width="7"/><circle cx="50" cy="50" r="9" fill="currentColor"/>' +
    '<path d="M26 74 L74 26" stroke="currentColor" stroke-width="7" stroke-linecap="round"/>'),

  /* the title crest: a lightning-lit laurel over an open gateway */
  crest: () => {
    const g = uid('cr');
    return svgBox('<defs>' + lg(g, [[0, '#FFF6DA'], [0.5, '#E3B23C'], [1, '#8A6220']]) + '</defs>' +
      '<g class="a-shimmer" opacity=".65">' +
        '<circle cx="60" cy="56" r="44" fill="none" stroke="#E3B23C" stroke-width=".8" ' +
          'stroke-dasharray="3 8"/></g>' +
      '<path d="M30 96 V44 q0 -22 30 -22 t30 22 v52" fill="none" stroke="url(#' + g + ')" ' +
        'stroke-width="5"/>' +
      '<path d="M44 96 V50 q0 -12 16 -12 t16 12 v46" fill="none" stroke="#C9922E" stroke-width="2.4" ' +
        'opacity=".8"/>' +
      '<g class="a-flicker">' +
        '<path d="M64 30 L52 56 h11 L56 82" stroke="#FFF6C9" stroke-width="3.4" fill="none" ' +
          'stroke-linejoin="round"/></g>' +
      '<g class="a-sway" style="transform-origin:60px 96px">' +
        '<path d="M22 96 q-8 -20 2 -34 q10 14 4 34z" fill="#8ED17F" opacity=".85"/>' +
        '<path d="M98 96 q8 -20 -2 -34 q-10 14 -4 34z" fill="#6EBF6A" opacity=".85"/></g>' +
      '<path d="M6 96 h108" stroke="#8A6220" stroke-width="3"/>',
      '0 0 120 100');
  },

  /* ghost hand for the one-time tutorial */
  hand: () => svgBox(
    '<g class="trace">' +
      '<path d="M46 62 q0 -22 6 -22 q4 0 4 8 v12 q4 -10 9 -8 q4 2 1 12 q6 -6 9 -2 q3 4 -2 12 ' +
        'q-6 12 -16 14 q-14 3 -18 -8 q-4 -12 7 -18z" fill="currentColor" opacity=".85"/>' +
      '<circle cx="52" cy="52" r="26" fill="none" stroke="currentColor" stroke-width="1.4" ' +
        'opacity=".4" class="a-pulse"/>' +
    '</g>' +
    '<g opacity=".45" stroke="currentColor" stroke-width="2" fill="none">' +
      '<path d="M50 14 v18 M50 88 v-18 M14 50 h18 M88 50 h-18"/>' +
      '<path d="M50 10 l-5 6 h10z" fill="currentColor"/>' +
      '<path d="M50 92 l-5 -6 h10z" fill="currentColor"/>' +
      '<path d="M10 50 l6 -5 v10z" fill="currentColor"/>' +
      '<path d="M92 50 l-6 -5 v10z" fill="currentColor"/>' +
    '</g>'),
};

/* -------------------------------------------------------------------------
   Look-up used by the junction: turn an option's {k, id} into markup.
   If a drawing is ever missing this returns a visible placeholder rather
   than an empty card, so the gap is obvious during development.
   ------------------------------------------------------------------------- */
function optionArt(art) {
  const group = Art[art.k];
  const fn = group && group[art.id];
  if (!fn) {
    if (DEV) console.warn('missing art:', art.k, art.id);
    return svgBox('<rect x="10" y="10" width="80" height="80" rx="10" fill="#5A1E18"/>' +
      '<text x="50" y="55" text-anchor="middle" font-size="11" fill="#FFD9A0">' +
      art.k + '/' + art.id + '</text>');
  }
  return fn();
}

function collectibleArt(id) {
  const fn = Collect[id];
  return fn ? fn() : Collect.drachma();
}

function beastArt(id) {
  const fn = Beast[id];
  return fn ? fn() : Beast.owl();
}
