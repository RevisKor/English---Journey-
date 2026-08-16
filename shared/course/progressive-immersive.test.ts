import { describe, expect, it } from "vitest";
import { getProgressiveImmersiveModules, IMMERSIVE_DIFFICULTY_PROFILES } from "./progressive-immersive";
import { A2_AUTHORED_LESSON_COUNT } from "./a2-immersive-authoring";

describe("progressive A2-C2 immersive authoring", () => {
  it("provides the approved module count for each authored level", () => {
    const expectedCounts = { A2: 9, B1: 6, B2: 6, C1: 6, C2: 6 } as const;
    for (const level of ["A2", "B1", "B2", "C1", "C2"] as const) {
      const modules = getProgressiveImmersiveModules(level);
      expect(modules).toHaveLength(expectedCounts[level]);
      expect(modules.every((module) => module.lessonBlueprints.length === IMMERSIVE_DIFFICULTY_PROFILES[level].lessonsPerModule)).toBe(true);
    }
  });

  it("authors a complete nine-module A2 journey with distinct lesson arcs", () => {
    const modules = getProgressiveImmersiveModules("A2");
    const lessons = modules.flatMap((module) => module.lessonBlueprints);
    expect(A2_AUTHORED_LESSON_COUNT).toBe(135);
    expect(modules).toHaveLength(9);
    expect(lessons).toHaveLength(135);
    expect(new Set(lessons.map((lesson) => lesson.title)).size).toBe(135);
    expect(lessons.every((lesson) => lesson.titleArabic.length > 4 && lesson.grammarFocus.length > 12 && lesson.vocabularyAnchors.length >= 3)).toBe(true);
    expect(new Set(lessons.map((lesson) => lesson.type)).size).toBeGreaterThanOrEqual(7);
  });

  it("increases reading, writing, and lesson-length demands across CEFR levels", () => {
    const levels = ["A2", "B1", "B2", "C1", "C2"] as const;
    const profiles = levels.map((level) => IMMERSIVE_DIFFICULTY_PROFILES[level]);
    expect(profiles.map((profile) => profile.expectedReadingWords)).toEqual([180, 450, 800, 1400, 2200]);
    expect(profiles.map((profile) => profile.expectedWritingWords)).toEqual([80, 160, 240, 420, 650]);
    expect(profiles.map((profile) => profile.lessonsPerModule)).toEqual([15, 16, 16, 18, 20]);
  });

  it("raises the mentor and assessment stance rather than only changing labels", () => {
    const a2 = getProgressiveImmersiveModules("A2")[0];
    const c2 = getProgressiveImmersiveModules("C2")[0];
    expect(a2.mentorOpening).toContain("investigate");
    expect(c2.mentorOpening).toContain("investigate");
    expect(a2.assessmentRecipe.join(" ")).toContain("180");
    expect(c2.assessmentRecipe.join(" ")).toContain("2200");
    expect(c2.lessonBlueprints[0].beginnerExplanation).toContain("2200");
    expect(c2.requiredSkills).toContain("mediation");
  });

  it("repeats vocabulary through reading, use, writing, and retrieval in every level", () => {
    for (const level of ["A2", "B1", "B2", "C1", "C2"] as const) {
      const module = getProgressiveImmersiveModules(level)[0];
      expect(module.requiredSkills).toEqual(expect.arrayContaining(["reading", "writing", "speaking", "mediation"]));
      expect(module.lessonBlueprints.every((lesson) => ["read", "retrieve", "use", "write"].every((mode) => lesson.exposurePlan.some((item) => item.mode === mode)))).toBe(true);
    }
  });
});
