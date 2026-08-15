import { describe, expect, it } from "vitest";
import { A1_COURSE, A2_COURSE } from "../shared/course";
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
