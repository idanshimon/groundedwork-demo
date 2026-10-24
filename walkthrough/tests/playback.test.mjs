import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { execFileSync } from "node:child_process";
import { chromium, expect } from "@playwright/test";

const root = process.cwd();
const mime = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".png": "image/png" };
let server, browser, origin;
before(async () => {
  server = createServer(async (request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const path = resolve(root, `.${pathname.endsWith("/") ? `${pathname}index.html` : pathname}`);
    if (!path.startsWith(`${root}${sep}`)) { response.writeHead(403).end(); return; }
    try {
      const body = await readFile(path);
      response.writeHead(200, { "Content-Type": mime[extname(path)] || "application/octet-stream" }).end(body);
    } catch (error) {
      if (error.code !== "ENOENT") console.error(error);
      response.writeHead(error.code === "ENOENT" ? 404 : 500).end();
    }
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  origin = `http://127.0.0.1:${server.address().port}`;
  const executablePath = execFileSync("node_modules/.bin/hyperframes", ["browser", "path"], { encoding: "utf8" }).trim();
  browser = await chromium.launch({ executablePath, headless: true });
  await mkdir("evidence/browser", { recursive: true });
});
after(async () => {
  await browser?.close();
  if (server) await new Promise((done) => server.close(done));
});

async function open(options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1200 }, ...options });
  const errors = [], external = [];
  await context.route("**/*", async (route) => {
    if (new URL(route.request().url()).origin !== origin) {
      external.push(route.request().url());
      await route.abort();
    } else await route.continue();
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  page.on("requestfailed", (request) => errors.push(`Failed request: ${request.url()}`));
  await page.goto(origin);
  await expect(page.locator("#play")).toBeEnabled();
  const film = page.frames().find((frame) => frame.url().endsWith("/film/index.html"));
  assert.ok(film);
  return { context, page, film, errors, external };
}

async function scrub(page, seconds) {
  await page.locator("#scrub").fill(String(seconds));
  await page.locator("#scrub").dispatchEvent("input");
}

async function state(film) {
  return film.evaluate(() => {
    const timeline = window.__timelines["groundedwork-walkthrough"];
    return {
      time: timeline.time(), duration: timeline.duration(), paused: timeline.paused(),
      scenes: [...document.querySelectorAll(".scene")].filter((scene) => getComputedStyle(scene).visibility === "visible").map((scene) => scene.id),
      caveat: getComputedStyle(document.querySelector("#caveat")).visibility,
      takeaway: getComputedStyle(document.querySelector("#takeaway")).visibility,
      sourceOpacity: getComputedStyle(document.querySelector(".source-card")).opacity,
      sourceTransform: getComputedStyle(document.querySelector(".source-card")).transform,
      gsap: window.gsap.version,
    };
  });
}

test("paused finite HyperFrames composition; no autoplay or remote browser assets", async () => {
  const { context, page, film, errors, external } = await open();
  const initial = await state(film);
  assert.equal(initial.duration, 30);
  assert.equal(initial.gsap, "3.14.2");
  assert.equal(initial.paused, true);
  assert.equal(initial.time, 0);
  await page.waitForTimeout(200);
  assert.equal((await state(film)).time, 0);
  await expect(page.locator("#start")).toBeVisible();
  assert.equal(await page.locator("audio,video").count(), 0);
  assert.equal(await film.locator("audio,video").count(), 0);
  assert.equal(await page.locator(".back-link").getAttribute("href"), "../");
  await page.screenshot({ path: "evidence/browser/desktop-shell.png", fullPage: true });
  assert.deepEqual(errors, []);
  assert.deepEqual(external, []);
  await context.close();
});

test("seeks forward and backward through every chapter, including exact boundaries and end", async () => {
  const { context, page, film, errors } = await open();
  for (const [seconds, scene] of [
    [3, "pipeline"], [10, "matched"], [17, "abstain"], [23, "boundary"],
    [28, "boundary"], [10, "matched"], [3, "pipeline"], [23, "boundary"],
    [17, "abstain"], [0, "pipeline"], [6, "matched"], [14, "abstain"],
    [21, "boundary"], [30, "boundary"], [10, "matched"],
  ]) {
    await scrub(page, seconds);
    const current = await state(film);
    assert.equal(current.time, seconds);
    assert.equal(current.paused, true);
    assert.deepEqual(current.scenes, [scene], `one visible scene at ${seconds}s`);
    if (seconds === 28 || seconds === 30) assert.equal(current.takeaway, "visible");
    if (seconds === 23) {
      assert.equal(current.caveat, "visible");
      assert.equal(current.takeaway, "hidden");
    }
    if (seconds === 10) assert.equal(current.sourceOpacity, "1");
  }
  assert.equal(await film.locator("#refund-score").textContent(), "3.8605");
  assert.equal(await film.locator("#wrong-score").textContent(), "2.9429");
  const recording = JSON.parse(await readFile("evidence/recording.json", "utf8"));
  assert.equal(await film.locator("#refund-extract").textContent(), recording.results[0].hits[0].body);
  assert.equal(recording.results[1].grounded, false);
  assert.deepEqual(recording.results[1].hits, []);
  assert.equal(recording.results[2].grounded, true);
  assert.equal(recording.results[2].hits[0].id, "pause");
  const visual = () => film.evaluate(() => [...document.querySelectorAll("#matched, #matched .drift, #refund-bar")].map((element) => {
    const style = getComputedStyle(element);
    return { opacity: style.opacity, visibility: style.visibility, transform: style.transform };
  }));
  const forward = await visual();
  await scrub(page, 28);
  await scrub(page, 10);
  assert.deepEqual(await visual(), forward, "repeated absolute seeks reproduce identical visual properties");
  assert.deepEqual(errors, []);
  await context.close();
});

test("play, pause, replay, finite end and reload", async () => {
  const { context, page, film, errors } = await open();
  await page.clock.install();
  await page.locator("#start").click();
  await page.clock.runFor(1600);
  assert.ok((await state(film)).time > 1.4);
  await page.locator("#play").click();
  const paused = (await state(film)).time;
  await page.clock.runFor(1200);
  assert.equal((await state(film)).time, paused);
  await page.locator("#replay").click();
  await page.clock.runFor(350);
  assert.ok((await state(film)).time < 0.5);
  await page.clock.runFor(31000);
  assert.equal((await state(film)).time, 30);
  await expect(page.locator("#play")).toHaveText("Replay");
  await page.locator("#play").click();
  await page.clock.runFor(200);
  assert.ok((await state(film)).time < 0.4);
  await page.reload();
  await expect(page.locator("#start")).toBeVisible();
  const reloadedFilm = page.frames().find((frame) => frame.url().endsWith("/film/index.html"));
  assert.equal((await state(reloadedFilm)).time, 0);
  await expect(page.locator("#play")).toHaveText("Play");
  assert.deepEqual(errors, []);
  await context.close();
});

test("keyboard controls, reduced motion, narrow viewport and accessible text alternative", async () => {
  const { context, page, film, errors, external } = await open({
    reducedMotion: "reduce", viewport: { width: 390, height: 844 },
  });
  await expect(page.locator("#reduce")).toBeChecked();
  await page.locator("[data-seek='14']").focus();
  await page.keyboard.press("Enter");
  assert.equal((await state(film)).time, 16);
  await page.locator("#scrub").focus();
  await page.keyboard.press("End");
  assert.equal((await state(film)).time, 30);
  await page.keyboard.press("Home");
  assert.equal((await state(film)).time, 0);
  await page.keyboard.press("ArrowRight");
  assert.ok((await state(film)).time > 0);
  await scrub(page, 7.4);
  assert.equal((await state(film)).sourceTransform, "none");
  assert.equal(await film.locator("html").getAttribute("data-reduced-motion"), "true");
  const bounds = await page.locator(".screen").boundingBox();
  assert.ok(Math.abs(bounds.width / bounds.height - 16 / 9) < 0.02);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await scrub(page, 10);
  await expect(page.locator("#chapter-caption-copy")).toContainText("3.8605");
  await scrub(page, 23);
  await expect(page.locator("#chapter-caption-copy")).toContainText("incorrectly retrieves");
  assert.ok(await page.locator("#chapter-caption-copy").evaluate(el => parseFloat(getComputedStyle(el).fontSize) >= 16));
  for (const selector of ["#play", "#replay", "#scrub", ".motion-option", "[data-seek='21']"]) {
    assert.ok((await page.locator(selector).boundingBox()).height >= 44, `${selector} must have a 44px touch target`);
  }
  await page.screenshot({ path: "evidence/browser/mobile-shell.png", fullPage: true });
  await page.locator("summary").click();
  await expect(page.locator(".transcript-body")).toBeVisible();
  assert.deepEqual(errors, []);
  assert.deepEqual(external, []);
  await context.close();
});

test("seek rejects nonfinite input and clamps finite input", async () => {
  const { context, film } = await open();
  const invalid = await film.evaluate(() => {
    try { window.walkthrough.seek(NaN); return "did not reject"; }
    catch (error) { return error.message; }
  });
  assert.equal(invalid, "Seek time must be finite");
  await film.evaluate(() => window.walkthrough.seek(-100));
  assert.equal((await state(film)).time, 0);
  await film.evaluate(() => window.walkthrough.seek(999));
  assert.equal((await state(film)).time, 30);
  await context.close();
});
