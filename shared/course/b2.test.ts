import { describe, expect, it } from "vitest";
import { B2_COURSE, B2_LESSONS } from "./b2";

describe("B2 evidence and influence curriculum", () => {
  it("contains 150 complete lessons across ten fifteen-lesson modules", () => {
    expect(B2_COURSE.totalLessons).toBe(150);
    expect(B2_COURSE.lessonsPerModule).toBe(15);
    expect(B2_LESSONS).toHaveLength(150);
    expect(B2_LESSONS.map((lesson) => lesson.moduleNumber)).toEqual(Array.from({ length: 150 }, (_, index) => Math.floor(index / 15) + 1));
  });

  it("provides unique bilingual targets with register-aware lexical networks", () => {
    const words = B2_LESSONS.flatMap((lesson) => lesson.words);
    const uniqueTargets = new Set(words.map((word) => word.word.toLocaleLowerCase()));
    expect(words).toHaveLength(1800);
    expect(uniqueTargets.size).toBeGreaterThan(200);

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

  it("authors Module 1 as varied bilingual evidence-and-judgement journeys rather than retaining generated fallback activities", () => {
    const moduleOne = B2_LESSONS.slice(0, 15);
    expect(moduleOne.every((lesson) => lesson.experience && lesson.activities.length > 0)).toBe(true);
    expect(new Set(moduleOne.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(7);
    expect(B2_LESSONS[0].activities.some((activity) => activity.title === "Read information under pressure")).toBe(true);
    expect(B2_LESSONS[8].activities.some((activity) => activity.title === "Build the case for change" && activity.kind === "writing")).toBe(true);
    expect(B2_LESSONS[11].activities.some((activity) => activity.title === "Negotiate a fair compromise")).toBe(true);
    expect(B2_LESSONS[14].activities.some((activity) => activity.kind === "assessment")).toBe(true);
    expect(B2_LESSONS[15].experience).toBeUndefined();
  });
});
