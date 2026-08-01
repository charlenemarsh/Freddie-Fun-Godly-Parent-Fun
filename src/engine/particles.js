/* ===========================================================================
   particles.js — every particle system in the game, on one canvas
   ---------------------------------------------------------------------------
   Dust, fireflies, bubbles, ash, motes, collection bursts and the shatter
   motes when four lane cards blow away. All of it is Canvas 2D on a single
   full-screen canvas — never hundreds of DOM nodes.

   Switched off entirely under reduced motion.
   =========================================================================== */

const Particles = (function () {

  let cv = null, ctx = null;
  let w = 0, h = 0, dpr = 1;
  let enabled = true;
  let ambient = [];         // the realm's standing particle field
  let bursts = [];          // short-lived one-off effects
  let cfg = null;

  function resize() {
    if (!cv) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const rand = (a, b) => a + Math.random() * (b - a);

  function spawn(p, first) {
    const k = cfg.kind;
    p.x = rand(-40, w + 40);
    p.y = first ? rand(-40, h + 40)
                : (cfg.rise < 0 ? h + rand(4, 60) : -rand(4, 60));
    p.r = rand(cfg.size[0], cfg.size[1]);
    p.a = rand(cfg.alpha[0], cfg.alpha[1]);
    p.vx = rand(-cfg.drift, cfg.drift) * 0.5;
    p.vy = cfg.rise + rand(-4, 4);
    p.ph = Math.random() * Math.PI * 2;
    p.sp = rand(0.4, 1.9);            // personal wobble speed
    p.life = 1;
    if (k === 'fireflies') { p.blink = rand(0.5, 1.9); p.a = 0; }
    if (k === 'bubbles') { p.vy = cfg.rise * rand(0.5, 1.5); }
    if (k === 'ash') { p.spin = rand(-2, 2); p.rot = Math.random() * 6.28; }
    return p;
  }

  function build(count) {
    ambient = [];
    const n = Math.round(count * (typeof G !== 'undefined' ? G.quality : 1));
    for (let i = 0; i < n; i++) ambient.push(spawn({}, true));
  }

  /* ------------------------------------------------------------------ */

  function stepAmbient(dt, t) {
    const k = cfg.kind;
    for (let i = 0; i < ambient.length; i++) {
      const p = ambient[i];
      p.ph += dt * p.sp;

      switch (k) {
        case 'fireflies':
          // wander, and pulse on their own private rhythm
          p.x += (p.vx + Math.sin(p.ph * 0.8) * 9) * dt;
          p.y += (p.vy + Math.cos(p.ph * 0.6) * 7) * dt;
          p.a = Math.max(0, Math.sin(t * p.blink + p.ph)) * cfg.alpha[1];
          break;
        case 'bubbles':
          p.x += (p.vx + Math.sin(p.ph * 1.4) * 6) * dt;
          p.y += p.vy * dt;
          break;
        case 'ash':
          p.x += (p.vx + Math.sin(p.ph * 0.5) * 5) * dt;
          p.y += p.vy * dt;
          p.rot += p.spin * dt;
          break;
        default: // dust, motes
          p.x += (p.vx + Math.sin(p.ph * 0.45) * 4) * dt;
          p.y += p.vy * dt;
          p.a = p.a * 0.995 + (0.3 + 0.25 * Math.sin(p.ph)) * 0.005;
      }

      if (p.y < -70 || p.y > h + 70 || p.x < -70 || p.x > w + 70) spawn(p, false);
    }
  }

  function drawAmbient() {
    const k = cfg.kind;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < ambient.length; i++) {
      const p = ambient[i];
      if (p.a <= 0.01) continue;
      ctx.globalAlpha = Math.min(1, p.a);

      if (k === 'bubbles') {
        ctx.strokeStyle = cfg.colour;
        ctx.lineWidth = Math.max(0.6, p.r * 0.22);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.stroke();
        ctx.globalAlpha = Math.min(1, p.a * 0.5);
        ctx.beginPath();
        ctx.arc(p.x - p.r * 0.3, p.y - p.r * 0.3, p.r * 0.28, 0, 6.2832);
        ctx.fillStyle = cfg.colour;
        ctx.fill();
      } else if (k === 'ash') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = cfg.colour;
        ctx.fillRect(-p.r * 0.5, -p.r * 0.35, p.r, p.r * 0.7);
        ctx.restore();
      } else {
        // a tight core with a short falloff — a wide gradient at low alpha
        // reads as a dirty grey ring against a bright sky, not as a mote
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.2);
        g.addColorStop(0, cfg.colour);
        g.addColorStop(0.45, cfg.colour);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.2, 0, 6.2832);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  /* ---- one-off bursts --------------------------------------------------- */

  function stepBursts(dt) {
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.t += dt;
      if (b.t >= b.dur) { bursts.splice(i, 1); continue; }
      for (const p of b.parts) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += b.gravity * dt;
        p.vx *= 0.985;
      }
    }
  }

  function drawBursts() {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const b of bursts) {
      const k = 1 - b.t / b.dur;
      for (const p of b.parts) {
        ctx.globalAlpha = Math.max(0, k * p.a);
        const r = p.r * (0.4 + k * 0.9);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
        g.addColorStop(0, b.colour);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3, 0, 6.2832);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  /* ------------------------------------------------------------------ */

  return {
    init(canvas) {
      cv = canvas;
      ctx = cv.getContext('2d', { alpha: true });
      resize();
      window.addEventListener('resize', resize);
      window.addEventListener('orientationchange', resize);
    },

    /* Load a realm's standing particle field (from data/realms.js). */
    setRealm(particleConfig) {
      cfg = particleConfig;
      build(cfg.count);
    },

    setEnabled(v) { enabled = v; if (!v && ctx) ctx.clearRect(0, 0, w, h); },

    /* Halve the particle count — the Tier 3 auto-downgrade. */
    setQuality(q) { if (cfg) build(cfg.count * q); },

    /* A collectible was picked up: a small bright pop at that point. */
    burst(x, y, colour, n, power) {
      if (!enabled) return;
      const parts = [];
      const count = Math.round((n || 16) * (typeof G !== 'undefined' ? G.quality : 1));
      for (let i = 0; i < count; i++) {
        const a = Math.random() * 6.2832;
        const s = rand(40, 150) * (power || 1);
        parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
                     r: rand(1, 3), a: rand(.5, 1) });
      }
      bursts.push({ parts, t: 0, dur: 0.85, colour: colour || '#FFE9AE', gravity: 60 });
    },

    /* The four unchosen lane cards shattering into light motes. */
    shatter(rect, colour) {
      if (!enabled) return;
      const parts = [];
      const count = Math.round(26 * (typeof G !== 'undefined' ? G.quality : 1));
      for (let i = 0; i < count; i++) {
        parts.push({
          x: rect.left + Math.random() * rect.width,
          y: rect.top + Math.random() * rect.height,
          vx: rand(-60, 60), vy: rand(-130, -30),
          r: rand(1, 3.4), a: rand(.4, 1),
        });
      }
      bursts.push({ parts, t: 0, dur: 1.15, colour: colour || '#FFE9AE', gravity: 24 });
    },

    /* A big radial wave — used by the claiming shockwave. */
    shockwave(x, y, colour) {
      if (!enabled) return;
      const parts = [];
      const count = Math.round(90 * (typeof G !== 'undefined' ? G.quality : 1));
      for (let i = 0; i < count; i++) {
        const a = Math.random() * 6.2832;
        const s = rand(220, 620);
        parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s * 0.6,
                     r: rand(1.4, 4), a: rand(.5, 1) });
      }
      bursts.push({ parts, t: 0, dur: 1.6, colour: colour || '#FFE9AE', gravity: 10 });
    },

    frame(dt, t) {
      if (!ctx) return;
      if (!enabled) return;
      ctx.clearRect(0, 0, w, h);
      if (cfg) { stepAmbient(dt, t); drawAmbient(); }
      stepBursts(dt);
      drawBursts();
    },

    count() { return ambient.length + bursts.reduce((n, b) => n + b.parts.length, 0); },
  };
})();
