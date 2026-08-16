import { describe, expect, it } from "vitest";
import { A1_COURSE, A2_COURSE, B1_COURSE, C2_COURSE } from "./index";
import { buildImmersiveModuleWordBank, buildModuleWordBank, summarizeWordBank } from "./word-bank";

describe("module word banks", () => {
  it("aggregates only the selected module and preserves lesson provenance", () => {
    const entries = buildModuleWordBank(A1_COURSE, 1, new Set([1]));
    expect(entries.length).toBeGreaterThan(0);
    expect(new Set(entries.map((entry) => entry.introducedLessonNumber))).toEqual(new Set(Array.from({ length: 15 }, (_, index) => index + 1)));
    expect(entries.filter((entry) => entry.introducedLessonNumber === 1).every((entry) => entry.familiarity === "recognized")).toBe(true);
    expect(entries.some((entry) => entry.introducedLessonNumber > 1 && entry.familiarity === "introduced")).toBe(true);
  });

  it("returns stable unique identifiers for module word-bank rows", () => {
    const entries = buildModuleWordBank(A1_COURSE, 1, new Set([1, 3, 6]));
    const renderedIdentities = entries.map((entry) => entry.id);

    expect(new Set(renderedIdentities).size).toBe(entries.length);
    expect(entries.every((entry) => entry.introducedLessonNumber >= 1 && entry.introducedLessonNumber <= 15)).toBe(true);
  });

  it("deduplicates lesson-scoped A2 retrieval vocabulary into one learner row per word", () => {
    const firstModuleLessons = A2_COURSE.lessons.filter((lesson) => lesson.moduleNumber === 1);
    const repeatedSourceWord = firstModuleLessons
      .flatMap((lesson) => lesson.words)
      .find((word, index, words) => words.findIndex((candidate) => candidate.word.toLowerCase() === word.word.toLowerCase() && candidate.partOfSpeech === word.partOfSpeech) !== index);

    expect(repeatedSourceWord).toBeDefined();
    const entries = buildModuleWordBank(A2_COURSE, 1, new Set([1, 2, 3]));
    const matchingEntries = entries.filter((entry) => entry.word.toLowerCase() === repeatedSourceWord!.word.toLowerCase() && entry.partOfSpeech === repeatedSourceWord!.partOfSpeech);

    expect(matchingEntries).toHaveLength(1);
    expect(matchingEntries[0].reviewCount).toBeGreaterThanOrEqual(1);
  });

  it("connects A1 Meeting People vocabulary to repeated immersive exposures", () => {
    const entries = buildImmersiveModuleWordBank(A1_COURSE, 1, new Set([1, 2]));
    expect(entries.length).toBeGreaterThan(0);
    expect(entries.every((entry) => entry.sourceLessonNumbers.length > 0 && entry.exposurePlan.length > 0)).toBe(true);
    expect(entries.some((entry) => entry.exposurePlan.some((exposure) => exposure.mode === "use"))).toBe(true);
  });

  it("returns no immersive overlay for levels without an authored blueprint", () => {
    expect(buildImmersiveModuleWordBank(C2_COURSE, 3, new Set())).toEqual([]);
  });

  it("scales across different authored module sizes and summarizes review state", () => {
    const b1Entries = buildModuleWordBank(B1_COURSE, 2, new Set([7]));
    const c2Entries = buildModuleWordBank(C2_COURSE, 3, new Set());
    expect(b1Entries.length).toBeGreaterThan(0);
    expect(c2Entries.length).toBeGreaterThan(0);
    expect(summarizeWordBank(c2Entries)).toMatchObject({ total: c2Entries.length, introduced: c2Entries.length, recognized: 0 });
  });
});
