/* ===========================================================================
   rig.js — one character rig, five heroes
   ---------------------------------------------------------------------------
   There is a single layered SVG skeleton with named groups. Each hero swaps
   the palette, the hair shape and the prop. Nobody gets their own figure —
   that way all five animate identically and the run cycle only exists once.

   The camera is over the shoulder, so this is a BACK view: you see the back
   of the head, the shoulders, and the arms and legs swinging past the body.

   Silhouette readability at small size matters more than detail.

   States: idle · run · turnLeft · turnRight · leap · slide · awe
   =========================================================================== */

const Rig = (function () {

  let root = null;          // the <svg>
  let parts = {};           // cached group elements
  let hero = null;
  let state = 'run';
  let stateT = 0;
  let phase = 0;            // run-cycle phase, radians
  let hairLag = 0;          // hair and cloak trail one frame behind, for weight

  /* ---- hair shapes, drawn from behind ---------------------------------- */
  const HAIR = {
    curls: (c) => '<g fill="' + c + '">' +
      '<path d="M30 8 q-15 0 -16 15 q-1 12 3 20 q-8 -2 -7 -14 q1 -22 20 -23z"/>' +
      '<path d="M30 8 q15 0 16 15 q1 12 -3 20 q8 -2 7 -14 q-1 -22 -20 -23z"/>' +
      '<circle cx="18" cy="20" r="7"/><circle cx="42" cy="20" r="7"/>' +
      '<circle cx="15" cy="32" r="6"/><circle cx="45" cy="32" r="6"/>' +
      '<circle cx="19" cy="42" r="5.4"/><circle cx="41" cy="42" r="5.4"/>' +
      '<circle cx="30" cy="10" r="13"/></g>',
    curlsShort: (c) => '<g fill="' + c + '">' +
      '<circle cx="30" cy="11" r="13"/>' +
      '<circle cx="19" cy="17" r="6.4"/><circle cx="41" cy="17" r="6.4"/>' +
      '<circle cx="23" cy="25" r="5.4"/><circle cx="37" cy="25" r="5.4"/></g>',
    mop: (c) => '<g fill="' + c + '">' +
      '<path d="M30 -3 q17 0 17 17 q0 9 -2 13 q-4 -8 -6 -3 q-3 -8 -7 -2 q-4 -7 -8 -1 ' +
      'q-3 -6 -8 1 q-3 -5 -3 -8 q0 -17 17 -17z"/></g>',
    ponytail: (c) => '<g fill="' + c + '">' +
      '<path d="M30 -2 q16 0 16 16 q0 6 -2 10 h-28 q-2 -4 -2 -10 q0 -16 16 -16z"/>' +
      '<path d="M27 24 q-5 14 -1 26 q3 8 8 6 q4 -3 1 -10 q-4 -10 -2 -22z" class="tail"/></g>',
    short: (c) => '<g fill="' + c + '">' +
      '<path d="M30 -1 q15 0 15 15 q0 6 -1 9 h-28 q-1 -3 -1 -9 q0 -15 15 -15z"/>' +
      '<path d="M17 20 q4 4 10 3 M43 20 q-4 4 -10 3" stroke="' + c + '" stroke-width="3" fill="none"/></g>',
  };

  /* ---- props, held in the trailing hand -------------------------------- */
  const PROP = {
    pen:   () => '<g><rect x="-2" y="-9" width="4" height="18" rx="1.6" fill="#2E4A5E"/>' +
                 '<rect x="-2" y="-13" width="4" height="5" rx="1.6" fill="#4FD1D9"/></g>',
    knife: () => '<g><path d="M0 -16 l3 6 v14 h-6 v-14z" fill="#C9BCA4"/>' +
                 '<rect x="-3.4" y="4" width="6.8" height="9" rx="2" fill="#6B4E28"/></g>',
    pipes: () => '<g fill="#C9A05E"><rect x="-7" y="-8" width="3.4" height="16" rx="1.4"/>' +
                 '<rect x="-2.4" y="-6" width="3.4" height="14" rx="1.4"/>' +
                 '<rect x="2.2" y="-4" width="3.4" height="12" rx="1.4"/>' +
                 '<rect x="6.8" y="-2" width="3.4" height="10" rx="1.4"/></g>',
    spear: () => '<g><rect x="-1.6" y="-26" width="3.2" height="52" rx="1.4" fill="#7A5A34"/>' +
                 '<path d="M0 -34 l4 8 h-8z" fill="#C9BCA4"/>' +
                 '<circle cx="0" cy="-30" r="2.6" fill="#FFE9AE" class="a-flicker"/></g>',
    sword: () => '<g><path d="M0 -24 l3.4 7 v24 h-6.8 v-24z" fill="#C9BCA4"/>' +
                 '<rect x="-7" y="7" width="14" height="3.4" rx="1.6" fill="#8A6238"/>' +
                 '<rect x="-2.4" y="10" width="4.8" height="10" rx="2" fill="#5A3A1E"/></g>',
  };

  /* ---- the shared skeleton --------------------------------------------- */
  function markup(h) {
    const p = h.palette;
    return '<svg viewBox="0 0 60 124" xmlns="http://www.w3.org/2000/svg" ' +
      'aria-hidden="true" focusable="false" overflow="visible">' +

      // back leg first so it reads behind the body
      '<g id="rgLegB" style="transform-origin:30px 70px">' +
        '<rect x="25" y="68" width="10" height="34" rx="4.6" fill="' + p.bottom + '"/>' +
        '<rect x="24" y="98" width="12" height="8" rx="3" fill="#2A2018"/>' +
      '</g>' +
      '<g id="rgArmB" style="transform-origin:30px 48px">' +
        '<rect x="15" y="45" width="8.6" height="31" rx="4.3" fill="' + p.skin + '"/>' +
        '<rect x="15" y="45" width="8.6" height="13" rx="4.3" fill="' + p.top + '"/>' +
        '<g id="rgProp" transform="translate(12 84)">' + (PROP[h.prop] || PROP.pen)() + '</g>' +
      '</g>' +

      // torso
      '<g id="rgTorso" style="transform-origin:30px 76px">' +
        '<path d="M16 44 q14 -7 28 0 l3 34 q-17 6 -34 0z" fill="' + p.top + '"/>' +
        '<path d="M16 44 q14 -7 28 0 l1 8 q-15 -5 -30 0z" fill="' + p.trim + '" opacity=".5"/>' +
        '<path d="M30 46 v32" stroke="' + p.trim + '" stroke-width="1.2" opacity=".35"/>' +
      '</g>' +

      // front leg and arm sit over the torso
      '<g id="rgLegF" style="transform-origin:30px 70px">' +
        '<rect x="27" y="68" width="10.4" height="34" rx="4.6" fill="' + p.bottom + '"/>' +
        '<rect x="26" y="98" width="12.4" height="8" rx="3" fill="#332618"/>' +
      '</g>' +
      '<g id="rgArmF" style="transform-origin:30px 48px">' +
        '<rect x="36.4" y="45" width="8.6" height="31" rx="4.3" fill="' + p.skin + '"/>' +
        '<rect x="36.4" y="45" width="8.6" height="13" rx="4.3" fill="' + p.top + '"/>' +
      '</g>' +

      // head, then hair on top so the silhouette stays clean
      '<g id="rgHead" style="transform-origin:30px 40px">' +
        '<rect x="26" y="34" width="8" height="10" rx="3" fill="' + p.skin + '"/>' +
        '<ellipse cx="30" cy="22" rx="13" ry="14" fill="' + p.skin + '"/>' +
        '<g id="rgHair" transform="translate(30 22) scale(.88) translate(-30 -22)">' +
          (HAIR[h.hairStyle] || HAIR.short)(p.hair) + '</g>' +
      '</g>' +

      // a light cloak of air behind them — sells the speed
      '<g id="rgCloak" style="transform-origin:30px 46px" opacity=".55">' +
        '<path d="M22 46 q-14 12 -20 30 q16 -8 24 -18z" fill="' + p.accent + '"/>' +
      '</g>' +
      '</svg>';
  }

  /* ---- pose maths ------------------------------------------------------- */

  function apply(el, transform) { if (el) el.style.transform = transform; }

  function poseRun(t) {
    const s = Math.sin(phase), c = Math.cos(phase);
    apply(parts.legF, 'rotate(' + (s * 30) + 'deg)');
    apply(parts.legB, 'rotate(' + (-s * 30) + 'deg)');
    apply(parts.armF, 'rotate(' + (-s * 34) + 'deg)');
    apply(parts.armB, 'rotate(' + (s * 34) + 'deg)');
    // torso bobs at twice the stride rate, and leans into the run
    apply(parts.torso, 'translateY(' + (Math.abs(c) * -2.2) + 'px) rotate(' + (s * 2.4 - 1) + 'deg)');
    apply(parts.head, 'translateY(' + (Math.abs(c) * -2.0) + 'px) rotate(' + (s * 2) + 'deg)');
    // hair follows a frame late so it has weight
    apply(parts.hair, 'rotate(' + (hairLag * 9) + 'deg) translateX(' + (hairLag * -1.6) + 'px)');
    apply(parts.cloak, 'rotate(' + (-6 - hairLag * 12) + 'deg) scaleX(' + (1 + Math.abs(s) * 0.16) + ')');
  }

  function poseIdle(t) {
    const b = Math.sin(t * 1.9);
    apply(parts.legF, 'rotate(1deg)');
    apply(parts.legB, 'rotate(-1deg)');
    apply(parts.armF, 'rotate(' + (b * 3) + 'deg)');
    apply(parts.armB, 'rotate(' + (-b * 3) + 'deg)');
    apply(parts.torso, 'translateY(' + (b * 0.9) + 'px)');
    apply(parts.head, 'translateY(' + (b * 1.1) + 'px) rotate(' + (b * 1.4) + 'deg)');
    apply(parts.hair, 'rotate(' + (b * 2) + 'deg)');
    apply(parts.cloak, 'rotate(' + (b * 4) + 'deg)');
  }

  function poseTurn(dir, t) {
    const k = Math.min(1, stateT * 5);
    const a = dir * 26 * k;
    apply(parts.torso, 'rotate(' + a * 0.6 + 'deg) scaleX(' + (1 - k * 0.18) + ')');
    apply(parts.head, 'rotate(' + a + 'deg) translateX(' + (dir * k * 3) + 'px)');
    apply(parts.hair, 'rotate(' + (a * 1.4) + 'deg)');
    apply(parts.armF, 'rotate(' + (-dir * 40 * k) + 'deg)');
    apply(parts.armB, 'rotate(' + (dir * 20 * k) + 'deg)');
    apply(parts.legF, 'rotate(' + (dir * 12 * k) + 'deg)');
    apply(parts.legB, 'rotate(' + (-dir * 12 * k) + 'deg)');
    apply(parts.cloak, 'rotate(' + (-dir * 26 * k) + 'deg)');
  }

  function poseLeap(t) {
    const k = Math.min(1, stateT * 3);
    apply(parts.legF, 'rotate(-38deg)');
    apply(parts.legB, 'rotate(26deg)');
    apply(parts.armF, 'rotate(-58deg)');
    apply(parts.armB, 'rotate(38deg)');
    apply(parts.torso, 'translateY(-4px) rotate(-5deg)');
    apply(parts.head, 'translateY(-5px) rotate(-4deg)');
    apply(parts.hair, 'rotate(16deg)');
    apply(parts.cloak, 'rotate(-24deg) scaleX(1.35)');
  }

  function poseSlide(t) {
    apply(parts.legF, 'rotate(-64deg)');
    apply(parts.legB, 'rotate(-30deg)');
    apply(parts.armF, 'rotate(46deg)');
    apply(parts.armB, 'rotate(64deg)');
    apply(parts.torso, 'translateY(10px) rotate(16deg)');
    apply(parts.head, 'translateY(11px) rotate(12deg)');
    apply(parts.hair, 'rotate(26deg)');
    apply(parts.cloak, 'rotate(-34deg) scaleX(1.5)');
  }

  function poseAwe(t) {
    const b = Math.sin(t * 1.2);
    apply(parts.legF, 'rotate(2deg)');
    apply(parts.legB, 'rotate(-2deg)');
    apply(parts.armF, 'rotate(' + (14 + b * 3) + 'deg)');
    apply(parts.armB, 'rotate(' + (-14 - b * 3) + 'deg)');
    apply(parts.torso, 'translateY(' + (b * 0.7) + 'px) rotate(-2deg)');
    apply(parts.head, 'rotate(-12deg) translateY(' + (-1 + b * 0.7) + 'px)');
    apply(parts.hair, 'rotate(-6deg)');
    apply(parts.cloak, 'rotate(' + (b * 5) + 'deg)');
  }

  /* ---------------------------------------------------------------------- */

  return {
    mount(el, heroKey) {
      hero = HEROES[heroKey] || HEROES.percy;
      el.innerHTML = markup(hero);
      root = el.querySelector('svg');
      parts = {
        legF: root.querySelector('#rgLegF'),
        legB: root.querySelector('#rgLegB'),
        armF: root.querySelector('#rgArmF'),
        armB: root.querySelector('#rgArmB'),
        torso: root.querySelector('#rgTorso'),
        head: root.querySelector('#rgHead'),
        hair: root.querySelector('#rgHair'),
        cloak: root.querySelector('#rgCloak'),
      };
      // give every group an origin the browser will honour on an SVG child
      for (const k in parts) if (parts[k]) parts[k].style.transformBox = 'fill-box';
      // fill-box origins are relative to each group's own box, so reset them
      if (parts.legF) parts.legF.style.transformOrigin = '50% 4%';
      if (parts.legB) parts.legB.style.transformOrigin = '50% 4%';
      if (parts.armF) parts.armF.style.transformOrigin = '50% 4%';
      if (parts.armB) parts.armB.style.transformOrigin = '50% 8%';
      if (parts.torso) parts.torso.style.transformOrigin = '50% 100%';
      if (parts.head) parts.head.style.transformOrigin = '50% 100%';
      if (parts.hair) parts.hair.style.transformOrigin = '50% 90%';
      if (parts.cloak) parts.cloak.style.transformOrigin = '90% 0%';
      state = 'idle'; stateT = 0; phase = 0;
    },

    /* Markup only — used by the result card and the character select, where
       there is no animation loop driving it. */
    still(heroKey, pose) {
      const h = HEROES[heroKey] || HEROES.percy;
      let m = markup(h);
      // a still figure gets no JS-driven transform origins, so pose it with
      // SVG rotate(angle cx cy) instead — those are in user units and need
      // no CSS at all
      if (pose === 'awe') {
        m = m.replace('id="rgHead"', 'id="rgHead" transform="rotate(-9 30 44)"')
             .replace('id="rgArmF"', 'id="rgArmF" transform="rotate(13 30 47)"')
             .replace('id="rgArmB"', 'id="rgArmB" transform="rotate(-13 30 47)"')
             .replace('id="rgLegF"', 'id="rgLegF" transform="rotate(4 30 70)"')
             .replace('id="rgLegB"', 'id="rgLegB" transform="rotate(-4 30 70)"');
      } else {
        m = m.replace('id="rgArmF"', 'id="rgArmF" transform="rotate(7 30 47)"')
             .replace('id="rgArmB"', 'id="rgArmB" transform="rotate(-7 30 47)"')
             .replace('id="rgLegF"', 'id="rgLegF" transform="rotate(6 30 70)"')
             .replace('id="rgLegB"', 'id="rgLegB" transform="rotate(-6 30 70)"');
      }
      return m;
    },

    setState(s) { if (s !== state) { state = s; stateT = 0; } },
    getState() { return state; },

    /* speed is the world scroll rate, so the stride matches the ground */
    update(dt, t, speed) {
      if (!root) return;
      stateT += dt;
      const stride = Math.max(0.6, (speed || 300) / 96);
      phase += dt * stride * 2 * Math.PI * 0.42;
      // one-frame lag, damped, so hair and cloak trail the body
      const lagTarget = Math.sin(phase);
      hairLag += (lagTarget - hairLag) * Math.min(1, dt * 9);

      switch (state) {
        case 'run': poseRun(t); break;
        case 'turnLeft': poseTurn(-1, t); break;
        case 'turnRight': poseTurn(1, t); break;
        case 'leap': poseLeap(t); break;
        case 'slide': poseSlide(t); break;
        case 'awe': poseAwe(t); break;
        default: poseIdle(t);
      }
    },

    /* the pose a lane choice puts them into, before the camera whip-pan */
    poseForDirection(dir) {
      return { UP: 'leap', DOWN: 'slide', LEFT: 'turnLeft', RIGHT: 'turnRight', CENTRE: 'run' }[dir] || 'run';
    },
  };
})();
