import { copyFile, mkdir } from "node:fs/promises";

await mkdir("film/assets/vendor", { recursive: true });
await copyFile("node_modules/gsap/dist/gsap.min.js", "film/assets/vendor/gsap.min.js");
await copyFile("node_modules/gsap/README.md", "film/assets/vendor/GSAP-NOTICE.md");
console.log("Vendored unmodified GSAP 3.14.2 and its upstream README/license notice.");
