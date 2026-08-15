import { readFileSync } from "node:fs";

const vocabulary = JSON.parse(readFileSync(new URL("../shared/course/a1-vocabulary.json", import.meta.url), "utf8"));
const grammar = JSON.parse(readFileSync(new URL("../shared/course/a1-grammar.json", import.meta.url), "utf8"));
const arabic = /[\u0600-\u06FF]/;
const requiredWordFields = ["id", "word", "arabic", "ipa", "phoneticRespelling", "partOfSpeech", "definition", "exampleEN", "exampleAR"];
const requiredGrammarFields = ["id", "lessonNumber", "topic", "arabicName", "concept", "arabicComparison", "useWhen", "doNotUseWhen", "commonMistakes", "structure", "examples", "practice"];
const issues = [];

if (vocabulary.length !== 500) issues.push(`Expected 500 vocabulary items; received ${vocabulary.length}.`);
if (grammar.length !== 20) issues.push(`Expected 20 grammar topics; received ${grammar.length}.`);
const seenWords = new Set();

vocabulary.forEach((item, index) => {
  requiredWordFields.forEach((field) => {
    if (!String(item[field] ?? "").trim()) issues.push(`Word ${index + 1} (${item.word || "unknown"}) is missing ${field}.`);
  });
  if (!arabic.test(item.arabic ?? "") || !arabic.test(item.exampleAR ?? "")) issues.push(`Word ${index + 1} is missing Arabic learner support.`);
  if (!/^\/.+\/$/.test(item.ipa ?? "")) issues.push(`Word ${index + 1} has an invalid IPA transcription.`);
  if (seenWords.has(item.word.toLowerCase())) issues.push(`Duplicate vocabulary word: ${item.word}.`);
  seenWords.add(item.word.toLowerCase());
});

grammar.forEach((topic, index) => {
  requiredGrammarFields.forEach((field) => {
    const value = topic[field];
    if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) issues.push(`Grammar topic ${index + 1} is missing ${field}.`);
  });
  if (!arabic.test(topic.arabicName ?? "") || !arabic.test(topic.arabicComparison ?? "")) issues.push(`Grammar topic ${index + 1} is missing Arabic guidance.`);
  if (!Array.isArray(topic.examples) || topic.examples.some((example) => !example.en || !example.ar)) issues.push(`Grammar topic ${index + 1} has incomplete bilingual examples.`);
});

if (issues.length) throw new Error(`A1 curriculum validation failed:\n${issues.join("\n")}`);
console.log(`A1 curriculum valid: ${vocabulary.length} bilingual vocabulary records and ${grammar.length} bilingual grammar topics.`);
