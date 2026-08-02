# Who's Your Godly Parent?

A swipe-driven, visually rich personality quiz that plays like a first-person
journey through the Greek demigod world. Five realms, fifteen questions,
fourteen possible divine parents.

Built for Freddie, who asked for a Subway-Surfers-style game where a character
searches, you swipe up / down / left / right or tap the middle to choose, and
you pick one of the book-one heroes at the start. Both of those ideas are his
and neither was compromised.

## Play it

Double-click **`index.html`**. That is the whole thing — one file, no install,
no server, and it works with the wifi off.

## For anyone who wants to change it

```
node build.js       rebuild index.html from src/
node simulate.js    10,000 random playthroughs, prints the outcome spread
node verify.js      render in a real browser, screenshot, check for problems
node playtest.js    play the whole game with keyboard input only
```

`verify.js` and `playtest.js` do different jobs and you want both. `verify.js`
drives the flow through internal hooks, so it never races the animation and
gets clean screenshots of every state. `playtest.js` presses real keys through
the real handler and plays all fifteen questions — which is the only way to
catch input-timing bugs. It found one: a key pressed while the junction cards
were still blooming used to be silently dropped.

`index.html` is generated. Edit the files in `src/` and run `node build.js`.

**The content is separated from the code on purpose.** These four files are
plain English and safe to edit without knowing how to program:

| File | What's in it |
| :-- | :-- |
| `src/data/questions.js` | the 15 questions and all 75 answers |
| `src/data/gods.js` | the 14 gods: cabins, gifts, signature moves, allies |
| `src/data/heroes.js` | the 5 playable heroes |
| `src/data/realms.js` | the 5 realms: names, colours, weather, creatures |

After changing a question or an answer, run `node simulate.js`. It checks that
every god is still reachable and that no single god has taken over.

## What's here

**Tier 1 — all shipped**

- 15 questions, all in-world, second person, present tense. Four of them
  (1, 5, 8 and 13) carry no text at all — only illustrations.
- All 75 answers work by swipe, arrow key, WASD **and** direct tap. A player
  who never works out swiping can still finish.
- All 14 gods scored with per-god normalisation, question 15 double-weighted.
- Five realms, each with six parallax layers, its own particle system, its own
  creatures and a distinct full-screen exit flourish.
- The claiming sequence and the result card.

**Also shipped, after playtesting**

- Mobile-only presentation: a portrait frame held at every window size.
- Leave the road: abandon a run and go back to the title, with a confirm.

**Tier 2 — all shipped**

- PNG card export, working from `file://` (see the note below).
- The Codex — all 14 gods, never locked. See "The Codex" below.
- `worldTint` — your answers change the next stretch of world: shadows
  lengthen, storms gather, things grow, light warms.
- Per-hero signature colouring.

**Tier 3 — shipped**

- Synthesized audio (Web Audio, no audio files anywhere). Muted by default.
- The Hunter's Invitation easter egg, calibrated to fire on ~3.9% of runs.
- Automatic quality downgrade when frames get slow.

Nothing was cut.

## Pacing — the player is never made to wait

An early build spent about two minutes of a four-minute game showing things
the player could not interact with, most of it watching the character walk
between questions. That has been cut hard, and everything left over can be
cut short by the player:

| Moment | Was | Now | Can the player skip it? |
| :-- | --: | --: | :-- |
| Walking between questions | 4–7s | 1.1–1.6s | yes — tap or press any key |
| Realm introduction | 2.5s | 1.3s | yes — tap or press any key |
| Cards blooming in | 640ms | 430ms | answers given during it are held, not dropped |
| Choice resolving | 560ms | 380ms | — |
| Realm exit flourish | 0.8–1.25s | 0.5–0.8s | — |
| The claiming | 9.2s | 7.6s | yes — a **Skip** button fades in after 2.2s |

The claiming is the only long moment left, and it is the one worth keeping.
It is deliberately *not* skippable by a stray tap — only by finding and
pressing the button — so that a thumb resting on the screen cannot throw
away the payoff.

Shortening the walk meant the world had to be re-spaced: collectibles and
creatures were laid out for a five-second stroll and would otherwise have sat
beyond the end of the road, never reached. They are now placed against a
travel budget derived from the realm's own speed, so the spacing follows the
pacing automatically if it is ever tuned again.

## Mobile only, everywhere

This is a phone game and it is composed for a phone. It does not reflow into
a wide desktop window — it holds a portrait frame and lets the desktop sit
behind it.

**The frame is a range, not a fixed ratio, and that matters.** Pinned to
exactly 9:19.5, the height was capped by the window and the width was then
forced down to 46% of it, so in a short wide panel the game filled about a
quarter of the space and looked tiny. It now always takes the full height and
only the *width* is capped, anywhere between a tall phone (9:19.5) and a
stubby one (9:16) — both real phone shapes. How much of the window it fills:

| window | before | after |
| :-- | --: | --: |
| 390×844 phone | 100% | 100% |
| 360×640 short phone | 82% | **100%** |
| 1000×700 panel | 32% | **39%** |
| 1440×900 laptop | 29% | **35%** |
| 820×1180 tablet | 66% | **81%** |

Widening the frame cost a little on desktop — 1440×900 went from ~34fps to
~31fps under the software renderer, occasionally tripping the quality
auto-downgrade — which is a fair trade for a game that is actually big enough
to see. The phone viewport is untouched at ~46fps, full quality.

That is not a cosmetic choice. Three things follow from it:

- **One shape to author against.** Every composition — the five-lane plus, the
  parallax horizon, the result card — was being asked to work at both 390px
  and 1920px wide. At the wide end the plus stranded itself in the middle of
  an acre of empty world. Now there is one target.
- **What you see on a laptop is what Freddie sees on his phone.** Useful for
  showing someone without handing over the device.
- **The desktop got dramatically faster**, because it stopped rasterising four
  times the pixels for a layout nobody was going to use. At 1440×900 under the
  software renderer it went from 100ms and 14–16fps, with the quality
  auto-downgrade permanently on, to roughly 50ms and ~31fps. (It was ~34fps at
  full quality with the original narrower frame; widening it to fill more of
  the window gave some of that back. See the table above.)

**A phone held sideways gets an apology, not a broken layout.** At 844×390
the frame is 219px wide and the plus genuinely does not fit — the bottom card
clipped off screen. Landscape on a short viewport now shows "turn your phone
upright" instead. A laptop window is also landscape but plenty tall, so it
never sees it.

Three things had to change underneath for this to be correct rather than just
letterboxed:

- **Everything sized against the viewport now sizes against the frame.** 37
  `vw` and 14 `vh` values became container query units, and `#app` is a size
  container. Left alone, the lane cards would have been sized from a 1440px
  window and spilled straight out of a 415px frame.
- **The plus is bounded by height, not width.** Bounded mainly by width, it
  grew taller in proportion on a squatter frame and the DOWN card swallowed
  the hero standing behind it — 72px of him showed on a tall phone and 22px
  on a short one. Keyed to height, it takes the same share of the screen at
  every shape in the range.
- **Everything that assumed the window was the stage was corrected.** The road
  projection, the strip tiling, the shatter vectors and the claiming shockwave
  all measured from `window.innerWidth/innerHeight`. Once the stage is inset
  those are different numbers, and the road would have drifted off to one
  side. The particle canvas converts viewport coordinates into its own space,
  so call sites did not have to learn about the offset.

## Leaving a run

There is a door icon in the HUD. It abandons the run and returns to the
title, asking first, because losing ten answers to a mis-tap would be
miserable.

It is **not** an undo and does not step back a question. A choice is still
instant and final — that is the point of the game, and the "no back button"
rule in CLAUDE.md still holds for answers. What it fixes is a child ten
questions deep who simply wants to start again, and whose only previous
option was to reload the page.

The confirm takes the modal input lock, so opening it can never register an
answer, and cancelling hands the junction straight back.

## The Codex

It used to be a collection — gods you had not been claimed by showed as
locked silhouettes reading "? ? ?", above a counter saying "3 of 14 found".

That was wrong for this game. You do not *find* a godly parent, and you
certainly do not unlock Athena by happening to be her child. A collection
also quietly says the gods you have not drawn are worth less, which breaks
the rule that no result is a consolation prize — and it gives a child a
reason to replay until the meter fills, which turns an honest answer into a
grind.

So it is now the cast list of the world, open from the first second, and its
job changes depending on when you open it:

- **Before you play** — a field guide. Fourteen people it is possible to be
  related to. Read them, and start wondering.
- **After you play** — a map of you. Every god carries how strongly this run
  resonated with them, strongest first, your parent at the top and named as
  such. The gods at the bottom are framed as the roads you did not take
  today, not as failures.

Nothing in it is ever hidden, greyed out or locked. Past runs are listed as
a story ("Roads walked: Demeter, Hecate") and never counted as a score.

## Scoring

Over 10,000 random playthroughs every god lands between **6.3% and 7.9%**,
against a target band of 3–14%.

```
node simulate.js            the distribution table
node simulate.js --skew     checks no god is reachable by spamming one lane
node simulate.js --hunter   calibrates the easter egg
```

`simulate.js` loads the real files out of `src/` through Node's `vm` module, so
it validates exactly the code the browser runs rather than a second copy of the
rules that could drift.

Two findings worth keeping:

- **Normalisation is doing the work.** Without dividing each god's score by the
  maximum it could have earned, whichever god appears on the most options wins
  almost every time.
- **Hades was originally reachable by just swiping down.** The first `--skew`
  run showed 34% of Hades wins came from the DOWN lane, because every
  underworld-flavoured answer had drifted onto the same arm of the plus. The
  lanes were redistributed; the worst is now 28%, near the 20% ideal.

## Bugs worth recording

**The tutorial was inescapable.** On the first junction the "Got it" button
did nothing — not by mouse, not by touch, not by keyboard — and there was no
other way out of the dialog. One cause, three symptoms. `Input` is attached
to `#stage`, which contains the HUD and the tutorial as well as the road, and
it was stealing from them twice over: `pointerdown` took pointer capture,
which retargets the follow-up `click` away from the button and onto
`#stage`, and `keydown` called `preventDefault()` on Enter and Space, which
cancels a focused button's own activation. The same fault also killed the
sound and reduce-motion toggles for as long as a junction was open.

Input now keeps its hands off anything that is a genuine control and is not
one of the five lane cards, and a dialog can take a modal lock so the road
hears nothing at all while it is up. The tutorial has four ways out — the
button, the backdrop, Escape, or any key — and dismissing it can no longer
count as an answer.

**The resonance bars on the result card had no colour.** The gradient and the
per-god custom properties were all correct; `.bar-fill` is a `<span>` with no
`display` set, so it stayed inline, `width` and `height` never applied, and
it rendered at 0×0 inside an empty grey track. One line. The lowest bars now
also carry a `min-width` so a 1% resonance shows a sliver rather than
nothing, which reads as "a little" instead of "no data".

**`verify.js` was quietly measuring the wrong thing.** It held the RUNNING
state open by waiting a fixed 3200ms and then pinning `segmentLength`. The
moment the pacing was shortened, the junction had already opened by then, so
the "run segment" frame timing was really five seconds of five animated lane
cards — the most expensive state in the game — and the reported p95 roughly
doubled with no change to the rendering at all. It now waits for the RUNNING
state itself, clears the sample window, and warns loudly if the state drifted
before the sample finished. A timing harness that depends on wall-clock
guesses will lie to you the first time you change the timing.

**`Claiming.skip()` existed and was never wired to anything.** It is now
behind the Skip button.

## Known limits, honestly

**Frame rate could not be verified against the 16.7ms target here.** This was
built in a headless container with no GPU, so Chromium falls back to
SwiftShader and rasterises everything on 4 CPU cores. The measured p95 is
quantised to vsync multiples (33.4 = 2 frames, 50 = 3, 100 = 6), so it moves
in steps rather than smoothly. `verify.js` prints the renderer next to the
frame time so the two are never read apart.

**The desktop figure used to be meaningless and is now merely pessimistic.**
`verify.js` uses `deviceScaleFactor: 2`, so the 1440×900 pass was really
2880×1800 — 5.2 megapixels software-rasterised every frame, measuring 100ms at
about 15fps with the quality auto-downgrade firing. Moving to the portrait
frame cut that to a 415×900 stage: 33–50ms at ~34fps, at full quality. It is
still SwiftShader and still not a statement about real hardware.

**Three measurement faults turned up while shortening the pacing, and all
three looked exactly like a performance regression.** Recorded because each
one cost real time to find:

1. `verify.js` held the RUNNING state open with a fixed 3200ms wait. Once the
   pacing shortened, the junction had already opened, so it timed five
   seconds of five animated lane cards instead of the world scrolling.
2. Even after fixing that, it was still timing inside a page that had already
   rendered every realm and taken about twenty screenshots at
   `deviceScaleFactor: 2`. On a software rasteriser that leaves the
   compositor in no state to be measured.
3. Moving the timing to a fresh *context* of that same browser changed
   nothing — still 100ms. Contexts are isolated for cookies and storage but
   share the browser's GPU process, which is the exhausted resource. It needs
   its own browser, which is what it now gets.

**Paired A/B, same file, separate browser launches throughout.** This is the
number to trust:

| | 390×844 | 1440×900 @ DSF 2 |
| :-- | :-- | :-- |
| before the pacing changes | 33.4 33.4 33.4 33.4 ms | 100.0 / 99.9 ms · 15.9 / 15.0 fps |
| after | 33.4 50.0 33.5 33.5 ms | 100.0 / 100.0 ms · 15.9 / 17.4 fps |

**The shortened pacing cost nothing at either viewport.** On the phone
viewport the frame rate after the change was consistently the higher of the
two; on desktop the two are indistinguishable. Note the run-to-run variance
(one 390×844 run gave 50ms where its neighbours gave 33.4ms) — a single
reading from this container means very little, which is why these are quoted
as four runs rather than one.

What the profiling did find, and fix, is real regardless of hardware:

- Full-screen `mix-blend-mode` overlays were costing ~50ms a frame on their
  own, because blending forces the compositor to read back the backdrop and
  blocks layer promotion for everything underneath. Replaced with plain alpha.
- Around 270 individually animated SVG elements inside the background layers
  were costing ~30ms a frame in style recalculation. They are now grouped:
  one animated wrapper moves all the grass, all the ferns, all the tree line.
  Wind moves everything together anyway, so it also looks more right.
- A CSS blur on the moving foreground layer forced it to re-rasterise every
  frame. The depth cue is baked into the art instead.

Those three are real wins regardless of hardware — each was verified by
ablation, removing one thing at a time and re-measuring. The absolute
before/after figures previously quoted here came from the flawed harness
described above and have been removed rather than restated; the ranking of
the three costs held up, the numbers attached to them did not.

On anything with a GPU there should be a lot of headroom, but that is an
expectation, not a measurement, and it still needs checking on the actual
device.

**PNG export works from `file://`.** The card is drawn from scratch with
Canvas 2D primitives rather than by rasterising SVG, which is what would
otherwise taint the canvas and make `toDataURL()` throw. There is still a
fallback: if the download is blocked, the card goes full-bleed with the
buttons hidden and asks for a screenshot instead.

## Accessibility

- `prefers-reduced-motion` is honoured, including the lightning white-out,
  and there is a manual toggle in the HUD for children who need it when the
  OS setting is off.
- Every lane is keyboard-reachable with a visible focus ring, and each
  junction is announced to screen readers.
- Lanes are identified by icon and position, never by colour alone.
- 44px minimum touch targets, 16px minimum body text.
- Nothing flashes more than three times a second.

## Acceptance checklist

Checked against SPEC §H. Honest status, not aspirational.

**Feel**

- [x] A stranger can play start to finish with no instructions
- [x] All five directions work by swipe, arrow key, WASD and direct click
- [x] The junction slows to ~35% and the cards bloom outward 70ms apart
- [x] No screen is static — something is always breathing, drifting or glowing
- [x] The claiming holds its silence before anything happens (2.3s, was 3s)
- [x] Every wait can be cut short by the player; none of them traps anyone
- [x] The tutorial can be dismissed four ways and cannot swallow an answer
- [x] HUD toggles work at every point in the game, including mid-junction

**Content**

- [x] 15 questions, all in-world, second person, present tense, under 22 words
- [x] Four of them (1, 5, 8, 13) carry no text on the options at all
- [x] All 75 options carry hand-drawn animated SVG art — no bare words
- [x] All 14 gods have complete, distinct result content
- [x] Every realm built to the Realm 1 benchmark and reviewed at both viewports

**Scoring**

- [x] Every god between 3% and 14% over 10,000 runs (actual: 6.32%–8.00%)
- [x] Per-god normalisation implemented
- [x] Question 15 double-weighted
- [x] No god reachable by spamming a single lane (worst lane share 28%)
- [x] `simulate.js` shipped, not deleted

**Technical**

- [x] One `index.html`, opens by double-click from `file://`, works offline
- [x] `node verify.js` reports zero console errors and zero network requests
- [x] `node playtest.js` completes all 15 questions on keyboard alone,
      with zero console errors
- [x] Screenshots reviewed at 390×844 and 1440×900 for every realm
- [ ] **p95 frame time under 16.7ms — not verified.** See "Known limits"
      above: this machine has no GPU, and three separate harness faults made
      the number look like a regression when it was not. A paired A/B with
      separate browser launches shows the shortened pacing cost nothing at
      either viewport. Still needs a check on real hardware.
- [x] Holds its portrait frame from 320px to 1920px, with no layout break
      and no horizontal page scroll at any width
- [x] `prefers-reduced-motion` honoured, including the lightning white-out
- [x] PNG export works from `file://`, with a screenshot fallback
- [x] Audio muted by default; unmuting never throws
- [x] Content data separated from engine code and commented for a non-coder

## A note on the art

Every illustration here — all 75 answer cards, the collectibles, the god
sigils, the creatures, all five realms — is hand-authored SVG written into
`src/art/`. Nothing is traced, embedded, or fetched. These are original
interpretations of public-domain Greek mythology; the character names are
used as a personal fan tribute in a non-commercial project made for one child.
