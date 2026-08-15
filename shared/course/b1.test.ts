import { describe, expect, it } from "vitest";
import { B1_COURSE, B1_LESSONS } from "./b1";

describe("B1 cumulative curriculum", () => {
  it("contains twenty-four complete lessons across four six-lesson modules", () => {
    expect(B1_COURSE.totalLessons).toBe(24);
    expect(B1_COURSE.lessonsPerModule).toBe(6);
    expect(B1_LESSONS).toHaveLength(24);
    expect(B1_LESSONS.map((lesson) => lesson.moduleNumber)).toEqual([
      1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4,
    ]);
  });

  it("provides unique, bilingual language targets with lexical depth", () => {
    const words = B1_LESSONS.flatMap((lesson) => lesson.words);
    const uniqueTargets = new Set(words.map((word) => word.word.toLocaleLowerCase()));
    expect(words).toHaveLength(288);
    expect(uniqueTargets.size).toBe(words.length);

    for (const lesson of B1_LESSONS) {
      const network = lesson.lexicalNetworks?.[0];
      expect(lesson.words).toHaveLength(12);
      expect(lesson.words.every((word) => word.arabic.trim().length > 1 && word.exampleEN.trim().length > 10 && /[\u0600-\u06FF]/.test(word.exampleAR))).toBe(true);
      expect(network?.chunks.length).toBeGreaterThanOrEqual(3);
      expect(network?.collocations.length).toBeGreaterThanOrEqual(3);
      expect(network?.wordFamilies.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("uses A2 retrieval and the six-step route to build supported B1 responses", () => {
    for (const lesson of B1_LESSONS) {
      expect(lesson.learningPlan?.englishFirst).toBe(true);
      expect(lesson.learningPlan?.steps.map((step) => step.id)).toEqual(["start", "explore", "notice", "build", "respond", "prove"]);
      expect(lesson.learningPlan?.retrieval.length).toBeGreaterThanOrEqual(3);
      expect(lesson.learningPlan?.retrieval.every((item) => item.sourceLevel === "A2")).toBe(true);
      expect(lesson.practiceBrief?.readingBrief.length).toBeGreaterThan(70);
      expect(lesson.practiceBrief?.writingPrompt.length).toBeGreaterThan(70);
    }
  });
});
