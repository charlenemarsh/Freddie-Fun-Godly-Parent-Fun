/* ===========================================================================
   realm-4-underworld.js — THE UNDERWORLD
   ---------------------------------------------------------------------------
   Dark, beautiful and solemn. NEVER gory, never frightening. No blood, no
   body horror, no jump scares. Awe, not fear — read the tone rule in
   CLAUDE.md before touching anything here.

   Cerberus is enormous and in silhouette, with six warm eyes, and he is
   not-quite-hostile. The spirits are pale and gentle and they turn to look
   at you as you pass, which should feel sad rather than threatening.
   =========================================================================== */

RealmArt.realm4 = {
  stripW: STRIP_W,

  /* --- L0 · a starless sky, and the far cavern roof -------------------- */
  L0: () => {
    const sky = uid('r4');
    let veins = '';
    for (let i = 0; i < 9; i++) {
      const x = i * 190;
      veins += '<path d="M' + x + ' 0 q' + (40 - (i % 3) * 30) + ' 90 ' + (10 + (i % 4) * 20) +
        ' 190" stroke="#9B6BD9" stroke-width="2" fill="none" opacity=".22"/>';
    }
    return strip(
      '<defs>' + lg(sky, [[0, '#07060B'], [0.55, '#120E1E'], [1, '#1B1430']]) + '</defs>' +
      '<rect width="1600" height="900" fill="url(#' + sky + ')"/>' +
      // the roof of the world, hanging low
      '<path d="M0 0 h1600 v120 q-100 46 -200 6 q-120 -40 -220 14 q-140 52 -260 -10 ' +
        'q-130 -66 -250 8 q-140 60 -280 -8 q-180 -84 -390 24Z" fill="#050409"/>' +
      '<g class="a-shimmer">' + veins + '</g>');
  },

  /* --- L1 · Asphodel: an endless plain of pale swaying grass ----------- */
  L1: () => {
    let grass = '';
    for (let i = 0; i < 150; i++) {
      const x = (i * 11.4) % STRIP_W, y = HORIZON - 4 + (i % 7) * 4;
      const h = 18 + (i % 9) * 6, lean = ((i % 5) - 2) * 3;
      grass += '<path d="M' + x + ' ' + y + ' q' + lean + ' -' + (h * 0.6) + ' ' + (lean * 1.7) +
        ' -' + h + '" stroke="#C4BEAA" stroke-width="1.3" fill="none" ' +
        'opacity="' + (0.28 + (i % 4) * 0.11).toFixed(2) + '" stroke-linecap="round"/>';
    }
    // black poplar groves on the horizon
    let poplars = '';
    for (let i = 0; i < 12; i++) {
      const x = 40 + i * 136;
      poplars += '<g>' +
        '<path d="M' + x + ' ' + HORIZON + ' v-' + (150 + (i % 3) * 40) + '" stroke="#0A0810" ' +
          'stroke-width="7"/>' +
        '<ellipse cx="' + x + '" cy="' + (HORIZON - 130 - (i % 3) * 40) + '" rx="26" ry="' +
          (70 + (i % 3) * 16) + '" fill="#0C0A14"/></g>';
    }
    return strip(
      ridge(HORIZON - 40, 26, '#141020', 700, 0.9) +
      '<g class="a-sway" style="transform-origin:800px ' + HORIZON + 'px;animation-duration:13s">' +
      grass + '</g>' + '<g class="a-windTilt">' + poplars + '</g>' +
      // the EZ-DEATH queue sign, flickering neon, far off to one side
      '<g class="a-flicker"><rect x="120" y="400" width="150" height="46" rx="6" fill="#12101C" ' +
        'stroke="#4EE59A" stroke-width="2"/>' +
      '<path d="M140 414 h30 M140 424 h22 M140 434 h30 M186 414 l22 20 M208 414 l-22 20 ' +
        'M222 414 h26 M222 414 v20 h26" stroke="#4EE59A" stroke-width="3" fill="none"/></g>');
  },

  /* --- L2 · the Styx, Charon's ferry, Cerberus, the obsidian palace ---- */
  L2: () => {
    const water = uid('r4'), gem = uid('r4');
    // black water that glows green where it is broken
    const styx =
      '<g><path d="M0 560 h1600 v120 H0Z" fill="#04060A"/>' +
      '<g class="a-flow">' +
        '<path d="M-40 578 q70 -12 140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0" ' +
          'stroke="url(#' + water + ')" stroke-width="4" fill="none"/>' +
        '<path d="M-40 606 q70 10 140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0" ' +
          'stroke="#1E5A4A" stroke-width="3" fill="none" opacity=".7"/>' +
      '</g></g>';
    // Charon poling across, his oar breaking the water into green light
    const ferry =
      '<g class="a-bob" transform="translate(260 520) scale(1.6)">' +
        '<path d="M0 40 q60 22 120 0 l-12 16 H12Z" fill="#1A1626"/>' +
        '<path d="M84 40 V-6" stroke="#2E2840" stroke-width="4"/>' +
        '<g class="a-sway" style="transform-origin:84px 40px">' +
          '<path d="M52 36 L20 62" stroke="#3A3450" stroke-width="4" stroke-linecap="round"/>' +
          '<ellipse cx="18" cy="64" rx="12" ry="4" fill="#4EE59A" opacity=".7" class="a-pulse"/></g>' +
        '<path d="M70 40 q-8 -34 8 -40 q14 4 12 40Z" fill="#0E0C16"/>' +
        '<circle cx="80" cy="-6" r="9" fill="#171326"/>' +
        '<circle cx="77" cy="-7" r="2" fill="#4EE59A" class="a-shimmer"/>' +
        '<circle cx="84" cy="-7" r="2" fill="#4EE59A" class="a-shimmer"' + dly(2) + '/>' +
        '<circle cx="110" cy="-14" r="7" fill="#FF6B35" class="a-flicker"/>' +
      '</g>';
    // Cerberus: enormous, silhouetted, six warm eyes, not-quite-hostile
    const cerb =
      '<g transform="translate(1130 560) scale(2.5)">' +
        '<ellipse cx="0" cy="0" rx="96" ry="16" fill="#050409"/>' +
        '<g class="a-breathe" style="transform-origin:0px 0px">' +
          '<ellipse cx="6" cy="-30" rx="66" ry="34" fill="#0A0810"/>' +
          '<circle cx="-46" cy="-58" r="21" fill="#0C0A12"/>' +
          '<circle cx="-2" cy="-72" r="24" fill="#0E0B14"/>' +
          '<circle cx="42" cy="-58" r="21" fill="#0C0A12"/>' +
          '<path d="M-58 -74 l-5 -16 l17 8Z M-34 -76 l6 -16 l11 12Z" fill="#0A0810"/>' +
          '<path d="M-14 -90 l-5 -17 l17 9Z M12 -92 l7 -16 l10 13Z" fill="#0A0810"/>' +
          '<path d="M30 -74 l-5 -16 l17 8Z M54 -76 l6 -16 l11 12Z" fill="#0A0810"/>' +
          '<g fill="#FF6B35">' +
            '<circle cx="-52" cy="-60" r="3.6" class="a-blink"/><circle cx="-40" cy="-60" r="3.6" class="a-blink"' + dly(1) + '/>' +
            '<circle cx="-9" cy="-74" r="4" class="a-blink"' + dly(2) + '/><circle cx="5" cy="-74" r="4" class="a-blink"' + dly(3) + '/>' +
            '<circle cx="36" cy="-60" r="3.6" class="a-blink"' + dly(4) + '/><circle cx="48" cy="-60" r="3.6" class="a-blink"' + dly(5) + '/>' +
          '</g>' +
          '<path d="M78 -24 q26 -12 22 -40" stroke="#0A0810" stroke-width="9" fill="none" ' +
            'class="a-tail" style="transform-origin:78px -24px"/>' +
        '</g>' +
      '</g>';
    // the obsidian palace, gemstones seaming the walls like veins of light
    const palace =
      '<g>' +
        '<path d="M600 560 V300 l60 -54 l60 54 v260Z" fill="#0B0A10"/>' +
        '<path d="M700 560 V340 l50 -44 l50 44 v220Z" fill="#0E0C14"/>' +
        '<path d="M520 560 V380 l44 -38 l44 38 v180Z" fill="#0E0C14"/>' +
        '<g stroke="url(#' + gem + ')" stroke-width="2.6" fill="none" class="a-shimmer">' +
          '<path d="M620 552 q14 -80 6 -160 q-6 -50 22 -84"/>' +
          '<path d="M690 552 q-10 -70 4 -140"/>' +
          '<path d="M742 552 q10 -60 -2 -120 q-6 -34 14 -56"/>' +
          '<path d="M548 552 q8 -60 -2 -110"/>' +
        '</g>' +
        '<rect x="640" y="470" width="40" height="90" rx="18" fill="#1A1428"/>' +
        '<rect x="640" y="470" width="40" height="90" rx="18" fill="none" stroke="#9B6BD9" ' +
          'stroke-width="2" opacity=".8" class="a-shimmer"/>' +
      '</g>';
    return strip(
      '<defs>' + lg(water, [[0, '#4EE59A', 0.15], [0.5, '#4EE59A', 0.85], [1, '#4EE59A', 0.15]], 0, 0, 1, 0) +
        lg(gem, [[0, '#9B6BD9'], [0.5, '#4EE59A'], [1, '#FF6B35']], 0, 0, 0, 1) + '</defs>' +
      palace + cerb + styx + ferry);
  },

  /* --- L3 · a road of pale stone across the plain ---------------------- */
  L3: () => planeSVG({
    far: '#181428', near: '#100D18', nearest: '#0A0810',
    pathFar: '#4A4458', pathNear: '#2E2A3C',
    rung: '#9B6BD9', lane: '#7E6AA8', edge: '#050409',
  }),

  /* --- L4 · drifting spirits and guttering braziers -------------------- */
  L4: () => {
    let g = '', spirits = '';
    // spirits: pale translucent forms that turn to look as you pass
    [[200, 742, 0.85], [1040, 770, 0.7], [1450, 730, 0.95]].forEach((s, i) => {
      spirits += '<g transform="translate(' + s[0] + ' ' + s[1] +
        ') scale(' + s[2] + ')" opacity=".42">' +
        '<path d="M0 -100 q40 0 40 58 q0 48 -14 74 q-9 18 -26 18 t-26 -18 q-14 -26 -14 -74 ' +
          'q0 -58 40 -58z" fill="#E8E2D0"/>' +
        // hollows where the eyes were, not eyes. Sad, not comic.
        '<g class="a-shimmer" opacity=".55">' +
          '<ellipse cx="-11" cy="-48" rx="4.5" ry="6.5" fill="#5E4A88"/>' +
          '<ellipse cx="11" cy="-48" rx="4.5" ry="6.5" fill="#5E4A88"/></g>' +
        '<path d="M-8 -26 q8 3 16 0" stroke="#8A82A0" stroke-width="2" fill="none" opacity=".4"/></g>';
    });
    // braziers close to the lens, guttering
    [[110, 900], [1180, 900], [1520, 900]].forEach((b, i) => {
      g += '<g transform="translate(' + b[0] + ' ' + b[1] + ')">' +
        '<path d="M-34 0 l10 -70 h48 l10 70Z" fill="#1A1622"/>' +
        '<ellipse cx="0" cy="-70" rx="34" ry="9" fill="#2A2434"/>' +
        '<g class="a-flicker"' + dly(i * 3) + '>' +
          '<path d="M-22 -74 q10 -74 24 -92 q-6 44 8 56 q6 -48 16 -62 q12 70 -14 98Z" fill="#FF6B35"/>' +
          '<path d="M-10 -74 q6 -46 14 -58 q0 28 8 34 q0 -26 8 -34 q6 42 -10 58Z" fill="#FFD98A"/>' +
        '</g></g>';
    });
    return strip('<g class="a-driftY">' + spirits + '</g>' + g);
  },
};
