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
  it("keeps C1 at ten modules and 160 lessons", () => {
    expect(C1_COURSE.totalLessons).toBe(160);
    expect(C1_COURSE.lessons).toHaveLength(160);
    expect(C1_COURSE.lessons.filter((lesson) => lesson.moduleNumber === 1)).toHaveLength(16);
    expect(new Set(C1_COURSE.lessons.map((lesson) => lesson.moduleNumber))).toEqual(new Set(Array.from({ length: 10 }, (_, index) => index + 1)));
  });

  it("keeps C2 at twelve modules and 180 lessons", () => {
    expect(C2_COURSE.totalLessons).toBe(180);
    expect(C2_COURSE.lessons).toHaveLength(180);
    expect(new Set(C2_COURSE.lessons.map((lesson) => lesson.moduleNumber))).toEqual(new Set(Array.from({ length: 12 }, (_, index) => index + 1)));
  });
});
