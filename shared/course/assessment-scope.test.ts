import { describe, expect, it } from "vitest";
import { A1_COURSE, C1_COURSE, C2_COURSE, isMilestoneLesson, milestoneLessonNumbers, moduleNumberForLesson } from "./index";

describe("milestone checkpoint scope", () => {
  it("uses the final lesson of each active module for A1 and C1", () => {
    expect(milestoneLessonNumbers(A1_COURSE)).toEqual([15, 30, 45, 60, 75, 90]);
    expect(milestoneLessonNumbers(C1_COURSE)).toEqual([16, 32, 48, 64, 80, 96, 112, 128, 144, 160]);
    expect(isMilestoneLesson(A1_COURSE, 15)).toBe(true);
    expect(isMilestoneLesson(A1_COURSE, 14)).toBe(false);
    expect(isMilestoneLesson(C1_COURSE, 15)).toBe(false);
  });

  it("adapts the same rule to C2’s fifteen-lesson modules", () => {
    expect(milestoneLessonNumbers(C2_COURSE)).toEqual([15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180]);
    expect(moduleNumberForLesson(C2_COURSE, 30)).toBe(2);
    expect(isMilestoneLesson(C2_COURSE, 180)).toBe(true);
    expect(isMilestoneLesson(C2_COURSE, 179)).toBe(false);
  });
});
