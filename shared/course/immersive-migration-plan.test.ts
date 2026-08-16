import { describe, expect, it } from "vitest";
import { buildA1ImmersiveMigrationPlan, buildProgressiveImmersiveMigrationPlan, flattenImmersiveMigrationLessons } from "./immersive-migration-plan";

describe("immersive migration plan", () => {
  it("creates six stable A1 module source keys and leaves the current 20-lesson catalog collision-safe", () => {
    const modules = buildA1ImmersiveMigrationPlan();
    expect(modules).toHaveLength(6);
    expect(modules.map((module) => module.sourceKey)).toEqual([
      "A1:immersive:module-1", "A1:immersive:module-2", "A1:immersive:module-3",
      "A1:immersive:module-4", "A1:immersive:module-5", "A1:immersive:module-6",
    ]);
    const lessons = flattenImmersiveMigrationLessons(modules);
    expect(new Set(lessons.map((lesson) => lesson.sourceKey)).size).toBe(lessons.length);
    expect(Math.min(...lessons.map((lesson) => lesson.proposedCatalogLessonNumber))).toBe(21);
  });

  it("plans six progressively authored modules for every level from A2 through C2", () => {
    for (const [level, existingLessonCount] of [["A2", 20], ["B1", 24], ["B2", 24], ["C1", 20], ["C2", 16]] as const) {
      const modules = buildProgressiveImmersiveMigrationPlan(level, existingLessonCount);
      expect(modules).toHaveLength(6);
      expect(modules.every((module) => module.status === "shadow-preview")).toBe(true);
      expect(modules.every((module) => module.lessons.length >= 15)).toBe(true);
    }
  });
});
