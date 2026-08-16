import { describe, expect, it } from "vitest";
import { buildC2LessonQuiz, buildC2ModuleTest } from "./c2-quiz";

describe("C2 contextual assessment builders", () => {
  it("builds a mixed lesson quiz with vocabulary and grammar coverage", () => {
    const quiz = buildC2LessonQuiz(1);
    expect(quiz.length).toBeGreaterThanOrEqual(6);
    expect(quiz.some((question) => question.reviewItemType === "vocabulary")).toBe(true);
    expect(quiz.some((question) => question.reviewItemType === "grammar")).toBe(true);
    expect(quiz.every((question) => question.prompt.trim().length > 20)).toBe(true);
  });

  it("builds a larger cumulative module test for each C2 module", () => {
    for (const moduleNumber of [1, 2, 3, 4]) {
      const test = buildC2ModuleTest(moduleNumber);
      expect(test.length).toBeGreaterThanOrEqual(12);
      expect(test.some((question) => question.reviewItemType === "vocabulary")).toBe(true);
      expect(test.some((question) => question.reviewItemType === "grammar")).toBe(true);
    }
  });
});
