import { describe, expect, it } from "vitest";
import { A1_COURSE, A1_LESSONS, A1_VOCABULARY } from "./a1";
import { buildAssessmentVariants } from "./assessment-questions";

describe("concrete everyday-domain curriculum coverage", () => {
  it("includes animal, profession, and everyday-life anchors in the beginner course", () => {
    const titles = A1_LESSONS.map((lesson) => lesson.title.toLocaleLowerCase()).join(" ");
    const words = A1_VOCABULARY.map((word) => word.word.toLocaleLowerCase());
    expect(titles).toContain("nature");
    expect(titles).toContain("study & work");
    expect(words).toEqual(expect.arrayContaining(["cat", "doctor", "job", "restaurant", "travel"]));
  });

  it("carries those domains into contextual question banks rather than spelling traps", () => {
    const domainLessons = A1_LESSONS.filter((lesson) => /food|travel|study|work|nature/i.test(lesson.title));
    const questions = domainLessons.flatMap((lesson) => buildAssessmentVariants(A1_COURSE, lesson));
    expect(questions.length).toBeGreaterThan(20);
    expect(questions.filter((question) => question.reviewItemType === "vocabulary").every((question) => ["meaning", "context"].includes(question.type))).toBe(true);
    expect(questions.some((question) => question.reviewItemType === "grammar" && question.type === "grammar")).toBe(true);
    expect(questions.every((question) => question.choices.every((choice) => choice.trim().length > 0))).toBe(true);
  });
});
