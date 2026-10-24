(() => {
  "use strict";
  const { version, config, results } = window.RECORDING;
  const [refund, abstain, wrong] = results;
  const text = (selector, value) => { document.querySelector(selector).textContent = value; };
  text("#refund-query", `“${refund.query}”`);
  text("#abstain-query", `“${abstain.query}”`);
  text("#wrong-query", `“${wrong.query}”`);
  text("#refund-score", refund.hits[0].score.toFixed(4));
  text("#wrong-score", wrong.hits[0].score.toFixed(4));
  text("#refund-extract", refund.hits[0].body);
  text(".corpus-count", `${refund.corpus_size} documents`);
  text(".working-limit", `Up to ${config.top_k} sources for your model`);
  text(".floor-copy", `Floor ${config.min_score}`);
  text(".wrong-floor", `> floor ${config.min_score}`);
  text("#engine-label", `ENGINE ${version} / BM25 / BYOM`);
  document.querySelector("#refund-bar").style.width = `${refund.hits[0].score / 4 * 100}%`;
  document.querySelector(".floor-marker").style.left = `${config.min_score / 4 * 100}%`;

  const tl = gsap.timeline({ paused: true });
  const scenes = [
    ["#pipeline", 0, 6],
    ["#matched", 6, 14],
    ["#abstain", 14, 21],
    ["#boundary", 21, 30],
  ];
  scenes.forEach(([selector, start, end]) => {
    tl.set(selector, { autoAlpha: 1 }, start);
    if (end < 30) tl.set(selector, { autoAlpha: 0 }, end);
  });
  // Adapted from the catalog's per-word-crossfade: calm, seek-safe drift; no blur.
  const reveal = (selector, at, stagger = 0.07) => {
    tl.fromTo(selector, { opacity: 0, y: 18 }, {
      opacity: 1, y: 0, duration: 0.5, stagger, ease: "power2.out",
    }, at);
  };
  reveal(".pipeline-step", 0.7, 0.22);
  reveal("#matched h1, .query-column", 6);
  tl.fromTo("#refund-bar", { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.out", immediateRender: false }, 6.9);
  reveal(".source-card", 7.25);
  reveal("#abstain h1, .abstain-query", 14);
  reveal(".empty-set, .abstain-response", 14.6, 0.3);
  reveal("#caveat h1, .limitation-card, .warning-copy", 21, 0.12);
  tl.set("#caveat", { autoAlpha: 0 }, 25.5);
  tl.set("#takeaway", { autoAlpha: 1 }, 25.5);
  reveal("#takeaway .drift", 25.5, 0.1);
  tl.fromTo(".end-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.6, immediateRender: false }, 26.3);
  tl.to({}, { duration: 0.01 }, 29.99);
  tl.seek(0).pause();

  // The host owns its clock. The film only accepts deterministic absolute seeks.
  window.walkthrough = Object.freeze({
    duration: 30,
    timeline: tl,
    seek(seconds, { reducedMotion = false } = {}) {
      if (!Number.isFinite(seconds)) throw new TypeError("Seek time must be finite");
      const target = Math.max(0, Math.min(30, seconds));
      document.documentElement.dataset.reducedMotion = String(reducedMotion);
      tl.seek(target, true).pause();
      const active = scenes.find(([, start, end]) => target >= start && (target < end || end === 30))[0];
      scenes.forEach(([selector]) => {
        document.querySelector(selector).setAttribute("aria-hidden", String(selector !== active));
      });
    },
  });
})();
