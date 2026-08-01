/* ===========================================================================
   result.js — the Claiming Card
   ---------------------------------------------------------------------------
   A tall, richly illustrated card the player will want to screenshot.

   PNG EXPORT (SPEC §F.4) — this is the known landmine. Rasterising inline SVG
   through drawImage can taint the canvas and make toDataURL() throw a
   SecurityError, and it behaves differently from a file:// origin, which is
   exactly how this game gets opened. So we take the preferred route: the
   downloadable card is drawn from scratch with Canvas 2D primitives, with no
   SVG rasterisation anywhere in the path. If even that fails, we fall back to
   a clean full-bleed "screenshot me" view with the HUD hidden.
   =========================================================================== */

const Result = (function () {

  let hunterResolved = false;

  /* ---- the on-screen card ---------------------------------------------- */

  function renderCard() {
    const res = G.result;
    const god = GODS[res.winner];
    const text = buildResultText(res);
    const item = sacredItemFor(res.winner, G.satchel);
    const hero = HEROES[G.hero];
    const c = god.colours;

    const chip = (svg, label) => '<span class="chip">' + svg + label + '</span>';
    const swatch = '<span class="chip"><span class="swatch" style="background:' + c[0] +
      '"></span>' + god.colourName + '</span>';

    const bars = res.resonance.map((r) => {
      const g2 = GODS[r.god];
      return '<div class="bar-row"><span>' + g2.name + '</span>' +
        '<span class="bar-track"><span class="bar-fill" style="width:' + r.pct +
        '%;--bar-a:' + g2.colours[0] + ';--bar-b:' + g2.colours[1] + '"></span></span>' +
        '<span>' + r.pct + '%</span></div>';
    }).join('');

    D.card.style.setProperty('--g-a', c[0]);
    D.card.style.setProperty('--g-b', c[1]);
    D.card.style.setProperty('--g-glow', c[2]);

    D.card.className = 'plate';
    D.card.innerHTML =
      '<div class="card-hero">' +
        '<span class="halo"></span>' +
        '<span class="sym">' + (Sigil[god.symbol] || Sigil.lightning)(c[2]) + '</span>' +
        '<span class="fig">' + Rig.still(G.hero, 'awe') + '</span>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="card-god display">' + god.name + '</div>' +
        '<div class="card-dom">' + god.domains + '</div>' +

        '<div class="card-sec"><h4>Your Cabin</h4>' +
          '<p><strong>Cabin ' + god.cabinNumber + '.</strong> ' + god.cabinDescription + '</p></div>' +

        '<div class="card-sec"><h4>Divine Gifts</h4><ul>' +
          text.gifts.map((g) => '<li>' + g + '</li>').join('') + '</ul></div>' +

        '<div class="card-sec"><h4>Your Signature Move</h4><p>' + text.move + '</p></div>' +

        '<div class="card-sec"><h4>Your Sacred Item</h4>' +
          '<div class="chips">' + chip(collectibleArt(item), itemName(item)) + '</div></div>' +

        '<div class="card-sec"><h4>Sacred Marks</h4><div class="chips">' +
          chip(beastArt(god.animal), god.animalName) + swatch +
          chip((Sigil[god.symbol] || Sigil.lightning)(c[0]), god.symbolName) +
        '</div></div>' +

        '<div class="card-sec"><h4>Compatibility</h4><div class="chips">' +
          '<span class="chip" style="border-color:' + GODS[god.ally].colours[0] + '99">Closest ally · ' +
            GODS[god.ally].name + '</span>' +
          '<span class="chip" style="border-color:' + GODS[god.rival].colours[0] + '99">Greatest rival · ' +
            GODS[god.rival].name + '</span>' +
        '</div></div>' +

        '<div class="card-sec"><h4>Resonance</h4><div class="bars">' + bars + '</div></div>' +

        '<div class="card-sec"><h4>Walked as</h4><p>' + hero.name + '</p></div>' +
      '</div>';

    D.resultBtns.innerHTML =
      '<button class="btn" id="btnDownload">Download My Card</button>' +
      '<button class="btn" id="btnCodex2">See All 14 Gods</button>' +
      '<button class="btn" id="btnAgain">Run It Again</button>';
    D.resultBtns.querySelector('#btnDownload').addEventListener('click', downloadCard);
    D.resultBtns.querySelector('#btnCodex2').addEventListener('click', () => Codex.open(S.RESULT));
    D.resultBtns.querySelector('#btnAgain').addEventListener('click', () => {
      resetRun();
      hunterResolved = false;
      setState(S.CHARACTER_SELECT);
    });

    D.cardNote.textContent = '';
    D.live.textContent = 'You are a child of ' + god.name + '. ' + god.domains + '.';
  }

  function itemName(id) {
    return ({
      drachma: 'Golden Drachma', ambrosia: 'Square of Ambrosia', nectar: 'Flask of Nectar',
      riptide: 'A Capped Pen', yankeesCap: 'A Well-Worn Cap', reedPipes: 'Reed Pipes',
      wingedSandal: 'A Winged Sandal', bluePearl: 'A Blue Pearl', bronzeShield: 'Celestial Bronze Shield',
      fleeceTuft: 'A Tuft of the Fleece', owlFeather: 'An Owl Feather', lightningShard: 'A Lightning Shard',
      pomegranateSeed: 'A Pomegranate Seed', laurelCrown: 'A Laurel Crown', lyreString: 'A Lyre String',
      bronzeGear: 'A Bronze Gear', styxVial: 'A Vial of Styx Water', irisPrism: 'An Iris-Message Prism',
      helm: 'A Shard of the Helm',
    })[id] || 'Golden Drachma';
  }

  /* ---- the Hunter's Invitation (Tier 3 easter egg) --------------------- */

  function renderHunter() {
    D.card.className = 'plate';
    D.card.style.setProperty('--g-a', '#C8D4DC');
    D.card.style.setProperty('--g-b', '#1E2A38');
    D.card.style.setProperty('--g-glow', '#EAF4FF');
    D.card.innerHTML =
      '<div class="card-hero">' +
        '<span class="halo"></span>' +
        '<span class="sym">' + circlet() + '</span>' +
        '<span class="fig">' + Rig.still(G.hero, 'awe') + '</span>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="card-god display">The Hunter\'s Invitation</div>' +
        '<div class="card-dom">No god has claimed you. Someone else was watching.</div>' +
        '<div class="card-sec"><p>A girl no older than you steps out of the treeline with a silver ' +
          'circlet in her hand. She does not introduce herself. She does not need to.</p></div>' +
        '<div class="card-sec"><p><em>"You have been going your own way the whole time. ' +
          'You could keep going. With us."</em></p></div>' +
      '</div>';
    D.resultBtns.innerHTML =
      '<button class="btn" id="btnTake">Take the circlet</button>' +
      '<button class="btn" id="btnStay">Stay, and be claimed</button>';
    D.resultBtns.querySelector('#btnTake').addEventListener('click', () => {
      hunterResolved = true;
      D.card.querySelector('.card-body').innerHTML =
        '<div class="card-god display">Hunter of Artemis</div>' +
        '<div class="card-dom">Sworn to the wild things and the long road</div>' +
        '<div class="card-sec"><p>You take it. It is lighter than it looks, and colder, and it fits.</p></div>' +
        '<div class="card-sec"><h4>What you are now</h4><ul>' +
          '<li>You belong to no one but the road</li>' +
          '<li>You see in the dark better than anyone should</li>' +
          '<li>Your aim is quietly, unnervingly perfect</li></ul></div>' +
        '<div class="card-sec"><p class="gilt">This ending happens to about one player in twenty-five.</p></div>';
      D.resultBtns.innerHTML = '<button class="btn" id="btnAgain2">Run It Again</button>';
      D.resultBtns.querySelector('#btnAgain2').addEventListener('click', () => {
        resetRun(); hunterResolved = false; setState(S.CHARACTER_SELECT);
      });
      Audio2.divine();
    });
    D.resultBtns.querySelector('#btnStay').addEventListener('click', () => {
      hunterResolved = true;
      renderCard();
      recordDiscovery();
    });
    D.live.textContent = 'The Hunter\'s Invitation.';
  }

  function circlet() {
    return svgBox(
      '<g class="spin"><circle cx="50" cy="50" r="34" fill="none" stroke="#C8D4DC" stroke-width="3"/>' +
      '<circle cx="50" cy="50" r="42" fill="none" stroke="#EAF4FF" stroke-width="1" ' +
        'stroke-dasharray="2 8"/></g>' +
      '<path d="M50 12 l6 12 l-6 4 l-6 -4z" fill="#EAF4FF"/>' +
      '<path d="M28 24 a30 30 0 0 1 44 0" stroke="#EAF4FF" stroke-width="2" fill="none" opacity=".7"/>');
  }

  function recordDiscovery() {
    if (!G.result) return;
    G.discovered[G.result.winner] = true;
    G.history.unshift({ god: G.result.winner, hero: G.hero, at: Date.now() });
    G.history = G.history.slice(0, 20);
    saveStore();
  }

  /* ---- PNG export, drawn with Canvas 2D primitives only ---------------- */

  function roundRect(x, y, w, h, r) {
    const p = new Path2D();
    p.moveTo(x + r, y);
    p.arcTo(x + w, y, x + w, y + h, r);
    p.arcTo(x + w, y + h, x, y + h, r);
    p.arcTo(x, y + h, x, y, r);
    p.arcTo(x, y, x + w, y, r);
    p.closePath();
    return p;
  }

  function wrap(ctx, text, x, y, maxW, lh) {
    const words = String(text).split(' ');
    let line = '', yy = y;
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, yy); yy += lh; line = w;
      } else line = test;
    }
    if (line) { ctx.fillText(line, x, yy); yy += lh; }
    return yy;
  }

  function drawCard() {
    const W = 900, H = 1560;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    const res = G.result;
    const god = GODS[res.winner];
    const text = buildResultText(res);
    const c = god.colours;
    const DISPLAY = '600 56px Optima, Palatino, Georgia, serif';
    const BODY = '26px "Avenir Next", Avenir, "Segoe UI", Helvetica, sans-serif';

    // background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, c[1]); bg.addColorStop(0.42, '#17131E'); bg.addColorStop(1, '#0A0810');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // header panel with the god's halo
    const halo = ctx.createRadialGradient(W / 2, 250, 20, W / 2, 250, 420);
    halo.addColorStop(0, c[2]); halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = 0.55; ctx.fillStyle = halo; ctx.fillRect(0, 0, W, 560); ctx.globalAlpha = 1;

    // a simple sigil drawn from primitives — no SVG anywhere in this path
    ctx.save();
    ctx.translate(W / 2, 250);
    ctx.strokeStyle = c[2]; ctx.lineWidth = 5; ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.arc(0, 0, 128, 0, 6.2832); ctx.stroke();
    ctx.globalAlpha = 0.45; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 152, 0, 6.2832); ctx.stroke();
    ctx.globalAlpha = 1; ctx.lineWidth = 9; ctx.lineCap = 'round';
    // an eight-point star, rotated — reads as a divine mark at any size
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * 6.2832;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 40, Math.sin(a) * 40);
      ctx.lineTo(Math.cos(a) * (i % 2 ? 82 : 108), Math.sin(a) * (i % 2 ? 82 : 108));
      ctx.stroke();
    }
    ctx.fillStyle = c[2];
    ctx.beginPath(); ctx.arc(0, 0, 26, 0, 6.2832); ctx.fill();
    ctx.restore();

    // gold hairline frame
    ctx.strokeStyle = 'rgba(227,178,60,.75)'; ctx.lineWidth = 3;
    ctx.stroke(roundRect(18, 18, W - 36, H - 36, 26));

    let y = 500;
    ctx.textAlign = 'center';
    ctx.fillStyle = c[0]; ctx.font = DISPLAY;
    ctx.fillText(god.name, W / 2, y); y += 44;
    ctx.fillStyle = 'rgba(240,228,200,.85)'; ctx.font = '24px "Avenir Next", Helvetica, sans-serif';
    y = wrap(ctx, god.domains, W / 2, y, W - 140, 32) + 24;

    ctx.textAlign = 'left';
    const L = 70, MW = W - 140;
    const heading = (t) => {
      ctx.fillStyle = '#E3B23C';
      ctx.font = '600 22px Optima, Palatino, Georgia, serif';
      ctx.fillText(t.toUpperCase(), L, y); y += 34;
      ctx.fillStyle = '#EFE3CB'; ctx.font = BODY;
    };

    heading('Your Cabin');
    y = wrap(ctx, 'Cabin ' + god.cabinNumber + '. ' + god.cabinDescription, L, y, MW, 36) + 22;

    heading('Divine Gifts');
    for (const g of text.gifts) {
      ctx.fillStyle = '#E3B23C'; ctx.fillText('✦', L, y);
      ctx.fillStyle = '#EFE3CB';
      y = wrap(ctx, g, L + 30, y, MW - 30, 36) + 4;
    }
    y += 18;

    heading('Your Signature Move');
    y = wrap(ctx, text.move, L, y, MW, 36) + 22;

    heading('Your Sacred Item');
    y = wrap(ctx, itemName(sacredItemFor(res.winner, G.satchel)), L, y, MW, 36) + 22;

    heading('Sacred Marks');
    y = wrap(ctx, god.animalName + ' · ' + god.colourName + ' · ' + god.symbolName, L, y, MW, 36) + 22;

    heading('Compatibility');
    y = wrap(ctx, 'Closest ally: ' + GODS[god.ally].name + '.  Greatest rival: ' +
      GODS[god.rival].name + '.', L, y, MW, 36) + 24;

    heading('Resonance');
    for (const r of res.resonance) {
      const g2 = GODS[r.god];
      ctx.fillStyle = '#EFE3CB'; ctx.font = '24px "Avenir Next", Helvetica, sans-serif';
      ctx.fillText(g2.name, L, y + 20);
      const bx = L + 200, bw = MW - 270;
      ctx.fillStyle = 'rgba(255,240,210,.14)';
      ctx.fill(roundRect(bx, y + 4, bw, 18, 9));
      const grad = ctx.createLinearGradient(bx, 0, bx + bw, 0);
      grad.addColorStop(0, g2.colours[1]); grad.addColorStop(1, g2.colours[0]);
      ctx.fillStyle = grad;
      ctx.fill(roundRect(bx, y + 4, Math.max(18, bw * r.pct / 100), 18, 9));
      ctx.fillStyle = '#EFE3CB';
      ctx.fillText(r.pct + '%', bx + bw + 16, y + 20);
      y += 42;
    }

    y = H - 92;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(240,228,200,.6)';
    ctx.font = '22px "Avenir Next", Helvetica, sans-serif';
    ctx.fillText('Walked the road as ' + HEROES[G.hero].name, W / 2, y);
    ctx.fillStyle = 'rgba(227,178,60,.75)';
    ctx.font = '600 22px Optima, Palatino, Georgia, serif';
    ctx.fillText("WHO'S YOUR GODLY PARENT?", W / 2, y + 36);

    return cv;
  }

  function downloadCard() {
    let url = null;
    try {
      const cv = drawCard();
      url = cv.toDataURL('image/png');       // can throw on a tainted canvas
      if (!url || url.length < 2000) throw new Error('empty export');
    } catch (e) {
      // fallback: a clean full-bleed view with the HUD hidden, and a prompt
      // to use the device's own screenshot button
      D.hud.style.display = 'none';
      D.resultBtns.style.display = 'none';
      D.cardNote.textContent =
        'Your browser will not let this page save a file. Take a screenshot of this card instead — ' +
        'the buttons are hidden so it comes out clean. Tap anywhere to bring them back.';
      const restore = () => {
        D.hud.style.display = '';
        D.resultBtns.style.display = '';
        D.cardNote.textContent = '';
        D.result.removeEventListener('click', restore);
      };
      setTimeout(() => D.result.addEventListener('click', restore), 400);
      return;
    }
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = 'claimed-by-' + GODS[G.result.winner].name.toLowerCase() + '.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      D.cardNote.textContent = 'Saved as a PNG. Check your downloads.';
    } catch (e) {
      // some file:// contexts block the download attribute — open it instead
      try { window.open(url, '_blank'); } catch (e2) {
        D.cardNote.textContent = 'Could not save automatically — take a screenshot of the card instead.';
      }
    }
  }

  return {
    init() {
      onEnter(S.RESULT, () => {
        D.result.classList.add('on');
        D.hud.classList.add('dim');
        if (G.result && G.result.hunter && !hunterResolved) {
          renderHunter();
        } else {
          renderCard();
          recordDiscovery();
        }
        D.result.scrollTop = 0;
      });
      onExit(S.RESULT, () => D.result.classList.remove('on'));
    },
    drawCard,                 // exposed so verify.js can prove the export path runs
  };
})();
