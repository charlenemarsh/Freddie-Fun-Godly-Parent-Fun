# CLAUDE.md — Who's Your Godly Parent?

A swipe-driven, visually spectacular personality quiz that plays like a first-person journey through the Greek-mythology demigod world. Five realms, 15 questions, 14 possible divine parents.

Personal, non-commercial project for an 11-year-old named Freddie. **He will judge this on how it looks and feels.** Full design detail lives in SPEC.md — read the relevant section before starting each phase.

## Prime directive

**When forced to choose between clever engineering and "more magical to look at," choose magical.**

An eleven-year-old will notice if the trees don't move. He will not notice your state machine. Never ship a static screen — something should always be breathing, drifting, or glowing.

## Repo layout

Development is multi-file. **The deliverable is a single file.** build.js inlines everything.

```
src/
  00-head.html              meta, title, viewport
  01-styles.css             all CSS
  data/       gods.js · heroes.js · questions.js · realms.js
  engine/     state.js · input.js · loop.js · particles.js · scoring.js · audio.js
  art/        rig.js · symbols.js · realm-1-camp.js … realm-5-olympus.js
  screens/    title.js · select.js · junction.js · claiming.js · result.js · codex.js
build.js                    concatenates src/ → index.html
verify.js                   Playwright screenshot harness
simulate.js                 Monte Carlo answer-key validator
index.html                  GENERATED — never hand-edit
```

**Commands**

```
node build.js        # rebuild index.html from src/
node simulate.js     # 10,000-run outcome distribution
node verify.js       # render + screenshot to shots/
```

Never hand-edit index.html. Never add files outside this layout without saying why.

## Scope tiering

Ship each tier complete rather than everything at 40%. **A gorgeous three-realm game beats a shallow five-realm one.**

- **Tier 1 — must ship:** 15 questions · all 5 input directions · scoring across all 14 gods · 5 realms at full visual fidelity · claiming sequence · result card
- **Tier 2 — ship if you can:** PNG card export · Codex gallery · reactive worldTint · per-hero signature effects
- **Tier 3 — cut freely:** synthesized audio · Hunter's Invitation easter egg · quality auto-downgrade · results history

Cut from Tier 3 upward and record it in the README. **Never cut visual fidelity to add features.**

## Hard rules — must not

- **No network requests.** No CDN, no web fonts, no external images, no libraries, no frameworks, no bundler. Vanilla ES6+. It must work with the wifi off, opened by double-click from file://.
- **No borrowed art.** Do not reproduce, trace or embed any existing illustration, book cover, film still, poster, logo or promotional artwork. Every asset hand-authored by you as inline SVG. Original interpretations of public-domain Greek mythology; character names used as personal fan tribute only.
- **The Underworld is beautiful and solemn, never gory or frightening.** No blood, no body horror, no jump scares. Awe, not fear.
- **No result is a consolation prize.** There is no bad godly parent. Dionysus must sound as thrilling as Zeus. Write the Demeter and Iris cards with as much love as the Poseidon one — more, if anything.
- **The hero choice must not affect scoring.** It is pure flavour. Do not surface that fact in the UI.
- **No back button, no undo.** Commit is instant and final.
- **No autoplay audio.** Muted by default.
- **No flat grey rectangles.** UI sits on translucent stone or aged-vellum plates with warm inner glow and a gold hairline.

## The fourteen gods

Zeus · Poseidon · Hades · Athena · Apollo · Ares · Aphrodite · Hephaestus · Hermes · Demeter · Dionysus · Hecate · Nemesis · Iris

**Do not add Hera, Hestia or Artemis.** All three are canonically childless here — the omission is deliberate. Artemis appears only as the rare "Hunter's Invitation" alternate ending (Tier 3).

## Scoring invariants

Break any of these and results stop feeling true:

1. **Normalise per god** — divide each god's raw score by the maximum it could possibly have earned before comparing. Without this, gods appearing on more options always win. *This is the most important rule in the codebase.*
2. **Question 15 is double-weighted.**
3. **Every one of the 75 options awards points to at least one god.** No filler.
4. **Distribution target: every god between 3% and 14%** over 10,000 simulated runs. Watch Poseidon — he is the fan favourite and the sea realm over-feeds him.
5. **Tiebreak** in order: realm cluster → dominant trait axis → rarer god wins.
6. Rerun `node simulate.js` after *any* edit to data/questions.js.

Six trait axes drive result *narrative* (not the winner): VALOR WISDOM WILD CRAFT HEART SHADOW.

## Writing voice

Pitched at 11–13. Vivid, fast, funny where it can be. **Never babyish, never twee, never explain the joke.**

All questions are **in-world, second person, present tense, diegetic**. Not *"Which do you prefer?"* but *"The Hermes cabin is full. Chiron points down four paths and one open door. Where do you sleep tonight?"*

Under 22 words per question. Under 5 words per option label. Scenario questions must have no obviously correct answer.

## Realm palettes

| **Realm** | **Palette** | **Mood** |
| :-- | :-- | :-- |
| 1 Camp Half-Blood | #F2B544 #E2543A #2E6B4F #87C5E8 #F7EBD3 | golden, warm, hopeful, alive |
| 2 The Forest | #123B2A #3E8E5A #8ED17F #FFD98A #0C1B2A | green, whispering, ancient |
| 3 The Sea | #0A2A43 #1E7A8C #4FD1D9 #F7C9C0 #EDE6F2 | vast, weightless, luminous |
| 4 The Underworld | #0B0A10 #E8E2D0 #FF6B35 #9B6BD9 #4EE59A | dark, beautiful, solemn |
| 5 Mount Olympus | #FDFBF5 #E3B23C #F5CBD8 #7B5FC4 #8FE3F2 | blazing, marble, thunder |

## Accessibility non-negotiables

- Honour `prefers-reduced-motion`: kill parallax, particles, shake and **all flashes including the lightning white-out**. Also expose a manual HUD toggle — some children need it when the OS setting is off.
- Never flash more than 3× per second.
- All five lanes keyboard-reachable with visible focus rings; live-region announcement at each junction.
- Lane identity by **icon and position, never colour alone.**
- 44×44px minimum touch targets. 16px minimum body text.

## Workflow

**Plan → build → screenshot → critique → commit.** Every phase.

1. **Plan first** on any phase touching more than one file. Wait for approval.
2. **Build**, then `node build.js`.
3. **Look at your own work.** Run `node verify.js` to render and screenshot at **390×844** and **1440×900**. Read the screenshots. Critique them honestly against the art direction in SPEC.md §E. Iterate until it holds up. *Do not mark a visual phase done without having looked at it.*
4. **Commit per phase** with a clear message. When Realm 4's particles tank the framerate, you need to bisect, not guess.
5. **Update todos** as you go so progress is visible.

**Context hygiene:** one realm per session where possible. `/clear` between phases — this file carries the standard forward. Read only the SPEC.md section you need; don't pull the whole doc into context.

## Definition of done — every phase

- `node build.js` succeeds, index.html opens from file:// with **zero console errors and zero network requests**
- Screenshots taken at both viewports and actually reviewed
- `node simulate.js` still passes if any data changed
- No layout break between 320px and 1920px
- Committed

## Quality gate — Realm 1

**Camp Half-Blood is the benchmark.** Build it to the complete standard in SPEC.md §E.1 — six parallax layers, volumetric god-rays, dust motes, animated collectibles, reactive NPCs.

**Do not start Realm 2 until Realm 1 looks genuinely beautiful on screen and you have said so having seen it.** Every later realm must match that bar. This gate is what stops the whole build sliding into placeholder art.
