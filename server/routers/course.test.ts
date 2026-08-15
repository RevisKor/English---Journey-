import type { TrpcContext } from "../_core/context";
import { buildA2LessonQuiz, buildLessonQuiz, buildModuleTest } from "../../shared/course";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  completeReviewItem: vi.fn(),
  getDueReviews: vi.fn(),
  getLearnerProgress: vi.fn(),
  getLearningProfile: vi.fn(),
  hasCompletedModuleLessons: vi.fn(),
  recordLearnerActivity: vi.fn(),
  submitLessonAssessment: vi.fn(),
  updateLearnerAccent: vi.fn(),
}));

vi.mock("../db", () => mocks);

import { courseRouter } from "./course";

function createContext(): TrpcContext {
  return {
    user: { id: 12, openId: "learner-12", name: "Learner", email: null, loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("course assessment mutations", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.getLearnerProgress.mockResolvedValue({ lessons: [], modules: [] });
    mocks.getLearningProfile.mockResolvedValue({ totalXp: 0, currentStreak: 1 });
    mocks.submitLessonAssessment.mockResolvedValue({ passed: true, firstPass: true, xpAwarded: 20, profile: { totalXp: 20 } });
    mocks.completeReviewItem.mockResolvedValue({ nextInterval: 2 });
    mocks.recordLearnerActivity.mockResolvedValue({ currentStreak: 2 });
  });

  it("scores lesson answers server-side and queues only missed review keys", async () => {
    const questions = buildLessonQuiz(1);
    const answers = Object.fromEntries(questions.map((question, index) => [question.id, index === 0 ? "wrong" : question.answer]));
    const caller = courseRouter.createCaller(createContext());

    const result = await caller.submitLessonQuiz({ lessonNumber: 1, answers });

    expect(mocks.submitLessonAssessment).toHaveBeenCalledWith(expect.objectContaining({
      userId: 12,
      assessmentType: "lesson_quiz",
      lessonNumber: 1,
      score: 88,
      missedItemKeys: [questions[0].reviewItemKey],
    }));
    expect(result).toEqual(expect.objectContaining({ passed: true, profile: { totalXp: 20 } }));
  });

  it("sends a failing score and every missed item to the persistent assessment flow", async () => {
    mocks.submitLessonAssessment.mockResolvedValueOnce({ passed: false, firstPass: false, xpAwarded: 0, profile: { totalXp: 0 } });
    const questions = buildLessonQuiz(1);
    const answers = Object.fromEntries(questions.map((question) => [question.id, "wrong"]));
    const caller = courseRouter.createCaller(createContext());

    const result = await caller.submitLessonQuiz({ lessonNumber: 1, answers });

    expect(mocks.submitLessonAssessment).toHaveBeenCalledWith(expect.objectContaining({ score: 0, missedItemKeys: questions.map((question) => question.reviewItemKey) }));
    expect(result).toEqual(expect.objectContaining({ passed: false, xpAwarded: 0 }));
  });

  it("uses A2 questions and persists the active level for A2 lesson submission", async () => {
    const questions = buildA2LessonQuiz(1);
    const answers = Object.fromEntries(questions.map((question) => [question.id, question.answer]));
    const caller = courseRouter.createCaller(createContext());

    await caller.submitLessonQuiz({ level: "A2", lessonNumber: 1, answers });

    expect(mocks.submitLessonAssessment).toHaveBeenCalledWith(expect.objectContaining({
      level: "A2",
      lessonNumber: 1,
      assessmentType: "lesson_quiz",
      score: 100,
      missedItemKeys: [],
    }));
  });

  it("passes complete module answers to the persistent module-test flow", async () => {
    const questions = buildModuleTest(1);
    const answers = Object.fromEntries(questions.map((question) => [question.id, question.answer]));
    const caller = courseRouter.createCaller(createContext());

    await caller.submitModuleTest({ moduleNumber: 1, answers });

    expect(mocks.submitLessonAssessment).toHaveBeenCalledWith(expect.objectContaining({
      assessmentType: "module_test",
      lessonNumber: 5,
      score: 100,
      missedItemKeys: [],
    }));
  });

  it("denies module questions until the persistence-level prerequisite confirms every lesson", async () => {
    mocks.hasCompletedModuleLessons.mockReturnValue(false);
    const caller = courseRouter.createCaller(createContext());

    await expect(caller.moduleTest({ moduleNumber: 1 })).rejects.toThrow("Complete all five module lessons");
  });

  it("applies the same module prerequisite gate to the A2 route", async () => {
    mocks.hasCompletedModuleLessons.mockReturnValue(false);
    const caller = courseRouter.createCaller(createContext());

    await expect(caller.moduleTest({ level: "A2", moduleNumber: 1 })).rejects.toThrow("Complete all five module lessons");
  });

  it("persists warm-up review answers and records eligible daily activity", async () => {
    const caller = courseRouter.createCaller(createContext());

    await caller.submitWarmup({ reviewId: 42, correct: true });
    await caller.recordActivity();

    expect(mocks.completeReviewItem).toHaveBeenCalledWith(12, 42, true);
    expect(mocks.recordLearnerActivity).toHaveBeenCalledWith(12);
  });
});
