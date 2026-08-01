/* ===========================================================================
   loop.js — boots the game and drives every frame
   ---------------------------------------------------------------------------
   One requestAnimationFrame loop with delta time. Everything that moves is
   driven from here: the parallax layers, the ground plane rushing toward the
   camera, the hero's run cycle, the collectibles, the NPCs, the worldTint
   lerp and the particle system.

   Only transform and opacity are animated.
   =========================================================================== */

/* ---- 1. the DOM, built once ------------------------------------------- */

function buildDOM() {
  const app = document.getElementById('app');
  app.innerHTML =
    '<div id="stage">' +
      '<div class="layer" id="L0"><div class="strip"></div></div>' +
      '<div class="layer" id="L1"><div class="strip"></div></div>' +
      '<div class="layer" id="L2"><div class="strip"></div></div>' +
      '<div class="layer" id="L3">' +
        '<div class="plane"></div><div id="items"></div><div id="npcs"></div>' +
      '</div>' +
      '<div id="heroShadow"></div>' +
      '<div id="hero"></div>' +
      '<div class="layer" id="L4"><div class="strip"></div></div>' +
      '<canvas id="fx"></canvas>' +
      '<div class="fxlayer" id="caustics"></div>' +
      '<div class="fxlayer" id="rays"></div>' +
      '<div class="fxlayer" id="fog"></div>' +
      '<div class="fxlayer" id="geometry"></div>' +
      '<div class="fxlayer" id="sheen"></div>' +
      '<div class="fxlayer" id="vignette"></div>' +
      '<div class="fxlayer" id="transition"></div>' +
      '<div class="fxlayer" id="flash"></div>' +

      '<div id="hud">' +
        '<div id="satchel" aria-label="Satchel"></div>' +
        '<div id="realmTag"><div class="rname"></div><div id="dots"></div></div>' +
        '<div id="toggles">' +
          '<button class="tog" id="togSound" aria-pressed="false" aria-label="Sound"></button>' +
          '<button class="tog" id="togMotion" aria-pressed="false" aria-label="Reduce motion"></button>' +
          '<button class="tog" id="btnLeave" aria-label="Leave the road"></button>' +
        '</div>' +
      '</div>' +

      '<div id="leaveAsk"><div class="ask-inner plate">' +
        '<h3 class="display">Leave the road?</h3>' +
        '<p>You will go back to the start. The choices you have made so far ' +
           'will not be kept.</p>' +
        '<div class="btn-row">' +
          '<button class="btn" id="leaveNo">Keep going</button>' +
          '<button class="btn" id="leaveYes">Leave</button>' +
        '</div>' +
      '</div></div>' +

      '<div id="junction">' +
        '<div id="prompt" class="plate"></div>' +
        '<div id="lanes"></div>' +
      '</div>' +

      '<div id="tutorial"><div class="tut-inner plate">' +
        '<div id="ghostHand"></div>' +
        '<h3 class="display">Five ways to go</h3>' +
        '<p>Swipe up, down, left or right — or tap the middle to walk straight ahead. ' +
           'Arrow keys and WASD work too. You can also just tap a card.</p>' +
        '<button class="btn" id="tutBtn">Got it</button>' +
      '</div></div>' +

      '<div id="realmIntro"><div class="ri-inner">' +
        '<div class="ri-name display"></div><div class="ri-sub"></div><div class="ri-rule"></div>' +
      '</div></div>' +

      '<div class="screen" id="titleScreen"></div>' +
      '<div class="screen" id="selectScreen"></div>' +

      '<div id="claiming">' +
        '<div id="claimStage"></div>' +
        '<div id="claimBeam"></div>' +
        '<div id="claimDrain"></div>' +
        '<div id="claimHero"></div>' +
        '<div id="claimSymbol"></div>' +
        '<div id="claimRing"></div>' +
        '<div id="claimName"></div>' +
        '<div id="claimLine"></div>' +
        '<button type="button" id="claimSkip">Skip</button>' +
      '</div>' +

      '<div class="screen" id="resultScreen">' +
        '<div id="card"></div>' +
        '<div class="btn-row" id="resultBtns" style="margin:16px auto;max-width:460px"></div>' +
        '<p id="cardNote"></p>' +
      '</div>' +

      '<div class="screen" id="codexScreen"></div>' +
      '<div class="sr" id="live" role="status" aria-live="polite"></div>' +
      '<div id="dev"></div>' +
    '</div>';

  D.stage = document.getElementById('stage');
  D.L = [0, 1, 2, 3, 4].map((i) => document.getElementById('L' + i));
  D.strips = [0, 1, 2, 4].map((i) => document.getElementById('L' + i).querySelector('.strip'));
  D.plane = document.querySelector('#L3 .plane');
  D.items = document.getElementById('items');
  D.npcs = document.getElementById('npcs');
  D.hero = document.getElementById('hero');
  D.heroShadow = document.getElementById('heroShadow');
  D.fx = document.getElementById('fx');
  D.rays = document.getElementById('rays');
  D.fog = document.getElementById('fog');
  D.caustics = document.getElementById('caustics');
  D.vignette = document.getElementById('vignette');
  D.flash = document.getElementById('flash');
  D.transition = document.getElementById('transition');
  D.hud = document.getElementById('hud');
  D.satchel = document.getElementById('satchel');
  D.realmTag = document.querySelector('#realmTag .rname');
  D.dots = document.getElementById('dots');
  D.togSound = document.getElementById('togSound');
  D.togMotion = document.getElementById('togMotion');
  D.btnLeave = document.getElementById('btnLeave');
  D.leaveAsk = document.getElementById('leaveAsk');
  D.junction = document.getElementById('junction');
  D.prompt = document.getElementById('prompt');
  D.lanes = document.getElementById('lanes');
  D.tutorial = document.getElementById('tutorial');
  D.tutBtn = document.getElementById('tutBtn');
  D.ghostHand = document.getElementById('ghostHand');
  D.realmIntro = document.getElementById('realmIntro');
  D.title = document.getElementById('titleScreen');
  D.select = document.getElementById('selectScreen');
  D.claiming = document.getElementById('claiming');
  D.claimStage = document.getElementById('claimStage');
  D.claimHero = document.getElementById('claimHero');
  D.claimSymbol = document.getElementById('claimSymbol');
  D.claimRing = document.getElementById('claimRing');
  D.claimBeam = document.getElementById('claimBeam');
  D.claimDrain = document.getElementById('claimDrain');
  D.claimName = document.getElementById('claimName');
  D.claimLine = document.getElementById('claimLine');
  D.claimSkip = document.getElementById('claimSkip');
  D.result = document.getElementById('resultScreen');
  D.card = document.getElementById('card');
  D.resultBtns = document.getElementById('resultBtns');
  D.cardNote = document.getElementById('cardNote');
  D.codex = document.getElementById('codexScreen');
  D.live = document.getElementById('live');
  D.dev = document.getElementById('dev');

  D.ghostHand.innerHTML = Glyph.hand();
  for (let i = 0; i < 15; i++) D.dots.appendChild(document.createElement('i'));
}

/* ---- 2. loading a realm ----------------------------------------------- */

let stripW = [1600, 1600, 1600, 1600];   // rendered width of one copy, per layer
const RATES = [0.02, 0.10, 0.30, 1.60];  // L0, L1, L2, L4 — L3 is the plane

function measureStrip() {
  D.strips.forEach((s, i) => {
    const first = s.querySelector('svg');
    if (!first) return;
    const r = first.getBoundingClientRect();
    if (r.width > 10) stripW[i] = r.width;
  });
}

/* One copy is as wide as the viewport is tall x 16/9, so two copies cover
   every viewport we target and a third is pure cost. Recomputed on resize. */
function copiesNeeded() {
  const copyW = (stageH || window.innerHeight) * (1600 / 900);
  return Math.max(2, Math.ceil((stageW || window.innerWidth) / copyW) + 1);
}

function fillStrips(art) {
  const layers = [art.L0(), art.L1(), art.L2(), art.L4()];
  const n = copiesNeeded();
  D.strips.forEach((s, i) => { s.innerHTML = layers[i].repeat(n); });
  D.plane.innerHTML = art.L3();
  planeRungs = Array.prototype.slice.call(D.plane.querySelectorAll('.rung'));
  measureStrip();
}

let planeRungs = [];
let horizonY = 0, groundH = 0;

/* The stage, not the window. On anything wider than a phone the game is
   letterboxed into a portrait frame, and every piece of projection maths has
   to work in the frame's coordinates or the road, the collectibles and the
   creatures all drift off to one side. */
let stageW = 0, stageH = 0;

function measureStage() {
  const r = D.stage.getBoundingClientRect();
  stageW = r.width || window.innerWidth;
  stageH = r.height || window.innerHeight;
}

function measurePlane() {
  measureStage();
  const scale = Math.max(stageW / 1600, stageH / 900);
  const offsetY = (stageH - 900 * scale) / 2;
  horizonY = offsetY + PLANE_HORIZON * scale;
  groundH = stageH - horizonY;
}

function loadRealm(index) {
  const realm = REALMS[index];
  const art = RealmArt['realm' + realm.id];
  fillStrips(art);

  // realm palette straight into CSS custom properties
  for (const k in realm.cssVars) document.documentElement.style.setProperty(k, realm.cssVars[k]);
  document.documentElement.style.setProperty('--ray-strength', realm.ambient.rays);
  document.documentElement.style.setProperty('--fog-strength', realm.ambient.fog);
  document.documentElement.style.setProperty('--caustic-strength', realm.ambient.caustics || 0);
  D.rays.style.background =
    'repeating-linear-gradient(102deg, rgba(255,255,255,0) 0px, ' +
    hexA(realm.ambient.rayColour, 0.10) + ' 18px, rgba(255,255,255,0) 62px, rgba(255,255,255,0) 120px)';
  D.fog.style.background =
    'radial-gradient(120% 60% at 50% 78%, ' + hexA(realm.ambient.fogColour, 0.75) + ' 0%, transparent 62%)';

  Particles.setRealm(realm.particles);
  D.realmTag.textContent = realm.name;
  spawnItems(realm);
  spawnNPCs(realm);
  Audio2.realmBed(realm.id);
}

function hexA(hex, a) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
}

/* ---- 3. collectibles and NPCs ----------------------------------------- */

let items = [];      // { z, lane, id, el, taken }
let npcs = [];       // { z, side, id, el }

/* How far down the road a realm actually travels, in z, across its three run
   segments. Derived rather than hard-coded, so that shortening the segments
   re-spaces the world automatically instead of quietly stranding every
   collectible beyond the end of the walk. */
function realmZBudget(realm) {
  const perSegment = 1.35;                 // the average of beginRunSegment
  return (realm.runSpeed / 900) * perSegment * 3;
}

function spawnItems(realm) {
  D.items.innerHTML = '';
  items = [];
  const pool = realm.collectibles;
  const n = 4 + Math.floor(Math.random() * 3);         // 4-6 per realm
  const budget = realmZBudget(realm);
  for (let i = 0; i < n; i++) {
    // some items sit in one lane only, so replaying to collect a different
    // set is rewarded
    const id = pool[Math.floor(Math.random() * pool.length)];
    const el = document.createElement('div');
    el.style.cssText = 'position:absolute;will-change:transform;pointer-events:none;' +
      'width:64px;height:64px;left:0;top:0';
    el.innerHTML = '<div class="a-bob" style="width:100%;height:100%">' +
      '<div class="a-spinSlow" style="width:100%;height:100%">' + collectibleArt(id) + '</div></div>';
    el.firstChild.style.filter = 'drop-shadow(0 0 10px rgba(255,220,140,.8))';
    D.items.appendChild(el);
    // spread evenly over the road that will actually be walked, with the last
    // one comfortably inside it
    const z = 0.16 + ((i + 0.5) / n) * (budget * 0.88 - 0.16);
    items.push({ z, z0: z, lane: (Math.random() * 2 - 1) * 0.8, id, el, taken: false });
  }
}

function spawnNPCs(realm) {
  D.npcs.innerHTML = '';
  npcs = [];
  const budget = realmZBudget(realm);
  realm.npcs.forEach((id, i) => {
    const el = document.createElement('div');
    el.style.cssText = 'position:absolute;will-change:transform;pointer-events:none;' +
      'width:260px;height:260px;left:0;top:0';
    el.innerHTML = beastArt(id);
    D.npcs.appendChild(el);
    npcs.push({
      z: 0.3 + ((i + 0.5) / realm.npcs.length) * budget,
      zRecycle: budget,
      side: i % 2 ? 1 : -1, id, el, reacted: false,
    });
  });
}

/* project a point on the path into screen space */
function project(z, lane) {
  const u = Math.max(0, Math.min(1, 1 - z));
  const p = Math.pow(u, 2.2);
  return {
    y: horizonY + groundH * p,
    x: stageW / 2 + lane * p * stageW * 0.42,
    s: 0.10 + p * 1.5,
  };
}

function stepItems(dt, speed) {
  const dz = (speed / 900) * dt;
  for (const it of items) {
    if (it.taken) continue;
    it.z -= dz;
    if (it.z < 0.04) {
      // collected automatically on pass-through
      it.taken = true;
      it.el.style.display = 'none';
      G.satchel.push(it.id);
      addSatchelIcon(it.id);
      const p = project(0.06, it.lane);
      Particles.burst(p.x, p.y, '#FFE9AE', 22, 1.2);
      Audio2.collect();
      continue;
    }
    // fade in relative to where this one started, not a fixed distance, so
    // items stay visible whatever the realm's travel budget works out to
    const fade = Math.min(1, Math.max(0, (it.z0 - it.z) / (it.z0 * 0.22 + 0.08)));
    if (fade <= 0) { it.el.style.opacity = 0; continue; }
    const p = project(it.z, it.lane);
    it.el.style.opacity = fade;
    it.el.style.transform = 'translate3d(' + (p.x - 32) + 'px,' + (p.y - 60 * p.s) + 'px,0) scale(' +
      p.s.toFixed(3) + ')';
  }
}

function stepNPCs(dt, speed) {
  const dz = (speed / 1150) * dt;                 // NPCs drift by a little more slowly
  for (const n of npcs) {
    n.z -= dz;
    if (n.z < -0.25) {
      n.z = n.zRecycle * (0.75 + Math.random() * 0.35);
      n.side = Math.random() < 0.5 ? -1 : 1;
      n.reacted = false;
    }
    const p = project(Math.max(0, n.z), n.side * (1.55 + n.z * 0.45));
    n.el.style.opacity = Math.min(0.95, Math.max(0, (1.15 - n.z) * 2.2));
    // cap the scale: unclamped, a creature that walks right past the camera
    // fills half the screen and reads as an unidentifiable shape
    const ns = Math.min(p.s * 0.95, 0.72);
    n.el.style.transform = 'translate3d(' + (p.x - 130) + 'px,' + (p.y - 232 * ns) + 'px,0) scale(' +
      ns.toFixed(3) + ')';
    // they react as you draw level with them
    if (!n.reacted && n.z < 0.35) {
      n.reacted = true;
      n.el.firstChild.style.transition = 'transform .5s ease-out';
      n.el.firstChild.style.transform = 'scale(1.09) rotate(' + (-n.side * 5) + 'deg)';
    }
  }
}

function addSatchelIcon(id) {
  const el = document.createElement('div');
  el.className = 'satchel-item';
  el.innerHTML = collectibleArt(id);
  el.title = id;
  D.satchel.appendChild(el);
}

/* ---- 4. the ground plane rushing toward the camera --------------------- */

let planeT = 0;
function stepPlane(dt, speed) {
  planeT = (planeT + (speed / 900) * dt * 0.55) % 1;
  const n = planeRungs.length;
  for (let i = 0; i < n; i++) {
    const u = ((i / n) + planeT) % 1;
    const p = Math.pow(u, 2.2);
    const y = PLANE_HORIZON + (900 - PLANE_HORIZON) * p;
    const halfW = 34 + p * 490;
    const h = 3 + p * 16;
    planeRungs[i].setAttribute('d',
      'M' + (800 - halfW) + ' ' + y + ' H' + (800 + halfW) + ' v' + h + ' H' + (800 - halfW) + 'Z');
    planeRungs[i].setAttribute('opacity', (0.05 + p * 0.22).toFixed(3));
  }
}

/* ---- 5. realm intro, exit transitions ---------------------------------- */

/* Every wait in this game can be cut short by the player. Nothing holds the
   screen for longer than they want it to. */
let skipIntro = null;

function showRealmIntro(then) {
  const realm = currentRealm();
  D.realmIntro.querySelector('.ri-name').textContent = realm.name;
  D.realmIntro.querySelector('.ri-sub').textContent = realm.subtitle;
  D.realmIntro.classList.add('on');
  D.live.textContent = realm.name + '. ' + realm.subtitle;

  let fired = false;
  const finish = () => {
    if (fired) return;
    fired = true;
    skipIntro = null;
    clearTimeout(timer);
    D.realmIntro.classList.remove('on');
    then();
  };
  const timer = setTimeout(finish, G.reduced ? 700 : 1300);
  skipIntro = finish;
}

/* Cut the current run segment short — the player has seen enough and wants
   the next choice now. It does not snap: a beat is left on the clock so the
   slow-down into the junction still plays rather than the world stopping
   dead. */
function hurryToJunction() {
  if (G.state !== S.RUNNING) return;
  const leave = 0.3;
  if (G.segmentLength - G.runTime <= leave) return;
  G.runTime = G.segmentLength - leave;
}

/* Each exit is a distinct full-screen flourish, never a fade. */
const Transitions = {
  trunkDive(done) {
    D.transition.innerHTML =
      '<div class="tr-trunk tr-left"></div><div class="tr-trunk tr-right"></div>';
    D.transition.className = 'fxlayer tr-on';
    Audio2.whoosh();
    setTimeout(done, 520);
  },
  waveCrash(done) {
    D.transition.innerHTML = '<div class="tr-wave"></div><div class="tr-foam"></div>';
    D.transition.className = 'fxlayer tr-on';
    Audio2.whoosh();
    setTimeout(done, 600);
  },
  whirlpool(done) {
    D.transition.innerHTML = '<div class="tr-spiral"></div><div class="tr-lantern"></div>';
    D.transition.className = 'fxlayer tr-on';
    Audio2.whoosh();
    setTimeout(done, 700);
  },
  lightningWhite(done) {
    // suppressed entirely under reduced motion — this is the flash rule
    if (G.reduced) { setTimeout(done, 200); return; }
    Audio2.thunder();
    D.flash.classList.add('on');
    setTimeout(() => D.flash.classList.remove('on'), 200);
    setTimeout(done, 460);
  },
  skyDescent(done) {
    D.transition.innerHTML = '<div class="tr-cloud"></div>';
    D.transition.className = 'fxlayer tr-on';
    D.stage.classList.add('tr-spin');
    Audio2.whoosh();
    setTimeout(() => D.stage.classList.remove('tr-spin'), 800);
    setTimeout(done, 820);
  },
};

function runTransition(name, done) {
  const fn = Transitions[name] || Transitions.trunkDive;
  if (G.reduced && name !== 'lightningWhite') {
    D.transition.className = 'fxlayer';
    setTimeout(done, 180);
    return;
  }
  fn(() => { D.transition.className = 'fxlayer'; D.transition.innerHTML = ''; done(); });
}

/* ---- 6. the flow ------------------------------------------------------- */

function updateDots() {
  const dots = D.dots.children;
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = i < G.questionIndex ? 'done' : (i === G.questionIndex ? 'now' : '');
  }
}

function beginRunSegment() {
  G.runTime = 0;
  /* Short on purpose. This used to be 4-7 seconds and it was far too long:
     the game is the choosing, not the walking. What is left is just enough
     travel to carry you out of the last junction, show the realm moving and
     sweep in the next one — and it can still be cut short with a tap. */
  G.segmentLength = 1.1 + Math.random() * 0.5;
  G.targetSpeed = currentRealm().runSpeed;
  G.timeScale = 1;
  Rig.setState('run');
  D.hud.classList.add('dim');
  setState(S.RUNNING);
}

function openJunction() {
  if (G.questionIndex >= QUESTIONS.length) {
    G.result = scoreRun(G.answers, QUESTIONS);
    setState(S.CLAIMING);
    return;
  }
  setState(S.JUNCTION);
  updateDots();
  Junction.open(currentQuestion(), () => {
    setState(S.RESOLVING);
    G.questionIndex++;
    updateDots();
    // three junctions per realm
    if (G.questionIndex % 3 !== 0) {
      beginRunSegment();
      return;
    }
    setState(S.REALM_EXIT);
    const exit = currentRealm().transitionOut;
    runTransition(exit, () => {
      if (G.questionIndex >= QUESTIONS.length) {
        G.result = scoreRun(G.answers, QUESTIONS);
        setState(S.CLAIMING);
        return;
      }
      G.realmIndex++;
      loadRealm(G.realmIndex);
      setState(S.REALM_INTRO);
    });
  });
}

/* ---- 7. HUD ------------------------------------------------------------ */

function paintToggles() {
  D.togSound.innerHTML = G.muted ? Glyph.soundOff() : Glyph.soundOn();
  D.togSound.setAttribute('aria-pressed', String(!G.muted));
  D.togSound.setAttribute('aria-label', G.muted ? 'Sound off. Turn sound on' : 'Sound on. Turn sound off');
  D.togMotion.innerHTML = G.reduced ? Glyph.motionOff() : Glyph.motion();
  D.togMotion.setAttribute('aria-pressed', String(G.reduced));
  D.togMotion.setAttribute('aria-label', G.reduced ? 'Reduced motion on' : 'Reduced motion off');
}

/* ---- leaving a run ------------------------------------------------------
   A child ten questions deep who wants to start over should not have to
   reload the page. This does not undo an answer and never goes back one
   question — a choice is still instant and final, which is the point of the
   game. It abandons the whole run and returns to the title.

   It asks first, because losing ten answers to a mis-tap would be miserable,
   and it takes the modal lock so the confirm cannot answer a junction. */
function askToLeave() {
  if (D.leaveAsk.classList.contains('on')) return;
  Input.setModal(true);
  D.leaveAsk.classList.add('on');
  D.live.textContent = 'Leave the road? Your choices so far will not be kept.';

  const close = (leaving) => {
    D.leaveAsk.classList.remove('on');
    window.removeEventListener('keydown', onKey, true);
    D.leaveAsk.removeEventListener('click', onBackdrop);
    Input.setModal(false);
    if (leaving) {
      resetRun();
      G.realmIndex = 0;
      loadRealm(0);
      updateDots();
      setState(S.TITLE);
    } else if (G.state === S.JUNCTION) {
      Input.preArm();
      Input.arm();                    // hand the junction straight back
    }
  };
  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(false); }
  };
  const onBackdrop = (e) => { if (e.target === D.leaveAsk) close(false); };

  D.leaveAsk.querySelector('#leaveNo').onclick = () => close(false);
  D.leaveAsk.querySelector('#leaveYes').onclick = () => close(true);
  D.leaveAsk.addEventListener('click', onBackdrop);
  window.addEventListener('keydown', onKey, true);
  D.leaveAsk.querySelector('#leaveNo').focus({ preventScroll: true });
}

function initHUD() {
  paintToggles();
  D.btnLeave.innerHTML = Glyph.leave();
  D.btnLeave.addEventListener('click', askToLeave);
  D.togSound.addEventListener('click', () => {
    G.muted = !G.muted;
    Audio2.unlock();
    Audio2.setMuted(G.muted);
    if (!G.muted) Audio2.realmBed(currentRealm().id);
    paintToggles();
    saveStore();
  });
  D.togMotion.addEventListener('click', () => {
    G.reduced = !G.reduced;
    applyReduced();
    paintToggles();
    saveStore();
  });
}

/* ---- 8. the frame ------------------------------------------------------ */

let last = 0, frameCount = 0, slowFrames = 0;
let fpsAcc = 0, fpsN = 0, fps = 60;
const frameTimes = [];

function frame(now) {
  requestAnimationFrame(frame);
  if (!last) { last = now; return; }
  let dtReal = (now - last) / 1000;
  last = now;
  if (dtReal > 0.1) dtReal = 0.1;                 // a tab that was backgrounded
  const t = now / 1000;

  // frame timing, for the p95 report and the auto-downgrade
  frameTimes.push(dtReal * 1000);
  if (frameTimes.length > 600) frameTimes.shift();
  fpsAcc += dtReal; fpsN++;
  if (fpsAcc > 0.5) { fps = fpsN / fpsAcc; fpsAcc = 0; fpsN = 0; }
  if (dtReal * 1000 > 22) slowFrames++; else slowFrames = 0;
  if (slowFrames > 30 && G.quality === 1) {
    G.quality = 0.5;
    Particles.setQuality(0.5);
    document.documentElement.style.setProperty('--dof', '0');
    if (DEV) console.warn('quality auto-downgraded');
  }

  const dt = dtReal * G.timeScale;
  lerpTint(dtReal);

  if (G.state === S.RUNNING) {
    G.runTime += dt;
    // slow to about 35% as the junction comes up — this moment is the feel
    const left = G.segmentLength - G.runTime;
    if (left < 0.4) G.timeScale = Math.max(0.35, 0.35 + (left / 0.4) * 0.65);
    if (G.runTime >= G.segmentLength) { G.timeScale = 1; openJunction(); }
  }

  // speed eases toward its target rather than snapping
  const wantSpeed = (G.state === S.RUNNING) ? G.targetSpeed : 0;
  G.speed += (wantSpeed - G.speed) * Math.min(1, dtReal * 2.2);

  if (G.speed > 1) {
    G.scroll += G.speed * dt;
    if (!G.reduced) {
      for (let i = 0; i < D.strips.length; i++) {
        const off = -((G.scroll * RATES[i]) % stripW[i]);
        D.strips[i].style.transform = 'translate3d(' + off.toFixed(1) + 'px,0,0)';
      }
    }
    stepPlane(dt, G.speed);
    stepItems(dt, G.speed);
    stepNPCs(dt, G.speed);
  }

  Rig.update(dt, t, G.speed);
  Particles.frame(dtReal, t);

  if (DEV && (frameCount++ % 10 === 0)) paintDev();
}

function paintDev() {
  const r = G.answers.length ? scoreRun(G.answers, QUESTIONS) : null;
  D.dev.textContent =
    'state ' + G.state + '   q' + (G.questionIndex + 1) + '/15   fps ' + fps.toFixed(0) +
    '   parts ' + Particles.count() +
    '\nspeed ' + G.speed.toFixed(0) + '  ts ' + G.timeScale.toFixed(2) +
    '  quality ' + G.quality +
    (r ? '\nleading: ' + r.ranking.slice(0, 4).map((k) => GODS[k].name + ' ' +
      (r.scores[k] * 100).toFixed(0)).join('  ') : '');
}

function p95() {
  if (!frameTimes.length) return 0;
  const s = frameTimes.slice().sort((a, b) => a - b);
  return s[Math.floor(s.length * 0.95)];
}

/* ---- 9. boot ----------------------------------------------------------- */

function boot() {
  buildDOM();
  loadStore();
  initReducedMotion();
  Particles.init(D.fx);
  measurePlane();
  window.addEventListener('resize', () => { measurePlane(); measureStrip(); });
  window.addEventListener('orientationchange', () => setTimeout(() => {
    measurePlane(); measureStrip();
  }, 200));

  // input is attached once and routed by state, so the character select
  // teaches exactly the gestures the junctions will ask for
  Input.attach(D.stage, {
    onCommit(dir) {
      if (G.state === S.CHARACTER_SELECT) Select.handleCommit(dir);
      else if (G.state === S.JUNCTION) Junction.handleCommit(dir);
    },
    onDrag(dir, strength, dx, dy) {
      if (G.state === S.CHARACTER_SELECT) Select.handleDrag(dir, strength, dx, dy);
      else if (G.state === S.JUNCTION) Junction.handleDrag(dir, strength, dx, dy);
    },
    /* A press when there is nothing to answer means "get on with it". No
       moment in this game holds the screen against the player's wishes. */
    onIdlePress() {
      if (G.state === S.RUNNING) hurryToJunction();
      else if (G.state === S.REALM_INTRO && skipIntro) skipIntro();
      // the claiming is deliberately NOT here: it is the payoff, and a stray
      // thumb must not be able to throw it away. It gets its own skip button.
    },
  });

  TitleScreen.init();
  Select.init();
  Claiming.init();
  Result.init();
  Codex.init();
  initHUD();

  onEnter(S.REALM_INTRO, () => {
    D.hud.classList.remove('hidden');
    Rig.mount(D.hero, G.hero);
    showRealmIntro(beginRunSegment);
  });
  [S.TITLE, S.CHARACTER_SELECT, S.RESULT, S.CODEX, S.CLAIMING].forEach((st) => {
    onEnter(st, () => {
      D.hud.classList.add('hidden');
      document.documentElement.classList.add('overlay-open');
    });
    onExit(st, () => document.documentElement.classList.remove('overlay-open'));
  });
  onEnter(S.CLAIMING, () => { G.speed = 0; G.timeScale = 1; });

  // realm 1 is loaded up front so the title screen has a living world behind it
  loadRealm(0);
  Rig.mount(D.hero, G.hero);
  updateDots();

  if (DEV) D.dev.classList.add('on');
  requestAnimationFrame(frame);
  setState(S.TITLE);
}

/* -------------------------------------------------------------------------
   Hooks for verify.js. These are read-only levers into the flow; they carry
   no UI of their own, so they are safe to leave in the shipped file.
   ------------------------------------------------------------------------- */
window.__game = {
  get state() { return G.state; },
  get p95() { return p95(); },
  get fps() { return fps; },
  /* so a harness can measure one named state cleanly rather than whatever
     happened to be in the rolling window */
  resetFrameTimes() { frameTimes.length = 0; },
  G, D, S,
  setState,
  loadRealm,
  answer(dir) { if (G.state === S.JUNCTION) Junction.handleCommit(dir); },
  /* jump straight to a question, filling in random answers on the way */
  jumpTo(qIndex) {
    if (qIndex < G.questionIndex) { G.answers = []; G.questionIndex = 0; G.result = null; }
    while (G.questionIndex < qIndex) {
      const q = QUESTIONS[G.questionIndex];
      const opt = q.options[G.questionIndex % 5];
      G.answers.push({ q, opt });
      G.questionIndex++;
    }
    G.realmIndex = Math.min(4, Math.floor(G.questionIndex / 3));
    loadRealm(G.realmIndex);
    updateDots();
  },
  forceGod(key) {
    // build an answer set that actually maximises this god, so the claiming
    // and the card render exactly as a real playthrough would
    G.answers = QUESTIONS.map((q) => {
      let best = q.options[0], bestN = -1;
      q.options.forEach((o) => { const n = (o.gods || {})[key] || 0; if (n > bestN) { bestN = n; best = o; } });
      return { q, opt: best };
    });
    G.questionIndex = 15;
    G.result = scoreRun(G.answers, QUESTIONS);
    return G.result.winner;
  },
  openJunctionNow() { if (G.state === S.RUNNING) { G.runTime = G.segmentLength; } },
  skipTutorial() { G.tutorialSeen = true; saveStore(); },
  result() { return G.result; },
  validate() { return validateAnswerKey(QUESTIONS); },
  drawCard() { return Result.drawCard(); },
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
