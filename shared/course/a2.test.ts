import { describe, expect, it } from "vitest";
import { A2_COURSE, A2_LESSONS } from "./a2";

describe("A2 cumulative curriculum", () => {
  it("contains twenty complete lessons across four paced modules", () => {
    expect(A2_COURSE.totalLessons).toBe(20);
    expect(A2_LESSONS).toHaveLength(20);
    expect(A2_LESSONS.map((lesson) => lesson.moduleNumber)).toEqual([
      1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4,
    ]);
  });

  it("provides varied lexical networks and three hundred usable target entries", () => {
    const words = A2_LESSONS.flatMap((lesson) => lesson.words);
    const chunks = words.filter((word) => word.word.includes(" "));
    expect(words).toHaveLength(300);
    expect(chunks.length).toBeGreaterThanOrEqual(80);
    for (const word of words) {
      expect(word.arabic.trim().length).toBeGreaterThan(1);
      expect(word.definition.trim().split(/\s+/).length).toBeGreaterThanOrEqual(3);
      expect(word.exampleEN).toMatch(/[.!?]$/);
      expect(word.exampleAR).toMatch(/[\u0600-\u06FF]/);
    }
  });

  it("makes prior learning visible through a six-step, English-first learning journey", () => {
    for (const lesson of A2_LESSONS) {
      expect(lesson.learningPlan?.englishFirst).toBe(true);
      expect(lesson.learningPlan?.steps.map((step) => step.id)).toEqual(["start", "explore", "notice", "build", "respond", "prove"]);
      expect(lesson.learningPlan?.retrieval.length).toBeGreaterThanOrEqual(3);
      expect(lesson.learningPlan?.retrieval.every((item) => item.sourceLevel === "A1")).toBe(true);
      expect(lesson.lexicalNetworks).toHaveLength(1);
      expect(lesson.lexicalNetworks?.[0]?.chunks.length).toBeGreaterThanOrEqual(3);
      expect(lesson.practiceBrief?.readingBrief.length).toBeGreaterThan(70);
      expect(lesson.practiceBrief?.writingPrompt.length).toBeGreaterThan(70);
    }
  });
});
