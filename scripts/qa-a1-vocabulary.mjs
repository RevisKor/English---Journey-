import fs from "node:fs/promises";

const vocabularyPath = "/home/ubuntu/english-journey/shared/course/a1-vocabulary.json";
const genericDefinition = "A basic English word describing a person, object, quality, or action.";

const arpabetToHint = {
  AA: "ah", AE: "a", AH: "uh", AO: "aw", AW: "ow", AY: "eye", B: "b", CH: "ch", D: "d", DH: "th", EH: "e", ER: "er", EY: "ay", F: "f", G: "g", HH: "h", IH: "i", IY: "ee", JH: "j", K: "k", L: "l", M: "m", N: "n", NG: "ng", OW: "oh", OY: "oy", P: "p", R: "r", S: "s", SH: "sh", T: "t", TH: "th", UH: "oo", UW: "oo", V: "v", W: "w", Y: "y", Z: "z", ZH: "zh",
};

function ipaToHint(ipa) {
  const stripped = ipa.replace(/[\/ˈˌ]/g, "");
  return stripped
    .replace(/tʃ/g, "ch").replace(/dʒ/g, "j").replace(/ʃ/g, "sh").replace(/ʒ/g, "zh")
    .replace(/θ/g, "th").replace(/ð/g, "th").replace(/ŋ/g, "ng").replace(/aɪ/g, "eye")
    .replace(/aʊ/g, "ow").replace(/eɪ/g, "ay").replace(/oʊ|əʊ/g, "oh").replace(/ɔɪ/g, "oy")
    .replace(/i/g, "ee").replace(/ɪ/g, "i").replace(/ɛ/g, "e").replace(/æ/g, "a")
    .replace(/ʌ|ə/g, "uh").replace(/ɑ|ɒ/g, "ah").replace(/ɔ/g, "aw").replace(/ɜ/g, "er")
    .replace(/ʊ|u/g, "oo").replace(/ɡ/g, "g").replace(/r/g, "r").replace(/[^a-z]/gi, "");
}

const vocabulary = JSON.parse(await fs.readFile(vocabularyPath, "utf8"));
const targets = vocabulary.filter((item) => item.definition === genericDefinition);
let updatedDefinitions = 0;

async function getDefinition(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      signal: AbortSignal.timeout(2_000),
    });
    if (!response.ok) return "";
    const entries = await response.json();
    const definition = entries.flatMap((entry) => entry.meanings ?? []).flatMap((meaning) => meaning.definitions ?? []).map((item) => item.definition).find(Boolean);
    return definition?.replace(/\s+/g, " ").trim() ?? "";
  } catch {
    return "";
  }
}

const concurrency = 40;
for (let start = 0; start < targets.length; start += concurrency) {
  const chunk = targets.slice(start, start + concurrency);
  const definitions = await Promise.all(chunk.map(async (item) => [item, await getDefinition(item.word)]));
  for (const [item, definition] of definitions) {
    if (definition) {
      item.definition = definition;
      updatedDefinitions += 1;
    }
  }
  process.stdout.write(`Reviewed ${Math.min(start + concurrency, targets.length)}/${targets.length} generic definitions\n`);
}

for (const item of vocabulary) {
  if (!item.phoneticRespelling && item.ipa) item.phoneticRespelling = ipaToHint(item.ipa);
}

await fs.writeFile(vocabularyPath, `${JSON.stringify(vocabulary, null, 2)}\n`, "utf8");
console.log(`Replaced ${updatedDefinitions}/${targets.length} generic definitions and populated phonetic respellings.`);
