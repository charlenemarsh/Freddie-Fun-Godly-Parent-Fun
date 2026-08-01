/* ===========================================================================
   select.js — choose your hero
   ---------------------------------------------------------------------------
   Presented in the SAME five-lane plus as every junction, so the mechanic is
   taught before it is ever tested. Swipe, arrow keys, WASD and direct click
   all work here exactly as they will for the rest of the game.

   Which hero you pick changes nothing about your result. It is pure flavour,
   and the game never says so.
   =========================================================================== */

const Select = (function () {

  let cards = {};
  let focused = 'percy';
  let typeTimer = 0;

  function heroByDir(dir) {
    return HERO_KEYS.map((k) => HEROES[k]).find((h) => h.lane === dir);
  }

  /* the flavour line types itself out, one character at a time */
  function typeFlavour(text) {
    clearInterval(typeTimer);
    const el = D.flavour;
    if (G.reduced) { el.innerHTML = '&ldquo;' + text + '&rdquo;'; return; }
    let i = 0;
    el.innerHTML = '<span class="caret"></span>';
    typeTimer = setInterval(() => {
      i++;
      el.innerHTML = '&ldquo;' + text.slice(0, i) + '&rdquo;<span class="caret"></span>';
      if (i >= text.length) {
        clearInterval(typeTimer);
        setTimeout(() => { el.innerHTML = '&ldquo;' + text + '&rdquo;'; }, 900);
      }
    }, 26);
  }

  function focus(dir) {
    const h = heroByDir(dir);
    if (!h || focused === h.key) return;
    focused = h.key;
    for (const d in cards) cards[d].classList.toggle('target', d === dir);
    typeFlavour(h.flavourLine);
    D.live.textContent = h.name + '. ' + h.flavourLine;
  }

  function commit(dir) {
    const h = heroByDir(dir) || HEROES.percy;
    G.hero = h.key;
    Input.disarm();
    const el = cards[dir];
    if (el) {
      el.classList.add('chosen');
      const r = el.getBoundingClientRect();
      Particles.burst(r.left + r.width / 2, r.top + r.height / 2, h.accentHud, 34, 1.6);
    }
    for (const d in cards) if (d !== dir) { cards[d].classList.add('shatter'); }
    Audio2.divine();
    document.documentElement.style.setProperty('--hero-accent', h.accentHud);
    setTimeout(() => setState(S.REALM_INTRO), G.reduced ? 150 : 620);
  }

  function build() {
    let lanes = '';
    HERO_KEYS.forEach((k) => {
      const h = HEROES[k];
      lanes +=
        '<button type="button" class="lane lane-' + h.lane + '" data-dir="' + h.lane + '" ' +
          'style="--lane-glow:' + h.accentHud + '" aria-label="' + h.name + '">' +
          '<span class="glow"></span>' +
          '<span class="chev" aria-hidden="true">' + Glyph.chevron(h.lane) + '</span>' +
          '<span class="pedestal"></span>' +
          '<span class="art" style="height:74%">' + Rig.still(k) + '</span>' +
          '<span class="lbl">' + h.name.split(' ')[0] + '</span>' +
        '</button>';
    });

    D.select.innerHTML =
      '<div class="screen-center"><div class="sel-wrap">' +
        '<h2 class="display">Who walks the road?</h2>' +
        '<p class="hint">Swipe, use the arrow keys, or just tap one.</p>' +
        '<div id="selLanes">' + lanes + '</div>' +
        '<p id="flavour"></p>' +
      '</div></div>';

    const grid = D.select.querySelector('#selLanes');
    grid.id = 'selLanes';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(3, var(--card))';
    grid.style.gridTemplateRows = 'repeat(3, var(--card))';
    grid.style.gap = 'var(--gap)';

    D.flavour = D.select.querySelector('#flavour');
    cards = {};
    grid.querySelectorAll('.lane').forEach((el) => {
      cards[el.dataset.dir] = el;
      el.classList.add('bloomed');
      el.style.opacity = 1;
      el.style.transform = 'scale(1)';
      el.addEventListener('pointerenter', () => focus(el.dataset.dir));
      el.addEventListener('focus', () => focus(el.dataset.dir));
    });
  }

  return {
    handleCommit: commit,
    handleDrag(dir) {
      if (!dir) { for (const d in cards) cards[d].classList.remove('target', 'dimmed'); return; }
      focus(dir);
      for (const d in cards) cards[d].classList.toggle('dimmed', d !== dir);
    },

    init() {
      onEnter(S.CHARACTER_SELECT, () => {
        build();
        D.select.classList.add('on');
        D.hud.classList.add('dim');
        focused = null;
        focus('CENTRE');
        Input.arm();
        const first = D.select.querySelector('.lane-CENTRE');
        if (first) first.focus({ preventScroll: true });
      });
      onExit(S.CHARACTER_SELECT, () => {
        clearInterval(typeTimer);
        D.select.classList.remove('on');
        Input.disarm();
      });
    },
  };
})();
