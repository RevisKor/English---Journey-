import { describe, expect, it } from "vitest";
import { A1_COURSE, A2_COURSE, C1_COURSE, C2_COURSE } from "../shared/course";
import { structuredReading, structuredWriting } from "./course-catalog";

describe("normalized practice catalog blueprints", () => {
  for (const course of [A1_COURSE, A2_COURSE]) {
    it(`creates one complete reading and writing record for every ${course.level} lesson`, () => {
      const readingTitles = new Set<string>();
      const writingTitles = new Set<string>();

      for (const lesson of course.lessons) {
        const reading = structuredReading(course, lesson);
        const writing = structuredWriting(course, lesson);
        readingTitles.add(reading.title);
        writingTitles.add(writing.title);

        expect(reading.titleArabic).toMatch(/^قراءة:/);
        expect(reading.passage.length).toBeGreaterThan(30);
        expect(reading.questions).toHaveLength(3);
        expect(writing.instructionsEnglish.length).toBeGreaterThan(30);
        expect(writing.instructionsArabic.length).toBeGreaterThan(20);
        expect(writing.minimumWords).toBeGreaterThan(0);
        expect(writing.successCriteria).toHaveLength(3);
      }

      expect(readingTitles.size).toBe(course.totalLessons);
      expect(writingTitles.size).toBe(course.totalLessons);
    });
  }
});

describe("advanced catalog lesson contracts", () => {
  it("keeps C1 at four modules and twenty lessons", () => {
    expect(C1_COURSE.totalLessons).toBe(20);
    expect(C1_COURSE.lessons).toHaveLength(20);
    expect(C1_COURSE.lessons.filter((lesson) => lesson.moduleNumber === 1)).toHaveLength(5);
    expect(new Set(C1_COURSE.lessons.map((lesson) => lesson.moduleNumber))).toEqual(new Set([1, 2, 3, 4]));
  });

  it("keeps C2 at four modules and sixteen lessons", () => {
    expect(C2_COURSE.totalLessons).toBe(16);
    expect(C2_COURSE.lessons).toHaveLength(16);
    expect(new Set(C2_COURSE.lessons.map((lesson) => lesson.moduleNumber))).toEqual(new Set([1, 2, 3, 4]));
  });
});
