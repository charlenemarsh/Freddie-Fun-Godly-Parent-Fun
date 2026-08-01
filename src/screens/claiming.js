/* ===========================================================================
   claiming.js — the finale (SPEC §C.3)
   ---------------------------------------------------------------------------
   The hero stands in the amphitheatre at dusk, the whole camp gathered in
   silhouette, and then:

     1. held silence — fire crackles, everyone looks up.
        RESIST THE URGE TO FILL THIS. The silence is the effect.
     2. light drains to near-black, desaturating from the edges inward
     3. the god-symbol ignites above their head, rotating, casting light down
     4. light bursts outward in a shockwave ring; the crowd kneels in a wave
        rippling from the front row backward
     5. the god's name types out in gold, one letter at a time, bass per letter
     6. a synthesized chorus speaks the claiming line
     7. the result card slides up
   =========================================================================== */

const Claiming = (function () {

  let timers = [];
  const after = (ms, fn) => timers.push(setTimeout(fn, G.reduced ? Math.min(ms, 400) : ms));
  const clearAll = () => { timers.forEach(clearTimeout); timers = []; };

  /* the amphitheatre: tiered stone, a fire, and the camp in silhouette */
  function stage() {
    const sky = uid('cl'), fire = uid('cl');
    let crowd = '';
    // five rows, back to front, so row 0 kneels first in the wave
    for (let row = 0; row < 5; row++) {
      const y = 700 + row * 46;
      const n = 9 + row * 2;
      for (let i = 0; i < n; i++) {
        const x = 800 + ((i - (n - 1) / 2) * (150 - row * 8));
        const s = (0.6 + row * 0.14).toFixed(2);
        crowd += '<g class="cwd" data-row="' + row + '" transform="translate(' + x.toFixed(0) +
          ' ' + y + ') scale(' + s + ')">' +
          '<path d="M0 0 q-22 -10 -22 -46 q0 -30 22 -36 q22 6 22 36 q0 36 -22 46z" fill="#0A0812"/>' +
          '<circle cx="0" cy="-92" r="20" fill="#0E0B16"/></g>';
      }
    }
    let tiers = '';
    for (let i = 0; i < 6; i++) {
      tiers += '<path d="M' + (100 - i * 20) + ' ' + (930 - i * 46) + ' H' + (1500 + i * 20) +
        ' v46 H' + (100 - i * 20) + 'Z" fill="#1A1520" opacity="' + (0.55 + i * 0.07) + '"/>';
    }
    return '<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" ' +
      'xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs>' + lg(sky, [[0, '#241A38'], [0.5, '#3E2A46'], [1, '#7A4A38']]) +
        rg(fire, [[0, '#FFE9AE', 0.9], [1, '#FF6B35', 0]], 0.5, 0.5, 0.5) + '</defs>' +
      '<rect width="1600" height="1000" fill="url(#' + sky + ')"/>' +
      // dusk ridge and Thalia's pine on the skyline
      '<path d="M0 470 q220 -70 440 -20 q240 56 460 -30 q260 -100 700 30 v560 H0Z" fill="#1E1628"/>' +
      '<g><path d="M1330 470 v-70 h10 v70Z" fill="#0E0B16"/>' +
      '<path d="M1335 388 l-40 46 h80Z" fill="#141020"/>' +
      '<path d="M1335 358 l-32 40 h64Z" fill="#181428"/></g>' +
      tiers +
      // the fire everyone is standing around
      '<ellipse cx="800" cy="960" rx="300" ry="70" fill="url(#' + fire + ')" class="a-flicker"/>' +
      '<g class="a-flicker" transform="translate(800 960)">' +
        '<path d="M-46 0 q18 -96 44 -120 q-10 58 14 74 q10 -62 26 -82 q22 92 -26 128Z" fill="#FF8A3D"/>' +
        '<path d="M-20 0 q10 -58 26 -74 q0 34 12 42 q0 -32 12 -42 q10 54 -18 74Z" fill="#FFE9AE"/></g>' +
      crowd +
      '</svg>';
  }

  function run() {
    clearAll();
    const res = G.result;
    const god = GODS[res.winner];
    const c = god.colours;

    document.documentElement.style.setProperty('--claim-glow', c[2]);

    D.claimStage.innerHTML = stage();
    // the hero, standing in the middle of it, looking up
    D.claimHero.innerHTML = Rig.still(G.hero, 'awe');
    D.claimSymbol.innerHTML = Sigil[god.symbol] ? Sigil[god.symbol](c[0]) : Sigil.lightning(c[0]);
    D.claimSymbol.classList.remove('ignite');
    D.claimRing.classList.remove('burst');
    D.claimBeam.classList.remove('on');
    D.claimDrain.classList.remove('on');
    D.claimName.innerHTML = '';
    D.claimLine.classList.remove('on');
    D.claimLine.textContent = '';
    D.claiming.classList.add('on');

    D.live.textContent = 'The claiming.';
    D.claimSkip.classList.remove('on');

    // The one long moment left in the game, and the only one worth keeping.
    // It is still skippable — but by a button that has to be found and
    // pressed, never by the tap that a waiting child makes by reflex.
    after(2200, () => D.claimSkip.classList.add('on'));

    // 1. the held silence
    // 2. light drains to near-black
    after(1200, () => D.claimDrain.classList.add('on'));

    // 3. the symbol ignites and casts its light down
    after(2300, () => {
      D.claimSymbol.classList.add('ignite');
      D.claimBeam.classList.add('on');
      Audio2.divine();
    });

    // 4. the shockwave, and the crowd kneeling in a wave from the front row back
    after(3300, () => {
      D.claimRing.classList.add('burst');
      const sr = D.stage.getBoundingClientRect();
      Particles.shockwave(sr.left + sr.width / 2, sr.top + sr.height * 0.23, c[2]);
      Audio2.thunder();
      const rows = D.claimStage.querySelectorAll('.cwd');
      rows.forEach((el) => {
        const row = Number(el.dataset.row);
        setTimeout(() => {
          el.style.transition = 'transform .5s cubic-bezier(.2,.8,.3,1)';
          const t = el.getAttribute('transform');
          el.setAttribute('transform', t + ' translate(0 44) scale(1 0.72)');
        }, G.reduced ? 0 : (4 - row) * 130);
      });
    });

    // 5. the name types out in gold, one bass impact per letter
    after(4100, () => {
      const name = god.name.toUpperCase();
      D.claimName.innerHTML = name.split('').map((ch) =>
        '<span class="ch">' + (ch === ' ' ? '&nbsp;' : ch) + '</span>').join('');
      const chs = D.claimName.querySelectorAll('.ch');
      chs.forEach((el, i) => setTimeout(() => {
        el.classList.add('in');
        Audio2.nameHit(i);
      }, G.reduced ? 0 : i * 130));
    });

    // 6. the chorus speaks the claiming line
    after(5200, () => {
      const epithet = god.epithets[(res.traits.VALOR + res.traits.SHADOW) % god.epithets.length];
      D.claimLine.textContent = 'Hail, child of ' + god.name + ', ' + epithet + '.';
      D.claimLine.classList.add('on');
      Audio2.chorus(god.name.length);
      D.live.textContent = 'Hail, child of ' + god.name + ', ' + epithet + '.';
    });

    // 7. the result card slides up
    after(7600, () => setState(S.RESULT));
  }

  return {
    init() {
      onEnter(S.CLAIMING, run);
      onExit(S.CLAIMING, () => {
        clearAll();
        D.claiming.classList.remove('on');
        D.claimSkip.classList.remove('on');
      });
      D.claimSkip.addEventListener('click', () => Claiming.skip());
    },
    skip() { clearAll(); setState(S.RESULT); },
  };
})();
