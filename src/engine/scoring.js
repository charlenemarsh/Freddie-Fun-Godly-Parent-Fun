/* ===========================================================================
   scoring.js — how the game decides who your godly parent is
   ---------------------------------------------------------------------------
   This is engine code. You do not need to edit it to change questions.

   THE MOST IMPORTANT RULE IN THE CODEBASE is normalisation (step 2 below).
   Without it, whichever god happens to appear on the most options always
   wins, and the result stops feeling true.

   The four invariants, all enforced here:
     1. Normalise per god — divide each god's raw score by the maximum it
        could possibly have earned across the whole quiz.
     2. Question 15 is double-weighted.
     3. Every option feeds at least one god (asserted by validateAnswerKey).
     4. Tiebreak order: realm cluster -> dominant trait axis -> rarer god.
   =========================================================================== */

/* Thresholds for the Hunter's Invitation easter egg (Tier 3).
   Derived from simulate.js so it lands near 4% of playthroughs.
   Re-derive with:  node simulate.js --hunter                                */
const HUNTER = { wildMin: 9, shadowMin: 10, wildernessMin: 3 };

/* An option counts as a "wilderness path" if it leans hard into WILD. */
function isWildernessOption(opt) {
  return (opt.traits && opt.traits.WILD >= 2) === true;
}

function questionWeight(q) {
  return q.doubleWeight ? 2 : 1;
}

/* -------------------------------------------------------------------------
   The maximum each god could possibly score, given this answer key.
   Computed once and cached — it depends only on questions.js, not on play.
   ------------------------------------------------------------------------- */
let _maxCache = null;
function maxPossiblePerGod(questions) {
  if (_maxCache) return _maxCache;
  const max = {};
  for (const key of GOD_KEYS) max[key] = 0;
  for (const q of questions) {
    const w = questionWeight(q);
    for (const key of GOD_KEYS) {
      let best = 0;
      for (const opt of q.options) {
        const p = (opt.gods && opt.gods[key]) || 0;
        if (p > best) best = p;
      }
      max[key] += best * w;
    }
  }
  _maxCache = max;
  return max;
}

/* -------------------------------------------------------------------------
   scoreRun(answers, questions)
     answers   array of option objects actually chosen, in question order,
               each paired with its question: [{ q, opt }, ...]
   Returns everything the claiming and result screens need.
   ------------------------------------------------------------------------- */
function scoreRun(answers, questions) {
  const qs = questions || QUESTIONS;
  const max = maxPossiblePerGod(qs);

  /* --- 1. raw god points, question 15 counted twice ------------------- */
  const raw = {};
  for (const key of GOD_KEYS) raw[key] = 0;

  const traits = { VALOR: 0, WISDOM: 0, WILD: 0, CRAFT: 0, HEART: 0, SHADOW: 0 };
  const realmCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let wildernessPicks = 0;

  for (const { q, opt } of answers) {
    const w = questionWeight(q);
    if (opt.gods) {
      for (const key in opt.gods) raw[key] += opt.gods[key] * w;
    }
    if (opt.traits) {
      for (const axis in opt.traits) traits[axis] += opt.traits[axis] * w;
    }
    realmCounts[q.realmId] = (realmCounts[q.realmId] || 0) + 1;
    if (isWildernessOption(opt)) wildernessPicks++;
  }

  /* --- 2. NORMALISE. The rule everything else depends on. ------------- */
  const normalised = {};
  for (const key of GOD_KEYS) {
    const ceiling = max[key];
    normalised[key] = ceiling > 0 ? raw[key] / ceiling : 0;
  }

  /* --- 3. rarity nudge, so the rare gods stay genuinely reachable ----- */
  const finalScores = {};
  for (const key of GOD_KEYS) {
    finalScores[key] = normalised[key] * (GODS[key].rarityMultiplier || 1);
  }

  /* --- 4. rank, with the specified tiebreak ---------------------------- */
  let dominantRealm = 1, best = -1;
  for (const rid in realmCounts) {
    if (realmCounts[rid] > best) { best = realmCounts[rid]; dominantRealm = Number(rid); }
  }
  const axesRanked = AXES.slice().sort((a, b) => traits[b] - traits[a]);
  const dominantAxis = axesRanked[0];

  /* Which gods does the dominant trait axis feed? Used only for tiebreaks. */
  const AXIS_GODS = {
    VALOR:  ['ares', 'zeus', 'nemesis'],
    WISDOM: ['athena', 'hecate', 'hermes'],
    WILD:   ['demeter', 'dionysus', 'poseidon'],
    CRAFT:  ['hephaestus', 'athena', 'apollo'],
    HEART:  ['aphrodite', 'apollo', 'iris'],
    SHADOW: ['hades', 'hecate', 'nemesis'],
  };

  const ranking = GOD_KEYS.slice().sort((a, b) => {
    const d = finalScores[b] - finalScores[a];
    if (Math.abs(d) > 1e-9) return d > 0 ? 1 : -1;
    // tiebreak 1: the realm you answered most in
    const ra = GOD_REALM_CLUSTER[a] === dominantRealm ? 1 : 0;
    const rb = GOD_REALM_CLUSTER[b] === dominantRealm ? 1 : 0;
    if (ra !== rb) return rb - ra;
    // tiebreak 2: your dominant trait axis
    const fa = AXIS_GODS[dominantAxis].indexOf(a) >= 0 ? 1 : 0;
    const fb = AXIS_GODS[dominantAxis].indexOf(b) >= 0 ? 1 : 0;
    if (fa !== fb) return fb - fa;
    // tiebreak 3: the rarer god wins
    return (GODS[b].rarityMultiplier || 1) - (GODS[a].rarityMultiplier || 1);
  });

  /* --- 5. top three resonances, as percentages that sum to 100 -------- */
  const top3 = ranking.slice(0, 3);
  const sum3 = top3.reduce((t, k) => t + finalScores[k], 0) || 1;
  const resonance = top3.map((k) => ({
    god: k,
    pct: Math.round((finalScores[k] / sum3) * 100),
  }));
  // rounding can leave 99 or 101; push the remainder onto the winner
  const drift = 100 - resonance.reduce((t, r) => t + r.pct, 0);
  if (resonance.length) resonance[0].pct += drift;

  /* --- 6. the Hunter's Invitation (Tier 3 easter egg) ----------------- */
  const hunter = traits.WILD >= HUNTER.wildMin &&
                 traits.SHADOW >= HUNTER.shadowMin &&
                 wildernessPicks >= HUNTER.wildernessMin;

  return {
    winner: ranking[0],
    ranking,
    scores: finalScores,
    raw,
    traits,
    axesRanked,
    dominantAxis,
    dominantRealm,
    resonance,
    wildernessPicks,
    hunter,
  };
}

/* -------------------------------------------------------------------------
   Result-card text, generated from the trait axes.
   Three gifts and one signature move, chosen by your strongest axes so two
   children of the same god still get different cards.
   ------------------------------------------------------------------------- */
function buildResultText(result, rngPick) {
  const god = GODS[result.winner];
  const pick = rngPick || ((arr, seed) => arr[seed % arr.length]);

  const gifts = [];
  const seen = new Set();
  for (const axis of result.axesRanked) {
    const pool = god.gifts[axis];
    if (!pool || !pool.length) continue;
    for (const g of pool) {
      if (!seen.has(g)) { gifts.push(g); seen.add(g); break; }
    }
    if (gifts.length === 3) break;
  }
  // top axis has the deepest pool, so backfill from it if we came up short
  while (gifts.length < 3) {
    const pool = god.gifts[result.axesRanked[0]] || god.gifts.HEART || [];
    const next = pool.find((g) => !seen.has(g));
    if (!next) break;
    gifts.push(next); seen.add(next);
  }

  const moves = god.signatureMoves[result.dominantAxis] || god.signatureMoves.HEART;
  const move = pick(moves, result.traits[result.dominantAxis] || 0);
  const epithet = pick(god.epithets, result.traits.VALOR + result.traits.SHADOW);

  return { god, gifts, move, epithet };
}

/* Pick the collected item that best suits the winning god.
   Falls back to the god's own first choice if the satchel is empty. */
function sacredItemFor(godKey, satchel) {
  const prefs = GODS[godKey].sacredItems || [];
  for (const p of prefs) if (satchel && satchel.indexOf(p) >= 0) return p;
  return prefs[0] || 'drachma';
}

/* -------------------------------------------------------------------------
   validateAnswerKey — invariant 3, run by simulate.js and by DEV mode.
   ------------------------------------------------------------------------- */
function validateAnswerKey(questions) {
  const problems = [];
  const qs = questions || QUESTIONS;
  if (qs.length !== 15) problems.push(`expected 15 questions, found ${qs.length}`);
  const dirs = ['UP', 'RIGHT', 'DOWN', 'LEFT', 'CENTRE'];
  qs.forEach((q, i) => {
    if (q.options.length !== 5) problems.push(`Q${q.id}: ${q.options.length} options, need 5`);
    const seen = new Set();
    q.options.forEach((o) => {
      seen.add(o.dir);
      const total = Object.values(o.gods || {}).reduce((a, b) => a + b, 0);
      if (total <= 0) problems.push(`Q${q.id} ${o.dir}: awards no god points`);
      for (const k in (o.gods || {})) {
        if (!GODS[k]) problems.push(`Q${q.id} ${o.dir}: unknown god "${k}"`);
      }
      for (const a in (o.traits || {})) {
        if (AXES.indexOf(a) < 0) problems.push(`Q${q.id} ${o.dir}: unknown axis "${a}"`);
      }
      if (!q.visualOnly && !o.label) problems.push(`Q${q.id} ${o.dir}: missing label`);
      if (q.visualOnly && o.label) problems.push(`Q${q.id} ${o.dir}: visual-only question must have no label`);
    });
    dirs.forEach((d) => { if (!seen.has(d)) problems.push(`Q${q.id}: missing direction ${d}`); });
    const words = q.prompt.trim().split(/\s+/).length;
    if (words > 22) problems.push(`Q${q.id}: prompt is ${words} words, limit is 22`);
  });
  const visual = qs.filter((q) => q.visualOnly).map((q) => q.id).join(',');
  if (visual !== '1,5,8,13') problems.push(`visual-only questions are ${visual}, expected 1,5,8,13`);
  const dbl = qs.filter((q) => q.doubleWeight).map((q) => q.id).join(',');
  if (dbl !== '15') problems.push(`double-weighted questions are "${dbl}", expected "15"`);
  const unreachable = GOD_KEYS.filter((k) => maxPossiblePerGod(qs)[k] === 0);
  if (unreachable.length) problems.push(`gods that can never score: ${unreachable.join(', ')}`);
  return problems;
}
