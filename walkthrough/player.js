(() => {
  "use strict";
  const film = document.querySelector("#film");
  const play = document.querySelector("#play");
  const replay = document.querySelector("#replay");
  const start = document.querySelector("#start");
  const scrub = document.querySelector("#scrub");
  const time = document.querySelector("#time");
  const status = document.querySelector("#status");
  const reduce = document.querySelector("#reduce");
  const chapters = [...document.querySelectorAll("[data-seek]")];
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const duration = 30;
  const captions = [
    ["01 / The working set", "A question becomes keywords. BM25 ranks the documents, and the relevance floor filters the candidates. The working set can be empty."],
    ["02 / A source to use", "Recorded refund query: Returns & Refunds scores 3.8605, above the 0.5 floor. The displayed answer is source text. groundedwork does not call an LLM."],
    ["03 / The empty set", "The France question has no matches in the Nimbus documents. The engine returns grounded=false and an explicit no-evidence response—not a claim that the answer does not exist elsewhere."],
    ["04 / Know the boundary", "The delivery question incorrectly retrieves Pausing Your Subscription (2.9429 > 0.5). grounded=true means a source passed the lexical floor, not that it answers the question. A threshold is not a truth detector."]
  ];
  let captionIndex = -1;
  let adapter, position = 0, playing = false, frame = 0, last = 0;
  reduce.checked = preference.matches;

  function fit() {
    film.style.transform = `scale(${document.querySelector("#screen").clientWidth / 1920})`;
  }
  new ResizeObserver(fit).observe(document.querySelector("#screen"));
  fit();

  function paint() {
    adapter.seek(position, { reducedMotion: reduce.checked });
    scrub.value = String(position);
    scrub.setAttribute("aria-valuetext", `${position.toFixed(1)} seconds of ${duration}`);
    time.value = `0:${String(Math.floor(position)).padStart(2, "0")} / 0:30`;
    const current = position >= 21 ? 3 : position >= 14 ? 2 : position >= 6 ? 1 : 0;
    if (captionIndex !== current) {
      document.querySelector("#chapter-caption-title").textContent = captions[current][0];
      document.querySelector("#chapter-caption-copy").textContent = captions[current][1];
      captionIndex = current;
    }
    chapters.forEach((button, index) => {
      if (index === current) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
  }
  function pause(announce = true) {
    playing = false;
    cancelAnimationFrame(frame);
    play.textContent = position >= duration ? "Replay" : "Play";
    play.setAttribute("aria-label", position >= duration ? "Replay walkthrough" : "Play walkthrough");
    if (announce) status.textContent = position >= duration ? "Finished. Replay, explore a chapter, or try the live playground." : "Paused. Use the slider or chapter buttons to explore.";
  }
  function tick(now) {
    if (!playing) return;
    position = Math.min(duration, position + (now - last) / 1000);
    last = now;
    paint();
    if (position >= duration) pause();
    else frame = requestAnimationFrame(tick);
  }
  function begin() {
    if (!adapter) return;
    if (position >= duration) position = 0;
    start.hidden = true;
    playing = true;
    play.textContent = "Pause";
    play.setAttribute("aria-label", "Pause walkthrough");
    status.textContent = reduce.checked ? "Playing with reduced motion. Silent, recorded examples." : "Playing. Silent, recorded examples.";
    last = performance.now();
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(tick);
  }
  function seek(value) {
    if (!adapter) return;
    pause(false);
    position = Math.max(0, Math.min(duration, value));
    start.hidden = true;
    paint();
    pause();
  }
  function connect() {
    try {
      adapter = film.contentWindow.walkthrough;
      if (!adapter || adapter.duration !== duration) throw new Error("Composition seek adapter is unavailable.");
      paint();
      play.disabled = replay.disabled = scrub.disabled = false;
      start.disabled = false;
      status.textContent = preference.matches ? "Ready. Reduced motion is on. Playback starts only when you choose." : "Ready when you are. Silent, recorded examples; not a live query.";
    } catch (error) {
      status.textContent = `Playback unavailable: ${error.message} Serve this directory over local HTTP; the text alternative is available below.`;
      start.hidden = true;
      play.disabled = replay.disabled = scrub.disabled = true;
      console.error("Walkthrough could not initialize", error);
    }
  }
  start.disabled = true;
  film.addEventListener("load", () => {
    pause(false);
    position = 0;
    start.hidden = false;
    connect();
  });
  if (film.contentDocument?.readyState === "complete" && film.contentDocument.URL !== "about:blank") connect();
  play.addEventListener("click", () => playing ? pause() : begin());
  start.addEventListener("click", begin);
  replay.addEventListener("click", () => { seek(0); begin(); });
  scrub.addEventListener("input", () => seek(Number(scrub.value)));
  // Paused chapter navigation lands after entrance motion, on a readable frame.
  chapters.forEach((button) => button.addEventListener("click", () => seek(Number(button.dataset.readAt))));
  reduce.addEventListener("change", () => { if (adapter) paint(); });
  preference.addEventListener("change", (event) => {
    reduce.checked = event.matches;
    if (adapter) paint();
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden && playing) pause(); });
  document.querySelector(".player").addEventListener("keydown", (event) => {
    if (event.target.matches("input,button") || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.code === "Space") { event.preventDefault(); playing ? pause() : begin(); }
  });
})();
