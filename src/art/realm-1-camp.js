/* ===========================================================================
   realm-1-camp.js — CAMP HALF-BLOOD, and the shared scenery helpers
   ---------------------------------------------------------------------------
   Golden hour. Warm, alive, hopeful. This realm is the quality benchmark for
   the whole project — every later realm has to match it.

   Layer contract (SPEC §E.2). Each of L0, L1, L2, L4 returns one 1600x900
   strip that TILES HORIZONTALLY, so keep the left and right edges neutral —
   sky at the top, unbroken ground at the bottom, no object crossing x=0.
   L3 is the ground plane and does not tile; it is centred under the hero.

     L0  sky, celestial bodies          0.02x
     L1  far silhouettes                0.10x
     L2  mid architecture and terrain   0.30x
     L3  path plane, lane guides        1.00x   (perspective, not scrolled)
     L4  near foreground props          1.60x
   =========================================================================== */

const RealmArt = {};

/* =========================================================================
   SHARED SCENERY HELPERS — used by all five realms
   ========================================================================= */

const STRIP_W = 1600, STRIP_H = 900;

/* HORIZON is where a strip paints its ground line. PLANE_HORIZON is where the
   running ground actually meets the sky on screen.
   They differ on purpose: a 16:9 strip shown through a 9:19.5 phone window
   put the horizon at 60% of the screen, which left a huge dead sky and
   squashed all the scenery into a thin band. So the background layers are
   lifted by the difference (see --layer-lift in 01-styles.css), which pulls
   the horizon up to about 48% and gives the world room to breathe.
   Change these together or the ground will not line up with the scenery. */
const HORIZON = 545;
const PLANE_HORIZON = 430;
const LAYER_LIFT = ((HORIZON - PLANE_HORIZON) / STRIP_H * 100).toFixed(4);

function strip(inner) {
  return '<svg viewBox="0 0 ' + STRIP_W + ' ' + STRIP_H + '" preserveAspectRatio="xMidYMid slice" ' +
    'xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' + inner + '</svg>';
}

/* The ground plane. Rungs and lane guides are given ids so the run loop can
   drive them toward the camera every frame. */
function planeSVG(o) {
  const gGround = uid('pg'), gPath = uid('pg'), gEdge = uid('pg');
  let rungs = '';
  for (let i = 0; i < 16; i++) {
    rungs += '<path class="rung" data-i="' + i + '" d="M0 0" fill="' + o.rung +
      '" opacity="0"/>';
  }
  let lanes = '';
  for (let i = -2; i <= 2; i++) {
    lanes += '<path d="M800 ' + (PLANE_HORIZON + 4) + ' L' + (800 + i * 400) + ' 900" stroke="' +
      o.lane + '" stroke-width="' + (i === 0 ? 3 : 2) + '" opacity="' + (i === 0 ? 0.3 : 0.16) +
      '" fill="none"/>';
  }
  return '<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" ' +
    'xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
    '<defs>' +
      lg(gGround, [[0, o.far], [0.45, o.near], [1, o.nearest]]) +
      lg(gPath, [[0, o.pathFar], [1, o.pathNear]]) +
      lg(gEdge, [[0, o.edge, 0], [1, o.edge, 0.85]]) +
    '</defs>' +
    '<rect x="0" y="' + PLANE_HORIZON + '" width="1600" height="' + (900 - PLANE_HORIZON) +
      '" fill="url(#' + gGround + ')"/>' +
    // the path itself, receding to the vanishing point
    '<path d="M762 ' + PLANE_HORIZON + ' H838 L1330 900 H270Z" fill="url(#' + gPath + ')"/>' +
    '<g id="rungs">' + rungs + '</g>' +
    '<g id="laneGuides">' + lanes + '</g>' +
    // verges either side, to stop the path floating
    '<path d="M762 ' + PLANE_HORIZON + ' L270 900 H150 L730 ' + PLANE_HORIZON +
      'Z" fill="url(#' + gEdge + ')"/>' +
    '<path d="M838 ' + PLANE_HORIZON + ' L1330 900 H1450 L870 ' + PLANE_HORIZON +
      'Z" fill="url(#' + gEdge + ')"/>' +
    '</svg>';
}

/* a soft distant ridge line */
function ridge(y, amp, colour, seed, op) {
  let d = 'M0 ' + y;
  for (let x = 0; x <= STRIP_W; x += 100) {
    const n = Math.sin((x + seed) * 0.0031) * amp + Math.sin((x + seed) * 0.0091) * amp * 0.45;
    d += ' L' + x + ' ' + (y + n).toFixed(1);
  }
  d += ' L' + STRIP_W + ' ' + STRIP_H + ' L0 ' + STRIP_H + 'Z';
  return '<path d="' + d + '" fill="' + colour + '" opacity="' + (op === undefined ? 1 : op) + '"/>';
}

/* one cabin: a small distinct building, lit from within */
function cabin(x, y, w, h, body, roof, glow, style) {
  const win = '<rect x="' + (x + w * 0.34) + '" y="' + (y - h * 0.55) + '" width="' + (w * 0.32) +
    '" height="' + (h * 0.3) + '" rx="3" fill="' + glow + '" class="a-flicker"' + dly(x) + '/>';
  let top = '';
  if (style === 'peak') {
    top = '<path d="M' + (x - 6) + ' ' + (y - h) + ' L' + (x + w / 2) + ' ' + (y - h - h * 0.5) +
      ' L' + (x + w + 6) + ' ' + (y - h) + 'Z" fill="' + roof + '"/>';
  } else if (style === 'temple') {
    top = '<path d="M' + (x - 10) + ' ' + (y - h) + ' L' + (x + w / 2) + ' ' + (y - h - h * 0.38) +
      ' L' + (x + w + 10) + ' ' + (y - h) + 'Z" fill="' + roof + '"/>' +
      '<rect x="' + (x - 10) + '" y="' + (y - h) + '" width="' + (w + 20) + '" height="7" fill="' + roof + '"/>';
  } else if (style === 'dome') {
    top = '<path d="M' + x + ' ' + (y - h) + ' a' + (w / 2) + ' ' + (h * 0.5) + ' 0 0 1 ' + w + ' 0Z" fill="' + roof + '"/>';
  } else {
    top = '<path d="M' + (x - 8) + ' ' + (y - h) + ' L' + (x + w / 2) + ' ' + (y - h - h * 0.34) +
      ' L' + (x + w + 8) + ' ' + (y - h) + 'Z" fill="' + roof + '"/>';
  }
  return '<g>' + '<rect x="' + x + '" y="' + (y - h) + '" width="' + w + '" height="' + h +
    '" fill="' + body + '"/>' + top + win + '</g>';
}

/* a tree — used by camp, the forest and Olympus */
function tree(x, y, h, trunk, leaf, leaf2, sway) {
  const w = h * 0.62;
  return '<g class="' + (sway === false ? '' : 'a-sway') + '" style="transform-origin:' + x + 'px ' + y + 'px"' +
    dly(x) + '>' +
    '<path d="M' + (x - h * 0.045) + ' ' + y + ' l' + (h * 0.02) + ' ' + (-h * 0.55) + ' h' +
      (h * 0.05) + ' l' + (h * 0.02) + ' ' + (h * 0.55) + 'Z" fill="' + trunk + '"/>' +
    '<ellipse cx="' + x + '" cy="' + (y - h * 0.66) + '" rx="' + (w * 0.5) + '" ry="' + (h * 0.30) +
      '" fill="' + leaf + '"/>' +
    '<ellipse cx="' + (x - w * 0.2) + '" cy="' + (y - h * 0.78) + '" rx="' + (w * 0.32) + '" ry="' +
      (h * 0.21) + '" fill="' + leaf2 + '"/>' +
    '<ellipse cx="' + (x + w * 0.22) + '" cy="' + (y - h * 0.72) + '" rx="' + (w * 0.28) + '" ry="' +
      (h * 0.19) + '" fill="' + leaf2 + '" opacity=".85"/>' +
    '</g>';
}


/* =========================================================================
   REALM 1 — CAMP HALF-BLOOD
   -------------------------------------------------------------------------
   Golden hour, and it has to READ as golden hour on a phone, where only
   about a quarter of the strip is on screen at once. Two consequences:
     · the warm light has to be everywhere, not just around the sun disc
     · everything has to be big. Detail authored at "looks right on a
       desktop" size disappears entirely in a 390px window.
   ========================================================================= */

RealmArt.realm1 = {
  stripW: STRIP_W,

  /* --- L0 · low sun, and warm light across the whole sky --------------- */
  L0: () => {
    const sky = uid('r1'), sun = uid('r1'), band = uid('r1');
    let clouds = '';
    [[200, 176, 210, 40], [640, 130, 260, 46], [1120, 196, 230, 38], [1470, 140, 190, 34]]
      .forEach((c, i) => {
        clouds += '<g class="a-driftX"' + dly(i * 7) + ' opacity=".82">' +
          '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="' + c[2] + '" ry="' + c[3] +
            '" fill="#FFE8C2"/>' +
          '<ellipse cx="' + (c[0] - c[2] * 0.42) + '" cy="' + (c[1] + c[3] * 0.34) + '" rx="' +
            (c[2] * 0.6) + '" ry="' + (c[3] * 0.8) + '" fill="#F7C79A"/>' +
          '<ellipse cx="' + (c[0] + c[2] * 0.46) + '" cy="' + (c[1] + c[3] * 0.2) + '" rx="' +
            (c[2] * 0.52) + '" ry="' + (c[3] * 0.74) + '" fill="#FFF6E2"/></g>';
      });
    return strip(
      '<defs>' +
        lg(sky, [[0, '#5E9EC0'], [0.17, '#9CC6D4'], [0.31, '#DCC49E'], [0.42, '#F8C486'],
                 [0.50, '#FFB068'], [0.66, '#FF9A55'], [1, '#F0854A']]) +
        rg(sun, [[0, '#FFFFFF'], [0.18, '#FFF3C4'], [0.5, '#FFC077', 0.55], [1, '#FF8A3D', 0]],
           0.5, 0.5, 0.5) +
        lg(band, [[0, '#FFC98A', 0.35], [0.3, '#FFE1B0', 0.9], [0.7, '#FFD9A0', 0.9],
                  [1, '#FFC07A', 0.35]], 0, 0, 1, 0) +
      '</defs>' +
      '<rect width="1600" height="900" fill="url(#' + sky + ')"/>' +
      // a warm band along the whole horizon, so the light reads from any window
      '<rect x="0" y="286" width="1600" height="290" fill="url(#' + band +
        ')" opacity=".8" class="a-shimmer"/>' +
      '<circle cx="1120" cy="404" r="330" fill="url(#' + sun + ')" class="a-shimmer"/>' +
      '<circle cx="1120" cy="404" r="86" fill="#FFFBE8" class="a-pulse"/>' +
      // a second, softer glow so the far side of the strip is warm too
      '<circle cx="180" cy="430" r="280" fill="url(#' + sun + ')" opacity=".45" class="a-shimmer"' +
        dly(4) + '/>' +
      clouds +
      // a pegasus, very far off
      '<g class="a-driftX" style="animation-duration:11s" opacity=".55">' +
        '<path d="M420 240 q30 -18 60 -3 q-9 16 -33 16 q-19 0 -27 -13z" fill="#FFF6E2"/>' +
        '<path d="M442 234 q13 -24 33 -19 q-6 19 -19 25z" fill="#FFFFFF" class="a-swayFast"/></g>');
  },

  /* --- L1 · the ridge, the lake, Thalia's pine with the Fleece --------- */
  L1: () => {
    const lake = uid('r1');
    const farRidge = ridge(HORIZON - 176, 62, '#B9976E', 100, 0.45);
    const nearRidge = ridge(HORIZON - 74, 40, '#7FA36A', 900, 0.82);

    // Thalia's pine on the high ground, the Golden Fleece glinting in it
    const pine =
      '<g class="a-sway" style="transform-origin:1300px ' + (HORIZON - 40) + 'px">' +
        '<path d="M1292 ' + (HORIZON - 30) + ' v-120 h16 v120Z" fill="#4A3520"/>' +
        '<path d="M1300 ' + (HORIZON - 138) + ' l-74 84 h148Z" fill="#25543C"/>' +
        '<path d="M1300 ' + (HORIZON - 198) + ' l-62 74 h124Z" fill="#2E6B4F"/>' +
        '<path d="M1300 ' + (HORIZON - 252) + ' l-48 60 h96Z" fill="#357A56"/>' +
        '<path d="M1300 ' + (HORIZON - 298) + ' l-34 46 h68Z" fill="#3E8E5A"/>' +
        '<g class="a-shimmer">' +
          '<ellipse cx="1352" cy="' + (HORIZON - 148) + '" rx="30" ry="22" fill="#F2D98A"/>' +
          '<ellipse cx="1352" cy="' + (HORIZON - 152) + '" rx="17" ry="12" fill="#FFF6DA"/>' +
          '<path d="M1338 ' + (HORIZON - 130) + ' q14 16 28 0" stroke="#E8C15E" stroke-width="5" ' +
            'fill="none"/></g>' +
      '</g>';

    // the canoe lake, catching the last of the sun
    const water =
      '<g><ellipse cx="330" cy="' + (HORIZON - 112) + '" rx="178" ry="34" fill="#C9B489"/>' +
      '<ellipse cx="330" cy="' + (HORIZON - 114) + '" rx="162" ry="27" fill="url(#' + lake + ')"/>' +
      '<g class="a-flow">' +
        '<path d="M212 ' + (HORIZON - 120) + ' q30 -6 60 0 t60 0 t60 0" ' +
          'stroke="#FFF0BF" stroke-width="3.4" fill="none" opacity=".8"/>' +
        '<path d="M228 ' + (HORIZON - 106) + ' q26 6 52 0 t52 0 t52 0" ' +
          'stroke="#FFD9A0" stroke-width="2.6" fill="none" opacity=".6"/></g>' +
      // two canoes drawn up on the shore
      '<g class="a-bob"><path d="M244 ' + (HORIZON - 92) + ' q24 12 48 0 q-6 10 -24 10 t-24 -10z" ' +
        'fill="#C4682E"/></g>' +
      '<g class="a-bob"' + dly(3) + '><path d="M382 ' + (HORIZON - 90) + ' q20 10 40 0 q-5 8 -20 8 ' +
        't-20 -8z" fill="#A85628"/></g></g>';

    let far = '';
    for (let i = 0; i < 7; i++) {
      far += tree(70 + i * 236, HORIZON - 46, 132 + (i % 3) * 40, '#5A4028', '#3E7A56', '#4E8E60');
    }
    // volumetric god-rays, fanning down from where the sun sits in L0
    const ray = uid('r1');
    let rays = '';
    [[-46, 120], [-22, 74], [2, 150], [26, 92], [52, 128], [78, 60]].forEach((r, i) => {
      const top = 1120 + r[0] * 5;
      rays += '<path d="M' + (1120 + r[0] * 1.2) + ' 360 l' + (-r[1] / 2) + ' 460 h' + r[1] +
        'Z" fill="url(#' + ray + ')" class="a-shimmer"' + dly(i * 5) +
        ' transform="rotate(' + (r[0] * 0.16) + ' ' + top + ' 360)"/>';
    });

    return strip(
      '<defs>' + lg(lake, [[0, '#A9DCEE'], [1, '#4E9BC8']]) +
        lg(ray, [[0, '#FFF3C4', 0.55], [1, '#FFD9A0', 0]]) + '</defs>' +
      farRidge + water + far + nearRidge + pine +
      '<g style="mix-blend-mode:screen">' + rays + '</g>');
  },

  /* --- L2 · the cabin horseshoe, Big House, climbing wall, fields ------ */
  L2: () => {
    // twelve cabins in a horseshoe, each architecturally distinct, lit within
    const specs = [
      [30, 'temple', '#F7F3EA', '#DCD2C0', 76, 70], [136, 'peak', '#EFE3C6', '#8A9AA8', 66, 60],
      [230, 'peak', '#9AC4DC', '#4E7290', 70, 58], [322, 'grass', '#8AA86E', '#4E7A3E', 64, 54],
      [410, 'peak', '#B0483A', '#6E2A1E', 72, 64], [508, 'temple', '#C4C8CC', '#7E848C', 66, 58],
      [602, 'dome', '#F2C64E', '#D0980E', 68, 60], [696, 'peak', '#B07A3A', '#6E4418', 72, 66],
      [796, 'peak', '#F2A8C0', '#C4607E', 64, 56], [888, 'peak', '#E0C48A', '#A88248', 76, 58],
      [984, 'grass', '#9B6BD9', '#5E3A88', 66, 56], [1074, 'temple', '#5A5560', '#2E2B36', 66, 60],
    ];
    let cabins = '';
    specs.forEach((sp, i) => {
      // the horseshoe: the middle cabins sit further back
      const back = Math.round(Math.sin((i / 11) * Math.PI) * 20);
      cabins += cabin(sp[0], HORIZON + 8 - back, sp[4], sp[5], sp[2], sp[3], '#FFE9AE', sp[1]);
    });

    // the Big House: sky blue, four storeys, wrap-around porch, weather vane
    const bigHouse =
      '<g>' +
        '<rect x="1180" y="' + (HORIZON - 150) + '" width="196" height="150" fill="#9AC8E4"/>' +
        '<rect x="1180" y="' + (HORIZON - 150) + '" width="196" height="150" fill="#7FB0D0" ' +
          'opacity=".35" clip-path="inset(0 0 0 64%)"/>' +
        '<path d="M1166 ' + (HORIZON - 150) + ' L1278 ' + (HORIZON - 228) + ' L1390 ' +
          (HORIZON - 150) + 'Z" fill="#4E7290"/>' +
        '<rect x="1160" y="' + (HORIZON - 42) + '" width="236" height="10" fill="#EFE3C6"/>' +
        '<g fill="#7FA8C4">' +
          '<rect x="1170" y="' + (HORIZON - 32) + '" width="9" height="34"/>' +
          '<rect x="1232" y="' + (HORIZON - 32) + '" width="9" height="34"/>' +
          '<rect x="1312" y="' + (HORIZON - 32) + '" width="9" height="34"/>' +
          '<rect x="1382" y="' + (HORIZON - 32) + '" width="9" height="34"/></g>' +
        '<g fill="#FFE9AE" class="a-flicker">' +
          '<rect x="1204" y="' + (HORIZON - 126) + '" width="30" height="36" rx="3"/>' +
          '<rect x="1262" y="' + (HORIZON - 126) + '" width="30" height="36" rx="3"/>' +
          '<rect x="1320" y="' + (HORIZON - 126) + '" width="30" height="36" rx="3"/></g>' +
        '<g fill="#FFDDA0" class="a-flicker"' + dly(3) + '>' +
          '<rect x="1218" y="' + (HORIZON - 78) + '" width="26" height="34" rx="3"/>' +
          '<rect x="1310" y="' + (HORIZON - 78) + '" width="26" height="34" rx="3"/></g>' +
        '<rect x="1274" y="' + (HORIZON - 268) + '" width="5" height="42" fill="#5A4632"/>' +
        '<g class="a-sway" style="transform-origin:1276px ' + (HORIZON - 240) + 'px">' +
          '<path d="M1254 ' + (HORIZON - 256) + ' h44 M1276 ' + (HORIZON - 272) + ' v30" ' +
            'stroke="#5A4632" stroke-width="3.4"/>' +
          '<path d="M1298 ' + (HORIZON - 264) + ' l17 7 l-17 7Z" fill="#C9922E"/></g>' +
      '</g>';

    // the climbing wall, lava sheeting down one face
    const wall =
      '<g>' +
        '<path d="M1430 ' + HORIZON + ' L1454 ' + (HORIZON - 196) + ' h108 l24 196Z" fill="#6E6660"/>' +
        '<path d="M1516 ' + (HORIZON - 196) + ' h46 l24 196 h-58Z" fill="#B2200A" opacity=".94" ' +
          'class="a-flicker"/>' +
        '<path d="M1530 ' + (HORIZON - 190) + ' q12 48 3 92 q-9 46 6 96" stroke="#FFD98A" ' +
          'stroke-width="6" fill="none" class="a-flicker"' + dly(3) + '/>' +
        '<path d="M1552 ' + (HORIZON - 186) + ' q-8 52 4 100" stroke="#FFF0BF" stroke-width="3.4" ' +
          'fill="none" opacity=".8" class="a-flicker"' + dly(6) + '/>' +
        '<g fill="#F2B544"><circle cx="1476" cy="' + (HORIZON - 142) + '" r="7"/>' +
          '<circle cx="1500" cy="' + (HORIZON - 88) + '" r="6"/>' +
          '<circle cx="1470" cy="' + (HORIZON - 48) + '" r="6"/>' +
          '<circle cx="1494" cy="' + (HORIZON - 162) + '" r="5"/></g>' +
      '</g>';

    // the amphitheatre fire, and orange camp tees on a washing line
    const fire =
      '<g><ellipse cx="1150" cy="' + (HORIZON + 6) + '" rx="62" ry="15" fill="#4A3A26"/>' +
      '<g class="a-flicker">' +
        '<path d="M1130 ' + (HORIZON + 2) + ' q8 -42 23 -53 q-6 25 8 33 q6 -27 15 -35 ' +
          'q11 41 -9 55z" fill="#FF8A3D"/>' +
        '<path d="M1141 ' + (HORIZON + 2) + ' q6 -27 15 -33 q-3 15 7 21 q0 -15 8 -21 ' +
          'q6 25 -8 33z" fill="#FFE9AE"/></g></g>';
    let tees = '';
    for (let i = 0; i < 6; i++) {
      const x = 120 + i * 42;
      tees += '<g class="a-sway"' + dly(i * 4) + ' style="transform-origin:' + (x + 15) + 'px ' +
        (HORIZON - 176) + 'px">' +
        '<path d="M' + x + ' ' + (HORIZON - 176) + ' h30 l5 10 l-8 4 v27 h-24 v-27 l-8 -4Z" ' +
        'fill="' + (i % 2 ? '#E87A2C' : '#F2913E') + '"/></g>';
    }

    // strawberry fields, in long low rows
    let rows = '';
    for (let i = 0; i < 3; i++) {
      const y = HORIZON + 22 + i * 26;
      rows += '<g class="a-sway"' + dly(i * 6) + ' style="transform-origin:800px ' + y + 'px">' +
        '<path d="M0 ' + y + ' q200 -18 400 0 t400 0 t400 0 t400 0" stroke="#3E7A4E" ' +
        'stroke-width="' + (9 + i * 4) + '" fill="none"/></g>';
    }

    // pegasus stable
    const stable =
      '<g><rect x="1240" y="' + (HORIZON - 84) + '" width="134" height="84" fill="#8A5A34"/>' +
      '<path d="M1228 ' + (HORIZON - 84) + ' L1307 ' + (HORIZON - 136) + ' L1386 ' +
        (HORIZON - 84) + 'Z" fill="#B0483A"/>' +
      '<rect x="1288" y="' + (HORIZON - 50) + '" width="40" height="50" rx="3" fill="#3A2A18"/>' +
      '<path d="M1258 ' + (HORIZON - 62) + ' h26 M1332 ' + (HORIZON - 62) + ' h26" ' +
        'stroke="#6B4520" stroke-width="5"/></g>';

    // long soft shadows thrown toward the camera by the low sun
    let shadows = '';
    for (let i = 0; i < 12; i++) {
      const x = 30 + i * 92;
      shadows += '<ellipse cx="' + (x + 26) + '" cy="' + (HORIZON + 16) + '" rx="72" ry="13" ' +
        'fill="#2E5A34" opacity=".28"/>';
    }

    return strip(cabins + shadows + stable + bigHouse + wall +
      '<path d="M112 ' + (HORIZON - 182) + ' h258" stroke="#8A7A5A" stroke-width="2.4"/>' + tees +
      fire + rows);
  },

  /* --- L3 · warm earth path through cut grass -------------------------- */
  L3: () => planeSVG({
    far: '#84AE68', near: '#6E9A56', nearest: '#527C40',
    pathFar: '#E0BC8A', pathNear: '#B98A4E',
    rung: '#FFE0A8', lane: '#FFF0BF', edge: '#3E6B3A',
  }),

  /* --- L4 · things sweeping past the camera ---------------------------- */
  /* Near-foreground props must never sit on top of the hero. At 1.6x these
     sweep past constantly, so anything tall is a trunk at the frame edge and
     anything wide is canopy hanging from the top — the frame gets dressed,
     the middle of the screen stays clear. */
  L4: () => {
    let g = '';

    // canopy hanging into the top of the frame
    const canopy = (x, w, d, c1, c2) => {
      // a scalloped leaf mass rather than a flat ellipse, so the edge reads
      // as foliage instead of a shadow
      let edge = 'M' + (x - w) + ' -120 ';
      const lobes = 9;
      for (let i = 0; i < lobes; i++) {
        const x0 = x - w + (i / lobes) * w * 2;
        const x1 = x - w + ((i + 1) / lobes) * w * 2;
        const dip = w * (0.34 + 0.2 * Math.sin(i * 2.1));
        edge += 'Q' + ((x0 + x1) / 2).toFixed(0) + ' ' + dip.toFixed(0) + ' ' + x1.toFixed(0) +
          ' ' + (dip * 0.42).toFixed(0) + ' ';
      }
      edge += 'L' + (x + w) + ' -120 Z';
      return '<g class="a-sway" style="transform-origin:' + x + 'px -110px;animation-duration:' +
          d + 's" opacity=".95">' +
        '<path d="' + edge + '" fill="' + c1 + '"/>' +
        '<ellipse cx="' + (x - w * 0.4) + '" cy="' + (w * 0.1) + '" rx="' + (w * 0.3) +
          '" ry="' + (w * 0.2) + '" fill="' + c2 + '"/>' +
        '<ellipse cx="' + (x + w * 0.42) + '" cy="' + (w * 0.06) + '" rx="' + (w * 0.26) +
          '" ry="' + (w * 0.17) + '" fill="' + c2 + '" opacity=".9"/>' +
        // a couple of gaps where the sky comes through
        '<ellipse cx="' + (x - w * 0.12) + '" cy="' + (-w * 0.2) + '" rx="' + (w * 0.1) +
          '" ry="' + (w * 0.07) + '" fill="#FFE1B0" opacity=".5"/>' +
      '</g>';
    };
    g += canopy(180, 210, 12, '#357A56', '#4E9E68');
    g += canopy(760, 170, 15, '#2E6B4F', '#3E8E5A');
    g += canopy(1340, 220, 13, '#357A56', '#4E9E68');

    // slim trunks at the edges of the frame
    [[60, 46], [1520, 54]].forEach((t, i) => {
      g += '<g class="a-sway" style="transform-origin:' + t[0] + 'px 900px;animation-duration:' +
        (14 + i * 2) + 's">' +
        '<path d="M' + t[0] + ' 900 l' + (-t[1] * 0.62) + ' -900 h' + (t[1] * 1.24) + 'Z" ' +
          'fill="#4A3524"/>' +
        '<path d="M' + t[0] + ' 900 l' + (-t[1] * 0.2) + ' -900 h' + (t[1] * 0.38) +
          'Z" fill="#5E4530" opacity=".7"/></g>';
    });

    // long grass tufts along the near verge, kept out of the centre lane
    for (let i = 0; i < 24; i++) {
      const x = (i * 67) % STRIP_W;
      if (x > 620 && x < 980) continue;            // leave the hero's lane clear
      const y = 824 + (i % 4) * 24;
      g += '<g class="a-swayFast"' + dly(i * 2) + ' style="transform-origin:' + x + 'px ' + y + 'px">' +
        '<path d="M' + x + ' ' + y + ' q-13 -46 -5 -76 M' + x + ' ' + y + ' q6 -54 20 -70 M' +
        x + ' ' + y + ' q15 -38 32 -50" stroke="#3E6B3A" stroke-width="8" fill="none" ' +
        'stroke-linecap="round"/></g>';
    }

    // strawberries close enough to actually see
    for (let i = 0; i < 8; i++) {
      const x = 110 + i * 195;
      if (x > 640 && x < 960) continue;
      const y = 866 + (i % 3) * 20;
      g += '<g class="a-bob"' + dly(i * 3) + '>' +
        '<path d="M' + (x - 18) + ' ' + (y - 16) + ' h36" stroke="#1D4A2C" stroke-width="8" ' +
          'stroke-linecap="round"/>' +
        '<circle cx="' + x + '" cy="' + y + '" r="16" fill="#E2543A"/>' +
        '<circle cx="' + (x - 5) + '" cy="' + (y - 5) + '" r="4" fill="#FFB0A0" opacity=".7"/></g>';
    }
    return strip(g);
  },
};
