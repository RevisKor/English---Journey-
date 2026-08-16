import fs from "node:fs/promises";
import path from "node:path";

const sourcePath = "/home/ubuntu/englishjourney_ref/English Journey/data/a1-words.js";
const outputPath = "/home/ubuntu/english-journey/shared/course/a1-vocabulary.json";
const offlineOnly = process.argv.includes("--offline");

const raw = await fs.readFile(sourcePath, "utf8");
const declaration = raw.indexOf("const A1_WORDS =");
const start = raw.indexOf("[", declaration);
const end = raw.indexOf("\n];", start) + 2;
if (declaration === -1 || start === -1 || end < 2) {
  throw new Error("Could not locate the supplied A1 word array.");
}

const sourceWords = JSON.parse(raw.slice(start, end));
const uniqueWords = [...new Map(sourceWords.map((word) => [word.word.toLowerCase(), word])).values()].slice(0, 500);

const normalizeIpa = (entry) => entry?.phonetics?.find((item) => item.text)?.text
  || entry?.phonetic
  || "";

async function enrich(item) {
  let ipa = "";
  if (!offlineOnly) {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(item.word)}`, {
        signal: AbortSignal.timeout(2_000),
      });
      if (response.ok) {
        const entries = await response.json();
        ipa = normalizeIpa(entries[0]);
      }
    } catch {
      // The supplied bilingual teaching data remains useful even where this public lookup has no entry.
    }
  }

  return {
    id: `a1-${item.word.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    word: item.word,
    arabic: item.arabic,
    ipa,
    phoneticRespelling: "",
    partOfSpeech: item.partOfSpeech,
    definition: item.definition,
    exampleEN: item.exampleEN,
    exampleAR: item.exampleAR,
  };
}

const result = [];
const concurrency = 20;
for (let index = 0; index < uniqueWords.length; index += concurrency) {
  const chunk = uniqueWords.slice(index, index + concurrency);
  result.push(...await Promise.all(chunk.map(enrich)));
  process.stdout.write(`Enriched ${Math.min(index + concurrency, uniqueWords.length)}/${uniqueWords.length}\n`);
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(`Saved ${result.length} vocabulary records to ${outputPath}`);
