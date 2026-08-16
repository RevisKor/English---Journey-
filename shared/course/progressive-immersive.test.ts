import { describe, expect, it } from "vitest";
import { getProgressiveImmersiveModules, IMMERSIVE_DIFFICULTY_PROFILES } from "./progressive-immersive";

describe("progressive A2-C2 immersive authoring", () => {
  it("provides six modules for every level beyond A1", () => {
    for (const level of ["A2", "B1", "B2", "C1", "C2"] as const) {
      const modules = getProgressiveImmersiveModules(level);
      expect(modules).toHaveLength(6);
      expect(modules.every((module) => module.lessonBlueprints.length === IMMERSIVE_DIFFICULTY_PROFILES[level].lessonsPerModule)).toBe(true);
    }
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
