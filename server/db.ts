import { and, count, desc, eq, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  learningProfiles,
  courseLevels,
  courseLessons,
  lessonProgress,
  lessonReadings,
  lessonWritingTasks,
  moduleProgress,
  quizAttempts,
  reviewQueue,
  aiUsageEvents,
  readingAttempts,
  writingSubmissions,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId, lastSignedIn: new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: new Date() };
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  updateSet.role = values.role;
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function ensureLearningProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  await db.insert(learningProfiles).values({ userId }).onDuplicateKeyUpdate({
    set: { updatedAt: new Date() },
  });
  const result = await db.select().from(learningProfiles).where(eq(learningProfiles.userId, userId)).limit(1);
  return result[0];
}

export async function getLearningProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  await ensureLearningProfile(userId);
  const result = await db.select().from(learningProfiles).where(eq(learningProfiles.userId, userId)).limit(1);
  return result[0];
}

export async function updateLearnerAccent(userId: number, preferredAccent: "british" | "american") {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await ensureLearningProfile(userId);
  await db.update(learningProfiles).set({ preferredAccent }).where(eq(learningProfiles.userId, userId));
  return getLearningProfile(userId);
}

export async function updateLearnerPreferences(
  userId: number,
  preferences: {
    preferredAccent: "british" | "american";
    interfaceLanguage: "bilingual" | "english" | "arabic";
  },
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await ensureLearningProfile(userId);
  await db.update(learningProfiles).set(preferences).where(eq(learningProfiles.userId, userId));
  return getLearningProfile(userId);
}

function utcDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function previousUtcDateKey(date = new Date()) {
  const yesterday = new Date(date.getTime() - 86_400_000);
  return utcDateKey(yesterday);
}

export function passesAssessment(score: number) {
  return score >= 80;
}

export function hasCompletedModuleLessons(
  lessons: Array<{ lessonNumber: number; status: string }>,
  moduleNumber: number,
  lessonsPerModule = 5,
) {
  const firstLesson = moduleNumber * lessonsPerModule - (lessonsPerModule - 1);
  return Array.from({ length: lessonsPerModule }, (_, index) =>
    lessons.some((lesson) => lesson.lessonNumber === firstLesson + index && lesson.status === "completed"),
  ).every(Boolean);
}

export function nextDailyStreak(currentStreak: number, lastActivityDate: string | null, date = new Date()) {
  const today = utcDateKey(date);
  if (lastActivityDate === today) return currentStreak;
  return lastActivityDate === previousUtcDateKey(date) ? currentStreak + 1 : 1;
}

export function lessonAssessmentPlan(score: number, hadPassedBefore: boolean) {
  const passed = passesAssessment(score);
  const firstPass = passed && !hadPassedBefore;
  return { passed, firstPass, shouldUnlockNextLesson: passed, shouldScheduleReview: true, xpAwarded: firstPass ? 20 : 0 };
}

export function moduleAssessmentPlan(score: number, hadPassedBefore: boolean) {
  const passed = passesAssessment(score);
  const firstPass = passed && !hadPassedBefore;
  return { passed, firstPass, shouldScheduleReview: true, xpAwarded: firstPass ? 80 : 0 };
}

/** Register one eligible learning day and return the refreshed learner profile. */
export async function recordLearnerActivity(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const profile = await ensureLearningProfile(userId);
  if (!profile) throw new Error("Learner profile unavailable");

  const today = utcDateKey();
  if (profile.lastActivityDate !== today) {
    const newStreak = nextDailyStreak(profile.currentStreak, profile.lastActivityDate);
    await db.update(learningProfiles).set({
      currentStreak: newStreak,
      longestStreak: Math.max(profile.longestStreak, newStreak),
      lastActivityDate: today,
      lastActivityAt: new Date(),
    }).where(eq(learningProfiles.userId, userId));
  }
  return getLearningProfile(userId);
}

export async function getLearnerProgress(userId: number, level = "A1") {
  const db = await getDb();
  if (!db) return { lessons: [], modules: [] };
  const [lessons, modules] = await Promise.all([
    db.select().from(lessonProgress).where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.level, level))),
    db.select().from(moduleProgress).where(and(eq(moduleProgress.userId, userId), eq(moduleProgress.level, level))),
  ]);
  return { lessons, modules };
}

/** Fetch the static, versioned practice records associated with one course lesson. */
export async function getLessonPractice(level: string, lessonNumber: number) {
  const db = await getDb();
  if (!db) return { reading: undefined, writing: undefined };
  const courseLevel = await db.select().from(courseLevels).where(eq(courseLevels.code, level)).limit(1);
  if (!courseLevel[0]) return { reading: undefined, writing: undefined };
  const lesson = await db.select().from(courseLessons).where(and(
    eq(courseLessons.levelId, courseLevel[0].id),
    eq(courseLessons.lessonNumber, lessonNumber),
  )).limit(1);
  if (!lesson[0]) return { reading: undefined, writing: undefined };
  const [reading, writing] = await Promise.all([
    db.select().from(lessonReadings).where(eq(lessonReadings.lessonId, lesson[0].id)).limit(1),
    db.select().from(lessonWritingTasks).where(eq(lessonWritingTasks.lessonId, lesson[0].id)).limit(1),
  ]);
  return { reading: reading[0], writing: writing[0] };
}

export async function countAiActionsToday(userId: number, action: typeof aiUsageEvents.$inferInsert.action) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.select({ value: count() }).from(aiUsageEvents).where(and(
    eq(aiUsageEvents.userId, userId),
    eq(aiUsageEvents.action, action),
    eq(aiUsageEvents.requestDate, utcDateKey()),
  ));
  return result[0]?.value ?? 0;
}

export async function logAiUsage(input: {
  userId: number;
  action: typeof aiUsageEvents.$inferInsert.action;
  inputCharacters: number;
  outputCharacters: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(aiUsageEvents).values({
    ...input,
    requestDate: utcDateKey(),
  });
}

export async function saveWritingSubmission(input: {
  userId: number;
  level: string;
  lessonNumber: number;
  submissionKind?: "checkpoint" | "module_test";
  prompt: string;
  response: string;
  overallScore: number;
  feedback: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(writingSubmissions).values({
    ...input,
    submissionKind: input.submissionKind ?? "checkpoint",
  });
}

export async function getWritingHistory(userId: number, level: string, lessonNumber: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(writingSubmissions).where(and(
    eq(writingSubmissions.userId, userId),
    eq(writingSubmissions.level, level),
    eq(writingSubmissions.lessonNumber, lessonNumber),
  )).orderBy(desc(writingSubmissions.createdAt)).limit(10);
}

export async function saveReadingAttempt(input: {
  userId: number;
  level: string;
  lessonNumber: number;
  passage: string;
  questions: Array<{ question: string; answer: string }>;
  answers: string[];
  score: number;
  feedback: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(readingAttempts).values(input);
}

async function addXp(userId: number, amount: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const profile = await ensureLearningProfile(userId);
  if (!profile) throw new Error("Learner profile unavailable");
  if (amount) await db.update(learningProfiles).set({ totalXp: profile.totalXp + amount }).where(eq(learningProfiles.userId, userId));
  return getLearningProfile(userId);
}

export async function queueMissedReviewItems(userId: number, level: string, lessonNumber: number, itemKeys: string[]) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const now = new Date();
  await Promise.all(Array.from(new Set(itemKeys)).map(async (itemKey) => {
    const itemType = itemKey.startsWith("grammar-") ? "grammar" as const : "vocabulary" as const;
    await db.insert(reviewQueue).values({ userId, level, lessonNumber, itemType, itemKey, dueAt: now }).onDuplicateKeyUpdate({ set: { dueAt: now, repetition: 0, intervalDays: 1 } });
  }));
}

export async function getDueReviews(userId: number, level = "A1") {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviewQueue).where(and(eq(reviewQueue.userId, userId), eq(reviewQueue.level, level), lte(reviewQueue.dueAt, new Date()))).limit(8);
}

export async function completeReviewItem(userId: number, reviewId: number, correct: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const item = await db.select().from(reviewQueue).where(and(eq(reviewQueue.id, reviewId), eq(reviewQueue.userId, userId))).limit(1);
  if (!item[0]) throw new Error("Review item not found");
  const nextInterval = correct ? Math.min(Math.max(item[0].intervalDays * 2, 2), 21) : 1;
  await db.update(reviewQueue).set({ repetition: correct ? item[0].repetition + 1 : 0, intervalDays: nextInterval, dueAt: new Date(Date.now() + nextInterval * 86_400_000), lastReviewedAt: new Date() }).where(eq(reviewQueue.id, reviewId));
  await recordLearnerActivity(userId);
  return { nextInterval };
}

export async function submitLessonAssessment(input: {
  userId: number;
  level: string;
  lessonNumber: number;
  assessmentType: "lesson_quiz" | "milestone_quiz" | "module_test";
  assessmentInstanceId: number;
  score: number;
  answers: Record<string, string>;
  missedItemKeys: string[];
  moduleNumber?: number;
  lessonsPerModule?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const now = new Date();
  await db.insert(quizAttempts).values({ ...input, passed: passesAssessment(input.score) ? 1 : 0 });
  if (input.assessmentType === "milestone_quiz") {
    if (input.missedItemKeys.length) await queueMissedReviewItems(input.userId, input.level, input.lessonNumber, input.missedItemKeys);
    const profile = await addXp(input.userId, passesAssessment(input.score) ? 25 : 0);
    await recordLearnerActivity(input.userId);
    return { passed: passesAssessment(input.score), firstPass: true, xpAwarded: passesAssessment(input.score) ? 25 : 0, profile };
  }
  if (input.assessmentType === "lesson_quiz") {
    const existing = await db.select().from(lessonProgress).where(and(eq(lessonProgress.userId, input.userId), eq(lessonProgress.level, input.level), eq(lessonProgress.lessonNumber, input.lessonNumber))).limit(1);
    const plan = lessonAssessmentPlan(input.score, Boolean(existing[0]?.quizPassedAt));
    const { passed, firstPass } = plan;
    if (existing[0]) await db.update(lessonProgress).set({ status: passed ? "completed" : existing[0].status === "locked" ? "available" : existing[0].status, quizBestScore: Math.max(existing[0].quizBestScore, input.score), quizPassedAt: passed ? (existing[0].quizPassedAt ?? now) : existing[0].quizPassedAt, completedAt: passed ? (existing[0].completedAt ?? now) : existing[0].completedAt }).where(eq(lessonProgress.id, existing[0].id));
    else await db.insert(lessonProgress).values({ userId: input.userId, level: input.level, lessonNumber: input.lessonNumber, status: passed ? "completed" : "available", quizBestScore: input.score, quizPassedAt: passed ? now : null, completedAt: passed ? now : null });
    if (plan.shouldUnlockNextLesson) {
      const nextLesson = input.lessonNumber + 1;
      const next = await db.select({ id: lessonProgress.id }).from(lessonProgress).where(and(eq(lessonProgress.userId, input.userId), eq(lessonProgress.level, input.level), eq(lessonProgress.lessonNumber, nextLesson))).limit(1);
      if (!next[0]) await db.insert(lessonProgress).values({ userId: input.userId, level: input.level, lessonNumber: nextLesson, status: "available" });
    }
    if (plan.shouldScheduleReview && input.missedItemKeys.length) await queueMissedReviewItems(input.userId, input.level, input.lessonNumber, input.missedItemKeys);
    const profile = await addXp(input.userId, plan.xpAwarded);
    await recordLearnerActivity(input.userId);
    return { passed, firstPass, xpAwarded: plan.xpAwarded, profile };
  }
  const lessonsPerModule = input.lessonsPerModule ?? 5;
  const moduleNumber = input.moduleNumber ?? Math.ceil(input.lessonNumber / lessonsPerModule);
  const moduleLessons = await db.select().from(lessonProgress).where(and(eq(lessonProgress.userId, input.userId), eq(lessonProgress.level, input.level)));
  const allLessonsComplete = hasCompletedModuleLessons(moduleLessons, moduleNumber, lessonsPerModule);
  if (!allLessonsComplete) throw new Error(`Complete all ${lessonsPerModule} module lessons before taking this test.`);
  const existingModule = await db.select().from(moduleProgress).where(and(eq(moduleProgress.userId, input.userId), eq(moduleProgress.level, input.level), eq(moduleProgress.moduleNumber, moduleNumber))).limit(1);
  const plan = moduleAssessmentPlan(input.score, Boolean(existingModule[0]?.testPassedAt));
  const { passed, firstPass } = plan;
  if (existingModule[0]) await db.update(moduleProgress).set({ status: passed ? "completed" : "available", testBestScore: Math.max(existingModule[0].testBestScore, input.score), testPassedAt: passed ? (existingModule[0].testPassedAt ?? now) : existingModule[0].testPassedAt, completedAt: passed ? (existingModule[0].completedAt ?? now) : existingModule[0].completedAt }).where(eq(moduleProgress.id, existingModule[0].id));
  else await db.insert(moduleProgress).values({ userId: input.userId, level: input.level, moduleNumber, status: passed ? "completed" : "available", testBestScore: input.score, testPassedAt: passed ? now : null, completedAt: passed ? now : null });
  if (plan.shouldScheduleReview && input.missedItemKeys.length) await queueMissedReviewItems(input.userId, input.level, input.lessonNumber, input.missedItemKeys);
  const profile = await addXp(input.userId, plan.xpAwarded);
  await recordLearnerActivity(input.userId);
  return { passed, firstPass, xpAwarded: plan.xpAwarded, profile };
}
