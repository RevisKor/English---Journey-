import { describe, expect, it } from "vitest";
import { A1_COURSE, A2_COURSE, B1_COURSE, B2_COURSE } from "./index";
import { buildAssessmentVariants } from "./assessment-questions";

const courses = [A1_COURSE, A2_COURSE, B1_COURSE, B2_COURSE];

describe("contextual assessment-bank quality", () => {
  it("uses only correctly spelled, previously learned vocabulary as contextual distractors", () => {
    for (const course of courses) {
      for (const lesson of course.lessons) {
        const knownWords = new Set(
          course.lessons
            .filter((item) => item.lessonNumber <= lesson.lessonNumber)
            .flatMap((item) => item.words.map((word) => word.word)),
        );
        const questions = buildAssessmentVariants(course, lesson);
        const vocabularyQuestions = questions.filter((question) => question.reviewItemType === "vocabulary");
        expect(vocabularyQuestions).toHaveLength(lesson.words.length);
        expect(vocabularyQuestions.every((question) => question.type === "context")).toBe(true);
        expect(new Set(vocabularyQuestions.map((question) => question.assessmentFocus))).toEqual(new Set(["meaning", "collocation", "retrieval"]));
        expect(vocabularyQuestions.every((question) => question.choices.length === 4)).toBe(true);
        expect(vocabularyQuestions.every((question) => new Set(question.choices).size === question.choices.length)).toBe(true);
        expect(vocabularyQuestions.every((question) => question.choices.every((choice) => knownWords.has(choice)))).toBe(true);
      }
    }
  });

  it("includes at least one grammar-in-context question for every lesson and never creates spelling-trap questions", () => {
    for (const course of courses) {
      for (const lesson of course.lessons) {
        const questions = buildAssessmentVariants(course, lesson);
        expect(questions.some((question) => question.reviewItemType === "grammar" && question.type === "grammar")).toBe(true);
        expect(questions.some((question) => question.type === "spelling")).toBe(false);
      }
    }
  });
});
