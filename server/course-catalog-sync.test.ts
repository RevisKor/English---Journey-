import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  assessmentQuestionBank,
  courseLessons,
  courseLevels,
  courseModules,
  courseTopics,
  lessonGrammar,
  lessonReadings,
  lessonVocabulary,
  lessonWritingTasks,
} from "../drizzle/schema";
import { A1_COURSE, A2_COURSE, B1_COURSE, B2_COURSE } from "../shared/course";

const state = vi.hoisted(() => ({
  inserts: [] as Array<{ table: unknown; values: unknown }>,
  updates: [] as Array<{ table: unknown; values: unknown }>,
  practiceRowsExist: false,
  courseLevelLookups: 0,
  lessonId: 100,
}));

const fakeDb = {
  select: () => ({
    from: (table: unknown) => ({
      where: () => ({
        limit: async () => {
          if (table === courseLevels) {
            state.courseLevelLookups += 1;
            return [{ id: state.courseLevelLookups === 1 ? 1 : 2 }];
          }
          if (table === courseLessons) return [{ id: ++state.lessonId }];
          if (table === courseModules || table === courseTopics) return [{ id: 1 }];
          if (table === lessonReadings || table === lessonWritingTasks) return state.practiceRowsExist ? [{ id: 1 }] : [];
          return [];
        },
      }),
    }),
  }),
  insert: (table: unknown) => ({
    values: (values: unknown) => {
      state.inserts.push({ table, values });
      return { onDuplicateKeyUpdate: async () => undefined };
    },
  }),
  update: (table: unknown) => ({
    set: (values: unknown) => ({
      where: async () => { state.updates.push({ table, values }); },
    }),
  }),
};

vi.mock("./db", () => ({ getDb: async () => fakeDb }));

import { ensureCurriculumCatalog, structuredReading, structuredWriting, syncStructuredPracticeCatalog } from "./course-catalog";

describe("curriculum catalog practice persistence", () => {
  beforeEach(() => {
    state.inserts.length = 0;
    state.updates.length = 0;
    state.practiceRowsExist = false;
    state.courseLevelLookups = 0;
    state.lessonId = 100;
  });

  it("inserts reading and writing records for every integrated lesson, then updates those same rows on focused practice sync", async () => {
    await ensureCurriculumCatalog();

    const integratedCourses = [A1_COURSE, A2_COURSE, B1_COURSE, B2_COURSE];
    const integratedLessonCount = integratedCourses.reduce((total, course) => total + course.lessons.length, 0);
    expect(state.inserts.filter((entry) => entry.table === lessonReadings)).toHaveLength(integratedLessonCount);
    expect(state.inserts.filter((entry) => entry.table === lessonWritingTasks)).toHaveLength(integratedLessonCount);
    expect(state.inserts.some((entry) => entry.table === lessonVocabulary)).toBe(true);
    expect(state.inserts.some((entry) => entry.table === lessonGrammar)).toBe(true);
    expect(state.inserts.some((entry) => entry.table === assessmentQuestionBank)).toBe(true);

    state.practiceRowsExist = true;
    await syncStructuredPracticeCatalog();

    const expectedLessons = integratedCourses.flatMap((course) => course.lessons.map((lesson) => ({ course, lesson })));
    const expectedReadingUpdates = expectedLessons.map(({ course, lesson }) => {
      const reading = structuredReading(course, lesson);
      return { titleArabic: reading.titleArabic, passage: reading.passage, questions: reading.questions, contentVersion: 1 };
    });
    const expectedWritingUpdates = expectedLessons.map(({ course, lesson }) => ({ ...structuredWriting(course, lesson), contentVersion: 1 }));
    const readingUpdates = state.updates.filter((entry) => entry.table === lessonReadings).map((entry) => entry.values);
    const writingUpdates = state.updates.filter((entry) => entry.table === lessonWritingTasks).map((entry) => entry.values);

    expect(readingUpdates).toEqual(expectedReadingUpdates);
    expect(writingUpdates).toEqual(expectedWritingUpdates);
  });
});
