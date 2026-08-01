/* ===========================================================================
   title.js — the title screen
   ---------------------------------------------------------------------------
   Nothing here is allowed to be still: the crest breathes, the laurel sways,
   and the lightning inside the gateway flickers.
   =========================================================================== */

const TitleScreen = (function () {
  return {
    init() {
      D.title.innerHTML =
        '<div class="screen-center"><div class="title-wrap">' +
          '<div class="crest">' + Glyph.crest() + '</div>' +
          '<h1 class="display">Who\'s Your<br>Godly Parent?</h1>' +
          '<p class="sub">A demigod\'s road · five realms · fifteen choices</p>' +
          '<div class="btn-row">' +
            '<button class="btn" id="btnBegin">Begin the Journey</button>' +
            '<button class="btn" id="btnCodex">The Codex</button>' +
          '</div>' +
        '</div></div>';

      D.title.querySelector('#btnBegin').addEventListener('click', () => {
        // audio may only start from a real gesture, and stays muted until asked
        Audio2.unlock();
        Audio2.setMuted(G.muted);
        setState(S.CHARACTER_SELECT);
      });
      D.title.querySelector('#btnCodex').addEventListener('click', () => {
        Audio2.unlock();
        Codex.open(S.TITLE);
      });

      onEnter(S.TITLE, () => {
        D.title.classList.add('on');
        D.hud.classList.add('dim');
        const btn = D.title.querySelector('#btnBegin');
        if (btn) btn.focus({ preventScroll: true });
      });
      onExit(S.TITLE, () => D.title.classList.remove('on'));
    },
  };
})();
