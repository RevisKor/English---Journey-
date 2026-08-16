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
import { A1_COURSE, A2_COURSE, B1_COURSE, B2_COURSE, C1_COURSE, C2_COURSE, milestoneLessonNumbers } from "../shared/course";

const state = vi.hoisted(() => ({
  inserts: [] as Array<{ table: unknown; values: unknown }>,
  updates: [] as Array<{ table: unknown; values: unknown }>,
  upserts: [] as Array<{ table: unknown; values: unknown }>,
  deletes: [] as unknown[],
  practiceRowsExist: false,
  courseLevelLookups: 0,
  moduleLookups: 0,
  lessonId: 100,
}));

const fakeDb = {
  select: () => ({
    from: (table: unknown) => ({
      where: () => ({
        limit: async () => {
          if (table === courseLevels) {
            state.courseLevelLookups += 1;
            return [{ id: state.courseLevelLookups }];
          }
          if (table === courseLessons) return [{ id: ++state.lessonId }];
          if (table === courseModules) return [{ id: ++state.moduleLookups }];
          if (table === courseTopics) return [{ id: 1 }];
          if (table === lessonReadings || table === lessonWritingTasks) return state.practiceRowsExist ? [{ id: 1 }] : [];
          return [];
        },
      }),
    }),
  }),
  insert: (table: unknown) => ({
    values: (values: unknown) => {
      const persistedValues = table === assessmentQuestionBank && typeof values === "object" && values !== null
        ? { ...(values as Record<string, unknown>), active: 1 }
        : values;
      state.inserts.push({ table, values: persistedValues });
      return {
        onDuplicateKeyUpdate: async ({ set }: { set: unknown }) => {
          state.upserts.push({ table, values: set });
        },
      };
    },
  }),
  update: (table: unknown) => ({
    set: (values: unknown) => ({
      where: async () => { state.updates.push({ table, values }); },
    }),
  }),
  delete: (table: unknown) => ({
    where: async () => { state.deletes.push(table); },
  }),
};

vi.mock("./db", () => ({ getDb: async () => fakeDb }));

import { assessmentVariants, courseNeedsCatalogSynchronization, ensureCurriculumCatalog, structuredReading, structuredWriting, syncStructuredPracticeCatalog } from "./course-catalog";

describe("curriculum catalog practice persistence", () => {
  beforeEach(() => {
    state.inserts.length = 0;
    state.updates.length = 0;
    state.upserts.length = 0;
    state.deletes.length = 0;
    state.practiceRowsExist = false;
    state.courseLevelLookups = 0;
    state.moduleLookups = 0;
    state.lessonId = 100;
  });

  it("treats an interrupted versioned A2 refresh as incomplete until all nine modules and 135 current lessons exist", () => {
    const partialLessons = Array.from({ length: 20 }, () => ({ contentVersion: 3 }));
    const completeLessons = Array.from({ length: A2_COURSE.totalLessons }, () => ({ contentVersion: 3 }));

    expect(courseNeedsCatalogSynchronization(A2_COURSE, { contentVersion: 3 }, 4, partialLessons)).toBe(true);
    expect(courseNeedsCatalogSynchronization(A2_COURSE, { contentVersion: 3 }, 9, completeLessons)).toBe(false);
    expect(courseNeedsCatalogSynchronization(A2_COURSE, { contentVersion: 2 }, 9, completeLessons)).toBe(true);
  });

  it("inserts reading and writing records for every integrated lesson, then updates those same rows on focused practice sync", async () => {
    await ensureCurriculumCatalog();

    const integratedCourses = [A1_COURSE, A2_COURSE, B1_COURSE, B2_COURSE, C1_COURSE, C2_COURSE];
    const integratedLessonCount = integratedCourses.reduce((total, course) => total + course.lessons.length, 0);
    expect(state.inserts.filter((entry) => entry.table === lessonReadings)).toHaveLength(integratedLessonCount);
    expect(state.inserts.filter((entry) => entry.table === lessonWritingTasks)).toHaveLength(integratedLessonCount);
    const persistedC1Modules = state.inserts.filter((entry) => entry.table === courseModules && (entry.values as { levelId?: number }).levelId === 5);
    const persistedC1Lessons = state.inserts.filter((entry) => entry.table === courseLessons && (entry.values as { levelId?: number }).levelId === 5);
    expect(persistedC1Modules).toHaveLength(4);
    expect(persistedC1Lessons).toHaveLength(20);
    expect(state.inserts.some((entry) => entry.table === lessonVocabulary)).toBe(true);
    expect(state.deletes.filter((table) => table === lessonVocabulary)).toHaveLength(integratedLessonCount);
    expect(state.inserts.some((entry) => entry.table === lessonGrammar)).toBe(true);
    expect(state.inserts.some((entry) => entry.table === assessmentQuestionBank)).toBe(true);

    const milestoneRows = state.inserts
      .filter((entry) => entry.table === assessmentQuestionBank)
      .map((entry) => entry.values as { questionKey: string; levelId: number; moduleId: number; assessmentType: string; active?: number })
      .filter((row) => row.assessmentType === "milestone_quiz");
    expect(milestoneRows.length).toBeGreaterThan(0);
    for (const [index, course] of integratedCourses.entries()) {
      const levelRows = milestoneRows.filter((row) => row.levelId === index + 1);
      const checkpoints = milestoneLessonNumbers(course);
      const checkpointRows = new Map<number, typeof milestoneRows>();
      for (const row of levelRows) {
        const lessonNumber = Number(row.questionKey.split(":")[3]);
        checkpointRows.set(lessonNumber, [...(checkpointRows.get(lessonNumber) ?? []), row]);
      }
      expect([...checkpointRows.keys()].sort((a, b) => a - b)).toEqual(checkpoints);
      expect([...checkpointRows.values()].every((rows) => rows.length === assessmentVariants(course, course.lessons.find((lesson) => lesson.lessonNumber === Number(rows[0].questionKey.split(":")[3])))!.length)).toBe(true);
      expect([...checkpointRows.values()].every((rows) => rows.every((row) => row.active === 1))).toBe(true);
      const moduleIdsByNumber = new Map<number, number>();
      for (const rows of checkpointRows.values()) {
        const moduleNumber = Number(rows[0].questionKey.split(":")[2]);
        const moduleIds = new Set(rows.map((row) => row.moduleId));
        expect(moduleIds.size).toBe(1);
        expect([...moduleIds][0]).toBeGreaterThan(0);
        moduleIdsByNumber.set(moduleNumber, [...moduleIds][0]);
      }
      expect(moduleIdsByNumber.size).toBe(checkpoints.length);
      expect(new Set(moduleIdsByNumber.values()).size).toBe(checkpoints.length);
    }
    const restoredMilestoneLessonKeys = state.upserts
      .filter((entry) => entry.table === assessmentQuestionBank)
      .map((entry) => entry.values as { lessonId?: number | null })
      .filter((values) => values.lessonId !== null && values.lessonId !== undefined);
    expect(restoredMilestoneLessonKeys.length).toBeGreaterThanOrEqual(milestoneRows.length);

    state.practiceRowsExist = true;
    await syncStructuredPracticeCatalog();

    const expectedLessons = integratedCourses.flatMap((course) => course.lessons.map((lesson) => ({ course, lesson })));
    const expectedReadingUpdates = expectedLessons.map(({ course, lesson }) => {
      const reading = structuredReading(course, lesson);
      return { titleArabic: reading.titleArabic, passage: reading.passage, questions: reading.questions, contentVersion: 3 };
    });
    const expectedWritingUpdates = expectedLessons.map(({ course, lesson }) => ({ ...structuredWriting(course, lesson), contentVersion: 3 }));
    const readingUpdates = state.updates.filter((entry) => entry.table === lessonReadings).map((entry) => entry.values);
    const writingUpdates = state.updates.filter((entry) => entry.table === lessonWritingTasks).map((entry) => entry.values);

    expect(readingUpdates).toEqual(expectedReadingUpdates);
    expect(writingUpdates).toEqual(expectedWritingUpdates);
  });
});
