import { z } from "zod";
import {
  completeReviewItem,
  getDueReviews,
  getLearnerProgress,
  getLearningProfile,
  hasCompletedModuleLessons,
  recordLearnerActivity,
  submitLessonAssessment,
  updateLearnerAccent,
} from "../db";
import { getOrCreateAssessmentInstance, gradeAssessmentInstance } from "../assessment-instances";
import {
  A1_GRAMMAR, A1_VOCABULARY, A2_GRAMMAR, A2_VOCABULARY,
  buildA2LessonQuiz, buildA2ModuleTest, buildLessonQuiz, buildModuleTest,
} from "../../shared/course";
import { protectedProcedure, router } from "../_core/trpc";

const levelSchema = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);

function materialForLevel(level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2") {
  if (level === "A2") return { vocabulary: A2_VOCABULARY, grammar: A2_GRAMMAR, lessonQuiz: buildA2LessonQuiz, moduleTest: buildA2ModuleTest };
  return { vocabulary: A1_VOCABULARY, grammar: A1_GRAMMAR, lessonQuiz: buildLessonQuiz, moduleTest: buildModuleTest };
}

export const courseRouter = router({
  dashboard: protectedProcedure.input(z.object({ level: levelSchema.optional() }).optional()).query(async ({ ctx, input }) => {
    const level = input?.level ?? "A1";
    const [profile, progress] = await Promise.all([
      getLearningProfile(ctx.user.id),
      getLearnerProgress(ctx.user.id, level),
    ]);
    return { profile, progress };
  }),

  progress: protectedProcedure.input(z.object({ level: levelSchema })).query(({ ctx, input }) =>
    getLearnerProgress(ctx.user.id, input.level),
  ),

  updateAccent: protectedProcedure.input(z.object({
    preferredAccent: z.enum(["british", "american"]),
  })).mutation(({ ctx, input }) => updateLearnerAccent(ctx.user.id, input.preferredAccent)),

  recordActivity: protectedProcedure.mutation(({ ctx }) => recordLearnerActivity(ctx.user.id)),

  lessonQuiz: protectedProcedure.input(z.object({ level: levelSchema.optional(), lessonNumber: z.number().int().min(1).max(20) })).query(async ({ ctx, input }) => {
    const level = input.level ?? "A1";
    const progress = await getLearnerProgress(ctx.user.id, level);
    const isAvailable = input.lessonNumber === 1 || progress.lessons.some((lesson) => lesson.lessonNumber === input.lessonNumber && lesson.status !== "locked") || progress.lessons.some((lesson) => lesson.lessonNumber === input.lessonNumber - 1 && lesson.status === "completed");
    if (!isAvailable) throw new Error("Complete the previous lesson before taking this quiz.");
    return getOrCreateAssessmentInstance(ctx.user.id, { level, assessmentType: "lesson_quiz", lessonNumber: input.lessonNumber });
  }),

  submitLessonQuiz: protectedProcedure.input(z.object({
    level: levelSchema.optional(), lessonNumber: z.number().int().min(1).max(20),
    assessmentInstanceId: z.number().int().positive(),
    answers: z.record(z.string(), z.string()),
  })).mutation(async ({ ctx, input }) => {
    const level = input.level ?? "A1";
    const graded = await gradeAssessmentInstance({
      userId: ctx.user.id,
      assessmentInstanceId: input.assessmentInstanceId,
      scope: { level, assessmentType: "lesson_quiz", lessonNumber: input.lessonNumber },
      answers: input.answers,
    });
    return submitLessonAssessment({ userId: ctx.user.id, level, lessonNumber: input.lessonNumber, assessmentType: "lesson_quiz", assessmentInstanceId: input.assessmentInstanceId, score: graded.score, answers: input.answers, missedItemKeys: graded.missedItemKeys });
  }),

  moduleTest: protectedProcedure.input(z.object({ level: levelSchema.optional(), moduleNumber: z.number().int().min(1).max(4) })).query(async ({ ctx, input }) => {
    const level = input.level ?? "A1";
    const progress = await getLearnerProgress(ctx.user.id, level);
    const allLessonsComplete = hasCompletedModuleLessons(progress.lessons, input.moduleNumber);
    if (!allLessonsComplete) throw new Error("Complete all five module lessons before taking this test.");
    return getOrCreateAssessmentInstance(ctx.user.id, { level, assessmentType: "module_test", moduleNumber: input.moduleNumber });
  }),

  submitModuleTest: protectedProcedure.input(z.object({
    level: levelSchema.optional(), moduleNumber: z.number().int().min(1).max(4),
    assessmentInstanceId: z.number().int().positive(),
    answers: z.record(z.string(), z.string()),
  })).mutation(async ({ ctx, input }) => {
    const level = input.level ?? "A1";
    const progress = await getLearnerProgress(ctx.user.id, level);
    if (!hasCompletedModuleLessons(progress.lessons, input.moduleNumber)) throw new Error("Complete all five module lessons before taking this test.");
    const graded = await gradeAssessmentInstance({
      userId: ctx.user.id,
      assessmentInstanceId: input.assessmentInstanceId,
      scope: { level, assessmentType: "module_test", moduleNumber: input.moduleNumber },
      answers: input.answers,
    });
    return submitLessonAssessment({ userId: ctx.user.id, level, lessonNumber: input.moduleNumber * 5, assessmentType: "module_test", assessmentInstanceId: input.assessmentInstanceId, score: graded.score, answers: input.answers, missedItemKeys: graded.missedItemKeys });
  }),

  warmup: protectedProcedure.input(z.object({ level: levelSchema.optional() }).optional()).query(async ({ ctx, input }) => {
    const material = materialForLevel(input?.level ?? "A1");
    const due = await getDueReviews(ctx.user.id, input?.level ?? "A1");
    return due.map((item) => {
      const word = material.vocabulary.find((entry) => entry.id === item.itemKey);
      const grammar = material.grammar.find((entry) => entry.id === item.itemKey);
      return { id: item.id, type: item.itemType, prompt: word?.word ?? grammar?.topic ?? item.itemKey, promptArabic: word?.arabic ?? grammar?.arabicName ?? "" };
    });
  }),

  submitWarmup: protectedProcedure.input(z.object({ reviewId: z.number().int(), correct: z.boolean() })).mutation(({ ctx, input }) =>
    completeReviewItem(ctx.user.id, input.reviewId, input.correct),
  ),
});
