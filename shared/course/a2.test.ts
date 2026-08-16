import { describe, expect, it } from "vitest";
import { A2_COURSE, A2_LESSONS } from "./a2";

describe("A2 cumulative curriculum", () => {
  it("contains 135 globally ordered lessons across nine fifteen-lesson modules", () => {
    expect(A2_COURSE.totalLessons).toBe(135);
    expect(A2_COURSE.lessonsPerModule).toBe(15);
    expect(A2_LESSONS).toHaveLength(135);
    expect(A2_LESSONS.map((lesson) => lesson.lessonNumber)).toEqual(Array.from({ length: 135 }, (_, index) => index + 1));
    expect(A2_COURSE.modules).toHaveLength(9);
    for (let moduleNumber = 1; moduleNumber <= 9; moduleNumber += 1) {
      expect(A2_LESSONS.filter((lesson) => lesson.moduleNumber === moduleNumber)).toHaveLength(15);
    }
  });

  it("provides bilingual lexical networks with repeated exposure across the expanded journey", () => {
    const words = A2_LESSONS.flatMap((lesson) => lesson.words);
    expect(words.length).toBeGreaterThanOrEqual(900);
    expect(new Set(A2_LESSONS.map((lesson) => lesson.title)).size).toBe(135);
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
      expect(lesson.activities?.some((activity) => activity.kind === lesson.lessonType)).toBe(true);
    }
  });
});
