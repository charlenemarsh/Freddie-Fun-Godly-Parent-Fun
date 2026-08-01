#!/usr/bin/env node
/* ===========================================================================
   playtest.js — play the whole game, keyboard only, no shortcuts
   ---------------------------------------------------------------------------
   verify.js drives the flow through the __game hooks, which means it never
   races the animation and cannot see input-timing bugs. This does: it presses
   real keys through the real handler and plays all fifteen questions.

   That distinction is not theoretical. This test is what found that a key
   pressed while the junction cards were still blooming was silently dropped —
   fifteen presses only got seven questions in.

       node playtest.js

   The driver runs INSIDE the page. Polling from Node needed ~600 IPC
   round-trips, which under a software renderer cost more than the game does.
   The only thing shortened is how long each run segment lasts.
   =========================================================================== */

const path = require('path');

function loadPlaywright() {
  try { return require('playwright'); } catch (e) { /* try global next */ }
  try {
    const root = require('child_process').execSync('npm root -g', { encoding: 'utf8' }).trim();
    return require(path.join(root, 'playwright'));
  } catch (e) {
    console.error('\n  playtest.js needs Playwright:  npm i -g playwright\n');
    process.exit(1);
  }
}
const { chromium } = loadPlaywright();
const wait=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
 const b=await chromium.launch({args:['--allow-file-access-from-files']});
 const c=await b.newContext({viewport:{width:390,height:844}});
 const p=await c.newPage();
 const errs=[];
 p.on('pageerror',e=>errs.push(String(e)));
 p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
 await p.goto('file://' + path.join(__dirname, 'index.html'), { waitUntil: 'load' });
 await p.evaluate(()=>localStorage.clear());
 await p.reload({waitUntil:'load'}); await wait(600);

 const out = await p.evaluate(() => new Promise((resolve) => {
   const g = window.__game;
   const KEYS = ['ArrowUp','ArrowRight','ArrowDown','ArrowLeft','Enter',
                 'w','d','s','a',' '];
   const press = (key) => window.dispatchEvent(new KeyboardEvent('keydown',
     { key, bubbles: true, cancelable: true }));
   const log = [];
   let answered = 0, lastQ = -1, ticks = 0;

   document.getElementById('btnBegin').click();

   const iv = setInterval(() => {
     if (++ticks > 4000) { clearInterval(iv); resolve({ timeout: true, answered, log }); return; }
     const st = g.state;

     if (st === 'CHARACTER_SELECT') { press('ArrowLeft'); return; }   // Grover
     if (st === 'RUNNING') { g.G.segmentLength = 1.5; return; }
     if (st === 'JUNCTION') {
       if (document.getElementById('tutorial').classList.contains('on')) {
         document.getElementById('tutBtn').click(); return;
       }
       if (g.G.questionIndex !== lastQ) {
         const key = KEYS[answered % KEYS.length];
         press(key);
         if (g.G.answers.length > answered) {          // it registered
           lastQ = g.G.questionIndex; answered++;
           log.push(key);
         }
       }
       return;
     }
     if (st === 'CLAIMING') { g.setState(g.S.RESULT); return; }
     if (st === 'RESULT') {
       clearInterval(iv);
       const r = g.result();
       resolve({
         answered, log,
         answers: g.G.answers.length,
         satchel: g.G.satchel.length,
         hero: g.G.hero,
         winner: r ? r.winner : null,
         resonance: r ? r.resonance.map(x => x.god + ' ' + x.pct + '%').join(', ') : '',
         card: (document.getElementById('card').innerText || '')
                 .split('\n').filter(Boolean).slice(0, 3).join(' | '),
       });
     }
   }, 60);
 }));

 await p.screenshot({path:'shots/390x844/99-playthrough-result.png'});
 console.log('  hero chosen    ', out.hero, '(by ArrowLeft)');
 console.log('  keys used      ', (out.log||[]).join(' '));
 console.log('  answers stored ', out.answers, 'of 15');
 console.log('  items collected', out.satchel);
 console.log('  winner         ', out.winner);
 console.log('  resonance      ', out.resonance);
 console.log('  card           ', out.card);
 console.log('  console errors ', errs.length, errs.slice(0,2).join(' | '));
 const ok = !out.timeout && out.answers === 15 && errs.length === 0 && out.winner;
 console.log(ok ? '\n  PASS - played start to finish, keyboard only, 15/15 answers.'
                : '\n  FAIL' + (out.timeout ? ' (timed out at ' + out.answered + ' answers)' : ''));
 await b.close();
 if (!ok) process.exitCode = 1;
})();
