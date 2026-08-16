import type { TrpcContext } from "../_core/context";
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

const assessmentMocks = vi.hoisted(() => ({
  getOrCreateAssessmentInstance: vi.fn(),
  gradeAssessmentInstance: vi.fn(),
}));

vi.mock("../db", () => mocks);
vi.mock("../assessment-instances", () => assessmentMocks);

import { courseRouter, assertLessonInCourse, assertModuleInCourse } from "./course";
import { A1_COURSE } from "../../shared/course";

function createContext(): TrpcContext {
  return {
    user: { id: 12, openId: "learner-12", name: "Learner", email: null, loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("dynamic course range validation", () => {
  const extendedCourse = {
    ...A1_COURSE,
    totalLessons: 30,
    lessonsPerModule: 5,
    lessons: Array.from({ length: 30 }, (_, index) => ({
      ...A1_COURSE.lessons[0],
      lessonNumber: index + 1,
      moduleNumber: Math.ceil((index + 1) / 5),
    })),
  };

  it("accepts expanded lesson and module ranges and rejects only the derived bounds", () => {
    expect(() => assertLessonInCourse(extendedCourse, 30)).not.toThrow();
    expect(() => assertModuleInCourse(extendedCourse, 6)).not.toThrow();
    expect(() => assertLessonInCourse(extendedCourse, 31)).toThrow("Lesson not found");
    expect(() => assertModuleInCourse(extendedCourse, 7)).toThrow("Module not found");
  });
});

describe("course assessment mutations", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.getLearnerProgress.mockResolvedValue({ lessons: [], modules: [] });
    mocks.getLearningProfile.mockResolvedValue({ totalXp: 0, currentStreak: 1 });
    mocks.submitLessonAssessment.mockResolvedValue({ passed: true, firstPass: true, xpAwarded: 20, profile: { totalXp: 20 } });
    mocks.completeReviewItem.mockResolvedValue({ nextInterval: 2 });
    mocks.recordLearnerActivity.mockResolvedValue({ currentStreak: 2 });
    assessmentMocks.getOrCreateAssessmentInstance.mockResolvedValue({ assessmentInstanceId: 101, questions: [] });
    assessmentMocks.gradeAssessmentInstance.mockResolvedValue({ level: "A1", lessonNumber: 1, moduleNumber: null, assessmentType: "lesson_quiz", score: 88, missedItemKeys: ["a1-word-1"] });
  });

  it("grades the saved lesson snapshot server-side and persists only its missed review keys", async () => {
    const caller = courseRouter.createCaller(createContext());
    const result = await caller.submitLessonQuiz({ lessonNumber: 1, assessmentInstanceId: 101, answers: { "question-1": "wrong" } });

    expect(assessmentMocks.gradeAssessmentInstance).toHaveBeenCalledWith(expect.objectContaining({
      assessmentInstanceId: 101,
      scope: { level: "A1", assessmentType: "lesson_quiz", lessonNumber: 1 },
    }));
    expect(mocks.submitLessonAssessment).toHaveBeenCalledWith(expect.objectContaining({
      userId: 12, assessmentInstanceId: 101, assessmentType: "lesson_quiz", lessonNumber: 1, score: 88, missedItemKeys: ["a1-word-1"],
    }));
    expect(result).toEqual(expect.objectContaining({ passed: true, profile: { totalXp: 20 } }));
  });

  it("persists a failing snapshot score and all associated missed items", async () => {
    mocks.submitLessonAssessment.mockResolvedValueOnce({ passed: false, firstPass: false, xpAwarded: 0, profile: { totalXp: 0 } });
    assessmentMocks.gradeAssessmentInstance.mockResolvedValueOnce({ level: "A1", lessonNumber: 1, moduleNumber: null, assessmentType: "lesson_quiz", score: 0, missedItemKeys: ["a1-word-1", "a1-word-2"] });
    const caller = courseRouter.createCaller(createContext());
    const result = await caller.submitLessonQuiz({ lessonNumber: 1, assessmentInstanceId: 102, answers: { "question-1": "wrong" } });

    expect(mocks.submitLessonAssessment).toHaveBeenCalledWith(expect.objectContaining({ score: 0, missedItemKeys: ["a1-word-1", "a1-word-2"] }));
    expect(result).toEqual(expect.objectContaining({ passed: false, xpAwarded: 0 }));
  });

  it("persists the active A2 level with an A2 assessment snapshot", async () => {
    assessmentMocks.gradeAssessmentInstance.mockResolvedValueOnce({ level: "A2", lessonNumber: 1, moduleNumber: null, assessmentType: "lesson_quiz", score: 100, missedItemKeys: [] });
    const caller = courseRouter.createCaller(createContext());
    await caller.submitLessonQuiz({ level: "A2", lessonNumber: 1, assessmentInstanceId: 103, answers: { "question-1": "answer" } });

    expect(mocks.submitLessonAssessment).toHaveBeenCalledWith(expect.objectContaining({ level: "A2", lessonNumber: 1, assessmentType: "lesson_quiz", score: 100, missedItemKeys: [] }));
  });

  it("requires module completion and then persists a graded module-test snapshot", async () => {
    mocks.hasCompletedModuleLessons.mockReturnValue(true);
    assessmentMocks.gradeAssessmentInstance.mockResolvedValueOnce({ level: "A1", lessonNumber: null, moduleNumber: 1, assessmentType: "module_test", score: 100, missedItemKeys: [] });
    const caller = courseRouter.createCaller(createContext());
    await caller.submitModuleTest({ moduleNumber: 1, assessmentInstanceId: 104, answers: { "question-1": "answer" } });

    expect(mocks.submitLessonAssessment).toHaveBeenCalledWith(expect.objectContaining({ assessmentType: "module_test", assessmentInstanceId: 104, lessonNumber: 15, lessonsPerModule: 15, score: 100, missedItemKeys: [] }));
  });

  it("returns the active personalized instance when a learner reopens a lesson quiz", async () => {
    assessmentMocks.getOrCreateAssessmentInstance.mockResolvedValueOnce({ assessmentInstanceId: 105, questions: [{ id: "q-1" }] });
    const caller = courseRouter.createCaller(createContext());
    const assessment = await caller.lessonQuiz({ level: "A2", lessonNumber: 1 });

    expect(assessment).toEqual({ assessmentInstanceId: 105, questions: [{ id: "q-1" }] });
    expect(assessmentMocks.getOrCreateAssessmentInstance).toHaveBeenCalledWith(12, { level: "A2", assessmentType: "lesson_quiz", lessonNumber: 1 });
  });

  it("denies module questions until every lesson is complete, including on the A2 route", async () => {
    mocks.hasCompletedModuleLessons.mockReturnValue(false);
    const caller = courseRouter.createCaller(createContext());

    await expect(caller.moduleTest({ moduleNumber: 1 })).rejects.toThrow("Complete all 15 module lessons");
    await expect(caller.moduleTest({ level: "A2", moduleNumber: 1 })).rejects.toThrow("Complete all 5 module lessons");
    await expect(caller.submitModuleTest({ moduleNumber: 1, assessmentInstanceId: 106, answers: {} })).rejects.toThrow("Complete all 15 module lessons");
  });

  it("persists warm-up review answers and records eligible daily activity", async () => {
    const caller = courseRouter.createCaller(createContext());
    await caller.submitWarmup({ reviewId: 42, correct: true });
    await caller.recordActivity();

    expect(mocks.completeReviewItem).toHaveBeenCalledWith(12, 42, true);
    expect(mocks.recordLearnerActivity).toHaveBeenCalledWith(12);
  });
});


describe("milestone assessment routing", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.getLearnerProgress.mockResolvedValue({ lessons: [{ lessonNumber: 3, status: "completed" }], modules: [] });
    mocks.submitLessonAssessment.mockResolvedValue({ passed: true, firstPass: true, xpAwarded: 25, profile: { totalXp: 25 } });
    assessmentMocks.getOrCreateAssessmentInstance.mockResolvedValue({ assessmentInstanceId: 207, questions: [{ id: "milestone-q" }] });
    assessmentMocks.gradeAssessmentInstance.mockResolvedValue({ level: "C2", lessonNumber: 4, moduleNumber: 1, assessmentType: "milestone_quiz", score: 92, missedItemKeys: [] });
  });

  it("creates a distinct milestone instance for the C2 checkpoint", async () => {
    const caller = courseRouter.createCaller(createContext());
    const assessment = await caller.milestoneQuiz({ level: "C2", lessonNumber: 4 });
    expect(assessment).toEqual(expect.objectContaining({ assessmentInstanceId: 207 }));
    expect(assessmentMocks.getOrCreateAssessmentInstance).toHaveBeenCalledWith(12, {
      level: "C2",
      assessmentType: "milestone_quiz",
      lessonNumber: 4,
      moduleNumber: 1,
    });
  });

  it("submits a milestone checkpoint without converting it into a cumulative module test", async () => {
    const caller = courseRouter.createCaller(createContext());
    await caller.submitMilestoneQuiz({ level: "C2", lessonNumber: 4, assessmentInstanceId: 207, answers: { "milestone-q": "answer" } });
    expect(assessmentMocks.gradeAssessmentInstance).toHaveBeenCalledWith(expect.objectContaining({
      scope: { level: "C2", assessmentType: "milestone_quiz", lessonNumber: 4, moduleNumber: 1 },
    }));
    expect(mocks.submitLessonAssessment).toHaveBeenCalledWith(expect.objectContaining({
      level: "C2", assessmentType: "milestone_quiz", lessonNumber: 4, moduleNumber: 1,
    }));
  });
});
