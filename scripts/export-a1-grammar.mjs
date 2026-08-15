import fs from "node:fs/promises";
import path from "node:path";

const sourcePath = "/home/ubuntu/englishjourney_ref/English Journey/data/grammar.js";
const outputPath = "/home/ubuntu/english-journey/shared/course/a1-grammar.json";
const raw = await fs.readFile(sourcePath, "utf8");
const declaration = raw.indexOf("const GRAMMAR =");
const start = raw.indexOf("{", declaration);
const end = raw.indexOf("\n};", start) + 2;

if (declaration === -1 || start === -1 || end < 2) {
  throw new Error("Could not locate the supplied grammar object.");
}

const grammarJson = raw
  .slice(start, end)
  .replace(/([,{]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":');
const grammar = JSON.parse(grammarJson);
const a1 = grammar.A1.slice(0, 20).map((topic, index) => ({
  id: `a1-grammar-${String(index + 1).padStart(2, "0")}`,
  lessonNumber: index + 1,
  ...topic,
}));

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(a1, null, 2)}\n`, "utf8");
console.log(`Saved ${a1.length} A1 grammar topics to ${outputPath}`);
