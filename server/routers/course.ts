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
import { A1_GRAMMAR, A1_VOCABULARY, buildLessonQuiz, buildModuleTest, withoutAnswers } from "../../shared/course";
import { protectedProcedure, router } from "../_core/trpc";

const levelSchema = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);

export const courseRouter = router({
  dashboard: protectedProcedure.query(async ({ ctx }) => {
    const [profile, progress] = await Promise.all([
      getLearningProfile(ctx.user.id),
      getLearnerProgress(ctx.user.id, "A1"),
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

  lessonQuiz: protectedProcedure.input(z.object({ lessonNumber: z.number().int().min(1).max(20) })).query(async ({ ctx, input }) => {
    const progress = await getLearnerProgress(ctx.user.id, "A1");
    const isAvailable = input.lessonNumber === 1 || progress.lessons.some((lesson) => lesson.lessonNumber === input.lessonNumber && lesson.status !== "locked") || progress.lessons.some((lesson) => lesson.lessonNumber === input.lessonNumber - 1 && lesson.status === "completed");
    if (!isAvailable) throw new Error("Complete the previous lesson before taking this quiz.");
    return withoutAnswers(buildLessonQuiz(input.lessonNumber));
  }),

  submitLessonQuiz: protectedProcedure.input(z.object({
    lessonNumber: z.number().int().min(1).max(20),
    answers: z.record(z.string(), z.string()),
  })).mutation(async ({ ctx, input }) => {
    const questions = buildLessonQuiz(input.lessonNumber);
    const correct = questions.filter((question) => input.answers[question.id]?.trim().toLowerCase() === question.answer.trim().toLowerCase());
    const missed = questions.filter((question) => !correct.includes(question));
    const score = Math.round((correct.length / questions.length) * 100);
    return submitLessonAssessment({ userId: ctx.user.id, level: "A1", lessonNumber: input.lessonNumber, assessmentType: "lesson_quiz", score, answers: input.answers, missedItemKeys: missed.map((question) => question.reviewItemKey) });
  }),

  moduleTest: protectedProcedure.input(z.object({ moduleNumber: z.number().int().min(1).max(4) })).query(async ({ ctx, input }) => {
    const progress = await getLearnerProgress(ctx.user.id, "A1");
    const allLessonsComplete = hasCompletedModuleLessons(progress.lessons, input.moduleNumber);
    if (!allLessonsComplete) throw new Error("Complete all five module lessons before taking this test.");
    return withoutAnswers(buildModuleTest(input.moduleNumber));
  }),

  submitModuleTest: protectedProcedure.input(z.object({
    moduleNumber: z.number().int().min(1).max(4),
    answers: z.record(z.string(), z.string()),
  })).mutation(({ ctx, input }) => {
    const questions = buildModuleTest(input.moduleNumber);
    const correct = questions.filter((question) => input.answers[question.id]?.trim().toLowerCase() === question.answer.trim().toLowerCase());
    const missed = questions.filter((question) => !correct.includes(question));
    const score = Math.round((correct.length / questions.length) * 100);
    return submitLessonAssessment({ userId: ctx.user.id, level: "A1", lessonNumber: input.moduleNumber * 5, assessmentType: "module_test", score, answers: input.answers, missedItemKeys: missed.map((question) => question.reviewItemKey) });
  }),

  warmup: protectedProcedure.query(async ({ ctx }) => {
    const due = await getDueReviews(ctx.user.id, "A1");
    return due.map((item) => {
      const word = A1_VOCABULARY.find((entry) => entry.id === item.itemKey);
      const grammar = A1_GRAMMAR.find((entry) => entry.id === item.itemKey);
      return { id: item.id, type: item.itemType, prompt: word?.word ?? grammar?.topic ?? item.itemKey, promptArabic: word?.arabic ?? grammar?.arabicName ?? "" };
    });
  }),

  submitWarmup: protectedProcedure.input(z.object({ reviewId: z.number().int(), correct: z.boolean() })).mutation(({ ctx, input }) =>
    completeReviewItem(ctx.user.id, input.reviewId, input.correct),
  ),
});
