import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
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
} from "../../drizzle/schema";
import { getDb } from "../db";
import { adminProcedure, router } from "../_core/trpc";

const catalogLevelSchema = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);

/** Owner-only curriculum access. Learner-facing material remains in the course router. */
export const adminRouter = router({
  catalog: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    const [levels, modules, lessons] = await Promise.all([
      db.select().from(courseLevels),
      db.select().from(courseModules).orderBy(asc(courseModules.moduleNumber)),
      db.select({
        id: courseLessons.id,
        levelId: courseLessons.levelId,
        moduleId: courseLessons.moduleId,
        topicId: courseLessons.topicId,
        lessonNumber: courseLessons.lessonNumber,
        title: courseLessons.title,
        titleArabic: courseLessons.titleArabic,
      }).from(courseLessons).orderBy(asc(courseLessons.lessonNumber)),
    ]);

    const levelOrder = ["A1", "A2", "B1", "B2", "C1", "C2"];
    return levels
      .sort((a, b) => levelOrder.indexOf(a.code) - levelOrder.indexOf(b.code))
      .map(level => ({
        ...level,
        modules: modules
          .filter(module => module.levelId === level.id)
          .map(module => ({
            ...module,
            lessons: lessons.filter(lesson => lesson.moduleId === module.id),
          })),
      }));
  }),

  lesson: adminProcedure
    .input(z.object({ level: catalogLevelSchema, lessonNumber: z.number().int().min(1) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const level = (await db.select().from(courseLevels).where(eq(courseLevels.code, input.level)).limit(1))[0];
      if (!level) return null;
      const lesson = (await db.select().from(courseLessons).where(and(
        eq(courseLessons.levelId, level.id),
        eq(courseLessons.lessonNumber, input.lessonNumber),
      )).limit(1))[0];
      if (!lesson) return null;

      const [topic, vocabulary, grammar, readings, writingTasks, assessments] = await Promise.all([
        lesson.topicId ? db.select().from(courseTopics).where(eq(courseTopics.id, lesson.topicId)).limit(1) : Promise.resolve([]),
        db.select().from(lessonVocabulary).where(eq(lessonVocabulary.lessonId, lesson.id)).orderBy(asc(lessonVocabulary.position)),
        db.select().from(lessonGrammar).where(eq(lessonGrammar.lessonId, lesson.id)),
        db.select().from(lessonReadings).where(eq(lessonReadings.lessonId, lesson.id)),
        db.select().from(lessonWritingTasks).where(eq(lessonWritingTasks.lessonId, lesson.id)),
        db.select().from(assessmentQuestionBank).where(and(
          eq(assessmentQuestionBank.lessonId, lesson.id),
          eq(assessmentQuestionBank.active, 1),
        )).orderBy(asc(assessmentQuestionBank.questionKey)),
      ]);

      return {
        lesson,
        topic: topic[0] ?? null,
        vocabulary,
        grammar,
        readings,
        writingTasks,
        assessments,
      };
    }),
});
