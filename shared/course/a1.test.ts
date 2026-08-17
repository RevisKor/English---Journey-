import { describe, expect, it } from "vitest";
import { A1_COURSE, A1_GRAMMAR, A1_LESSONS, A1_VOCABULARY } from "./a1";

const genericDefinition = "A basic English word describing a person, object, quality, or action.";

describe("A1 curriculum", () => {
  it("keeps a coherent beginner-domain progression with Arabic scaffolding", () => {
    expect(A1_LESSONS.map((lesson) => lesson.moduleNumber).filter((module, index, all) => all.indexOf(module) === index)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(A1_LESSONS.every((lesson) => lesson.words.length >= 5 && lesson.domainFocusArabic && lesson.beginnerScaffold && lesson.beginnerScaffoldArabic)).toBe(true);
    expect(A1_LESSONS[0].beginnerScaffold).toContain("sentence");
    expect(A1_LESSONS.at(-1)?.beginnerScaffoldArabic).toBeTruthy();
  });

  it("provides six complete fifteen-lesson immersive module journeys", () => {
    expect(A1_COURSE.totalLessons).toBe(90);
    expect(A1_COURSE.lessonsPerModule).toBe(15);
    expect(A1_LESSONS).toHaveLength(90);
    expect(A1_COURSE.modules).toHaveLength(6);
    expect(A1_COURSE.modules?.every((module) => module.lessonNumbers.length === 15)).toBe(true);
    expect(A1_LESSONS.map((lesson) => lesson.moduleNumber)).toEqual(Array.from({ length: 90 }, (_, index) => Math.floor(index / 15) + 1));
  });

  it("contains 500 unique bilingual vocabulary records with IPA", () => {
    expect(A1_VOCABULARY).toHaveLength(500);
    expect(new Set(A1_VOCABULARY.map((word) => word.word.toLowerCase())).size).toBe(500);
    expect(A1_VOCABULARY.every((word) => word.arabic && word.ipa && word.phoneticRespelling && word.definition && word.definition !== genericDefinition && word.exampleEN && word.exampleAR)).toBe(true);
  });

  it("uses a globally unique persistence identity for every repeated lesson exposure", () => {
    const exposedWords = A1_LESSONS.flatMap((lesson) => lesson.words);
    expect(new Set(exposedWords.map((word) => word.id)).size).toBe(exposedWords.length);
    expect(exposedWords.every((word) => /^a1-lesson-\d+-/.test(word.id))).toBe(true);
  });

  it("assigns one bilingual grammar topic to every lesson", () => {
    expect(A1_GRAMMAR).toHaveLength(20);
    expect(A1_LESSONS.every((lesson) => Boolean(lesson.grammar?.topic && lesson.grammar?.arabicName))).toBe(true);
  });

  it("normalises every A1 lesson onto the shared learner-facing plan contract", () => {
    expect(A1_LESSONS.every((lesson) => (
      lesson.learningPlan?.outcome.canDo
      && lesson.learningPlan.outcome.canDoArabic
      && lesson.learningPlan.outcome.scenario
      && lesson.learningPlan.steps.length === 6
      && lesson.learningPlan.studio === "A1 First Steps Studio"
      && lesson.learningPlan.englishFirst === false
    ))).toBe(true);
  });

  it("gives every A1 lesson a seven-moment bilingual mentor guide for the learner route", () => {
    expect(A1_LESSONS.every((lesson) => (
      lesson.mentorGuide?.level === "A1"
      && lesson.mentorGuide.lessonTitle === lesson.title
      && lesson.mentorGuide.moments.length === 7
      && lesson.mentorGuide.moments.every((moment) => moment.message && moment.messageArabic)
    ))).toBe(true);
    expect(A1_LESSONS[0].mentorGuide?.moments[0].message).toContain("You do not need to know grammar");
  });
});
