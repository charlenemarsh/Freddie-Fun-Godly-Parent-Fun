/* ===========================================================================
   audio.js — everything you hear, synthesized on the fly (Tier 3)
   ---------------------------------------------------------------------------
   Web Audio API only. There are no audio files anywhere in this project.

     filtered noise  -> wind, surf, cave air
     plucked strings -> the lyre swell at each junction
     sine swells     -> divine moments
     low sub impact  -> thunder, and one hit per letter of the god's name
     bell tones      -> collectibles, rising pentatonic as a combo builds

   Muted by default. Unmuting must never throw — every entry point is
   wrapped, and if the browser refuses us an AudioContext the game simply
   plays in silence.
   =========================================================================== */

const Audio2 = (function () {

  let ac = null;
  let master = null, bedGain = null;
  let bedNodes = [];
  let started = false;
  let combo = 0, comboAt = 0;

  const PENT = [0, 2, 4, 7, 9];      // pentatonic, so nothing can sound wrong

  function ensure() {
    if (ac) return true;
    try {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return false;
      ac = new Ctor();
      master = ac.createGain();
      master.gain.value = 0;          // muted by default, always
      master.connect(ac.destination);
      bedGain = ac.createGain();
      bedGain.gain.value = 0.5;
      bedGain.connect(master);
      return true;
    } catch (e) { ac = null; return false; }
  }

  function noiseBuffer(seconds) {
    const n = Math.floor(ac.sampleRate * seconds);
    const buf = ac.createBuffer(1, n, ac.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < n; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;   // brown-ish: softer, less hissy
      d[i] = last * 3.2;
    }
    return buf;
  }

  function stopBed() {
    bedNodes.forEach((n) => { try { n.stop ? n.stop() : n.disconnect(); } catch (e) {} });
    bedNodes = [];
  }

  /* A realm's ambient bed: filtered noise plus a slow detuned drone. */
  function bed(kind) {
    if (!ensure()) return;
    stopBed();
    try {
      const src = ac.createBufferSource();
      src.buffer = noiseBuffer(4);
      src.loop = true;

      const filt = ac.createBiquadFilter();
      const lfo = ac.createOscillator();
      const lfoGain = ac.createGain();

      const preset = {
        camp:   { type: 'lowpass',  freq: 620,  q: 0.6, lfo: 0.09, sweep: 180, gain: 0.16, drone: 110 },
        forest: { type: 'bandpass', freq: 420,  q: 1.4, lfo: 0.14, sweep: 220, gain: 0.20, drone: 82  },
        sea:    { type: 'lowpass',  freq: 340,  q: 0.9, lfo: 0.07, sweep: 150, gain: 0.26, drone: 66  },
        under:  { type: 'lowpass',  freq: 240,  q: 1.1, lfo: 0.05, sweep: 90,  gain: 0.22, drone: 55  },
        olympus:{ type: 'highpass', freq: 900,  q: 0.7, lfo: 0.11, sweep: 300, gain: 0.13, drone: 146 },
      }[kind] || { type: 'lowpass', freq: 500, q: 0.7, lfo: 0.1, sweep: 160, gain: 0.16, drone: 98 };

      filt.type = preset.type;
      filt.frequency.value = preset.freq;
      filt.Q.value = preset.q;
      lfo.frequency.value = preset.lfo;
      lfoGain.gain.value = preset.sweep;
      lfo.connect(lfoGain).connect(filt.frequency);

      const g = ac.createGain();
      g.gain.value = 0;
      src.connect(filt).connect(g).connect(bedGain);
      g.gain.linearRampToValueAtTime(preset.gain, ac.currentTime + 2.2);

      const drone = ac.createOscillator();
      const dg = ac.createGain();
      drone.type = 'sine';
      drone.frequency.value = preset.drone;
      dg.gain.value = 0;
      dg.gain.linearRampToValueAtTime(0.05, ac.currentTime + 3);
      drone.connect(dg).connect(bedGain);

      src.start(); lfo.start(); drone.start();
      bedNodes = [src, lfo, drone];
    } catch (e) { /* silence is an acceptable outcome */ }
  }

  /* One plucked string. Karplus-ish: a short noise burst through a tight
     bandpass with a fast decay. */
  function pluck(freq, when, level, dur) {
    try {
      const t = (when || 0) + ac.currentTime;
      const o = ac.createOscillator();
      const g = ac.createGain();
      const f = ac.createBiquadFilter();
      o.type = 'triangle';
      o.frequency.setValueAtTime(freq, t);
      f.type = 'lowpass';
      f.frequency.setValueAtTime(freq * 5, t);
      f.frequency.exponentialRampToValueAtTime(freq * 1.4, t + (dur || 0.9));
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(level || 0.16, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.9));
      o.connect(f).connect(g).connect(master);
      o.start(t); o.stop(t + (dur || 0.9) + 0.05);
    } catch (e) {}
  }

  function tone(freq, when, level, dur, type) {
    try {
      const t = (when || 0) + ac.currentTime;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(level || 0.12, t + (dur || 1) * 0.28);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 1));
      o.connect(g).connect(master);
      o.start(t); o.stop(t + (dur || 1) + 0.05);
    } catch (e) {}
  }

  const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

  return {
    /* Called from a real user gesture, so the context is allowed to start. */
    unlock() {
      try {
        if (!ensure()) return;
        if (ac.state === 'suspended') ac.resume();
        started = true;
      } catch (e) {}
    },

    setMuted(m) {
      try {
        if (!ensure()) return;
        if (!m && ac.state === 'suspended') ac.resume();
        master.gain.cancelScheduledValues(ac.currentTime);
        master.gain.linearRampToValueAtTime(m ? 0 : 0.85, ac.currentTime + 0.25);
      } catch (e) {}
    },

    realmBed(realmId) {
      if (!started) return;
      bed(['camp', 'forest', 'sea', 'under', 'olympus'][realmId - 1]);
    },

    /* duck the bed and rise a lyre swell as a junction opens */
    junction() {
      if (!ac) return;
      try {
        bedGain.gain.cancelScheduledValues(ac.currentTime);
        bedGain.gain.linearRampToValueAtTime(0.18, ac.currentTime + 0.5);
      } catch (e) {}
      const root = 57;                              // A3
      [0, 4, 7, 11, 14].forEach((iv, i) => pluck(midi(root + iv), i * 0.075, 0.12, 1.5));
    },

    junctionEnd() {
      if (!ac) return;
      try { bedGain.gain.linearRampToValueAtTime(0.5, ac.currentTime + 0.8); } catch (e) {}
    },

    /* collectible — a bell that climbs the pentatonic as a combo builds */
    collect() {
      if (!ac) return;
      const now = performance.now();
      combo = (now - comboAt < 2600) ? Math.min(combo + 1, 9) : 0;
      comboAt = now;
      const n = 76 + PENT[combo % 5] + 12 * Math.floor(combo / 5);
      tone(midi(n), 0, 0.13, 0.5, 'sine');
      tone(midi(n + 12), 0.01, 0.05, 0.34, 'sine');
    },

    whoosh() {
      if (!ac) return;
      try {
        const src = ac.createBufferSource();
        src.buffer = noiseBuffer(1);
        const f = ac.createBiquadFilter();
        const g = ac.createGain();
        const t = ac.currentTime;
        f.type = 'bandpass'; f.Q.value = 1.2;
        f.frequency.setValueAtTime(300, t);
        f.frequency.exponentialRampToValueAtTime(2400, t + 0.42);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.1);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
        src.connect(f).connect(g).connect(master);
        src.start(t); src.stop(t + 0.6);
      } catch (e) {}
    },

    thunder() {
      if (!ac) return;
      tone(38, 0, 0.5, 1.8, 'sine');
      tone(52, 0.02, 0.16, 1.2, 'triangle');
      this.whoosh();
    },

    /* one bass impact per letter of the god's name */
    nameHit(i) {
      if (!ac) return;
      tone(midi(33 + (i % 3)), 0, 0.34, 0.42, 'sine');
    },

    /* the synthesized chorus for the claiming line */
    chorus(colourSeed) {
      if (!ac) return;
      const root = 45 + ((colourSeed || 0) % 5);
      [0, 7, 12, 16, 19].forEach((iv, i) => tone(midi(root + iv), i * 0.06, 0.10, 3.4, 'sine'));
      [0, 7, 12].forEach((iv, i) => tone(midi(root + iv) * 1.005, i * 0.06, 0.06, 3.4, 'sine'));
    },

    divine() {
      if (!ac) return;
      [0, 5, 9, 12].forEach((iv, i) => tone(midi(69 + iv), i * 0.09, 0.09, 2.4, 'sine'));
    },
  };
})();
