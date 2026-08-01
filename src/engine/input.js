/* ===========================================================================
   input.js — the five-lane junction input
   ---------------------------------------------------------------------------
   Every direction is reachable four ways, and all four must work:

     UP      swipe up      · Arrow Up    · W · click the up card
     RIGHT   swipe right   · Arrow Right · D · click the right card
     DOWN    swipe down    · Arrow Down  · S · click the down card
     LEFT    swipe left    · Arrow Left  · A · click the left card
     CENTRE  tap centre    · Enter/Space · click the centre card

   A player who never works out swiping must still be able to finish, so the
   cards are real buttons as well as swipe targets.

   Gesture rules:
     · ~40px threshold, but VELOCITY-AWARE — a fast short flick counts
     · +/-35 degrees of tolerance around each axis
     · a dead zone at the centre so a shaky finger does not pick a direction
     · debounced: one gesture can never fire twice
   =========================================================================== */

const Input = (function () {

  const THRESHOLD = 40;        // px of travel for a slow, deliberate drag
  const FLICK_DIST = 16;       // px — enough if it was fast
  const FLICK_VEL = 0.55;      // px per ms
  const DEAD_ZONE = 12;        // px — below this there is no direction at all
  const ANGLE_TOL = 35;        // degrees either side of each axis
  const TAP_MS = 450;          // a press shorter than this, that barely moved, is a tap

  let host = null;
  let opts = {};
  let active = false;          // is a junction currently accepting input?
  let locked = false;          // debounce — set on commit, cleared by arm()
  let dragging = false;
  let startX = 0, startY = 0, startT = 0;
  let lastX = 0, lastY = 0, lastT = 0;
  let vel = 0;
  let currentTarget = null;
  let pointerId = null;

  /* Which direction is this offset pointing in? null when it is inside the
     dead zone or falls between two axes. */
  function directionOf(dx, dy) {
    const dist = Math.hypot(dx, dy);
    if (dist < DEAD_ZONE) return null;
    // screen y grows downward, so negate for a normal maths angle
    const deg = Math.atan2(-dy, dx) * 180 / Math.PI;   // -180..180, 0 = right
    const near = (target) => {
      let d = Math.abs(deg - target);
      if (d > 180) d = 360 - d;
      return d <= ANGLE_TOL;
    };
    if (near(0)) return 'RIGHT';
    if (near(90)) return 'UP';
    if (near(180)) return 'LEFT';
    if (near(-90)) return 'DOWN';
    return null;                                        // between two lanes
  }

  function commit(dir, how) {
    if (!active || locked || !dir) return;
    locked = true;
    active = false;
    clearDrag();
    if (opts.onCommit) opts.onCommit(dir, how);
  }

  function clearDrag() {
    dragging = false;
    pointerId = null;
    currentTarget = null;
    if (opts.onDrag) opts.onDrag(null, 0, 0, 0);
  }

  /* ---- pointer ---------------------------------------------------------- */

  function onDown(e) {
    if (!active || locked) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true;
    pointerId = e.pointerId;
    startX = lastX = e.clientX;
    startY = lastY = e.clientY;
    startT = lastT = e.timeStamp;
    vel = 0;
    try { host.setPointerCapture(e.pointerId); } catch (err) {}
  }

  function onMove(e) {
    if (!dragging || e.pointerId !== pointerId) return;
    const dt = Math.max(1, e.timeStamp - lastT);
    const stepX = e.clientX - lastX, stepY = e.clientY - lastY;
    // smoothed velocity, so one jittery sample cannot fake a flick
    vel = vel * 0.6 + (Math.hypot(stepX, stepY) / dt) * 0.4;
    lastX = e.clientX; lastY = e.clientY; lastT = e.timeStamp;

    const dx = e.clientX - startX, dy = e.clientY - startY;
    const dir = directionOf(dx, dy);
    currentTarget = dir;
    if (opts.onDrag) {
      // 0..1 — how committed does this drag look right now?
      const strength = Math.min(1, Math.hypot(dx, dy) / THRESHOLD);
      opts.onDrag(dir, strength, dx, dy);
    }
  }

  function onUp(e) {
    if (!dragging || (pointerId !== null && e.pointerId !== pointerId)) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    const dist = Math.hypot(dx, dy);
    const dur = e.timeStamp - startT;
    const dir = directionOf(dx, dy);

    const farEnough = dist >= THRESHOLD;
    const fastEnough = dist >= FLICK_DIST && vel >= FLICK_VEL;

    if (dir && (farEnough || fastEnough)) {
      commit(dir, 'swipe');
      return;
    }
    // barely moved and let go quickly: that is a tap
    if (dist < DEAD_ZONE && dur < TAP_MS) {
      const lane = e.target && e.target.closest && e.target.closest('.lane');
      commit(lane ? lane.dataset.dir : 'CENTRE', 'tap');
      return;
    }
    clearDrag();
  }

  function onCancel() { if (dragging) clearDrag(); }

  /* ---- keyboard --------------------------------------------------------- */

  const KEYS = {
    ArrowUp: 'UP', ArrowRight: 'RIGHT', ArrowDown: 'DOWN', ArrowLeft: 'LEFT',
    w: 'UP', d: 'RIGHT', s: 'DOWN', a: 'LEFT',
    W: 'UP', D: 'RIGHT', S: 'DOWN', A: 'LEFT',
  };

  function onKey(e) {
    if (!active || locked) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const mapped = KEYS[e.key];
    if (mapped) {
      e.preventDefault();
      commit(mapped, 'key');
      return;
    }
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      // if the player has tabbed onto a specific lane, Enter picks that lane;
      // otherwise Enter means "walk straight ahead" — the centre
      const el = document.activeElement;
      const lane = el && el.classList && el.classList.contains('lane') ? el : null;
      commit(lane ? lane.dataset.dir : 'CENTRE', 'key');
    }
  }

  /* ---- public ----------------------------------------------------------- */

  return {
    attach(hostEl, options) {
      host = hostEl;
      opts = options || {};
      host.addEventListener('pointerdown', onDown, { passive: true });
      host.addEventListener('pointermove', onMove, { passive: true });
      host.addEventListener('pointerup', onUp, { passive: true });
      host.addEventListener('pointercancel', onCancel, { passive: true });
      window.addEventListener('keydown', onKey);
      // clicking a lane card directly always works, swipe or no swipe
      host.addEventListener('click', (e) => {
        const lane = e.target.closest && e.target.closest('.lane');
        if (lane && active && !locked) commit(lane.dataset.dir, 'click');
      });
      // no long-press context menu on the play area
      host.addEventListener('contextmenu', (e) => e.preventDefault());
    },

    /* Open the junction for input. Clears the debounce lock. */
    arm() { active = true; locked = false; clearDrag(); },

    /* Close it — used during the resolve animation and between junctions. */
    disarm() { active = false; clearDrag(); },

    isArmed() { return active && !locked; },

    /* Used by verify.js and the DEV hooks to answer without a real gesture. */
    force(dir) { const wasLocked = locked; locked = false; active = true;
                 commit(dir, 'forced'); locked = wasLocked || locked; },
  };
})();
