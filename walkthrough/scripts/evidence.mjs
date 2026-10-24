import { readFile, writeFile, mkdir } from "node:fs/promises";

const source = process.argv[2] || "evidence/recording.json";
const baseline = JSON.parse(await readFile(source, "utf8"));
const queries = [
  "How do I get a refund?",
  "What is the capital of France?",
  "when does it show up at my door?",
];
if (baseline.version !== "0.1.0") throw new Error("Expected deployed engine 0.1.0 recording");
const results = queries.map((query) => {
  const result = baseline.results.find((entry) => entry.query === query);
  if (!result) throw new Error(`Recording missing query: ${query}`);
  const { terms, floor, scored, grounded, hits, corpus_size } = result;
  return { query, terms, floor, scored, grounded, hits, corpus_size };
});
const recording = {
  provenance: "Recorded example · Nimbus sample documents",
  version: baseline.version,
  config: baseline.config,
  results,
};
await mkdir("evidence", { recursive: true });
await mkdir("film", { recursive: true });
await writeFile("evidence/recording.json", `${JSON.stringify(recording, null, 2)}\n`);
await writeFile("film/recording.js", `window.RECORDING = ${JSON.stringify(recording, null, 2)};\n`);
console.log(`Validated and generated ${results.length} recorded cases; no engine execution or LLM call.`);
