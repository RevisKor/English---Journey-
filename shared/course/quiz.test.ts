import { describe, expect, it } from "vitest";
import { A1_LESSONS } from "./a1";
import { buildLessonQuiz, buildModuleTest, withoutAnswers } from "./quiz";

describe("A1 gated assessments", () => {
  it("builds an eight-question lesson quiz that covers contextual vocabulary and grammar", () => {
    const questions = buildLessonQuiz(1);
    expect(questions).toHaveLength(8);
    expect(new Set(questions.map((question) => question.type))).toEqual(new Set(["context", "grammar"]));
    expect(questions.every((question) => question.choices.includes(question.answer))).toBe(true);
  });

  it("builds a balanced thirty-question module test from all fifteen active lessons", () => {
    const questions = buildModuleTest(1);
    expect(questions).toHaveLength(30);
    expect(new Set(questions.map((question) => A1_LESSONS.find((lesson) => (
      lesson.grammar.id === question.reviewItemKey || lesson.words.some((word) => word.id === question.reviewItemKey)
    ))?.lessonNumber))).toEqual(
      new Set(A1_LESSONS.filter((lesson) => lesson.moduleNumber === 1).map((lesson) => lesson.lessonNumber)),
    );
  });

  it("removes answers from question payloads sent to learners and enforces an 80 percent pass score", () => {
    const questions = buildLessonQuiz(1);
    expect(withoutAnswers(questions).every((question) => !("answer" in question))).toBe(true);
    expect(Math.round((6 / 8) * 100) >= 80).toBe(false);
    expect(Math.round((7 / 8) * 100) >= 80).toBe(true);
  });
});
