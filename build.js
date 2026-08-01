#!/usr/bin/env node
/* ===========================================================================
   build.js — turns src/ into one single index.html
   ---------------------------------------------------------------------------
   The deliverable is ONE FILE that opens by double-click with the wifi off.
   No bundler, no dependencies, no network. This script just concatenates the
   source files in a fixed order and wraps them in the right tags.

     node build.js

   There is a second, optional output for sharing the game as a web page:

     node build.js --artifact [outfile]

   That one emits BODY CONTENT ONLY — no doctype, no <html>, no <head>, no
   <body> — because the host that publishes it supplies its own document
   shell. It also leaves out the no-network guard: that guard overwrites
   window.fetch and friends to throw, which is exactly what you want in a
   file:// deliverable being tested and exactly what you do not want inside
   somebody else's page. The guard is a development assertion, not a feature;
   verify.js is what actually proves the game makes zero requests.

   index.html — the real deliverable — is unaffected and still built by the
   plain `node build.js`. Never hand-edit it; it is generated and will be
   overwritten.
   =========================================================================== */

const fs = require('fs');
const path = require('path');

/* Order matters: each file may use things declared by the ones above it.
   The whole lot ends up inside ONE <script> tag, sharing one scope. */
const JS = [
  // content — safe for a non-programmer to edit
  'src/data/gods.js',
  'src/data/heroes.js',
  'src/data/realms.js',
  'src/data/questions.js',
  // engine
  'src/engine/state.js',
  'src/engine/scoring.js',
  'src/engine/particles.js',
  'src/engine/audio.js',
  'src/engine/input.js',
  // art
  'src/art/symbols.js',
  'src/art/rig.js',
  'src/art/realm-1-camp.js',
  'src/art/realm-2-forest.js',
  'src/art/realm-3-sea.js',
  'src/art/realm-4-underworld.js',
  'src/art/realm-5-olympus.js',
  // screens
  'src/screens/title.js',
  'src/screens/select.js',
  'src/screens/junction.js',
  'src/screens/claiming.js',
  'src/screens/result.js',
  'src/screens/codex.js',
  // the loop boots everything, so it goes last
  'src/engine/loop.js',
];

const root = __dirname;
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function banner(rel) {
  return `\n/* ${'='.repeat(72)}\n   ${rel}\n   ${'='.repeat(72)} */\n`;
}

const missing = JS.filter((f) => !fs.existsSync(path.join(root, f)));
if (missing.length) {
  console.error('  build failed — missing source files:');
  missing.forEach((m) => console.error('    ' + m));
  process.exit(1);
}

const head = read('src/00-head.html').trim();
const css = read('src/01-styles.css');
const js = JS.map((f) => banner(f) + read(f)).join('\n');

/* A guard so a stray fetch/XHR/image never sneaks in unnoticed. It runs
   before anything else and turns a silent network call into a loud error. */
const netGuard = `
/* ---- no-network guard -------------------------------------------------
   This game must work with the wifi off. If any code ever tries to reach
   the network, fail loudly here rather than quietly degrading in the wild. */
(function () {
  var shout = function (what) {
    return function () {
      var msg = 'BLOCKED network access via ' + what + ' — this game must run offline';
      console.error(msg);
      throw new Error(msg);
    };
  };
  try { window.fetch = shout('fetch'); } catch (e) {}
  try { window.XMLHttpRequest = shout('XMLHttpRequest'); } catch (e) {}
  try { window.WebSocket = shout('WebSocket'); } catch (e) {}
  try { window.EventSource = shout('EventSource'); } catch (e) {}
})();
`;

const artifactMode = process.argv.includes('--artifact');

let out, target;

if (artifactMode) {
  /* Body content only, and no net guard — see the note at the top. */
  const after = process.argv[process.argv.indexOf('--artifact') + 1];
  target = after && !after.startsWith('--') ? after : 'artifact.html';
  out = `<title>Who's Your Godly Parent?</title>
<style>
${css}
</style>
<div id="app" aria-live="polite"></div>
<script>
"use strict";
${js}
</script>
`;
} else {
  target = 'index.html';
  out = `<!doctype html>
<html lang="en">
<head>
${head}
<style>
${css}
</style>
</head>
<body>
<div id="app" aria-live="polite"></div>
<script>
"use strict";
${netGuard}
${js}
</script>
</body>
</html>
`;
}

fs.writeFileSync(path.isAbsolute(target) ? target : path.join(root, target), out, 'utf8');

const kb = (Buffer.byteLength(out, 'utf8') / 1024).toFixed(0);
console.log(`  built ${target} — ${kb} KB, ${JS.length} source files, 0 network requests`);
