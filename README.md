# groundedwork — live playground

[Open the playground](https://idanshimon.github.io/groundedwork-demo/) · [Watch the walkthrough](https://idanshimon.github.io/groundedwork-demo/walkthrough/) · [Library source](https://github.com/idanshimon/groundedwork)

A browser-only evidence inspector for groundedwork's actual TypeScript retrieval engine. Query 24 fictional Nimbus Coffee documents, inspect ranked results and the lexical floor, read verbatim source extracts, and expand **Prompt & metadata** to see the payload your model would receive.

## What is real?

The playground computes retrieval results in the browser using the compiled TypeScript engine. It does not call an LLM. Source extracts are not generated answers. The engine version is read from the bundle, not a marketing badge.

The five cases cover a refund lookup, an out-of-scope question, an intentional keyword mismatch, a multi-term query, and a product lookup. The mismatch is important: a document can pass the lexical floor without answering the question. `grounded=true` reports that a working set was returned, not semantic verification.

## Walkthrough

The separate 30-second, silent [HyperFrames walkthrough](walkthrough/) explains retrieval, the floor, abstention, and a recorded wrong match. It includes play/pause, replay, seeking, chapter navigation, reduced motion, chapter-synced readable captions, and a full text alternative.

The walkthrough uses explicitly labeled recorded results from engine 0.1.0. The interactive playground uses the bundled engine 0.2.0; the demonstrated cases were verified unchanged. Recorded animation is not presented as a live engine execution.

## OpenSpec

The shipped playback contract lives in [walkthrough-experience](openspec/specs/walkthrough-experience/spec.md), with a retrospective proposal/design/tasks and executed evidence in its archived change. Run `openspec list --specs` and `openspec validate --all --strict --no-interactive` from this repository root.

The library owns [playground-experience](https://github.com/idanshimon/groundedwork/blob/main/openspec/specs/playground-experience/spec.md) and retrieval invariants; this repository owns the companion player and deployment-specific site navigation. A playground rebuild must preserve newer deployment-only navigation rather than overwrite it blindly.

## Rebuild and test

The playground's source, static builder and regression suite live in the library's `playground/` directory. Compile the TypeScript engine and run `python3 playground/build_static.py` there, then copy `playground/dist/index.html` here. No external runtime dependencies are needed by the generated page.

The walkthrough's authoring source, pinned dependencies, evidence generator and browser tests are in `walkthrough/`. Its runtime assets are local. See [walkthrough/README.md](walkthrough/README.md) for development commands.

To preview the combined site, serve this directory with any static HTTP server. The `walkthrough/` relative links then work without additional routing.

The library, algorithm contract, shared fixtures and cross-language parity tests live in [idanshimon/groundedwork](https://github.com/idanshimon/groundedwork).
