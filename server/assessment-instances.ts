import { and, asc, eq, inArray } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import {
  assessmentInstanceItems,
  assessmentInstances,
  assessmentQuestionBank,
  courseLessons,
  courseLevels,
  courseModules,
} from "../drizzle/schema";
import type { QuizQuestion } from "../shared/course";
import { getDb } from "./db";

export type AssessmentScope = {
  level: string;
  assessmentType: "lesson_quiz" | "milestone_quiz" | "module_test";
  lessonNumber?: number;
  moduleNumber?: number;
};

/** Keep every level on the same assessment contract while making checkpoints richer at milestones. */
export function assessmentTargetCount(scope: AssessmentScope) {
  if (scope.assessmentType === "module_test") return 20;
  if (scope.assessmentType === "milestone_quiz") return 15;
  return 8;
}

type PublicQuestion = Omit<QuizQuestion, "answer" | "reviewItemKey" | "reviewItemType">;

function stableNumber(value: string) {
  let hash = 2_166_136_261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  return hash >>> 0;
}

function toPublicQuestion(question: QuizQuestion): PublicQuestion {
  const { answer: _answer, reviewItemKey: _reviewItemKey, reviewItemType: _reviewItemType, ...safeQuestion } = question;
  return safeQuestion;
}

async function presentInstance(instanceId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const items = await db.select().from(assessmentInstanceItems)
    .where(eq(assessmentInstanceItems.instanceId, instanceId))
    .orderBy(asc(assessmentInstanceItems.position));
  return {
    assessmentInstanceId: instanceId,
    questions: items.map((item) => toPublicQuestion(item.questionSnapshot as unknown as QuizQuestion)),
  };
}

function scopeWhere(scope: AssessmentScope, activeOnly = false) {
  const conditions = [
    eq(assessmentInstances.level, scope.level),
    eq(assessmentInstances.assessmentType, scope.assessmentType),
    scope.assessmentType === "lesson_quiz"
      ? eq(assessmentInstances.lessonNumber, scope.lessonNumber!)
      : eq(assessmentInstances.moduleNumber, scope.moduleNumber!),
  ];
  if (activeOnly) conditions.push(eq(assessmentInstances.status, "active"));
  return and(...conditions);
}

/** Reuse an open attempt on refresh, and create a new deterministic snapshot after a submitted attempt. */
export async function getOrCreateAssessmentInstance(userId: number, scope: AssessmentScope) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const active = await db.select().from(assessmentInstances).where(and(
    eq(assessmentInstances.userId, userId),
    scopeWhere(scope, true),
  )).limit(1);
  if (active[0]) return presentInstance(active[0].id);

  const level = await db.select().from(courseLevels).where(eq(courseLevels.code, scope.level)).limit(1);
  if (!level[0]) throw new Error(`Course level ${scope.level} has not been synchronized.`);
  let bankScope;
  if (scope.assessmentType === "lesson_quiz") {
    const lesson = await db.select().from(courseLessons).where(and(
      eq(courseLessons.levelId, level[0].id),
      eq(courseLessons.lessonNumber, scope.lessonNumber!),
    )).limit(1);
    if (!lesson[0]) throw new Error("Lesson content has not been synchronized.");
    bankScope = eq(assessmentQuestionBank.lessonId, lesson[0].id);
  } else {
    const module = await db.select().from(courseModules).where(and(
      eq(courseModules.levelId, level[0].id),
      eq(courseModules.moduleNumber, scope.moduleNumber!),
    )).limit(1);
    if (!module[0]) throw new Error("Module content has not been synchronized.");
    bankScope = eq(assessmentQuestionBank.moduleId, module[0].id);
  }

  const candidates = await db.select().from(assessmentQuestionBank).where(and(
    eq(assessmentQuestionBank.levelId, level[0].id),
    eq(assessmentQuestionBank.assessmentType, scope.assessmentType),
    eq(assessmentQuestionBank.active, 1),
    bankScope,
  ));
  if (!candidates.length) throw new Error("No assessment questions are available for this scope.");

  const previousInstances = await db.select({ id: assessmentInstances.id }).from(assessmentInstances).where(and(
    eq(assessmentInstances.userId, userId),
    scopeWhere(scope),
    eq(assessmentInstances.status, "submitted"),
  ));
  const previouslySeen = previousInstances.length
    ? new Set((await db.select({ questionKey: assessmentInstanceItems.questionKey }).from(assessmentInstanceItems)
      .where(inArray(assessmentInstanceItems.instanceId, previousInstances.map((item) => item.id))))
      .map((item) => item.questionKey))
    : new Set<string>();
  const seed = randomUUID();
  const targetCount = assessmentTargetCount(scope);
  const selected = [...candidates].sort((left, right) => {
    const seenDifference = Number(previouslySeen.has(left.questionKey)) - Number(previouslySeen.has(right.questionKey));
    return seenDifference || stableNumber(`${seed}:${left.questionKey}`) - stableNumber(`${seed}:${right.questionKey}`);
  }).slice(0, Math.min(targetCount, candidates.length));

  await db.insert(assessmentInstances).values({
    userId,
    level: scope.level,
    lessonNumber: scope.assessmentType === "lesson_quiz" ? scope.lessonNumber! : null,
    moduleNumber: scope.assessmentType === "lesson_quiz" ? null : scope.moduleNumber!,
    assessmentType: scope.assessmentType,
    seed,
  });
  const created = await db.select().from(assessmentInstances).where(and(
    eq(assessmentInstances.userId, userId),
    eq(assessmentInstances.seed, seed),
  )).limit(1);
  if (!created[0]) throw new Error("Assessment instance was not created.");
  await db.insert(assessmentInstanceItems).values(selected.map((item, position) => {
    const question = item.questionData as unknown as QuizQuestion;
    return {
      instanceId: created[0].id,
      questionBankId: item.id,
      position,
      questionKey: item.questionKey,
      questionSnapshot: question as unknown as Record<string, unknown>,
      answerSnapshot: question.answer,
      reviewItemKey: item.reviewItemKey,
    };
  }));
  return presentInstance(created[0].id);
}

export async function gradeAssessmentInstance(input: {
  userId: number;
  assessmentInstanceId: number;
  scope: AssessmentScope;
  answers: Record<string, string>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const instance = await db.select().from(assessmentInstances).where(and(
    eq(assessmentInstances.id, input.assessmentInstanceId),
    eq(assessmentInstances.userId, input.userId),
    eq(assessmentInstances.status, "active"),
  )).limit(1);
  if (!instance[0]) throw new Error("This assessment has already been submitted or is unavailable.");
  const expectedScopeValue = input.scope.assessmentType === "lesson_quiz" ? input.scope.lessonNumber : input.scope.moduleNumber;
  const actualScopeValue = input.scope.assessmentType === "lesson_quiz" ? instance[0].lessonNumber : instance[0].moduleNumber;
  if (instance[0].level !== input.scope.level || instance[0].assessmentType !== input.scope.assessmentType || actualScopeValue !== expectedScopeValue) {
    throw new Error("This assessment does not belong to the requested lesson or module.");
  }
  const items = await db.select().from(assessmentInstanceItems)
    .where(eq(assessmentInstanceItems.instanceId, instance[0].id))
    .orderBy(asc(assessmentInstanceItems.position));
  if (!items.length) throw new Error("This assessment contains no questions.");
  const correct = items.filter((item) => {
    const question = item.questionSnapshot as unknown as QuizQuestion;
    return input.answers[question.id]?.trim().toLowerCase() === item.answerSnapshot.trim().toLowerCase();
  });
  const score = Math.round((correct.length / items.length) * 100);
  await db.update(assessmentInstances).set({ status: "submitted", submittedAt: new Date() })
    .where(eq(assessmentInstances.id, instance[0].id));
  return {
    level: instance[0].level,
    lessonNumber: instance[0].lessonNumber,
    moduleNumber: instance[0].moduleNumber,
    assessmentType: instance[0].assessmentType,
    score,
    missedItemKeys: items.filter((item) => !correct.includes(item)).map((item) => item.reviewItemKey),
    questionReview: items.map((item) => {
      const question = item.questionSnapshot as unknown as QuizQuestion;
      const selected = input.answers[question.id] ?? "";
      return {
        questionId: question.id,
        prompt: question.prompt,
        promptArabic: question.promptArabic,
        selected,
        correctAnswer: item.answerSnapshot,
        isCorrect: selected.trim().toLowerCase() === item.answerSnapshot.trim().toLowerCase(),
      };
    }),
  };
}
