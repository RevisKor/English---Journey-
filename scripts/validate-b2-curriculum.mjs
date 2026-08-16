import { readFileSync } from "node:fs";

const lessons = JSON.parse(readFileSync(new URL("../shared/course/b2-draft.json", import.meta.url), "utf8"));
const arabic = /[\u0600-\u06FF]/;
const issues = [];
const seenTargets = new Set();

if (lessons.length !== 24) issues.push(`Expected 24 B2 lessons; received ${lessons.length}.`);

for (const [index, lesson] of lessons.entries()) {
  const number = index + 1;
  if (lesson.lessonNumber !== number) issues.push(`Expected lesson number ${number}; received ${lesson.lessonNumber}.`);
  if (Math.ceil(number / 6) < 1 || Math.ceil(number / 6) > 4) issues.push(`Lesson ${number} has an invalid module assignment.`);
  if (!lesson.title?.trim() || !arabic.test(lesson.titleArabic ?? "")) issues.push(`Lesson ${number} lacks bilingual title support.`);
  if (!lesson.outcome?.canDo || !arabic.test(lesson.outcome?.canDoArabic ?? "")) issues.push(`Lesson ${number} lacks a bilingual can-do outcome.`);
  if (!Array.isArray(lesson.retrieval) || lesson.retrieval.length < 3) issues.push(`Lesson ${number} lacks three cumulative retrieval targets.`);
  if (!Array.isArray(lesson.vocabulary) || lesson.vocabulary.length !== 12) issues.push(`Lesson ${number} must have exactly 12 targets.`);
  if (!lesson.network || lesson.network.relatedWords.length < 6 || lesson.network.chunks.length < 5 || lesson.network.collocations.length < 5 || lesson.network.wordFamilies.length < 3) issues.push(`Lesson ${number} does not meet lexical-network depth requirements.`);
  if (!lesson.grammar?.topic || !lesson.grammar?.structure || !arabic.test(lesson.grammar?.arabicName ?? "")) issues.push(`Lesson ${number} has incomplete bilingual grammar support.`);
  if (!/\b(350|400|450)\b/.test(lesson.readingBrief ?? "")) issues.push(`Lesson ${number} reading brief does not name the B2 length range.`);
  if (!/\b(200|260)\b/.test(lesson.writingPrompt ?? "")) issues.push(`Lesson ${number} writing prompt does not name the B2 length range.`);

  for (const item of lesson.vocabulary ?? []) {
    const normalized = item.word?.trim().toLowerCase();
    if (!normalized || !item.definition?.trim() || !item.exampleEN?.trim() || !arabic.test(item.arabic ?? "") || !arabic.test(item.exampleAR ?? "")) issues.push(`Lesson ${number} has incomplete bilingual target vocabulary.`);
    if (seenTargets.has(normalized)) issues.push(`Duplicate B2 vocabulary target: ${item.word}.`);
    seenTargets.add(normalized);
  }
}

if (issues.length) throw new Error(`B2 curriculum validation failed:\n${issues.join("\n")}`);
console.log(`B2 curriculum valid: ${lessons.length} lessons, ${seenTargets.size} unique bilingual target entries, and four six-lesson modules.`);
