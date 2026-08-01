/* ===========================================================================
   state.js — the finite state machine, the run state, and persistence
   ---------------------------------------------------------------------------
   BOOT -> TITLE -> CHARACTER_SELECT -> REALM_INTRO -> RUNNING -> JUNCTION
        -> RESOLVING -> (loop RUNNING/JUNCTION x3) -> REALM_EXIT
        -> (loop realms x5) -> CLAIMING -> RESULT -> [CODEX | REPLAY]
   =========================================================================== */

/* Turn this on to get: jump-to-question, force-a-god-result, a live score
   readout and an FPS counter. Also opens the __dev hooks verify.js drives. */
const DEV = false;

const S = {
  BOOT: 'BOOT',
  TITLE: 'TITLE',
  CHARACTER_SELECT: 'CHARACTER_SELECT',
  REALM_INTRO: 'REALM_INTRO',
  RUNNING: 'RUNNING',
  JUNCTION: 'JUNCTION',
  RESOLVING: 'RESOLVING',
  REALM_EXIT: 'REALM_EXIT',
  CLAIMING: 'CLAIMING',
  RESULT: 'RESULT',
  CODEX: 'CODEX',
};

const DIRS = ['UP', 'RIGHT', 'DOWN', 'LEFT', 'CENTRE'];

/* ---------------------------------------------------------------------------
   Everything that changes during a playthrough lives here.
   --------------------------------------------------------------------------- */
const G = {
  state: S.BOOT,
  prevState: null,

  hero: 'percy',
  realmIndex: 0,          // 0-4
  questionIndex: 0,       // 0-14, across the whole game
  answers: [],            // [{ q, opt }]
  satchel: [],            // collectible ids, in the order collected
  result: null,           // set by scoreRun at the claiming

  // run-segment motion
  scroll: 0,              // world scroll distance in px
  speed: 0,               // current px/sec
  targetSpeed: 0,
  runTime: 0,             // seconds into the current segment
  segmentLength: 5.2,     // seconds until the next junction

  // presentation
  timeScale: 1,           // dropped to ~0.35 for the junction slow-mo
  reduced: false,         // reduced motion, from OS or the HUD toggle
  muted: true,            // audio is muted by default, always
  tutorialSeen: false,
  quality: 1,             // 1 = full, 0.5 = downgraded (Tier 3 auto-downgrade)

  // worldTint (SPEC §D.4) — lerped, never hard-cut
  tint:       { warmth: 0, darkness: 0, storm: 0, growth: 0, geometry: 0 },
  tintTarget: { warmth: 0, darkness: 0, storm: 0, growth: 0, geometry: 0 },

  discovered: {},         // god keys the player has been claimed by, for the Codex
  history: [],            // past results
};

/* DOM handles, filled in by loop.js at boot */
const D = {};

/* ---------------------------------------------------------------------------
   Persistence. localStorage is wrapped so that a browser with storage
   disabled (or a file:// origin that refuses it) degrades silently rather
   than throwing on boot.
   --------------------------------------------------------------------------- */
const STORE_KEY = 'godlyParent.v1';

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    if (typeof s.muted === 'boolean') G.muted = s.muted;
    if (typeof s.reduced === 'boolean') G.reduced = s.reduced;
    if (typeof s.tutorialSeen === 'boolean') G.tutorialSeen = s.tutorialSeen;
    if (s.discovered && typeof s.discovered === 'object') G.discovered = s.discovered;
    if (Array.isArray(s.history)) G.history = s.history.slice(0, 20);
  } catch (e) { /* no storage — the game still plays, it just forgets */ }
}

function saveStore() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      muted: G.muted,
      reduced: G.reduced,
      tutorialSeen: G.tutorialSeen,
      discovered: G.discovered,
      history: G.history.slice(0, 20),
    }));
  } catch (e) { /* ignore */ }
}

/* ---------------------------------------------------------------------------
   Reduced motion. Honours the OS setting AND the in-game toggle, because
   some children need it when the OS setting is off.
   --------------------------------------------------------------------------- */
let _mq = null;
function initReducedMotion() {
  try {
    _mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (_mq.matches) G.reduced = true;
    const onChange = () => { if (_mq.matches) { G.reduced = true; applyReduced(); } };
    if (_mq.addEventListener) _mq.addEventListener('change', onChange);
    else if (_mq.addListener) _mq.addListener(onChange);
  } catch (e) { /* very old browser — leave the manual toggle */ }
  applyReduced();
}

function applyReduced() {
  document.documentElement.classList.toggle('reduced', !!G.reduced);
  if (typeof Particles !== 'undefined') Particles.setEnabled(!G.reduced);
}

/* ---------------------------------------------------------------------------
   State transitions. Every screen listens through onEnter/onExit rather than
   poking at each other, so the flow stays readable.
   --------------------------------------------------------------------------- */
const _enter = {};
const _exit = {};

function onEnter(state, fn) { (_enter[state] = _enter[state] || []).push(fn); }
function onExit(state, fn) { (_exit[state] = _exit[state] || []).push(fn); }

function setState(next, payload) {
  if (next === G.state) return;
  const prev = G.state;
  (_exit[prev] || []).forEach((fn) => fn(next));
  G.prevState = prev;
  G.state = next;
  if (DEV) console.log('[state]', prev, '->', next);
  (_enter[next] || []).forEach((fn) => fn(payload, prev));
}

/* ---------------------------------------------------------------------------
   worldTint — answers change the world. Set a target, and the loop lerps
   towards it over about two seconds. Never a hard cut.
   --------------------------------------------------------------------------- */
const TINT_FOR_GOD = {
  poseidon: { growth: .5, warmth: .1 },
  demeter:  { growth: .9 },
  dionysus: { growth: .8, warmth: .2 },
  hades:    { darkness: .9 },
  hecate:   { darkness: .75 },
  nemesis:  { darkness: .55 },
  zeus:     { storm: .9 },
  ares:     { storm: .75 },
  athena:   { geometry: .85 },
  hephaestus: { geometry: .8, warmth: .15 },
  apollo:   { warmth: .9 },
  aphrodite:{ warmth: .8 },
  iris:     { warmth: .85 },
};

function pushTintFromOption(opt) {
  // decay what is already there so the world drifts rather than accumulating
  for (const k in G.tintTarget) G.tintTarget[k] *= 0.72;
  const gods = opt.gods || {};
  let total = 0;
  for (const k in gods) total += gods[k];
  for (const godKey in gods) {
    const share = gods[godKey] / (total || 1);
    const t = TINT_FOR_GOD[godKey];
    if (!t) continue;
    for (const axis in t) {
      G.tintTarget[axis] = Math.min(1, G.tintTarget[axis] + t[axis] * share);
    }
  }
}

function lerpTint(dt) {
  const k = Math.min(1, dt / 2.0);     // ~2 seconds to arrive
  let changed = false;
  for (const axis in G.tint) {
    const d = G.tintTarget[axis] - G.tint[axis];
    if (Math.abs(d) > 0.001) { G.tint[axis] += d * k; changed = true; }
  }
  if (changed) {
    const r = document.documentElement.style;
    r.setProperty('--t-warmth', G.tint.warmth.toFixed(3));
    r.setProperty('--t-darkness', G.tint.darkness.toFixed(3));
    r.setProperty('--t-storm', G.tint.storm.toFixed(3));
    r.setProperty('--t-growth', G.tint.growth.toFixed(3));
    r.setProperty('--t-geometry', G.tint.geometry.toFixed(3));
  }
}

function resetTint() {
  for (const k in G.tint) { G.tint[k] = 0; G.tintTarget[k] = 0; }
  lerpTint(10);
}

/* ---------------------------------------------------------------------------
   Convenience accessors
   --------------------------------------------------------------------------- */
function currentRealm() { return REALMS[G.realmIndex]; }
function currentQuestion() { return QUESTIONS[G.questionIndex]; }
function currentHero() { return HEROES[G.hero]; }
function junctionInRealm() { return G.questionIndex % 3; }   // 0, 1 or 2

function resetRun() {
  G.realmIndex = 0;
  G.questionIndex = 0;
  G.answers = [];
  G.satchel = [];
  G.result = null;
  G.scroll = 0;
  G.speed = 0;
  G.runTime = 0;
  G.timeScale = 1;
  resetTint();
}
