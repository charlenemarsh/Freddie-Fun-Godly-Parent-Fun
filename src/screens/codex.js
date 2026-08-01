/* ===========================================================================
   codex.js — the gallery of all fourteen gods (Tier 2)
   ---------------------------------------------------------------------------
   Undiscovered gods are silhouettes with a locked symbol. Discovered ones
   reveal their art, domains, cabin, sacred animal and symbol.

   This is the replay engine — "13 of 14 found" is what makes a kid go again.
   =========================================================================== */

const Codex = (function () {

  let backTo = S.TITLE;

  function cell(key) {
    const god = GODS[key];
    const found = !!G.discovered[key];
    const c = god.colours;
    return '<div class="codex-cell plate' + (found ? '' : ' locked') + '" tabindex="0" ' +
      'role="button" aria-label="' + (found ? god.name + ', ' + god.domains : 'Undiscovered god') + '" ' +
      'data-key="' + key + '" style="--lane-glow:' + c[0] + '">' +
      '<div class="cs">' + (found ? (Sigil[god.symbol] || Sigil.lightning)(c[0]) : lockedSigil()) + '</div>' +
      '<div class="cn">' + (found ? god.name : '? ? ?') + '</div>' +
      '<div class="cd">' + (found ? 'Cabin ' + god.cabinNumber + ' · ' + god.animalName : 'Not yet claimed') +
      '</div></div>';
  }

  function lockedSigil() {
    return svgBox('<circle cx="50" cy="50" r="40" fill="none" stroke="#6A6258" stroke-width="3" ' +
      'stroke-dasharray="4 7"/>' +
      '<rect x="34" y="46" width="32" height="26" rx="5" fill="#5A5248"/>' +
      '<path d="M40 46 v-8 q0 -10 10 -10 t10 10 v8" stroke="#5A5248" stroke-width="4" fill="none"/>');
  }

  function detail(key) {
    const god = GODS[key];
    if (!G.discovered[key]) return;
    const c = god.colours;
    D.codexDetail.style.setProperty('--g-a', c[0]);
    D.codexDetail.innerHTML =
      '<div class="card-sec"><h4>' + god.name + '</h4>' +
      '<p style="color:' + c[0] + '">' + god.domains + '</p>' +
      '<p style="margin-top:6px"><strong>Cabin ' + god.cabinNumber + '.</strong> ' +
        god.cabinDescription + '</p>' +
      '<div class="chips" style="margin-top:8px">' +
        '<span class="chip">' + beastArt(god.animal) + god.animalName + '</span>' +
        '<span class="chip"><span class="swatch" style="background:' + c[0] + '"></span>' +
          god.colourName + '</span>' +
        '<span class="chip">' + (Sigil[god.symbol] || Sigil.lightning)(c[0]) + god.symbolName + '</span>' +
      '</div></div>';
    D.codexDetail.classList.add('plate');
    D.codexDetail.style.padding = '12px 14px';
    D.live.textContent = god.name + '. ' + god.domains;
  }

  function render() {
    const found = GOD_KEYS.filter((k) => G.discovered[k]).length;
    D.codex.innerHTML =
      '<div style="max-width:960px;margin:0 auto">' +
        '<h2 class="display">The Codex</h2>' +
        '<p id="codexCount" class="gilt">' + found + ' of 14 found</p>' +
        '<div id="codexGrid">' + GOD_KEYS.map(cell).join('') + '</div>' +
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
    // open on whatever they were just claimed by
    if (G.result && G.discovered[G.result.winner]) detail(G.result.winner);
  }

  return {
    init() {
      onEnter(S.CODEX, () => { render(); D.codex.classList.add('on'); D.codex.scrollTop = 0; });
      onExit(S.CODEX, () => D.codex.classList.remove('on'));
    },
    open(from) { backTo = from || S.TITLE; setState(S.CODEX); },
  };
})();
