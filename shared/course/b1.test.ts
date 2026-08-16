import { describe, expect, it } from "vitest";
import { B1_COURSE, B1_LESSONS } from "./b1";

describe("B1 cumulative curriculum", () => {
  it("contains 150 complete lessons across ten fifteen-lesson modules", () => {
    expect(B1_COURSE.totalLessons).toBe(150);
    expect(B1_COURSE.lessonsPerModule).toBe(15);
    expect(B1_LESSONS).toHaveLength(150);
    expect(B1_COURSE.modules).toHaveLength(10);
    expect(B1_LESSONS.map((lesson) => lesson.moduleNumber)).toEqual(
      Array.from({ length: 10 }, (_, moduleIndex) => Array.from({ length: 15 }, () => moduleIndex + 1)).flat(),
    );
    expect(B1_COURSE.modules.every((module) => module.lessonNumbers.length === 15)).toBe(true);
  });

  it("provides bilingual language targets with lexical depth and lesson-scoped identity", () => {
    const words = B1_LESSONS.flatMap((lesson) => lesson.words);
    expect(words).toHaveLength(1800);
    expect(new Set(words.map((word) => word.id)).size).toBe(words.length);

    for (const lesson of B1_LESSONS) {
      const network = lesson.lexicalNetworks?.[0];
      expect(lesson.words).toHaveLength(12);
      expect(lesson.words.every((word) => word.arabic.trim().length > 1 && word.exampleEN.trim().length > 10 && /[\u0600-\u06FF]/.test(word.exampleAR))).toBe(true);
      expect(network?.chunks.length).toBeGreaterThanOrEqual(3);
      expect(network?.collocations.length).toBeGreaterThanOrEqual(3);
      expect(network?.wordFamilies.length).toBeGreaterThanOrEqual(2);
      expect(network?.learningNoteArabic).toMatch(/[\u0600-\u06FF]/);
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

  it("increases communicative demand across the B1 sequence", () => {
    const first = B1_LESSONS[0];
    const final = B1_LESSONS.at(-1)!;
    expect(final.lessonNumber).toBe(150);
    expect(final.practiceBrief?.writingPrompt).toContain("160–220");
    expect(final.learningPlan?.outcome.canDo).toContain("future pathways");
    expect(first.learningPlan?.retrieval.every((item) => item.sourceLevel === "A2")).toBe(true);
  });
});
