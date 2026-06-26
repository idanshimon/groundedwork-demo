# groundedwork — live demo

An interactive, in-browser demo of [groundedwork](https://github.com/idanshimon/groundedwork) — a tiny, dependency-free retrieval layer that gives an LLM a knowledge base bigger than its context window, grounded and abstaining by default.

**[▶ Open the live demo](https://idanshimon.github.io/groundedwork-demo/)**

## Is it real?

Yes. This page runs the actual groundedwork **TypeScript engine** in your browser — the same implementation the project's test suite verifies byte-identical to the Python reference (to 9 decimal places). Every BM25 score, the relevance-floor decision, the grounded/abstain verdict, and the assembled prompt are computed live. No backend, no mockups, no hardcoded numbers.

Type a question about a fictional coffee company's help docs and expand **"show what happened"** to watch the real pipeline: tokenized terms → BM25 scores vs the floor → the decision → the cache-aware prompt your model would receive.

groundedwork is **BYOM** — it never calls an LLM. The "answer" shown is the source document's text; everything before it is the real retrieval engine.

---

This repo hosts only the static demo. The library, tests, and docs live in the main repo.
