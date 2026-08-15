import { describe, expect, it } from "vitest";
import { A1_COURSE, A1_GRAMMAR, A1_LESSONS, A1_VOCABULARY } from "./a1";

const genericDefinition = "A basic English word describing a person, object, quality, or action.";

describe("A1 curriculum", () => {
  it("provides 20 complete, five-lesson-module course units", () => {
    expect(A1_COURSE.totalLessons).toBe(20);
    expect(A1_LESSONS).toHaveLength(20);
    expect(A1_LESSONS.every((lesson) => lesson.words.length === 25)).toBe(true);
    expect(A1_LESSONS.map((lesson) => lesson.moduleNumber)).toEqual([
      1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4,
    ]);
  });

  it("contains 500 unique bilingual vocabulary records with IPA", () => {
    expect(A1_VOCABULARY).toHaveLength(500);
    expect(new Set(A1_VOCABULARY.map((word) => word.word.toLowerCase())).size).toBe(500);
    expect(A1_VOCABULARY.every((word) => word.arabic && word.ipa && word.phoneticRespelling && word.definition && word.definition !== genericDefinition && word.exampleEN && word.exampleAR)).toBe(true);
  });

  it("assigns one bilingual grammar topic to every lesson", () => {
    expect(A1_GRAMMAR).toHaveLength(20);
    expect(A1_LESSONS.every((lesson) => Boolean(lesson.grammar?.topic && lesson.grammar?.arabicName))).toBe(true);
  });
});
