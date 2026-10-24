# Verification and traceability

This retrospective baseline was authored against demo main fab8b034ab4df53b05ccd9bde13113e325806c05. That revision includes the newer site-return link. No root playground, player, composition or vendor asset is edited by this documentation.

## Executed for this spec update

- `openspec validate baseline-hyperframes-walkthrough --strict --no-interactive` from repository root: passed.
- `npm --prefix walkthrough test`: 5 real-browser tests passed.
- `npm --prefix walkthrough run check`: actual HyperFrames check passed, 5 sampled frames, 100/100 contrast checks; 0 runtime/layout/motion errors. Five structural warnings remain (dense track and four sub-composition suggestions); this is not a strict zero-warning claim.
- `openspec archive baseline-hyperframes-walkthrough --yes`: synchronized the canonical spec; archive/post-archive tasks were completed afterward.
- `openspec validate --all --strict --no-interactive` after archive: both canonical capabilities passed, 0 failed. The existing playground-navigation spec and newer site-return code are preserved.
- Publication work was isolated at main e967c71df6b226149da7959d1336a1c958832cda after concurrent navigation-spec work advanced the shared checkout; no runtime file was carried into this documentation change.

## Requirement evidence

| Requirement | Implementation / evidence |
|---|---|
| Finite real composition | film/index.html timed root/registry, film/film.js paused GSAP timeline and local assets; paused finite composition test checks matching registration, duration and no external browser assets |
| Recorded evidence | scripts/evidence.mjs selects the saved queries; film/recording.js and evidence/recording.json contain source/score/floor data; film.js reads those fields. This data binding is code-inspected, not a new model or engine execution |
| Play/pause/replay | player.js begin/pause/tick/replay handlers; play/pause/replay/finite-end/reload browser test |
| Hidden-tab pause | visibilitychange handler is code-inspected; no independent tab-hide timing result is claimed by the five tests |
| Bidirectional seeks/bounds | forward/back chapter test plus nonfinite/clamp test; direct seek reaches the actual registered timeline |
| Keyboard/reduced motion/captions | keyboard/phone test verifies Home/End/arrows, reduced-motion preference, readable chapter caption, 44px controls and no page overflow |
| Parent return and failure | relative ../ links in shell; unavailable-adapter catch disables playback and leaves transcript available. Failure branch is code-inspected, not claimed as its own automated unavailable-adapter test |
| Reproducible validation | pinned package/lock, evidence generator, recording, browser test suite and actual sampled HyperFrames gate |

Earlier live release journeys verified the playback route and return to the actual playground on desktop/390/320px. A local pass does not establish a hosted release; no MP4 render was performed. The separate library owns real engine parity and the working playground adapter contract.
