## Context
This repository publishes the browser-only playground and a separate 30-second HyperFrames companion. The library repository owns the real engine and playground source contracts. Demo main also includes newer site-return navigation; documentation work must not overwrite it.

## Goals / Non-Goals
**Goals:** Baseline the shipped finite composition, evidence provenance, accessible player and phone interpretation surface.
**Non-Goals:** A new playback platform, autoplay, audio/video rendering, different retrieval scores or new engine APIs.

## Decisions
1. Separate the ordinary player shell from film/index.html. Only the shell owns its wall-clock/requestAnimationFrame loop; the film accepts deterministic absolute seeks against one paused timeline.
2. Use the actual local GSAP distribution and a root/timeline registration with matching composition ID. HyperFrames CLI checks the same finite timeline the browser adapter seeks.
3. Keep a reduced recording from the original Nimbus baseline. Clearly label recorded engine 0.1.0 evidence; interactive engine version may differ. The recorded wrong match is necessary to bound the claim.
4. Preserve play/pause, replay, slider, keyboard and chapter semantics. Initial load is paused and silent; scrubbing or choosing a chapter pauses, reload returns to opening, background tabs pause.
5. A 16:9 film scales down too far on phones. A visible chapter-synced 16px HTML caption provides the meaning outside the scaled frame; full transcript and recording notes remain available.
6. Use local runtime assets and relative parent links. Evidence JSON/generator and package pins make the walkthrough inspectable; source artifacts do not become proof of a hosted release.

## Risks / Trade-offs
- A fixed landscape frame has tiny secondary text on phones: visible captions carry the important facts; do not treat overflow alone as readability proof.
- A score threshold is not a truth detector: show the wrong-source case and qualify grounded=true.
- Iframe initialization can race with about:blank: wait for the actual composition load, and keep control availability tied to the real seek adapter.
- HyperFrames structural warnings recommend smaller sub-compositions: this compact website module intentionally uses one shared finite timeline. Validation must disclose warnings rather than claim a strict zero-warning pass.

## Open Questions
No open behavior questions in the recorded scope. No MP4 render was requested or verified.
