import { describe, expect, it } from "vitest";
import { hasCompletedModuleLessons, lessonAssessmentPlan, moduleAssessmentPlan, nextDailyStreak, passesAssessment } from "./db";

describe("assessment progression rules", () => {
  it("requires at least 80 percent to pass", () => {
    expect(passesAssessment(79)).toBe(false);
    expect(passesAssessment(80)).toBe(true);
  });

  it("locks module 1 until every one of its five lessons is completed", () => {
    const fourComplete = [1, 2, 3, 4].map((lessonNumber) => ({ lessonNumber, status: "completed" }));
    const fiveComplete = [...fourComplete, { lessonNumber: 5, status: "completed" }];
    expect(hasCompletedModuleLessons(fourComplete, 1)).toBe(false);
    expect(hasCompletedModuleLessons(fiveComplete, 1)).toBe(true);
  });

  it("continues a consecutive daily streak once and resets it after a gap", () => {
    const today = new Date("2026-08-15T12:00:00.000Z");
    expect(nextDailyStreak(4, "2026-08-15", today)).toBe(4);
    expect(nextDailyStreak(4, "2026-08-14", today)).toBe(5);
    expect(nextDailyStreak(4, "2026-08-12", today)).toBe(1);
  });

  it("unlocks the next lesson and schedules review only through the tested lesson assessment plan", () => {
    expect(lessonAssessmentPlan(80, false)).toMatchObject({ passed: true, firstPass: true, shouldUnlockNextLesson: true, shouldScheduleReview: true, xpAwarded: 20 });
    expect(lessonAssessmentPlan(79, false)).toMatchObject({ passed: false, firstPass: false, shouldUnlockNextLesson: false, shouldScheduleReview: true, xpAwarded: 0 });
  });

  it("awards module XP only on the first successful module test", () => {
    expect(moduleAssessmentPlan(90, false)).toMatchObject({ passed: true, firstPass: true, xpAwarded: 80 });
    expect(moduleAssessmentPlan(90, true)).toMatchObject({ passed: true, firstPass: false, xpAwarded: 0 });
  });
});
