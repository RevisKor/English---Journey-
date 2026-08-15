import { describe, expect, it } from "vitest";
import { B2_COURSE, B2_LESSONS } from "./b2";

describe("B2 evidence and influence curriculum", () => {
  it("contains twenty-four complete lessons across four six-lesson modules", () => {
    expect(B2_COURSE.totalLessons).toBe(24);
    expect(B2_COURSE.lessonsPerModule).toBe(6);
    expect(B2_LESSONS).toHaveLength(24);
    expect(B2_LESSONS.map((lesson) => lesson.moduleNumber)).toEqual([
      1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4,
    ]);
  });

  it("provides unique bilingual targets with register-aware lexical networks", () => {
    const words = B2_LESSONS.flatMap((lesson) => lesson.words);
    const uniqueTargets = new Set(words.map((word) => word.word.toLocaleLowerCase()));
    expect(words).toHaveLength(288);
    expect(uniqueTargets.size).toBe(words.length);

    for (const lesson of B2_LESSONS) {
      const network = lesson.lexicalNetworks?.[0];
      expect(lesson.words).toHaveLength(12);
      expect(lesson.words.every((word) => word.arabic.trim().length > 1 && word.exampleEN.trim().length > 10 && /[\u0600-\u06FF]/.test(word.exampleAR))).toBe(true);
      expect(network?.chunks.length).toBeGreaterThanOrEqual(3);
      expect(network?.collocations.length).toBeGreaterThanOrEqual(3);
      expect(network?.wordFamilies.length).toBeGreaterThanOrEqual(2);
      expect(network?.register).toMatch(/neutral|informal|formal|mixed/);
    }
  });

  it("uses B1 retrieval and six-step evidence-based performance routes", () => {
    for (const lesson of B2_LESSONS) {
      expect(lesson.learningPlan?.englishFirst).toBe(true);
      expect(lesson.learningPlan?.steps.map((step) => step.id)).toEqual(["start", "explore", "notice", "build", "respond", "prove"]);
      expect(lesson.learningPlan?.retrieval.length).toBeGreaterThanOrEqual(3);
      expect(lesson.learningPlan?.retrieval.every((item) => item.sourceLevel === "B1")).toBe(true);
      expect(lesson.practiceBrief?.readingBrief.length).toBeGreaterThan(90);
      expect(lesson.practiceBrief?.writingPrompt.length).toBeGreaterThan(90);
    }
  });
});
