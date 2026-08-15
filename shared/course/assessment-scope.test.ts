import { describe, expect, it } from "vitest";
import { A1_COURSE, C1_COURSE, C2_COURSE, isMilestoneLesson, milestoneLessonNumbers, moduleNumberForLesson } from "./index";

describe("milestone checkpoint scope", () => {
  it("uses the final lesson of each five-lesson module for A1 and C1", () => {
    expect(milestoneLessonNumbers(A1_COURSE)).toEqual([5, 10, 15, 20]);
    expect(milestoneLessonNumbers(C1_COURSE)).toEqual([5, 10, 15, 20]);
    expect(isMilestoneLesson(A1_COURSE, 10)).toBe(true);
    expect(isMilestoneLesson(C1_COURSE, 9)).toBe(false);
  });

  it("adapts the same rule to C2’s shorter modules", () => {
    expect(milestoneLessonNumbers(C2_COURSE)).toEqual([4, 8, 12, 16]);
    expect(moduleNumberForLesson(C2_COURSE, 12)).toBe(3);
    expect(isMilestoneLesson(C2_COURSE, 16)).toBe(true);
    expect(isMilestoneLesson(C2_COURSE, 15)).toBe(false);
  });
});
