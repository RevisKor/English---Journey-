import { describe, expect, it } from "vitest";
import { C2_COURSE, C2_LESSONS } from "./c2";

describe("C2 precision and mediation curriculum", () => {
  it("contains 180 complete lessons across twelve fifteen-lesson modules", () => {
    expect(C2_COURSE.totalLessons).toBe(180);
    expect(C2_COURSE.lessonsPerModule).toBe(15);
    expect(C2_LESSONS).toHaveLength(180);
    expect(C2_LESSONS.map((lesson) => lesson.moduleNumber)).toEqual(Array.from({ length: 180 }, (_, index) => Math.floor(index / 15) + 1));
  });

  it("provides bilingual vocabulary, lexical networks, and advanced grammar for every lesson", () => {
    const words = C2_LESSONS.flatMap((lesson) => lesson.words);
    expect(words).toHaveLength(1080);
    expect(new Set(words.map((word) => word.word.toLocaleLowerCase())).size).toBeGreaterThan(5);
    for (const lesson of C2_LESSONS) {
      const network = lesson.lexicalNetworks?.[0];
      expect(lesson.words).toHaveLength(6);
      expect(lesson.words.every((word) => word.arabic.trim().length > 1 && word.exampleEN.trim().length > 10 && /[\u0600-\u06FF]/.test(word.exampleAR))).toBe(true);
      expect(network?.chunks.length).toBeGreaterThanOrEqual(3);
      expect(network?.collocations.length).toBeGreaterThanOrEqual(3);
      expect(network?.relatedWords.length).toBeGreaterThanOrEqual(3);
      expect(lesson.grammar.topic.length).toBeGreaterThan(5);
    }
  });

  it("uses C1 retrieval and six-step mediation and independent-judgement routes", () => {
    for (const lesson of C2_LESSONS) {
      expect(lesson.learningPlan?.englishFirst).toBe(true);
      expect(lesson.learningPlan?.steps.map((step) => step.id)).toEqual(["start", "explore", "notice", "build", "respond", "prove"]);
      expect(lesson.learningPlan?.retrieval.every((item) => item.sourceLevel === "C1")).toBe(true);
      expect(lesson.practiceBrief?.readingBrief.length).toBeGreaterThan(100);
      expect(lesson.practiceBrief?.writingPrompt.length).toBeGreaterThan(100);
    }
    expect(C2_LESSONS.at(-1)?.title).toMatch(/Extension|studio/i);
  });
});
