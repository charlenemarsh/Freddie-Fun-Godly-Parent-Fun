/* ===========================================================================
   realm-3-sea.js — THE SEA & SHORE
   ---------------------------------------------------------------------------
   Vast, weightless, luminous. The descent from the surf line into deep water.
   Caustic light on every surface, a kelp forest lit like a cathedral,
   hippocampi wheeling past, and far below, the impossible glow of the palace.

   EVERYTHING DRIFTS. Every layer gets a slow buoyant sway — nothing in this
   realm is allowed to sit still.
   =========================================================================== */

RealmArt.realm3 = {
  stripW: STRIP_W,

  /* --- L0 · the surface seen from beneath ------------------------------ */
  L0: () => {
    const sky = uid('r3'), sun = uid('r3');
    let shafts = '';
    for (let i = 0; i < 7; i++) {
      const x = 60 + i * 230;
      shafts += '<path d="M' + x + ' 0 h70 l' + (40 + i * 6) + ' 900 h-150Z" fill="#9FF0FF" ' +
        'opacity="' + (0.10 + (i % 3) * 0.035) + '"/>';
    }
    return strip(
      '<defs>' + lg(sky, [[0, '#2A9AB4'], [0.32, '#1E7A8C'], [0.72, '#0A2A43'], [1, '#041A2C']]) +
        rg(sun, [[0, '#FFFFFF', 0.9], [1, '#9FF0FF', 0]], 0.5, 0.5, 0.5) + '</defs>' +
      '<rect width="1600" height="900" fill="url(#' + sky + ')"/>' +
      '<circle cx="880" cy="30" r="220" fill="url(#' + sun + ')" class="a-pulse"/>' +
      // the underside of the surface, rippling
      '<g class="a-wave"><path d="M-60 46 q80 -34 160 0 t160 0 t160 0 t160 0 t160 0 t160 0 t160 0 ' +
        't160 0 t160 0 t160 0 V0 H-60Z" fill="#5AC8DC" opacity=".55"/></g>' +
      '<g class="a-wave" style="animation-delay:-2.4s"><path d="M-60 74 q80 -30 160 0 t160 0 t160 0 ' +
        't160 0 t160 0 t160 0 t160 0 t160 0 t160 0 t160 0 V20 H-60Z" fill="#7CE0EE" opacity=".28"/></g>' +
      '<g class="a-shimmer">' + shafts + '</g>');
  },

  /* --- L1 · the abyss below, and the palace glow ----------------------- */
  L1: () => {
    const pal = uid('r3');
    let rocks = ridge(HORIZON - 60, 60, '#062334', 200, 0.85);
    // Poseidon's palace, impossibly far below and slightly too bright
    const palace =
      '<g class="a-driftY" style="animation-duration:9s">' +
        '<ellipse cx="1120" cy="520" rx="220" ry="70" fill="url(#' + pal + ')"/>' +
        '<g opacity=".85">' +
          '<path d="M1040 520 v-70 h30 v70Z" fill="#1E7A8C"/>' +
          '<path d="M1090 520 v-110 h40 v110Z" fill="#2A93A8"/>' +
          '<path d="M1150 520 v-84 h32 v84Z" fill="#1E7A8C"/>' +
          '<path d="M1055 450 l-14 -26 h60 l-14 26Z" fill="#4FD1D9"/>' +
          '<path d="M1110 410 l-18 -34 h76 l-18 34Z" fill="#7CE7F0"/>' +
          '<path d="M1166 436 l-14 -28 h60 l-14 28Z" fill="#4FD1D9"/>' +
        '</g>' +
        '<g class="a-shimmer" fill="#CFF8FF">' +
          '<circle cx="1110" cy="392" r="9"/><circle cx="1058" cy="430" r="6"/>' +
          '<circle cx="1176" cy="418" r="6"/></g>' +
      '</g>';
    // a pod of hippocampi wheeling past, far off
    let pod = '';
    for (let i = 0; i < 4; i++) {
      const x = 200 + i * 90, y = 250 + (i % 2) * 60;
      pod += '<g opacity=".55" transform="translate(' + x + ' ' + y +
        ') scale(1.1)">' +
        '<path d="M0 0 q26 -18 54 -6 q-10 16 -30 16 q-18 0 -24 -10z" fill="#4FD1D9"/>' +
        '<path d="M8 -4 q6 -22 22 -20 q-4 16 -12 22z" fill="#7CE7F0" class="a-swayFast"/>' +
        '<path d="M54 -6 q22 -8 30 -26 q4 26 -12 34 q12 8 8 24 q-16 -14 -26 -20z" fill="#4FD1D9"/></g>';
    }
    return strip(
      '<defs>' + rg(pal, [[0, '#CFF8FF', 0.55], [1, '#0A2A43', 0]], 0.5, 0.5, 0.5) + '</defs>' +
      rocks + palace + '<g class="a-windSlow">' + pod + '</g>');
  },

  /* --- L2 · kelp cathedral, trireme, anemone garden, pearl caverns ----- */
  L2: () => {
    // kelp forest lit like a cathedral: tall columns of it, arching over
    let kelp = '';
    for (let i = 0; i < 16; i++) {
      const x = 40 + i * 100, h = 300 + (i % 4) * 90;
      kelp += '<g>' +
        '<path d="M' + x + ' 560 q' + ((i % 2 ? 40 : -40)) + ' -' + (h * 0.55) + ' ' +
          ((i % 2 ? -12 : 12)) + ' -' + h + '" stroke="#2E7A5E" stroke-width="' + (12 - (i % 3) * 2) +
          '" fill="none" stroke-linecap="round" opacity=".9"/>';
      for (let j = 1; j <= 4; j++) {
        kelp += '<ellipse cx="' + (x + (i % 2 ? 14 : -14)) + '" cy="' + (560 - h * j * 0.2) +
          '" rx="20" ry="8" fill="#4FA87E" opacity=".8" transform="rotate(' + (i % 2 ? 20 : -20) + ' ' +
          x + ' ' + (560 - h * j * 0.2) + ')"/>';
      }
      kelp += '</g>';
    }
    // a sunken trireme, resting on its side
    const ship =
      '<g class="a-driftY" style="animation-duration:8s" transform="translate(320 470) rotate(-7)">' +
        '<path d="M0 40 q150 46 300 0 l-40 62 h-220Z" fill="#3E2E20"/>' +
        '<path d="M14 44 q136 38 272 0" stroke="#2A1E14" stroke-width="6" fill="none"/>' +
        '<rect x="140" y="-90" width="12" height="132" fill="#4A3728" transform="rotate(6 146 -24)"/>' +
        '<path d="M150 -74 q70 24 56 82 q-38 -28 -60 -22Z" fill="#C9BCA4" opacity=".5" class="a-shimmer"/>' +
        '<g fill="#6E5A3A" opacity=".9"><circle cx="60" cy="52" r="13"/><circle cx="110" cy="62" r="13"/>' +
        '<circle cx="190" cy="62" r="13"/><circle cx="240" cy="52" r="13"/></g>' +
        '<path d="M0 40 q-30 -14 -34 -34 q26 6 40 24Z" fill="#3E2E20"/>' +
      '</g>';
    // anemone garden, pulsing
    let anem = '';
    for (let i = 0; i < 11; i++) {
      const x = 60 + i * 140, y = 566 + (i % 3) * 8;
      let arms = '';
      for (let j = 0; j < 9; j++) {
        const a = -Math.PI + (j / 8) * Math.PI;
        arms += '<path d="M' + x + ' ' + y + ' q' + (Math.cos(a) * 16) + ' ' + (Math.sin(a) * 22) + ' ' +
          (Math.cos(a) * 26) + ' ' + (Math.sin(a) * 30) + '" stroke="' +
          ['#F7C9C0', '#F5A8C0', '#EDE6F2'][i % 3] + '" stroke-width="5" fill="none" ' +
          'stroke-linecap="round"/>';
      }
      anem += '<g>' +
        arms + '<ellipse cx="' + x + '" cy="' + y + '" rx="17" ry="7" fill="#B98CB4"/></g>';
    }
    // pearl caverns in the far wall
    let pearls = '';
    [[1300, 500], [1400, 530], [1240, 540], [1470, 505]].forEach((p, i) => {
      pearls += '<g>' +
        '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (16 + i * 3) + '" fill="#EDE6F2" opacity=".9"/>' +
        '<circle cx="' + (p[0] - 5) + '" cy="' + (p[1] - 6) + '" r="6" fill="#FFFFFF" opacity=".8"/></g>';
    });
    return strip(
      '<path d="M1180 560 q60 -100 160 -110 q120 -12 200 40 v70Z" fill="#0A2A43"/>' +
      '<g class="a-driftY">' + pearls + '</g>' +
      '<g class="a-windTilt">' + kelp + '</g>' + ship +
      '<g class="a-pulse" style="transform-origin:800px 570px">' + anem + '</g>');
  },

  /* --- L3 · a pale sand corridor between reef walls -------------------- */
  L3: () => planeSVG({
    far: '#12556B', near: '#0C4058', nearest: '#082C40',
    pathFar: '#8FBECB', pathNear: '#4E8A9E',
    rung: '#CFF8FF', lane: '#7CE7F0', edge: '#062334',
  }),

  /* --- L4 · bubble columns and coral at the lens ----------------------- */
  L4: () => {
    let g = '', cols = '';
    // rising bubble columns, big and close
    for (let i = 0; i < 5; i++) {
      const x = 120 + i * 330;
      if (x > 640 && x < 960) continue;           // keep the hero's lane clear
      for (let j = 0; j < 6; j++) {
        cols += '<circle cx="' + (x + (j % 2 ? 22 : -18)) + '" cy="' + (880 - j * 62) + '" r="' +
          (4 + (j % 3) * 3) + '" fill="none" stroke="#CFF8FF" stroke-width="1.8" opacity=".38"/>';
      }
    }
    // coral fans at the very front
    [[80, 900], [700, 900], [1500, 900]].forEach((c, i) => {
      g += '<g>' +
        '<path d="M' + c[0] + ' 900 q-60 -120 -30 -220 q10 90 44 150 q-16 -110 20 -180 ' +
          'q4 110 26 200Z" fill="#D8607E" opacity=".85"/>' +
        '<path d="M' + c[0] + ' 900 q40 -100 90 -140 q-30 80 -50 140Z" fill="#F5A8C0" opacity=".7"/></g>';
    });
    return strip('<g class="a-rise">' + cols + '</g>' +
      '<g class="a-windTilt">' + g + '</g>');
  },
};
