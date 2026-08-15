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
  A1_COURSE, A1_GRAMMAR, A1_VOCABULARY, A2_COURSE, A2_GRAMMAR, A2_VOCABULARY, B1_COURSE, B1_GRAMMAR, B1_VOCABULARY, B2_COURSE, B2_GRAMMAR, B2_VOCABULARY, C1_COURSE, C1_GRAMMAR, C1_VOCABULARY, C2_COURSE, C2_GRAMMAR, C2_VOCABULARY,
  buildA2LessonQuiz, buildA2ModuleTest, buildB1LessonQuiz, buildB1ModuleTest, buildB2LessonQuiz, buildB2ModuleTest, buildC1LessonQuiz, buildC1ModuleTest, buildC2LessonQuiz, buildC2ModuleTest, buildLessonQuiz, buildModuleTest,
} from "../../shared/course";
import { protectedProcedure, router } from "../_core/trpc";
import { isMilestoneLesson, moduleNumberForLesson } from "../../shared/course";

const levelSchema = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);

function materialForLevel(level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2") {
  if (level === "A2") return { course: A2_COURSE, vocabulary: A2_VOCABULARY, grammar: A2_GRAMMAR, lessonQuiz: buildA2LessonQuiz, moduleTest: buildA2ModuleTest };
  if (level === "B1") return { course: B1_COURSE, vocabulary: B1_VOCABULARY, grammar: B1_GRAMMAR, lessonQuiz: buildB1LessonQuiz, moduleTest: buildB1ModuleTest };
  if (level === "B2") return { course: B2_COURSE, vocabulary: B2_VOCABULARY, grammar: B2_GRAMMAR, lessonQuiz: buildB2LessonQuiz, moduleTest: buildB2ModuleTest };
  if (level === "C1") return { course: C1_COURSE, vocabulary: C1_VOCABULARY, grammar: C1_GRAMMAR, lessonQuiz: buildC1LessonQuiz, moduleTest: buildC1ModuleTest };
  if (level === "C2") return { course: C2_COURSE, vocabulary: C2_VOCABULARY, grammar: C2_GRAMMAR, lessonQuiz: buildC2LessonQuiz, moduleTest: buildC2ModuleTest };
  return { course: A1_COURSE, vocabulary: A1_VOCABULARY, grammar: A1_GRAMMAR, lessonQuiz: buildLessonQuiz, moduleTest: buildModuleTest };
}

function moduleCountForCourse(course: (ReturnType<typeof materialForLevel>)["course"]) {
  return Math.max(...course.lessons.map((lesson) => lesson.moduleNumber));
}

export function assertLessonInCourse(course: (ReturnType<typeof materialForLevel>)["course"], lessonNumber: number) {
  if (lessonNumber > course.totalLessons || !course.lessons.some((lesson) => lesson.lessonNumber === lessonNumber)) {
    throw new Error("Lesson not found for this level.");
  }
}

export function assertModuleInCourse(course: (ReturnType<typeof materialForLevel>)["course"], moduleNumber: number) {
  if (moduleNumber > moduleCountForCourse(course) || !course.lessons.some((lesson) => lesson.moduleNumber === moduleNumber)) {
    throw new Error("Module not found for this level.");
  }
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

  lessonQuiz: protectedProcedure.input(z.object({ level: levelSchema.optional(), lessonNumber: z.number().int().min(1) })).query(async ({ ctx, input }) => {
    const level = input.level ?? "A1";
    const material = materialForLevel(level);
    assertLessonInCourse(material.course, input.lessonNumber);
    const progress = await getLearnerProgress(ctx.user.id, level);
    const isAvailable = input.lessonNumber === 1 || progress.lessons.some((lesson) => lesson.lessonNumber === input.lessonNumber && lesson.status !== "locked") || progress.lessons.some((lesson) => lesson.lessonNumber === input.lessonNumber - 1 && lesson.status === "completed");
    if (!isAvailable) throw new Error("Complete the previous lesson before taking this quiz.");
    return getOrCreateAssessmentInstance(ctx.user.id, { level, assessmentType: "lesson_quiz", lessonNumber: input.lessonNumber });
  }),

  milestoneQuiz: protectedProcedure.input(z.object({ level: levelSchema.optional(), lessonNumber: z.number().int().min(1) })).query(async ({ ctx, input }) => {
    const level = input.level ?? "A1";
    const material = materialForLevel(level);
    assertLessonInCourse(material.course, input.lessonNumber);
    if (!isMilestoneLesson(material.course, input.lessonNumber)) throw new Error("Milestone checkpoints are available at the final lesson of each module.");
    const progress = await getLearnerProgress(ctx.user.id, level);
    const isAvailable = progress.lessons.some((lesson) => lesson.lessonNumber === input.lessonNumber && lesson.status !== "locked") || progress.lessons.some((lesson) => lesson.lessonNumber === input.lessonNumber - 1 && lesson.status === "completed");
    if (!isAvailable) throw new Error("Complete the previous lesson before taking this milestone checkpoint.");
    return getOrCreateAssessmentInstance(ctx.user.id, { level, assessmentType: "milestone_quiz", lessonNumber: input.lessonNumber, moduleNumber: moduleNumberForLesson(material.course, input.lessonNumber) });
  }),

  submitMilestoneQuiz: protectedProcedure.input(z.object({
    level: levelSchema.optional(), lessonNumber: z.number().int().min(1),
    assessmentInstanceId: z.number().int().positive(),
    answers: z.record(z.string(), z.string()),
  })).mutation(async ({ ctx, input }) => {
    const level = input.level ?? "A1";
    const material = materialForLevel(level);
    assertLessonInCourse(material.course, input.lessonNumber);
    if (!isMilestoneLesson(material.course, input.lessonNumber)) throw new Error("Milestone checkpoints are available at the final lesson of each module.");
    const graded = await gradeAssessmentInstance({ userId: ctx.user.id, assessmentInstanceId: input.assessmentInstanceId, scope: { level, assessmentType: "milestone_quiz", lessonNumber: input.lessonNumber, moduleNumber: moduleNumberForLesson(material.course, input.lessonNumber) }, answers: input.answers });
    const saved = await submitLessonAssessment({ userId: ctx.user.id, level, lessonNumber: input.lessonNumber, assessmentType: "milestone_quiz", assessmentInstanceId: input.assessmentInstanceId, score: graded.score, answers: input.answers, missedItemKeys: graded.missedItemKeys, moduleNumber: moduleNumberForLesson(material.course, input.lessonNumber), lessonsPerModule: material.course.lessonsPerModule });
    return { ...saved, score: graded.score, questionReview: graded.questionReview };
  }),

  submitLessonQuiz: protectedProcedure.input(z.object({
    level: levelSchema.optional(), lessonNumber: z.number().int().min(1),
    assessmentInstanceId: z.number().int().positive(),
    answers: z.record(z.string(), z.string()),
  })).mutation(async ({ ctx, input }) => {
    const level = input.level ?? "A1";
    const material = materialForLevel(level);
    assertLessonInCourse(material.course, input.lessonNumber);
    const graded = await gradeAssessmentInstance({
      userId: ctx.user.id,
      assessmentInstanceId: input.assessmentInstanceId,
      scope: { level, assessmentType: "lesson_quiz", lessonNumber: input.lessonNumber },
      answers: input.answers,
    });
    const saved = await submitLessonAssessment({ userId: ctx.user.id, level, lessonNumber: input.lessonNumber, assessmentType: "lesson_quiz", assessmentInstanceId: input.assessmentInstanceId, score: graded.score, answers: input.answers, missedItemKeys: graded.missedItemKeys });
    return { ...saved, score: graded.score, questionReview: graded.questionReview };
  }),

  moduleTest: protectedProcedure.input(z.object({ level: levelSchema.optional(), moduleNumber: z.number().int().min(1) })).query(async ({ ctx, input }) => {
    const level = input.level ?? "A1";
    const material = materialForLevel(level);
    assertModuleInCourse(material.course, input.moduleNumber);
    const progress = await getLearnerProgress(ctx.user.id, level);
    const allLessonsComplete = hasCompletedModuleLessons(progress.lessons, input.moduleNumber, material.course.lessonsPerModule);
    if (!allLessonsComplete) throw new Error(`Complete all ${material.course.lessonsPerModule} module lessons before taking this test.`);
    return getOrCreateAssessmentInstance(ctx.user.id, { level, assessmentType: "module_test", moduleNumber: input.moduleNumber });
  }),

  submitModuleTest: protectedProcedure.input(z.object({
    level: levelSchema.optional(), moduleNumber: z.number().int().min(1),
    assessmentInstanceId: z.number().int().positive(),
    answers: z.record(z.string(), z.string()),
  })).mutation(async ({ ctx, input }) => {
    const level = input.level ?? "A1";
    const material = materialForLevel(level);
    assertModuleInCourse(material.course, input.moduleNumber);
    const progress = await getLearnerProgress(ctx.user.id, level);
    if (!hasCompletedModuleLessons(progress.lessons, input.moduleNumber, material.course.lessonsPerModule)) throw new Error(`Complete all ${material.course.lessonsPerModule} module lessons before taking this test.`);
    const graded = await gradeAssessmentInstance({
      userId: ctx.user.id,
      assessmentInstanceId: input.assessmentInstanceId,
      scope: { level, assessmentType: "module_test", moduleNumber: input.moduleNumber },
      answers: input.answers,
    });
    const saved = await submitLessonAssessment({ userId: ctx.user.id, level, lessonNumber: input.moduleNumber * material.course.lessonsPerModule, assessmentType: "module_test", assessmentInstanceId: input.assessmentInstanceId, score: graded.score, answers: input.answers, missedItemKeys: graded.missedItemKeys, moduleNumber: input.moduleNumber, lessonsPerModule: material.course.lessonsPerModule });
    return { ...saved, score: graded.score, questionReview: graded.questionReview };
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
