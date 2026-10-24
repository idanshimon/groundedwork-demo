## Why
The deployed HyperFrames companion has no canonical OpenSpec contract. This retrospective baseline documents the implementation that already shipped, with traceable verification; it is not a claim of prior design approval or a request for new runtime behavior.

## What Changes
- Add this demo repository's OpenSpec context and walkthrough capability.
- Govern finite deterministic composition timing, recorded evidence, on-demand accessible playback, chapter-synced phone captions and return navigation.
- Keep the working playground's engine/adapter requirements in the library repository and preserve the newer site-return change on demo main.

## Capabilities
### New Capabilities
- `walkthrough-experience`: Genuine HyperFrames explanation, browser controls and recorded-evidence boundaries.
### Modified Capabilities
None.

## Impact
Documentation only. Owners: walkthrough/film/, player.js, player.css, index.html, evidence/recording.json, scripts/evidence.mjs and tests/playback.test.mjs. The root playground and its site-return code are preserved, not regenerated or replaced.

## Safety Impact
The module must not imply that recorded examples are live, a model was called, or a lexical score verifies correctness. No private data, remote assets or new services are introduced.

## Non-goals
Rendering an MP4, changing retrieval behavior, adding narration/models, repairing library CI, or replacing the working tool with a movie.
