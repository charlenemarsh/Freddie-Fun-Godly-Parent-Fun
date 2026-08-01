#!/usr/bin/env node
/* ===========================================================================
   simulate.js — Monte Carlo validator for the answer key
   ---------------------------------------------------------------------------
   Runs 10,000 random playthroughs and prints how often each god comes out.
   Every god must land between 3% and 14%. If one drifts out of the band,
   adjust rarityMultiplier in src/data/gods.js — never distort the questions.

     node simulate.js            10,000 runs, distribution table
     node simulate.js 50000      more runs, tighter numbers
     node simulate.js --tune     suggests new rarityMultiplier values
     node simulate.js --hunter   calibrates the Hunter's Invitation thresholds
     node simulate.js --skew     per-god direction bias (is UP always Zeus?)

   It loads the real game source through Node's vm module, so it is testing
   exactly the code the browser runs — no duplicated copy of the rules.
   =========================================================================== */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = [
  'src/data/gods.js',
  'src/data/questions.js',
  'src/engine/scoring.js',
];

function loadGame() {
  const ctx = vm.createContext({ console, Math, Object, Array, Set, Number, JSON });
  for (const rel of SRC) {
    const file = path.join(__dirname, rel);
    vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: rel });
  }
  // top-level const/let live in the context's lexical scope, not on the sandbox
  // object, so ask for them back as an expression
  return vm.runInContext(
    '({ GODS, GOD_KEYS, AXES, QUESTIONS, scoreRun, validateAnswerKey, HUNTER, isWildernessOption })',
    ctx
  );
}

const G = loadGame();
const args = process.argv.slice(2);
const RUNS = Number(args.find((a) => /^\d+$/.test(a))) || 10000;
const BAND = { lo: 3, hi: 14 };

/* --- deterministic RNG so runs are reproducible ------------------------- */
let seed = 0x2f6e2b1;
function rnd() {
  seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
  return ((seed >>> 0) % 100000) / 100000;
}

function randomPlaythrough() {
  const answers = [];
  for (const q of G.QUESTIONS) {
    answers.push({ q, opt: q.options[Math.floor(rnd() * q.options.length)] });
  }
  return answers;
}

/* --- invariants first --------------------------------------------------- */
const problems = G.validateAnswerKey(G.QUESTIONS);
if (problems.length) {
  console.log('\n  ANSWER KEY PROBLEMS\n');
  problems.forEach((p) => console.log('    x ' + p));
  console.log('');
  process.exitCode = 1;
} else {
  console.log('\n  Answer key invariants: OK  (15 questions, 75 options, all feed a god)');
}

/* --- run ---------------------------------------------------------------- */
const counts = {};
const hunterHits = [];
const wildVals = [];
const shadowVals = [];
const dirCounts = {};   // god -> direction -> times that god won after picking dir
for (const k of G.GOD_KEYS) { counts[k] = 0; dirCounts[k] = { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0, CENTRE: 0 }; }

for (let i = 0; i < RUNS; i++) {
  const answers = randomPlaythrough();
  const r = G.scoreRun(answers, G.QUESTIONS);
  counts[r.winner]++;
  wildVals.push(r.traits.WILD);
  shadowVals.push(r.traits.SHADOW);
  if (r.hunter) hunterHits.push(1);
  for (const { opt } of answers) dirCounts[r.winner][opt.dir]++;
}

/* --- table -------------------------------------------------------------- */
function bar(pct) {
  const n = Math.round(pct * 3);
  return '#'.repeat(n) + '.'.repeat(Math.max(0, 45 - n));
}

console.log(`\n  ${RUNS.toLocaleString()} random playthroughs\n`);
console.log('  god           runs     pct   target 3% - 14%');
console.log('  ' + '-'.repeat(72));

let fails = 0;
const rows = G.GOD_KEYS.map((k) => ({ k, n: counts[k], pct: (counts[k] / RUNS) * 100 }))
  .sort((a, b) => b.pct - a.pct);

for (const row of rows) {
  const inBand = row.pct >= BAND.lo && row.pct <= BAND.hi;
  if (!inBand) fails++;
  console.log(
    '  ' + G.GODS[row.k].name.padEnd(12) +
    String(row.n).padStart(6) +
    (row.pct.toFixed(2) + '%').padStart(8) + '   ' +
    bar(row.pct) + (inBand ? '' : '  <-- OUT OF BAND')
  );
}
console.log('  ' + '-'.repeat(72));

const lo = Math.min(...rows.map((r) => r.pct));
const hi = Math.max(...rows.map((r) => r.pct));
console.log(`  spread ${lo.toFixed(2)}% - ${hi.toFixed(2)}%   ratio ${(hi / lo).toFixed(2)}x`);
console.log(fails === 0
  ? '  PASS - every god is inside the 3% to 14% band.\n'
  : `  FAIL - ${fails} god(s) outside the band. Adjust rarityMultiplier in src/data/gods.js.\n`);
if (fails) process.exitCode = 1;

/* --- --tune: suggest multipliers that flatten the distribution ---------- */
if (args.includes('--tune')) {
  const TARGET = 100 / G.GOD_KEYS.length;
  console.log('  suggested rarityMultiplier values (paste into src/data/gods.js):\n');
  for (const k of G.GOD_KEYS) {
    const pct = (counts[k] / RUNS) * 100 || 0.5;
    const cur = G.GODS[k].rarityMultiplier || 1;
    // gentle correction: full proportional correction overshoots badly because
    // the winner is a max() over gods, not an independent draw
    const next = cur * Math.pow(TARGET / pct, 0.28);
    console.log(`    ${(G.GODS[k].name + ':').padEnd(13)} ${cur.toFixed(3)}  ->  ${next.toFixed(3)}`);
  }
  console.log('');
}

/* --- --hunter: calibrate the easter-egg thresholds ---------------------- */
if (args.includes('--hunter')) {
  const pctile = (arr, p) => {
    const s = arr.slice().sort((a, b) => a - b);
    return s[Math.floor(s.length * p)];
  };
  console.log(`  Hunter's Invitation fired on ${hunterHits.length} of ${RUNS} runs ` +
              `(${((hunterHits.length / RUNS) * 100).toFixed(2)}%, target ~4%)`);
  console.log(`  WILD   p90 = ${pctile(wildVals, 0.90)}   (current threshold ${G.HUNTER.wildMin})`);
  console.log(`  SHADOW p90 = ${pctile(shadowVals, 0.90)}   (current threshold ${G.HUNTER.shadowMin})\n`);
}

/* --- --skew: are the questions secretly a direction quiz? --------------- */
if (args.includes('--skew')) {
  console.log('  direction bias per god (how often winners picked each lane)\n');
  console.log('  god            UP  RIGHT   DOWN   LEFT CENTRE   worst');
  for (const k of G.GOD_KEYS) {
    const d = dirCounts[k];
    const tot = Object.values(d).reduce((a, b) => a + b, 0) || 1;
    const pcts = ['UP', 'RIGHT', 'DOWN', 'LEFT', 'CENTRE'].map((x) => (d[x] / tot) * 100);
    const worst = Math.max(...pcts);
    console.log('  ' + G.GODS[k].name.padEnd(12) +
      pcts.map((p) => (p.toFixed(0) + '%').padStart(6)).join(' ') +
      '  ' + (worst > 32 ? `${worst.toFixed(0)}% <- lane-biased` : 'ok'));
  }
  console.log('\n  (20% each would be perfectly lane-neutral; over ~32% means that god\n' +
              '   is mostly reachable by spamming one direction.)\n');
}
