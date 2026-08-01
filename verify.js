#!/usr/bin/env node
/* ===========================================================================
   verify.js — the self-review harness
   ---------------------------------------------------------------------------
   This is how the game gets looked at. It loads the real index.html from a
   file:// URL — the same way the game will actually be opened — drives the
   flow through the __game hooks, and writes PNGs to shots/.

   It also proves the two hard technical claims:
       zero console errors        zero network requests

     node verify.js                 both viewports, every state
     node verify.js --realm 3       just realm 3
     node verify.js --quick         one viewport, skip the frame timing

   Then READ the screenshots. A visual phase is not done until you have
   actually looked at it.
   =========================================================================== */

const path = require('path');
const fs = require('fs');

/* Playwright is a dev-only dependency and this project deliberately has no
   node_modules, so fall back to a globally installed copy. */
function loadPlaywright() {
  try { return require('playwright'); } catch (e) { /* try global next */ }
  try {
    const root = require('child_process').execSync('npm root -g', { encoding: 'utf8' }).trim();
    return require(path.join(root, 'playwright'));
  } catch (e) {
    console.error('\n  verify.js needs Playwright:  npm i -g playwright\n');
    process.exit(1);
  }
}
const { chromium } = loadPlaywright();

const ROOT = __dirname;
const URL = 'file://' + path.join(ROOT, 'index.html');
const SHOTS = path.join(ROOT, 'shots');

const args = process.argv.slice(2);
const QUICK = args.includes('--quick');
const ONLY_REALM = args.includes('--realm') ? Number(args[args.indexOf('--realm') + 1]) : 0;

const VIEWPORTS = QUICK
  ? [{ name: '390x844', width: 390, height: 844 }]
  : [{ name: '390x844', width: 390, height: 844 },
     { name: '1440x900', width: 1440, height: 900 }];

const consoleErrors = [];
const networkAttempts = [];

function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(page, dir, name) {
  ensureDir(dir);
  await page.screenshot({ path: path.join(dir, name + '.png') });
  process.stdout.write('    ' + name + '\n');
}

/* A clean page, one state, nothing else touched. Returns p95 in ms.

   This launches its OWN BROWSER, and that detail is the whole point.

   Measuring inside the screenshot page reported 83-100ms. Moving it to a
   fresh CONTEXT of the same browser changed nothing — still 100ms — because
   contexts are isolated for cookies and storage but share the browser's GPU
   process, and on a software rasteriser that process is exactly what twenty
   screenshots at deviceScaleFactor 2 have already exhausted. A standalone
   benchmark in a separately launched browser measured 33.4ms for the same
   file, repeatably, which is why the timing gets its own browser here. */
async function measureFrameTime(vp) {
  const browser = await chromium.launch({
    executablePath: process.env.PW_CHROMIUM || undefined,
    args: ['--allow-file-access-from-files', '--force-color-profile=srgb'],
  });
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  try {
    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForFunction(() => window.__game && window.__game.state === 'TITLE');
    await page.evaluate(() => {
      window.__game.skipTutorial();
      window.__game.jumpTo(3);
      window.__game.setState(window.__game.S.REALM_INTRO);
    });
    /* Wait for the RUNNING state itself rather than for a fixed delay. A fixed
       delay silently measured the wrong thing the moment the pacing was
       shortened: the junction had already opened, so it reported five seconds
       of five animated lane cards instead of the world scrolling. */
    await page.waitForFunction(() => window.__game.state === 'RUNNING', null, { timeout: 20000 });
    await page.evaluate(() => { window.__game.G.segmentLength = 999; });
    await wait(800);                            // let the speed ease up to target
    await page.evaluate(() => { window.__game.resetFrameTimes(); });
    await wait(5000);
    const state = await page.evaluate(() => window.__game.state);
    if (state !== 'RUNNING') {
      console.log('  WARNING: frame timing sampled in state ' + state + ', not RUNNING');
      return null;
    }
    return await page.evaluate(() => window.__game.p95);
  } finally {
    await context.close();
    await browser.close();
  }
}

async function run(vp) {
  const browser = await chromium.launch({
    executablePath: process.env.PW_CHROMIUM || undefined,
    args: ['--allow-file-access-from-files', '--force-color-profile=srgb'],
  });
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  const dir = path.join(SHOTS, vp.name);

  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push('[' + vp.name + '] ' + m.text());
  });
  page.on('pageerror', (e) => consoleErrors.push('[' + vp.name + '] pageerror: ' + e.message));
  // anything that is not the page itself is a network access we must not make
  page.on('request', (r) => {
    if (r.url() !== URL && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) {
      networkAttempts.push('[' + vp.name + '] ' + r.method() + ' ' + r.url());
    }
  });

  console.log('\n  ' + vp.name);
  await page.goto(URL, { waitUntil: 'load' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' });
  await wait(700);

  /* --- title --- */
  await shot(page, dir, '01-title');

  /* --- the answer key still holds --- */
  const problems = await page.evaluate(() => window.__game.validate());
  if (problems.length) {
    consoleErrors.push('[' + vp.name + '] answer key: ' + problems.join(' | '));
  }

  /* --- character select, in the same plus layout --- */
  await page.click('#btnBegin');
  await wait(900);
  await shot(page, dir, '02-character-select');

  // hover the LEFT hero so the drag/target styling is captured too
  await page.hover('#selLanes .lane-LEFT').catch(() => {});
  await wait(700);
  await shot(page, dir, '03-character-select-focus');

  await page.keyboard.press('ArrowUp');       // pick Annabeth, by keyboard
  await wait(1100);

  /* --- every realm: intro, run segment, junction --- */
  for (let r = 1; r <= 5; r++) {
    if (ONLY_REALM && r !== ONLY_REALM) {
      // fast-forward through the realms we are not shooting
      await page.evaluate((n) => window.__game.jumpTo(n * 3), r);
      continue;
    }
    if (r > 1) {
      await page.evaluate((n) => {
        window.__game.jumpTo((n - 1) * 3);
        window.__game.setState(window.__game.S.REALM_INTRO);
      }, r);
    }
    await wait(500);
    await shot(page, dir, 'r' + r + '-01-intro');

    await wait(2400);                          // let the intro card clear
    await page.evaluate(() => window.__game.skipTutorial());
    await wait(1600);                          // mid-stride in the run segment
    await shot(page, dir, 'r' + r + '-02-run');

    await page.evaluate(() => window.__game.openJunctionNow());
    await wait(1400);                          // fully bloomed
    await shot(page, dir, 'r' + r + '-03-junction');

    await page.evaluate(() => window.__game.answer('CENTRE'));
    await wait(1200);
    await page.evaluate(() => window.__game.openJunctionNow());
    await wait(1300);
    await shot(page, dir, 'r' + r + '-04-junction-b');
    await page.evaluate(() => window.__game.answer('UP'));
    await wait(1100);
  }

  /* --- the tutorial overlay, on its own --- */
  await page.evaluate(() => {
    localStorage.clear();
    window.__game.G.tutorialSeen = false;
  });

  /* --- what is actually rasterising? A headless container with no GPU
         falls back to SwiftShader, where a full-screen composited scene is
         an order of magnitude slower than on real hardware. Report it, so
         the frame numbers below are never read out of context. --- */
  const renderer = await page.evaluate(() => {
    try {
      const gl = document.createElement('canvas').getContext('webgl');
      const d = gl && gl.getExtension('WEBGL_debug_renderer_info');
      return d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'unknown';
    } catch (e) { return 'unavailable'; }
  });

  /* --- frame timing over a five-second run segment ---
         In a FRESH context, deliberately. Measuring in this one gave numbers
         two to three times worse, and it was the harness's own fault: by this
         point the page has rendered every realm and taken about twenty
         screenshots at deviceScaleFactor 2, which on a software rasteriser
         leaves the compositor in no state to be timed. A paired A/B against
         the previous build measured 33.4ms in a clean context and 83-100ms in
         this one, for the same file. Time the game, not the harness. --- */
  let p95 = null;
  if (!QUICK) {
    p95 = await measureFrameTime(vp);
  }

  /* --- the claiming, and the result card, for three different gods --- */
  for (const god of ['athena', 'poseidon', 'iris']) {
    const winner = await page.evaluate((g) => window.__game.forceGod(g), god);
    await page.evaluate(() => window.__game.setState(window.__game.S.CLAIMING));
    await wait(4600);
    await shot(page, dir, 'c-' + god + '-01-claiming');
    await wait(2600);
    await shot(page, dir, 'c-' + god + '-02-name');
    await page.evaluate(() => window.__game.setState(window.__game.S.RESULT));
    await wait(1200);
    await shot(page, dir, 'c-' + god + '-03-card');
    if (god !== winner) {
      console.log('    note: forceGod(' + god + ') resolved to ' + winner);
    }
  }

  /* --- the PNG export has to work from file:// --- */
  const exportOK = await page.evaluate(() => {
    try {
      const cv = window.__game.drawCard();
      const url = cv.toDataURL('image/png');
      return { ok: !!url && url.length > 2000, len: url.length };
    } catch (e) { return { ok: false, err: String(e) }; }
  });

  /* --- the codex --- */
  await page.evaluate(() => window.__game.setState(window.__game.S.CODEX));
  await wait(700);
  await shot(page, dir, '90-codex');

  /* --- reduced motion, honoured --- */
  await page.evaluate(() => {
    window.__game.G.reduced = true;
    document.documentElement.classList.add('reduced');
    window.__game.jumpTo(0);
    window.__game.setState(window.__game.S.REALM_INTRO);
  });
  await wait(2000);
  await page.evaluate(() => window.__game.openJunctionNow());
  await wait(900);
  await shot(page, dir, '91-reduced-motion-junction');

  /* --- layout at the extremes: 320px and 1920px --- */
  await page.setViewportSize({ width: 320, height: 640 });
  await wait(600);
  await shot(page, dir, '92-320px');
  await page.setViewportSize({ width: 1920, height: 1080 });
  await wait(600);
  await shot(page, dir, '93-1920px');
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > window.innerWidth + 1);

  await browser.close();
  return { p95, exportOK, overflow, renderer };
}

(async () => {
  ensureDir(SHOTS);
  const results = [];
  for (const vp of VIEWPORTS) results.push(await run(vp));

  console.log('\n  ' + '-'.repeat(64));
  console.log('  console errors:    ' + consoleErrors.length);
  consoleErrors.slice(0, 12).forEach((e) => console.log('      x ' + e));
  console.log('  network requests:  ' + networkAttempts.length);
  networkAttempts.slice(0, 12).forEach((e) => console.log('      x ' + e));
  results.forEach((r, i) => {
    console.log('  ' + VIEWPORTS[i].name + ':');
    const soft = /swiftshader|llvmpipe|software/i.test(r.renderer);
    if (r.p95 !== null) {
      console.log('      p95 frame time   ' + r.p95.toFixed(2) + 'ms  ' +
        (r.p95 < 16.7 ? '(under the 16.7ms target)'
                      : soft ? '(over 16.7ms, but see the renderer below)'
                             : '(OVER the 16.7ms target)'));
    }
    console.log('      renderer         ' + r.renderer +
      (soft ? '\n                       ^ software rasteriser, no GPU: frame times here\n' +
              '                         are not representative of real hardware' : ''));
    console.log('      PNG export       ' + (r.exportOK.ok
      ? 'works from file:// (' + Math.round(r.exportOK.len / 1024) + ' KB data URL)'
      : 'FAILED -> falls back to screenshot mode: ' + (r.exportOK.err || '')));
    console.log('      horizontal overflow at 1920px: ' + (r.overflow ? 'YES - LAYOUT BREAK' : 'none'));
  });
  console.log('  ' + '-'.repeat(64));
  console.log('  shots written to shots/<viewport>/\n');

  if (consoleErrors.length || networkAttempts.length) process.exitCode = 1;
})();
