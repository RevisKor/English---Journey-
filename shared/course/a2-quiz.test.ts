import { describe, expect, it } from "vitest";
import { buildA2LessonQuiz, buildA2ModuleTest, buildA2ReadingChecks } from "./a2-quiz";

describe("A2 assessment definitions", () => {
  it("creates a balanced eight-question lesson quiz for every A2 lesson", () => {
    for (let lessonNumber = 1; lessonNumber <= 20; lessonNumber += 1) {
      const quiz = buildA2LessonQuiz(lessonNumber);
      expect(quiz).toHaveLength(8);
      expect(quiz.filter((question) => question.type === "meaning")).toHaveLength(5);
      expect(quiz.filter((question) => question.type === "spelling")).toHaveLength(2);
      expect(quiz.filter((question) => question.type === "grammar")).toHaveLength(1);
    }
  });

  it("creates a twenty-question module test and three reading checks", () => {
    for (let moduleNumber = 1; moduleNumber <= 4; moduleNumber += 1) {
      expect(buildA2ModuleTest(moduleNumber)).toHaveLength(20);
    }
    expect(buildA2ReadingChecks(1).map((check) => check.focus)).toEqual(["main_idea", "detail", "inference"]);
  });
});
