import { describe, expect, it } from "vitest";
import { hasCompletedModuleLessons, passesAssessment } from "./db";

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
});
