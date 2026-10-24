# groundedwork walkthrough

Open `index.html` through any static HTTP server. The shell embeds the separate
30-second HyperFrames composition in `film/index.html`. No build or external
browser connection is needed: GSAP, styles, scripts, and recorded evidence are
local. This is a recorded educational module, **not a live engine query**.

```sh
cd walkthrough
npm ci --no-audit --no-fund
npm run dev
# http://localhost:4175/
```

Deploy the entire directory as `walkthrough/` alongside the playground. The
`../` links then resolve to the live playground. Direct `file://` iframe access
may be blocked by browser origin policy; use HTTP. No service worker is required:
offline use means a local static server with no internet, not an installed PWA.

## Authoring and validation

```sh
npm run assets       # copy the genuine pinned GSAP distribution + upstream notice
npm run evidence     # regenerate film/recording.js from evidence/recording.json
npm run lint         # actual HyperFrames lint, scoped to film/
npm run check        # actual HyperFrames runtime/layout/motion/contrast gate
npm run snapshot     # exact 3, 10, 17, 23, 28-second PNGs; no AI API analysis
npm test             # real headless browser, local server, external requests blocked
```

The evidence generator can also consume the supplied original baseline:
`node scripts/evidence.mjs /path/to/groundedwork-live-baseline.json`.
It selects three recorded cases and omits model-message preferences and unrelated
queries. It never fabricates scores, reruns a different engine version, or calls
a model. The visual source is the retrieved document body, not the baseline's
demo answer paraphrase.

The pinned CLI is HyperFrames 0.8.167. Its lint is lexical: the registry declaration
lives inline in `film/index.html`, while animation code stays in `film/film.js`.
The exact registered ID is `groundedwork-walkthrough`, and both its paused GSAP
timeline and timed composition root have a duration of 30 seconds.
The host alone uses a nondeterministic animation clock; the composition accepts
absolute deterministic seeks through `window.walkthrough.seek(seconds, options)`.
This API pauses the GSAP timeline on every call. HyperFrames drives that same
registered timeline for inspection and snapshots.

The shell never autoplays. Use native buttons and the labeled range input:
Tab/Enter/Space activate buttons; range arrows scrub, Home/End jump to endpoints.
Scrubbing and chapter selection pause playback. Chapter buttons land on settled,
readable frames (2, 8, 16, 23 seconds); their small labels identify chapter starts.
Replay restarts playback;
reloading returns to the paused opening. Background tabs pause. OS reduced-motion
preference is honored, with an explicit override; reduced mode removes drift and
bar expansion while preserving restrained opacity reveals. The text alternative
is available without animation, including at narrow widths.

## Recorded checks and limitations

See `evidence/check.log`, `evidence/snapshot.log`, `evidence/test.log`, chapter
PNGs in `evidence/snapshots/`, and real shell captures in `evidence/browser/`.
Final results: the HyperFrames check passed at five explicit sample times with
zero runtime, layout, or motion findings and 100/100 passing contrast checks;
all five browser tests passed. Five chapter/closing snapshots were captured and
visually inspected.
The CLI's structural warnings recommend splitting the four chapter groups into
sub-compositions. These compact scenes intentionally share one finite timeline
for reliable website seeking; warnings are not represented as errors or hidden.

The shell includes a visible, chapter-synced 16px caption outside the scaled composition, so the wrong-match example and caveat remain readable on phones. Playback, scrubber, chapter and reduced-motion controls have at least 44px touch targets. The full text alternative remains available without animation.

HyperFrames inspection may automatically resolve system fonts into its own
deterministic font cache. The website itself uses only system Arial/Georgia and
makes no font or other external requests. For this reason CLI stills and browser
captures can have slightly different font metrics.

No publishing, remote mutation, MP4 rendering, or root demo edits are part of this
artifact. The parent owns design review, integration, and deployment.
