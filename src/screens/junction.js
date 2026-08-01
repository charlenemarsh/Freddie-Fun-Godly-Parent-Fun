/* ===========================================================================
   junction.js — the five-lane junction, and the choreography around it
   ---------------------------------------------------------------------------
   SPEC §A.1, in order:
     1. run ramps down, vignette closes, background pushes back
     2. ambient ducks, a lyre swell rises
     3. the question plaque slides down and settles with a bounce
     4. five cards stagger-bloom outward from centre, 70ms apart
     5. every card carries animated art — never a bare word
     6. on commit the chosen card flares white-hot and the other four
        shatter into light motes and drift away
   =========================================================================== */

const Junction = (function () {

  let currentQ = null;
  let cards = {};
  let onDone = null;
  let tiltRaf = 0;

  /* The glow colour of a lane is taken from the god it feeds most. That way
     the light on the card is a genuine hint, not decoration. */
  function laneGlow(opt) {
    let best = null, bestN = -1;
    for (const k in (opt.gods || {})) {
      if (opt.gods[k] > bestN) { bestN = opt.gods[k]; best = k; }
    }
    return best && GODS[best] ? GODS[best].colours[0] : '#FFE0A0';
  }

  function build(q) {
    const lanes = D.lanes;
    lanes.innerHTML = '';
    cards = {};
    q.options.forEach((opt) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'lane lane-' + opt.dir + (q.visualOnly ? ' visual' : '');
      el.dataset.dir = opt.dir;
      el.style.setProperty('--lane-glow', laneGlow(opt));
      // described by direction and, when there is one, its label — so a
      // screen reader user gets the same information as a sighted one
      el.setAttribute('aria-label',
        opt.dir.toLowerCase() + (q.visualOnly ? '' : ': ' + opt.label));
      el.innerHTML =
        '<span class="glow"></span>' +
        '<span class="chev" aria-hidden="true">' + Glyph.chevron(opt.dir) + '</span>' +
        '<span class="art">' + optionArt(opt.art) + '</span>' +
        (q.visualOnly ? '' : '<span class="lbl">' + opt.label + '</span>');
      lanes.appendChild(el);
      cards[opt.dir] = el;
    });
  }

  /* live drag: the whole group tilts toward the drag, the target lifts and
     brightens, the other four dim. The choice has to feel physical. */
  function onDrag(dir, strength, dx, dy) {
    if (G.reduced) return;
    for (const d in cards) {
      cards[d].classList.toggle('target', d === dir);
      cards[d].classList.toggle('dimmed', !!dir && d !== dir);
    }
    const k = Math.min(1, strength) * 7;
    const tx = dx ? Math.max(-1, Math.min(1, dx / 90)) : 0;
    const ty = dy ? Math.max(-1, Math.min(1, dy / 90)) : 0;
    D.lanes.style.transform =
      'perspective(900px) rotateY(' + (tx * k * 0.9) + 'deg) rotateX(' + (-ty * k * 0.9) + 'deg) ' +
      'translate3d(' + (tx * 9) + 'px,' + (ty * 9) + 'px,0)';
  }

  function resetTilt() {
    D.lanes.style.transform = '';
    for (const d in cards) cards[d].classList.remove('target', 'dimmed');
  }

  /* ---- the commit ------------------------------------------------------ */

  function commit(dir) {
    const opt = currentQ.options.find((o) => o.dir === dir) || currentQ.options[0];
    Input.disarm();
    resetTilt();

    // record the answer, and let it start changing the world
    G.answers.push({ q: currentQ, opt });
    pushTintFromOption(opt);

    // the chosen card flares white-hot; the other four shatter into motes
    for (const d in cards) {
      const el = cards[d];
      if (d === dir) {
        el.classList.add('chosen');
        const r = el.getBoundingClientRect();
        Particles.burst(r.left + r.width / 2, r.top + r.height / 2, laneGlow(opt), 30, 1.5);
      } else {
        const r = el.getBoundingClientRect();
        // outward from the centre of the STAGE, which is not the centre of
        // the window once the game is letterboxed into its portrait frame
        const sr = D.stage.getBoundingClientRect();
        el.style.setProperty('--shatter-x',
          ((r.left + r.width / 2) - (sr.left + sr.width / 2)) * 0.22 + 'px');
        el.style.setProperty('--shatter-y',
          ((r.top + r.height / 2) - (sr.top + sr.height / 2)) * 0.22 - 30 + 'px');
        el.style.setProperty('--shatter-rot', ((Math.random() * 24) - 12).toFixed(1) + 'deg');
        el.classList.add('shatter');
        Particles.shatter(r, '#FFE9AE');
      }
    }

    Audio2.whoosh();
    Audio2.junctionEnd();

    // the hero turns into the choice before the camera whips round
    Rig.setState(Rig.poseForDirection(dir));

    const wait = G.reduced ? 140 : 380;
    setTimeout(() => {
      D.junction.classList.remove('on');
      D.vignette.classList.remove('tight');
      D.lanes.classList.remove('bloom');
      if (onDone) onDone(opt);
    }, wait);
  }

  /* ---- the tutorial, once, on the very first junction ------------------ */

  /* While this is up it owns the screen: the road hears nothing, so no
     answer can be given by accident while dismissing it. And there are four
     ways out — the button, anywhere on the backdrop, Escape, or any key at
     all. A child must never be able to get stuck behind a message. */
  function showTutorial(then) {
    let done = false;
    Input.setModal(true);
    D.tutorial.classList.add('on');
    D.live.textContent =
      'Five ways to go. Swipe or use the arrow keys. Press any key or tap to continue.';

    const dismiss = () => {
      if (done) return;
      done = true;
      D.tutorial.classList.remove('on');
      G.tutorialSeen = true;
      try { saveStore(); } catch (e) {}       // storage must never trap anyone
      D.tutorial.removeEventListener('click', dismiss);
      window.removeEventListener('keydown', onKey, true);
      Input.setModal(false);
      then();
    };
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key === 'Tab') return;
      e.preventDefault();
      dismiss();
    };

    D.tutorial.addEventListener('click', dismiss);
    window.addEventListener('keydown', onKey, true);
    D.tutBtn.focus({ preventScroll: true });
  }

  /* ---------------------------------------------------------------------- */

  return {
    /* Input is attached once, in loop.js, and routed by game state — the
       character select uses the same plus and the same gestures. */
    handleCommit: commit,
    handleDrag: onDrag,

    open(q, done) {
      currentQ = q;
      onDone = done;
      build(q);

      const tutorialFirst = !G.tutorialSeen && G.questionIndex === 0;

      D.junction.classList.add('on');
      D.vignette.classList.add('tight');
      // hold any answer given during the bloom — but not when the tutorial is
      // about to open, or dismissing it would count as an answer
      if (!tutorialFirst) Input.preArm();
      D.hud.classList.remove('dim');

      // announce it for screen readers and for anyone with the sound off
      D.live.textContent = q.prompt + ' Five choices: ' +
        q.options.map((o) => o.dir.toLowerCase() + (q.visualOnly ? '' : ', ' + o.label)).join('; ') + '.';

      // 3. the plaque drops in
      D.prompt.textContent = q.prompt;
      D.prompt.classList.remove('in');
      void D.prompt.offsetWidth;                 // restart the animation
      D.prompt.classList.add('in');

      // 4. the cards bloom outward from centre, 70ms apart
      D.lanes.classList.remove('bloom');
      void D.lanes.offsetWidth;
      D.lanes.classList.add('bloom');

      Audio2.junction();

      const bloomTime = G.reduced ? 60 : 430;
      if (tutorialFirst) {
        setTimeout(() => showTutorial(() => { Input.preArm(); Input.arm(); }), bloomTime);
      } else {
        setTimeout(() => Input.arm(), bloomTime);
      }
    },

    /* used by the DEV hooks and verify.js */
    forceAnswer(dir) { if (currentQ) commit(dir); },
    current() { return currentQ; },
  };
})();
