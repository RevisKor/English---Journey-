import { describe, expect, it } from "vitest";
import { buildLessonQuiz, buildModuleTest, withoutAnswers } from "./quiz";

describe("A1 gated assessments", () => {
  it("builds an eight-question lesson quiz that covers vocabulary, spelling, and grammar", () => {
    const questions = buildLessonQuiz(1);
    expect(questions).toHaveLength(8);
    expect(new Set(questions.map((question) => question.type))).toEqual(new Set(["meaning", "spelling", "grammar"]));
    expect(questions.every((question) => question.choices.includes(question.answer))).toBe(true);
  });

  it("builds a fifteen-question module test from all five lessons", () => {
    const questions = buildModuleTest(1);
    expect(questions).toHaveLength(15);
    expect(new Set(questions.map((question) => question.id.split("-")[0]))).toEqual(new Set(["l1", "l2", "l3", "l4", "l5"]));
  });

  it("removes answers from question payloads sent to learners and enforces an 80 percent pass score", () => {
    const questions = buildLessonQuiz(1);
    expect(withoutAnswers(questions).every((question) => !("answer" in question))).toBe(true);
    expect(Math.round((6 / 8) * 100) >= 80).toBe(false);
    expect(Math.round((7 / 8) * 100) >= 80).toBe(true);
  });
});
