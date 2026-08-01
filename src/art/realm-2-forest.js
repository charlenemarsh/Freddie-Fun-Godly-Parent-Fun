/* ===========================================================================
   realm-2-forest.js — THE FOREST
   ---------------------------------------------------------------------------
   Deep, whispering, ancient. Colossal trunks receding into fog, shafts of
   light cutting the canopy, dryad faces half-emerged from bark turning to
   watch as you pass.

   Wind moves the entire canopy layer in one slow sine wave — that is the
   signature of this realm, so the canopy group gets a single shared sway.
   =========================================================================== */

RealmArt.realm2 = {
  stripW: STRIP_W,

  /* --- L0 · almost no sky. What there is, is far above the canopy ----- */
  L0: () => {
    const sky = uid('r2');
    let gaps = '';
    [[300, 90, 120], [760, 60, 170], [1180, 100, 140]].forEach((c, i) => {
      gaps += '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="' + c[2] + '" ry="' + (c[2] * 0.4) +
        '" fill="#CFE8B8" opacity=".5"/>';
    });
    return strip(
      '<defs>' + lg(sky, [[0, '#1B3A2C'], [0.4, '#123B2A'], [1, '#0C1B2A']]) + '</defs>' +
      '<rect width="1600" height="900" fill="url(#' + sky + ')"/>' + gaps);
  },

  /* --- L1 · the far canopy line and the fog between the trunks -------- */
  L1: () => {
    let far = '';
    for (let i = 0; i < 14; i++) {
      const x = 30 + i * 118, w = 26 + (i % 3) * 10;
      far += '<rect x="' + x + '" y="120" width="' + w + '" height="' + (HORIZON - 100) +
        '" fill="#0F2E22" opacity=".8"/>';
    }
    // canopy: one shared sine sway across the whole layer
    let canopy = '';
    for (let i = 0; i < 18; i++) {
      const x = i * 96, y = 80 + (i % 4) * 34;
      canopy += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + (86 + (i % 3) * 22) + '" ry="' +
        (54 + (i % 2) * 18) + '" fill="#173D2C"/>';
    }
    return strip(
      '<g class="a-sway" style="transform-origin:800px 0px;animation-duration:11s">' + canopy + '</g>' +
      far +
      ridge(HORIZON - 20, 18, '#0E2A1E', 400, 0.9) +
      '<rect x="0" y="' + (HORIZON - 130) + '" width="1600" height="150" fill="#2B5940" opacity=".28"/>');
  },

  /* --- L2 · colossal trunks, Zeus's Fist, mushroom rings, the stream --- */
  L2: () => {
    let trunks = '';
    const xs = [90, 300, 520, 880, 1120, 1380];
    xs.forEach((x, i) => {
      const w = 52 + (i % 3) * 18;
      trunks += '<g>' +
        '<path d="M' + x + ' 560 l' + (-w * 0.5) + ' -' + (520 + i * 20) + ' h' + w + 'Z" fill="#22412E"/>' +
        '<path d="M' + x + ' 560 l' + (-w * 0.2) + ' -' + (520 + i * 20) + ' h' + (w * 0.36) +
          'Z" fill="#2E5540" opacity=".7"/>' +
        // root flare
        '<path d="M' + (x - w * 0.5) + ' 560 q' + (-w * 0.5) + ' -20 ' + (-w * 0.9) + ' -8 ' +
          'q' + (w * 0.6) + ' 26 ' + (w * 0.5) + ' 8Z" fill="#1C3728"/>' +
      '</g>';
    });
    // a dryad's face half-emerged from the bark, watching
    const dryad =
      '<g transform="translate(520 300) scale(1.5)">' +
        '<ellipse cx="0" cy="0" rx="26" ry="34" fill="#2E5540"/>' +
        '<g class="a-blink" style="transform-origin:0px -6px">' +
          '<ellipse cx="-9" cy="-6" rx="5" ry="6" fill="#8ED17F"/>' +
          '<ellipse cx="9" cy="-6" rx="5" ry="6" fill="#8ED17F"/>' +
          '<circle cx="-9" cy="-6" r="2.4" fill="#0C1B14"/><circle cx="9" cy="-6" r="2.4" fill="#0C1B14"/>' +
        '</g>' +
        '<path d="M-10 14 q10 7 20 0" stroke="#1C3728" stroke-width="2.6" fill="none"/>' +
        '<path d="M-26 -12 q-10 -14 -4 -26 M26 -12 q10 -14 4 -26" stroke="#3E8E5A" ' +
          'stroke-width="3" fill="none" class="a-sway"/>' +
      '</g>';
    // Zeus's Fist: a pile of boulders that from here looks like a raised hand
    const fist =
      '<g><ellipse cx="1240" cy="548" rx="110" ry="26" fill="#0E2A1E"/>' +
        '<path d="M1160 548 q-6 -66 34 -70 q40 -4 40 40 v30Z" fill="#5A5A52"/>' +
        '<path d="M1218 548 v-96 q0 -22 22 -22 t22 22 v96Z" fill="#6A6A60"/>' +
        '<path d="M1258 548 v-74 q0 -18 18 -18 t18 18 v74Z" fill="#5A5A52"/>' +
        '<path d="M1290 548 v-52 q0 -14 14 -14 t14 14 v52Z" fill="#4E4E46"/>' +
        '<path d="M1176 494 q30 -12 60 -4" stroke="#3E3E38" stroke-width="4" fill="none" opacity=".6"/>' +
      '</g>';
    // glowing mushroom rings
    let shrooms = '';
    [[240, 552], [700, 560], [1000, 548]].forEach((c, i) => {
      for (let j = 0; j < 7; j++) {
        const a = (j / 7) * 6.2832, x = c[0] + Math.cos(a) * 62, y = c[1] + Math.sin(a) * 15;
        shrooms += '<g>' +
          '<rect x="' + (x - 3) + '" y="' + (y - 14) + '" width="6" height="15" rx="2" fill="#CFE8B8"/>' +
          '<ellipse cx="' + x + '" cy="' + (y - 15) + '" rx="12" ry="7" fill="#8ED17F"/>' +
          '<ellipse cx="' + x + '" cy="' + (y - 16) + '" rx="7" ry="4" fill="#FFD98A" opacity=".8"/></g>';
      }
    });
    // the stream, with stepping stones
    const stream =
      '<g><path d="M0 590 q200 -22 400 -8 q220 16 400 -4 q200 -18 400 6 q180 18 400 -4 v40 H0Z" ' +
        'fill="#1E5A5E" opacity=".8"/>' +
      '<g class="a-flow"><path d="M-40 596 q60 -8 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0" ' +
        'stroke="#7EC0B0" stroke-width="3" fill="none" opacity=".6"/></g>' +
      '<g fill="#4A4A44"><ellipse cx="300" cy="600" rx="30" ry="11"/><ellipse cx="560" cy="596" rx="26" ry="10"/>' +
      '<ellipse cx="900" cy="602" rx="32" ry="12"/><ellipse cx="1240" cy="596" rx="27" ry="10"/></g></g>';
    // ant-tunnel mouths, and one antenna withdrawing
    const tunnels =
      '<g><ellipse cx="420" cy="556" rx="46" ry="20" fill="#0A1C14"/>' +
      '<ellipse cx="420" cy="552" rx="38" ry="15" fill="#050E0A"/>' +
      '<g class="a-driftY"><path d="M414 548 q-8 -30 -22 -40" stroke="#7A5626" stroke-width="5" ' +
        'fill="none" stroke-linecap="round"/></g>' +
      '<ellipse cx="1470" cy="562" rx="40" ry="17" fill="#0A1C14"/>' +
      '<ellipse cx="1470" cy="558" rx="32" ry="13" fill="#050E0A"/></g>';
    return strip('<g class="a-windTilt">' + trunks + '</g>' + fist + stream +
      '<g class="a-shimmer">' + shrooms + '</g>' + tunnels + dryad);
  },

  /* --- L3 · a soft leaf-litter trail ---------------------------------- */
  L3: () => planeSVG({
    far: '#1E4632', near: '#173626', nearest: '#102618',
    pathFar: '#4A5A34', pathNear: '#3A4426',
    rung: '#6E7A46', lane: '#8ED17F', edge: '#0A1C14',
  }),

  /* --- L4 · enormous trunks sweeping past, ferns at the lens ---------- */
  L4: () => {
    let g = '', ferns = '';
    // three huge near trunks — these are what the exit transition dives between
    [[120, 190], [820, 150], [1420, 210]].forEach((t, i) => {
      g += '<g>' +
        '<path d="M' + t[0] + ' 900 l' + (-t[1] / 2) + ' -900 h' + t[1] + 'Z" fill="#0B1F16"/>' +
        '<path d="M' + t[0] + ' 900 l' + (-t[1] * 0.16) + ' -900 h' + (t[1] * 0.3) +
          'Z" fill="#16321F" opacity=".8"/></g>';
    });
    // ferns crowding the bottom of the frame
    for (let i = 0; i < 16; i++) {
      const x = (i * 103) % STRIP_W, y = 880 + (i % 3) * 20;
      ferns += '<path d="M' + x + ' ' + y + ' q-30 -50 -14 -96 M' + x + ' ' + y +
        ' q6 -60 26 -84 M' + x + ' ' + y + ' q34 -40 54 -50" stroke="#1D4A2C" ' +
        'stroke-width="9" fill="none" stroke-linecap="round"/>';
    }
    return strip('<g class="a-windTilt">' + g + '</g>' +
      '<g class="a-wind">' + ferns + '</g>');
  },
};
