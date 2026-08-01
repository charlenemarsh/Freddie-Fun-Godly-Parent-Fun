# SPEC.md — Who's Your Godly Parent?

Full design detail. **Read only the section you need for the current phase** — don't pull the whole document into context.

Standing rules, palettes, must-nots, scoring invariants and workflow live in CLAUDE.md. This document is the *design*; that one is the *constitution*.

**Contents**

- §A — The five-lane junction
- §B — Run segments
- §C — Journey structure
- §D — Scoring engine
- §E — Visual specification
- §F — Technical
- §G — Build order
- §H — Success criteria

## Origin — the child's own words

Two ideas below are non-negotiable because they are his: the **five-direction plus/star junction** (four swipes plus a centre tap), and **choosing a book-one hero at the start**.

> *"I think it should be a Subway Surfers style thing where there is a character multiple places to go, like swiping up to go to an up option, right to go to an option on the right. You'll have to go to one on the left, tap to go into the middle, swipe down to go to a down option in a star or plus shape. So a character searches, you could choose at the beginning one of the Percy Jackson characters from the first book, such as Clarisse, Percy Jackson, Annabeth, Grover... etcetera. These five options should be what my mom described before, such as colors, patterns, animals, choices in a scenario, preferences, etc."*

# §A — The five-lane junction

Build and perfect this before anything else. Every question is a junction in the world, laid out as a plus with the hero at the centre.

```
                    ┌───────────┐
                    │  OPTION A │        swipe UP     · ↑ / W
                    └───────────┘

  ┌───────────┐     ╔═══════════╗     ┌───────────┐
  │  OPTION D │     ║    YOU    ║     │  OPTION B │
  └───────────┘     ║ OPTION E  ║     └───────────┘
swipe LEFT · ← / A  ╚═══════════╝   swipe RIGHT · → / D
                  TAP CENTRE · Enter/Space
                    ┌───────────┐
                    │  OPTION C │        swipe DOWN   · ↓ / S
                    └───────────┘
```

| **Input** | **Gesture** | **Keys** | **Meaning in the world** |
| :-- | :-- | :-- | :-- |
| **UP** | swipe up | ↑ W | climb, leap, ascend, take the high road |
| **RIGHT** | swipe right | → D | branch right |
| **DOWN** | swipe down | ↓ S | slide, duck, dive, go under |
| **LEFT** | swipe left | ← A | branch left |
| **CENTRE** | tap the centre | Enter Space | walk straight into what's in front of you |

**Requirements**

- Every lane **must also be directly clickable/tappable**. A player who never works out swiping must still finish.
- Pointer events. ~40px threshold, **velocity-aware** so a fast short flick registers, ±35° angle tolerance per direction, dead zone at centre, debounced so one gesture never fires twice.
- **Partial drag gives live feedback** — the junction group tilts toward the drag, the targeted card lifts and brightens, the other four dim. The choice must feel physical.
- **One-time tutorial overlay** on the first junction: a ghost hand tracing the plus, then dissolving, with a "Got it" dismiss. Persist the seen-flag.

## A.1 Junction choreography — the money moment

1. Run speed ramps down over 600ms; radial vignette closes in; background pushes back with a depth blur.
2. Ambient audio ducks; a lyre swell rises.
3. **Question text** materialises top-of-screen on a carved-stone or gold-leaf plaque that slides down and settles with a small bounce.
4. **Five lane cards stagger-bloom** outward from centre — UP, RIGHT, DOWN, LEFT, CENTRE at 70ms intervals — each scaling 0.8→1.0 on a spring easing, each with a directional chevron and its own coloured god-light glow.
5. Each card carries a **hand-drawn animated SVG illustration**. Never a bare word. Text label beneath the art, max 5 words.
6. On commit: chosen card flares white-hot, the other four **shatter into light motes and drift away**, the hero turns, camera whip-pans, a transition flourish fires, the next run segment begins.

# §B — Run segments

4–7 seconds of auto-running between junctions. This is where the world-building lives.

- Camera is **over-the-shoulder third person** — hero seen from behind, mid-stride, hair and cloak streaming, ~22% of screen height, lower-centre.
- **Six parallax depth layers** scroll toward the viewer (§E.2).
- **Collectible items** float in the lanes ahead. Collection is automatic on pass-through: chime, particle burst, icon flies to the Satchel HUD.
- **NPCs and creatures** appear beside the path and react — a centaur trots alongside, a dryad's face surfaces in bark and winks, a pegasus banks overhead, hellhound eyes blink in the dark, a naiad waves from the water.
- **Speed-up whoosh** and slight scale push as the junction nears, then the world **slows to ~35%** as the cards bloom. This slow-mo moment is essential to the feel.

# §C — Journey structure

**Character select → 5 realms × 3 junctions → claiming → result card.** Target 6–9 minutes.

## C.1 Character select

Presented in the **same five-lane plus layout**, so the mechanic is taught before it is tested. All five heroes are from the first book.

| **Lane** | **Hero** | **Visual signature** | **Signature effect (Tier 2)** |
| :-- | :-- | :-- | :-- |
| **CENTRE** | **Percy Jackson** | sea-green eyes, black hair, orange camp tee, a pen he keeps clicking | water ripples at his feet; sea-glass HUD accent |
| **UP** | **Annabeth Chase** | blonde curls, grey eyes, Yankees cap at belt, bronze knife | blueprint grid lines flicker over scenery; owl feathers drift |
| **LEFT** | **Grover Underwood** | rasta cap, curly brown hair, crutches then goat legs, reed pipes | flowers bloom in his footprints; birdsong in the audio bed |
| **RIGHT** | **Clarisse La Rue** | red bandana, boar-tusk necklace, electric spear | sparks and scorch marks; drums in the audio bed |
| **DOWN** | **Luke Castellan** | sandy hair, scar down one cheek, winged shoes, Backbiter | shoes flutter; a faint shadow always one step behind |

Heroes stand on slowly rotating pedestals with idle animations, rim-lit spotlight on the focused one, and a flavour line that types out on hover (*"The sea does not like to be restrained."*).

The chosen hero appears in every run segment, junction, cutscene and on the result card.

## C.2 The five realms

Each gets a **2.5s cinematic intro card** — realm name in carved lettering over a sweeping establishing shot — then **3 junctions**, then a distinct **exit flourish** (§E.5).

| **#** | **Realm** | **Question types, in order** |
| :-- | :-- | :-- |
| 1 | Camp Half-Blood | Colour → Place preference → Training scenario |
| 2 | The Forest | Animal → Pattern/texture → Danger scenario |
| 3 | The Sea & Shore | Scene preference → Colour/light → Rescue scenario |
| 4 | The Underworld | Pattern/symbol → Object/treasure → Moral choice |
| 5 | Mount Olympus | Weather/element → Gift preference → Self-defining choice |

## C.3 The claiming finale — make this genuinely spine-tingling

The hero stands in the Camp Half-Blood amphitheatre at dusk, the whole camp gathered in silhouette.

1. **Three seconds of held silence.** Fire crackles. Everyone looks up. *Resist the urge to fill this.*
2. Light drains to near-black, colour desaturating from the edges inward.
3. A **holographic god-symbol ignites above the hero's head**, rotating slowly, casting coloured light down over the scene and their face.
4. Light **bursts outward** in a shockwave ring; the crowd kneels in a wave rippling from the front row backward.
5. The **god's name types out** in gold, one letter at a time, bass impact per letter.
6. A synthesized chorus speaks the claiming line: *"Hail, child of [God], [Epithet]."*
7. The result card slides up.

## C.4 The result card

A tall, richly illustrated **Claiming Card** the player will want to screenshot.

- Portrait panel — the chosen hero rendered in the god's palette, beneath the divine symbol
- God name and full domain titles (*"Athena — Goddess of Wisdom, Warcraft, and Weaving"*)
- **Your Cabin** — number plus a one-line description of what it looks like inside
- **Divine Gifts** — 3 traits generated from trait-axis scores, phrased as compliments a kid would be proud of
- **Your Sacred Item** — chosen from items actually collected in the Satchel
- **Sacred Animal / Colour / Symbol** — three small illustrated chips
- **Your Signature Move** — an invented ability with a name (*"Tactical Read: you see the pattern three moves before anyone else does."*)
- **Compatibility** — closest ally and greatest rival, with tiny character chips
- **Percentage bars for the top 3 resonances** — "68% Athena, 22% Hermes, 10% Apollo." This drives replay.
- Buttons: Download My Card · See All 14 Gods · Run It Again

# §D — Scoring engine

Invariants are in CLAUDE.md. This section covers the model and the question design rules.

## D.1 Dual scoring model

Track two parallel score sets on every answer.

**(a) God points** — each option awards 1–3 weighted points to 1–3 gods. These determine the winner.

**(b) Six trait axes** — each option also awards 0–2 points across:

| **Axis** | **Meaning** | **Feeds** |
| :-- | :-- | :-- |
| VALOR | courage, confrontation, protectiveness | Ares, Zeus, Nemesis |
| WISDOM | strategy, curiosity, pattern-reading | Athena, Hecate, Hermes |
| WILD | nature, freedom, instinct, motion | Demeter, Dionysus, Poseidon |
| CRAFT | making, fixing, precision, patience | Hephaestus, Athena, Apollo |
| HEART | loyalty, beauty, connection, joy | Aphrodite, Apollo, Iris |
| SHADOW | depth, solitude, secrets, justice | Hades, Hecate, Nemesis |

Trait axes generate the **narrative text** on the result card. God points pick the winner.

**Rarity multiplier:** start Hades, Hecate, Nemesis and Iris at ×1.12 so they are reachable rather than theoretical, then tune to hit the distribution target.

## D.2 The Hunter's Invitation (Tier 3)

A player scoring in the top decile on both WILD and SHADOW who also chose the wilderness path at three or more junctions is claimed by no god, but offered a silver circlet by Artemis. Target ~4% of playthroughs. It should feel like an easter egg.

## D.3 simulate.js

Node-runnable. Runs 10,000 random playthroughs against the answer key and prints the outcome distribution as a table. **Every god must land between 3% and 14%.** Tune the answer key until it does.

Ships in the deliverable — this is how the answer key gets re-validated after future question edits. Do not delete it.

## D.4 Answers change the world (Tier 2)

This is what converts a quiz into a game.

- Poseidon / Demeter / Dionysus weighting → next segment grows lusher: vines, pooling water, petals in the air
- Hades / Hecate / Nemesis → shadows lengthen, torches gutter to violet, sky darkens a shade
- Zeus / Ares → storm clouds gather, distant thunder, sparks along metal
- Athena / Hephaestus → faint blueprint lines and gear silhouettes overlay distant scenery
- Apollo / Aphrodite / Iris → warmer light, lens flares, prismatic sheen at screen edges

Implement as a **worldTint state object** with warmth, darkness, stormCharge, growth, geometry floats (0–1) that lerp over ~2s after each answer and drive CSS custom properties plus particle parameters. **Never a hard cut.**

## D.5 Question design

Voice rules are in CLAUDE.md. Additional requirements:

- **Questions 1, 5, 8 and 13 are pure-visual** — options carry **no text label at all**, only illustration. Animated colour swatches, moving pattern tiles, animal portraits, weather scenes. A player must be able to answer these with the sound off and the language unknown.
- **Animal options:** mix familiar and mythic — owl, boar, dolphin, hellhound pup, peacock, stag, serpent, hawk, honeybee, mouse. Draw them **characterfully**, with idle animation: breathing, blinking, tail-flick.
- **Pattern options:** animated SVG tiling — Greek key meander, olive branches, crashing waves, lightning fracture, pomegranate seeds, honeycomb, laurel, hammered bronze scales, constellation lines, spider-web weave. These must **move** — slow drift, shimmer, or pulse.

# §E — Visual specification

**All artwork is hand-authored SVG plus CSS and canvas, generated by you, inline in the file.** No external images, no sprite sheets, no icon fonts, nothing over the network.

## E.1 Realm art direction

**REALM 1 — CAMP HALF-BLOOD** *(golden hour, alive, hopeful)*
#F2B544 honey · #E2543A strawberry · #2E6B4F pine · #87C5E8 sky · #F7EBD3 linen

Twelve cabins in a horseshoe, each architecturally distinct and glowing from within. The sky-blue Big House with its wrap-around porch and weather vane. Strawberry fields in long low rows. The climbing wall with lava sheeting down one face. The amphitheatre fire. The canoe lake catching the sun. Thalia's pine on the ridge with the Golden Fleece glinting. Orange camp tees on a washing line. A pegasus stable. Volumetric golden god-rays, dust motes, long soft shadows.

**REALM 2 — THE FOREST** *(deep, whispering, ancient)*
#123B2A deep pine · #3E8E5A moss · #8ED17F fern light · #FFD98A firefly · #0C1B2A shadow

Colossal trunks receding into fog. Shafts of light cutting the canopy. Fireflies drifting with real depth. Dryad faces half-emerged from bark, turning to watch as you pass. Zeus's Fist boulder. Ant-tunnel mouths. Glowing mushroom rings. A myrmeke's antenna withdrawing. Distant howls. A stream with stepping stones. Wind moves the entire canopy layer in a slow sine wave.

**REALM 3 — THE SEA & SHORE** *(vast, weightless, luminous)*
#0A2A43 abyss · #1E7A8C teal · #4FD1D9 cyan · #F7C9C0 coral · #EDE6F2 pearl

The descent from surf line into deep water. Caustic light rippling across every surface. Rising bubble columns. A kelp forest lit like a cathedral. Hippocampi wheeling past in a pod. A sunken trireme. An anemone garden pulsing. Pearl caverns. Far below, the impossible glow of Poseidon's palace. Everything **drifts** — a slow buoyant sway on all layers. Screen-edge caustics overlay.

**REALM 4 — THE UNDERWORLD** *(dark, beautiful, solemn — see the tone rule in CLAUDE.md)*
#0B0A10 obsidian · #E8E2D0 bone · #FF6B35 ember · #9B6BD9 ghost violet · #4EE59A Styx green

Charon's ferry crossing black water that glows green where the oar breaks it. The Fields of Asphodel as an endless plain of pale swaying grass under a starless sky. Black poplar groves. Cerberus in silhouette — enormous, six glowing eyes, not-quite-hostile. The obsidian palace with gemstones seaming the walls like veins of light. The EZ-DEATH queue sign flickering neon. Drifting spirits as translucent pale forms that turn to look. Falling ash throughout.

**REALM 5 — MOUNT OLYMPUS** *(blazing, marble, thunder)*
#FDFBF5 alabaster · #E3B23C gold leaf · #F5CBD8 cloud rose · #7B5FC4 thunder violet · #8FE3F2 aether

A staircase of solidified cloud spiralling upward, the city floating above. Marble colonnades. The twelve empty thrones in a horseshoe, each styled to its god. Hestia's hearth burning at the exact centre with a small girl tending it. Braziers. Olive trees in gold pots. An aurora sky. Lightning arcing between distant columns. Bloom-lit and slightly overexposed throughout.

## E.2 Layer and rendering architecture

| **Layer** | **Content** | **Scroll rate** |
| :-- | :-- | :-- |
| L0 | Sky, gradient, celestial bodies, aurora | 0.02× |
| L1 | Far silhouettes — mountains, city, canopy line | 0.10× |
| L2 | Mid architecture and terrain | 0.30× |
| L3 | **Path plane, lane guides, hero, collectibles** | 1.00× |
| L4 | Near foreground props — trunks, columns, rocks | 1.60× |
| L5 | Screen-space FX — particles, vignette, light leaks, caustics | varies |

- **SVG for scenery and characters.** Crisp, scalable, easy to author.
- **Canvas 2D for every particle system** — fireflies, embers, ash, bubbles, petals, sparks, dust, rain. Never hundreds of DOM nodes for particles.
- **Animate only `transform` and `opacity`.** One requestAnimationFrame loop with delta-time. `will-change` on moving layers.
- Target locked 60fps on a mid-range tablet. *(Tier 3)* Auto-downgrade if frame time exceeds 22ms for 30 consecutive frames: halve particle counts, drop L4 blur, disable bloom.

## E.3 Character rendering

Build **one shared rig** — a single layered SVG skeleton with groups for hair, head, torso, each arm, each leg, and a prop slot — then **swap palette, hair shape and prop per hero.** Do not author five separate figures; you will run out of budget.

Procedural run cycle: sine-driven limb rotation, torso bob, hair and cloak trailing with a one-frame lag for weight. States: idle, run, turn-left, turn-right, leap, slide, look-up-in-awe.

**Silhouette readability at small size matters more than detail.**

## E.4 Collectibles and the Satchel

4–6 per realm, seeded along the path. Each a small animated SVG that rotates, bobs and glows.

Golden drachma · Ambrosia square · Nectar flask · Riptide (capped pen) · Yankees cap · Reed pipes · Winged sandal · Blue pearl · Celestial bronze shield · Golden Fleece tuft · Owl feather · Lightning shard · Pomegranate seed · Laurel crown · Lyre string · Bronze gear · Vial of Styx water · Iris-message prism

The **Satchel HUD** (top-left) shows collected items as icons that spring in. The result card names one as **"Your Sacred Item,"** picked as the one thematically nearest the winning god.

**Collecting awards no score.** It is pure joy and completionism. Place some items in only one lane so replaying to collect a different set is rewarded.

## E.5 Realm transitions

Each exit is a distinct **full-screen flourish**, never a fade.

- **Camp → Forest:** the camera dives between two enormous trunks that sweep past as wipes
- **Forest → Sea:** the ground drops into surf; a wave rises and crashes over the lens, then clears underwater
- **Sea → Underworld:** water darkens downward; a whirlpool spiral drains the screen to black; a single ferry lantern ignites
- **Underworld → Olympus:** a lightning strike whites out the screen for 200ms, then reveals clouds *(suppressed under `prefers-reduced-motion`)*
- **Olympus → Claiming:** camera pulls up and back through cloud, spins 180°, descends into the amphitheatre at dusk

## E.6 Typography and UI chrome

- **Display type:** chiselled, high-contrast serif feel — CSS on a system stack (Optima, Palatino, "Palatino Linotype", Georgia, serif) plus letter-spacing, a gold gradient text fill, and a soft outer glow. **No web fonts.**
- **Body type:** clean humanist sans stack, generous line height, high contrast against its plate.
- UI panels sit on **translucent stone or aged-vellum plates** — warm inner glow, soft drop shadow, 1px gold hairline border.
- **HUD, corners only:** Satchel (top-left) · realm name and progress dots 1–15 (top-centre) · sound and reduced-motion toggles (top-right). Fades to 30% opacity during runs, full at junctions.

## E.7 Audio (Tier 3 — synthesized, Web Audio API, no audio files)

Filtered noise for wind and surf. Plucked-string bursts for the lyre. Sine swells for divine moments. A low sub-impact for thunder. Tuned bell tones for collectibles, ascending pentatonic as a combo builds. Per-realm ambient beds that crossfade.

Muted by default with an obvious unmute button. Persist the choice. Unmuting must never throw.

# §F — Technical

## F.1 Responsive and input

- **Touch-first, fully keyboard-equivalent.** Design at 390×844 portrait; scale gracefully to 1920×1080 landscape. Use svh units, safe-area insets, viewport-fit=cover.
- No horizontal page scroll, no pinch-zoom on the game surface, no double-tap-to-zoom, no text selection, no iOS rubber-banding, no long-press context menu on the play area.

## F.2 State machine

```
BOOT → TITLE → CHARACTER_SELECT → REALM_INTRO → RUNNING → JUNCTION
   → RESOLVING → (loop RUNNING/JUNCTION ×3) → REALM_EXIT
   → (loop realms ×5) → CLAIMING → RESULT → [CODEX | REPLAY]
```

## F.3 Data structures

All content lives in src/data/, cleanly separated from engine code and **commented so a non-programmer can edit questions, options, palettes and god data without touching logic.**

```js
// data/gods.js
{ name, domains, colours, symbol, animal, cabinNumber, cabinDescription,
  epithets, giftPool, signatureMoves, ally, rival, rarityMultiplier }

// data/realms.js
{ name, palette, layerArt, ambientConfig, particleConfig,
  collectibles, npcs, transitionOut }

// data/questions.js
{ realmId, prompt, isVisualOnly,
  options: [ { direction, art, label, godPoints: {}, traits: {} } ] }   // ×5

// data/heroes.js
{ name, palette, rigOverrides, prop, signatureFx, flavourLine }
```

Add a `DEV = false` flag that when true exposes: jump-to-question, force-a-god-result, live score readout, FPS counter.

## F.4 PNG export — known landmine, handle it deliberately

Download My Card is a real technical risk. Rasterising inline SVG to canvas via drawImage **can taint the canvas and make `toDataURL()` throw a SecurityError**, and behaviour differs across browsers — especially from a file:// origin, which is exactly how this will be opened.

**Do not assume the SVG-to-canvas route works.** Either:

- **(preferred)** draw the result card **directly with Canvas 2D primitives** as a separate render path, sidestepping SVG rasterisation entirely; or
- attempt the SVG route wrapped in try/catch with a working fallback: a clean full-bleed "screenshot me" card view with the HUD hidden and a prompt to use the device screenshot button.

**Test the export from file://, not just from a local server.**

## F.5 Persistence

localStorage, wrapped in try/catch and degrading silently: sound preference, reduced-motion preference, tutorial-seen flag, results history, and the "gods discovered" set that fills in the Codex.

## F.6 The Codex screen (Tier 2)

A browsable gallery of all 14 gods. Undiscovered gods show as **silhouettes with a locked symbol**; discovered ones reveal full art, domains, cabin, sacred animal and symbol. A "13 of 14 found" counter. This is the replay engine — make it feel collectible.

## F.7 verify.js — the self-review harness

Build this early, in phase 1. It is how you see your own work.

Using Playwright (Chromium), it should:

1. Load index.html from file://
2. Render at **390×844** and **1440×900**
3. Drive through the flow programmatically via the DEV hooks — character select, each realm intro, a run segment mid-stride, each junction fully bloomed, the claiming moment, the result card
4. Write PNGs to shots/&lt;viewport&gt;/&lt;state&gt;.png
5. Capture and print **any console errors** and **any network requests attempted** — both must be zero
6. Log frame timing over a 5-second run segment and print the p95

**Then read the screenshots.** Critique them honestly against §E. Iterate. A visual phase is not done until you have looked at it.

# §G — Build order

Make it **playable end to end early**, then deepen.

1. **Skeleton** — repo layout, build.js, verify.js, FSM, data structures, placeholder rectangles, all five inputs working, full 15-question flow to a text-only result. *Playable.*
2. **Scoring** — full answer key, normalisation, simulate.js, tune until distribution passes.
3. **Realm 1 at full fidelity** — the quality benchmark. **Gate: do not proceed until it looks genuinely beautiful on screen and you have said so having seen the screenshots.**
4. **Realms 2–5** matched to that benchmark. One per session where possible.
5. **Character system** — shared rig, five heroes, run cycle.
6. **Junction polish** — bloom choreography, drag-tilt, shatter-away, transitions.
7. **Claiming, result card, PNG export.**
8. **Tier 2** — Codex, worldTint, signature effects, persistence.
9. **Tier 3** — audio, easter egg, quality downgrade.
10. **Performance pass, cross-browser test, acceptance checklist.**

# §H — Success criteria

Do not report complete until every Tier 1 item is true. Report honestly on Tier 2 and 3.

**Feel**

- A stranger can play start to finish with no instructions
- All five directions work by swipe, arrow key, WASD, and direct click
- The slow-mo junction bloom is satisfying enough to want to do again
- No screen is static — something is always breathing, drifting or glowing
- The claiming sequence gives a genuine chill

**Content**

- 15 questions written, all in-world, second person, present tense
- Four of them pure-visual with zero text on the options
- All 75 options carry hand-drawn animated SVG art, no bare words
- All 14 gods have complete, distinct, generous result content
- Every realm matches the Realm 1 fidelity benchmark

**Scoring**

- `node simulate.js` over 10,000 runs puts **every** god between 3% and 14%
- Per-god normalisation implemented
- Question 15 double-weighted
- Two different answer patterns reliably produce two different gods
- simulate.js shipped, not deleted

**Technical**

- `node build.js` produces a single index.html that opens by double-click from file:// and works with the wifi off
- `node verify.js` reports zero console errors and zero network requests
- Screenshots reviewed at both viewports for every realm
- p95 frame time under 16.7ms on the run segments
- No layout break between 320px and 1920px
- `prefers-reduced-motion` fully honoured, including the lightning flash
- PNG export either works from file:// or degrades to a working fallback
- Audio muted by default; unmuting never throws
- Content data cleanly separated from engine code and commented for a non-coder

# Escalate before coding if…

- The full scope will not fit at the quality bar described and you need a steer on what to cut beyond the Tier 3 list
- You cannot hit the 3–14% distribution without distorting questions into obviously "correct" answers — **widen the band to 2–18% rather than compromising the questions, and say so**
- A better structure exists for the five-lane junction under 360px wide than the plus layout
- PNG export cannot be made to work from file:// in any browser and the fallback needs a different design
