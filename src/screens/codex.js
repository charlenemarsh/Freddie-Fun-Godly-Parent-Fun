/* ===========================================================================
   codex.js — The Fourteen
   ---------------------------------------------------------------------------
   This used to be a collection: gods you had not been claimed by were locked
   silhouettes reading "? ? ?", and the page counted "3 of 14 found".

   That was the wrong idea for this game. You do not FIND a godly parent, and
   you certainly do not unlock Athena by happening to be her child — she was
   always there. A collection also quietly says the gods you have not drawn
   are worth less, which breaks the rule that no result is a consolation
   prize. Worse, it gave a child a reason to replay the quiz until the meter
   filled, which turns an honest answer into a grind.

   So the Codex is now the cast list of the world, and it is open from the
   first second. Its job changes depending on when you open it:

     BEFORE you play  — it is the field guide. Fourteen people it is possible
                        to be related to. Read them, and start wondering.
     AFTER you play   — it is the map of YOU. Every god carries how strongly
                        you resonated with them, strongest first, your parent
                        at the top and named as such. The gods at the bottom
                        are as interesting as the ones at the top: they are
                        the parts of yourself you did not choose today.

   Nothing here is ever hidden, greyed out or locked.
   =========================================================================== */

const Codex = (function () {

  let backTo = S.TITLE;
  let openKey = null;

  /* Affinity is the run's normalised score, restated against the winner so
     the parent reads 100% and everyone else reads as a share of them. Raw
     normalised scores cluster in a narrow band and look meaningless. */
  function affinities() {
    if (!G.result) return null;
    const s = G.result.scores;
    const top = s[G.result.winner] || 1;
    const map = {};
    GOD_KEYS.forEach((k) => {
      map[k] = Math.max(1, Math.round((s[k] / top) * 100));
    });
    return map;
  }

  function orderedKeys(aff) {
    const keys = GOD_KEYS.slice();
    if (aff) return keys.sort((a, b) => aff[b] - aff[a]);
    return keys.sort((a, b) => GODS[a].cabinNumber - GODS[b].cabinNumber);
  }

  function cell(key, aff, rank) {
    const god = GODS[key];
    const c = god.colours;
    const isParent = !!(G.result && G.result.winner === key);
    const claimedBefore = !!G.discovered[key];

    let meta;
    if (aff) {
      meta = '<div class="c-aff"><span class="c-aff-track"><span class="c-aff-fill" ' +
        'style="width:' + aff[key] + '%;--bar-a:' + c[0] + ';--bar-b:' + c[1] + '"></span></span>' +
        '<span class="c-aff-n">' + aff[key] + '%</span></div>';
    } else {
      meta = '<div class="cd">Cabin ' + god.cabinNumber + ' · ' + god.animalName + '</div>';
    }

    const label = god.name + '. ' + god.domains +
      (aff ? '. Resonance ' + aff[key] + ' percent' : '') +
      (isParent ? '. Your godly parent.' : '');

    return '<div class="codex-cell plate' + (isParent ? ' parent' : '') +
        (openKey === key ? ' open' : '') + '" tabindex="0" role="button" ' +
        'aria-label="' + label + '" data-key="' + key + '" style="--lane-glow:' + c[0] + '">' +
      (isParent ? '<span class="c-tag">Your parent</span>' :
        (claimedBefore ? '<span class="c-tag c-tag-past" title="Has claimed you before">Before</span>' : '')) +
      (aff ? '<span class="c-rank">' + rank + '</span>' : '') +
      '<div class="cs">' + (Sigil[god.symbol] || Sigil.lightning)(c[0]) + '</div>' +
      '<div class="cn">' + god.name + '</div>' +
      meta +
      '</div>';
  }

  /* The detail panel opens for any of the fourteen, always. */
  function detail(key) {
    const god = GODS[key];
    const c = god.colours;
    const aff = affinities();
    openKey = key;

    D.codexDetail.style.setProperty('--g-a', c[0]);
    D.codexDetail.innerHTML =
      '<div class="card-sec"><h4>' + god.name + '</h4>' +
      '<p style="color:' + c[0] + '">' + god.domains + '</p>' +
      (aff ? '<p class="cx-you">' +
        (G.result.winner === key
          ? 'This is your parent. You matched them more closely than any of the other thirteen.'
          : 'You resonated ' + aff[key] + '% as strongly with ' + god.name + ' as with your own parent.') +
        '</p>' : '') +
      '<p style="margin-top:6px"><strong>Cabin ' + god.cabinNumber + '.</strong> ' +
        god.cabinDescription + '</p>' +
      '<div class="chips" style="margin-top:8px">' +
        '<span class="chip">' + beastArt(god.animal) + god.animalName + '</span>' +
        '<span class="chip"><span class="swatch" style="background:' + c[0] + '"></span>' +
          god.colourName + '</span>' +
        '<span class="chip">' + (Sigil[god.symbol] || Sigil.lightning)(c[0]) + god.symbolName + '</span>' +
      '</div>' +
      '<div class="chips" style="margin-top:7px">' +
        '<span class="chip" style="border-color:' + GODS[god.ally].colours[0] + '99">' +
          'Closest ally · ' + GODS[god.ally].name + '</span>' +
        '<span class="chip" style="border-color:' + GODS[god.rival].colours[0] + '99">' +
          'Greatest rival · ' + GODS[god.rival].name + '</span>' +
      '</div></div>';
    D.codexDetail.classList.add('plate');
    D.live.textContent = god.name + '. ' + god.domains;

    D.codex.querySelectorAll('.codex-cell').forEach((el) => {
      el.classList.toggle('open', el.dataset.key === key);
    });
  }

  /* "You have walked this road before, and here is how it went." Past runs
     are a story, not a scoreboard — so they are listed, never counted. */
  function historyStrip() {
    if (!G.history || !G.history.length) return '';
    const seen = G.history.slice(0, 6).map((h) =>
      '<span class="cx-hist-i" style="--lane-glow:' + GODS[h.god].colours[0] + '">' +
        GODS[h.god].name + '</span>').join('');
    return '<div class="cx-hist"><span class="cx-hist-l">Roads walked</span>' + seen + '</div>';
  }

  function render() {
    const aff = affinities();
    const keys = orderedKeys(aff);

    const intro = aff
      ? '<p class="cx-sub">Ordered by how strongly this run resonated with each of them. ' +
        'The ones at the bottom are not failures — they are the roads you did not take today.</p>'
      : '<p class="cx-sub">Fourteen gods claim children. Any one of them could be yours. ' +
        'Read them now, or walk the road and find out.</p>';

    D.codex.innerHTML =
      '<div style="max-width:960px;margin:0 auto">' +
        '<h2 class="display">The Fourteen</h2>' +
        (aff ? '<p id="codexCount" class="gilt">Claimed by ' + GODS[G.result.winner].name + '</p>' : '') +
        intro +
        historyStrip() +
        '<div id="codexGrid">' + keys.map((k, i) => cell(k, aff, i + 1)).join('') + '</div>' +
        '<div id="codexDetail" style="max-width:520px;margin:0 auto 16px"></div>' +
        '<div class="btn-row"><button class="btn" id="btnCodexBack">Back</button></div>' +
      '</div>';

    D.codexDetail = D.codex.querySelector('#codexDetail');
    D.codex.querySelectorAll('.codex-cell').forEach((el) => {
      const go = () => detail(el.dataset.key);
      el.addEventListener('click', go);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
      });
    });
    D.codex.querySelector('#btnCodexBack').addEventListener('click', () => setState(backTo));

    // open on your own parent when there is one, otherwise on nobody
    if (G.result) detail(G.result.winner);
    else if (openKey) detail(openKey);
  }

  return {
    init() {
      onEnter(S.CODEX, () => { openKey = null; render(); D.codex.classList.add('on'); D.codex.scrollTop = 0; });
      onExit(S.CODEX, () => D.codex.classList.remove('on'));
    },
    open(from) { backTo = from || S.TITLE; setState(S.CODEX); },
  };
})();
