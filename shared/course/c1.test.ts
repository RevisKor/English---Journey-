import { describe, expect, it } from "vitest";
import { C1_COURSE, C1_LESSONS } from "./c1";

 describe("C1 nuance and evidence curriculum", () => {
  it("contains twenty complete lessons across four five-lesson modules", () => {
    expect(C1_COURSE.totalLessons).toBe(20);
    expect(C1_COURSE.lessonsPerModule).toBe(5);
    expect(C1_LESSONS).toHaveLength(20);
    expect(C1_LESSONS.map((lesson) => lesson.moduleNumber)).toEqual([
      1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4,
    ]);
  });

  it("provides unique bilingual vocabulary with lexical networks and C1 grammar", () => {
    const words = C1_LESSONS.flatMap((lesson) => lesson.words);
    const uniqueTargets = new Set(words.map((word) => word.word.toLocaleLowerCase()));
    expect(words).toHaveLength(240);
    expect(uniqueTargets.size).toBeGreaterThan(180);

    for (const lesson of C1_LESSONS) {
      const network = lesson.lexicalNetworks?.[0];
      expect(lesson.words).toHaveLength(12);
      expect(lesson.words.every((word) => word.arabic.trim().length > 1 && word.exampleEN.trim().length > 10 && /[\u0600-\u06FF]/.test(word.exampleAR))).toBe(true);
      expect(network?.chunks.length).toBeGreaterThanOrEqual(3);
      expect(network?.collocations.length).toBeGreaterThanOrEqual(3);
      expect(network?.wordFamilies.length).toBeGreaterThanOrEqual(2);
      expect(lesson.grammar.topic.length).toBeGreaterThan(5);
    }
  });

  it("uses B2 retrieval and six-step source-aware performance routes", () => {
    for (const lesson of C1_LESSONS) {
      expect(lesson.learningPlan?.englishFirst).toBe(true);
      expect(lesson.learningPlan?.steps.map((step) => step.id)).toEqual(["start", "explore", "notice", "build", "respond", "prove"]);
      expect(lesson.learningPlan?.retrieval.length).toBeGreaterThanOrEqual(3);
      expect(lesson.learningPlan?.retrieval.every((item) => item.sourceLevel === "B2")).toBe(true);
      expect(lesson.practiceBrief?.readingBrief.length).toBeGreaterThan(90);
      expect(lesson.practiceBrief?.writingPrompt.length).toBeGreaterThan(90);
    }
  });
});
