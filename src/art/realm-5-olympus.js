/* ===========================================================================
   realm-5-olympus.js — MOUNT OLYMPUS
   ---------------------------------------------------------------------------
   Blazing, marble, thunder. A staircase of solidified cloud spiralling up to
   a floating city. Twelve empty thrones in a horseshoe. Hestia's hearth
   burning at the exact centre with a small girl tending it.

   Bloom-lit and slightly overexposed throughout — this realm should feel
   almost too bright to look at.
   =========================================================================== */

RealmArt.realm5 = {
  stripW: STRIP_W,

  /* --- L0 · aurora sky, lightning between distant columns -------------- */
  L0: () => {
    const sky = uid('r5'), au = uid('r5'), au2 = uid('r5');
    return strip(
      '<defs>' +
        lg(sky, [[0, '#6B4FB8'], [0.35, '#9B84D8'], [0.68, '#F5CBD8'], [1, '#FFF0E2']]) +
        lg(au, [[0, '#8FE3F2', 0], [0.45, '#8FE3F2', 0.6], [1, '#7B5FC4', 0]], 0, 0, 0, 1) +
        lg(au2, [[0, '#F5CBD8', 0], [0.5, '#FFF3C4', 0.55], [1, '#7B5FC4', 0]], 0, 0, 0, 1) +
      '</defs>' +
      '<rect width="1600" height="900" fill="url(#' + sky + ')"/>' +
      '<g class="a-wave"><path d="M-60 90 q180 130 380 30 q200 -100 400 40 q200 130 400 -20 ' +
        'q160 -110 340 20 v170 q-180 -120 -340 -10 q-200 140 -400 10 q-200 -130 -400 -30 ' +
        'q-200 100 -380 -30Z" fill="url(#' + au + ')" class="a-shimmer"/></g>' +
      '<g class="a-wave" style="animation-delay:-2.8s"><path d="M-60 220 q200 100 400 10 ' +
        'q200 -90 400 30 q200 110 400 -10 q160 -90 320 20 v140 q-160 -100 -320 -10 ' +
        'q-200 110 -400 0 q-200 -110 -400 -20 q-200 90 -400 -10Z" fill="url(#' + au2 +
        ')" opacity=".75" class="a-shimmer"' + dly(3) + '/></g>' +
      '<circle cx="330" cy="150" r="70" fill="#FFFBE8" opacity=".85" class="a-pulse"/>' +
      '<g class="a-flicker" opacity=".8">' +
        '<path d="M1180 90 l-30 70 h22 l-26 74" stroke="#FFF6C9" stroke-width="4" fill="none" ' +
          'stroke-linejoin="round"/>' +
        '<path d="M1320 130 l-20 46 h14 l-18 48" stroke="#E0C6FF" stroke-width="2.6" fill="none"/></g>');
  },

  /* --- L1 · the floating city and the cloud staircase ------------------ */
  L1: () => {
    // the city on its cloud
    let city = '';
    for (let i = 0; i < 16; i++) {
      const x = 260 + i * 74, h = 90 + ((i * 37) % 130);
      city += '<rect x="' + x + '" y="' + (300 - h) + '" width="' + (34 + (i % 3) * 10) +
        '" height="' + h + '" fill="#FDFBF5" opacity="' + (0.75 + (i % 3) * 0.07) + '"/>';
      if (i % 3 === 0) {
        city += '<path d="M' + (x - 8) + ' ' + (300 - h) + ' L' + (x + 22) + ' ' + (300 - h - 30) +
          ' L' + (x + 52) + ' ' + (300 - h) + 'Z" fill="#E3B23C" opacity=".85"/>';
      }
    }
    // the staircase of solidified cloud, spiralling upward
    let stair = '';
    for (let i = 0; i < 14; i++) {
      const x = 700 + Math.sin(i * 0.55) * 300, y = 540 - i * 20, w = 190 - i * 8;
      stair += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + w + '" ry="' + (20 - i * 0.7) +
        '" fill="#FDFBF5" opacity="' + (0.9 - i * 0.045) + '" class="a-driftY"' + dly(i * 3) + '/>';
    }
    return strip(
      '<g class="a-driftY" style="animation-duration:12s">' +
        '<ellipse cx="820" cy="312" rx="620" ry="70" fill="#FFFFFF" opacity=".92"/>' +
        '<ellipse cx="500" cy="300" rx="260" ry="56" fill="#F5EFFF" opacity=".8"/>' +
        '<ellipse cx="1180" cy="304" rx="280" ry="52" fill="#F5EFFF" opacity=".8"/>' +
        city +
      '</g>' + stair);
  },

  /* --- L2 · colonnade, the twelve thrones, Hestia's hearth ------------- */
  L2: () => {
    const mar = uid('r5');
    // marble colonnade
    let cols = '';
    for (let i = 0; i < 11; i++) {
      const x = 40 + i * 150;
      cols += '<g>' +
        '<rect x="' + x + '" y="360" width="46" height="200" fill="url(#' + mar + ')"/>' +
        '<rect x="' + (x - 8) + '" y="348" width="62" height="16" rx="3" fill="#FDFBF5"/>' +
        '<rect x="' + (x - 10) + '" y="554" width="66" height="14" rx="3" fill="#EFE8DA"/>' +
        '<g stroke="#DCD2C0" stroke-width="2" opacity=".7">' +
          '<path d="M' + (x + 11) + ' 366 v186 M' + (x + 23) + ' 366 v186 M' + (x + 35) + ' 366 v186"/></g>' +
      '</g>';
    }
    // twelve thrones in a horseshoe, each styled to its god, all empty
    const throneCols = ['#E8E4F0', '#4FD1D9', '#C8CFD6', '#FFC63D', '#E2543A', '#F5A8C0',
                        '#FF8A3D', '#F2B544', '#8ED17F', '#9B6BD9', '#B98CF0', '#4EE59A'];
    let thrones = '';
    throneCols.forEach((c, i) => {
      const t = (i / 11) * Math.PI;
      const x = 800 - Math.cos(t) * 560, y = 500 - Math.sin(t) * 40, s = 0.6 + Math.sin(t) * 0.4;
      thrones += '<g transform="translate(' + x.toFixed(0) + ' ' + y.toFixed(0) + ') scale(' +
        s.toFixed(2) + ')">' +
        '<rect x="-26" y="-70" width="52" height="76" rx="6" fill="' + c + '" opacity=".9"/>' +
        '<rect x="-32" y="4" width="64" height="14" rx="4" fill="#EFE8DA"/>' +
        '<path d="M-26 -70 l26 -26 l26 26Z" fill="' + c + '"/>' +
        '<rect x="-30" y="-40" width="8" height="46" rx="3" fill="#EFE8DA" opacity=".85"/>' +
        '<rect x="22" y="-40" width="8" height="46" rx="3" fill="#EFE8DA" opacity=".85"/>' +
        '<circle cx="0" cy="-84" r="7" fill="' + c + '" class="a-shimmer"' + dly(i * 3) + '/></g>';
    });
    // Hestia's hearth at the exact centre, and the girl who tends it
    const hearth =
      '<g transform="translate(800 552)">' +
        '<ellipse cx="0" cy="0" rx="86" ry="20" fill="#E8DCC0"/>' +
        '<ellipse cx="0" cy="-4" rx="62" ry="14" fill="#C9B896"/>' +
        '<g class="a-flicker">' +
          '<path d="M-30 -8 q14 -96 34 -120 q-8 58 12 74 q8 -62 22 -82 q16 92 -20 128Z" fill="#FF8A3D"/>' +
          '<path d="M-14 -8 q8 -60 20 -76 q0 36 10 44 q0 -34 10 -44 q8 56 -14 76Z" fill="#FFE9AE"/>' +
        '</g>' +
        '<g class="a-breathe" transform="translate(-104 2)">' +
          '<path d="M0 0 q-13 -8 -13 -30 q0 -20 13 -25 q13 5 13 25 q0 22 -13 30z" fill="#E2543A"/>' +
          '<circle cx="0" cy="-44" r="12" fill="#E8C1A0"/>' +
          '<path d="M-12 -48 q12 -14 24 0 q-5 -11 -12 -11 t-12 11z" fill="#7A4E28"/>' +
          '<path d="M8 -22 q26 4 34 14" stroke="#E8C1A0" stroke-width="6" fill="none" ' +
            'stroke-linecap="round" class="a-sway"/></g>' +
      '</g>';
    // olive trees in gold pots
    let pots = '';
    [[300, 560], [1300, 560]].forEach((p, i) => {
      pots += '<g transform="translate(' + p[0] + ' ' + p[1] + ')">' +
        '<path d="M-30 0 l7 -44 h46 l7 44Z" fill="#E3B23C"/>' +
        '<g class="a-sway" style="transform-origin:0px -44px">' +
          '<path d="M0 -44 v-70" stroke="#7A6A4A" stroke-width="9"/>' +
          '<ellipse cx="-24" cy="-120" rx="40" ry="26" fill="#7EA86E"/>' +
          '<ellipse cx="26" cy="-134" rx="44" ry="28" fill="#8ED17F"/>' +
          '<ellipse cx="4" cy="-158" rx="36" ry="24" fill="#9DDA8C"/></g></g>';
    });
    return strip(
      '<defs>' + lg(mar, [[0, '#FFFFFF'], [0.5, '#FDFBF5'], [1, '#DCD2C0']], 0, 0, 1, 0) + '</defs>' +
      thrones + cols + pots + hearth);
  },

  /* --- L3 · a polished marble causeway --------------------------------- */
  L3: () => planeSVG({
    far: '#F0EAF8', near: '#E4DCF0', nearest: '#D6CCE8',
    pathFar: '#FFFFFF', pathNear: '#F2ECFA',
    rung: '#E3B23C', lane: '#7B5FC4', edge: '#C0B4DC',
  }),

  /* --- L4 · braziers, gold rails, cloud tearing past the lens ---------- */
  L4: () => {
    let g = '';
    // cloud shreds streaming past
    for (let i = 0; i < 7; i++) {
      const x = i * 240, y = 700 + (i % 3) * 70;
      g += '<g class="a-driftX"' + dly(i * 4) + ' opacity=".55">' +
        '<ellipse cx="' + x + '" cy="' + y + '" rx="170" ry="34" fill="#FFFFFF"/>' +
        '<ellipse cx="' + (x + 90) + '" cy="' + (y + 22) + '" rx="120" ry="26" fill="#F5EFFF"/></g>';
    }
    // gold rail along the causeway edge
    g += '<g stroke="#E3B23C" stroke-width="7" fill="none" opacity=".9">' +
      '<path d="M0 838 h1600"/></g>';
    for (let i = 0; i < 12; i++) {
      g += '<rect x="' + (i * 140) + '" y="838" width="10" height="62" rx="4" fill="#C9922E"/>';
    }
    // braziers at the very front
    [[150, 900], [900, 900], [1500, 900]].forEach((b, i) => {
      g += '<g transform="translate(' + b[0] + ' ' + b[1] + ')">' +
        '<path d="M-30 0 l8 -80 h44 l8 80Z" fill="#E3B23C"/>' +
        '<ellipse cx="0" cy="-80" rx="32" ry="9" fill="#C9922E"/>' +
        '<g class="a-flicker"' + dly(i * 3) + '>' +
          '<path d="M-20 -84 q10 -72 22 -90 q-6 44 8 54 q6 -46 14 -60 q12 68 -12 96Z" fill="#FFD98A"/>' +
          '<path d="M-8 -84 q6 -44 12 -56 q0 28 8 32 q0 -24 6 -32 q6 40 -8 56Z" fill="#FFFBE8"/></g></g>';
    });
    return strip(g);
  },
};
