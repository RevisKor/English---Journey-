import { describe, expect, it } from "vitest";
import { A1_IMMERSIVE_MODULES, buildImmersiveExposureIndex } from "./a1-immersive-modules";
import { A1_REMAINING_IMMERSIVE_MODULES } from "./a1-immersive-modules-expanded";

describe("expanded A1 immersive modules", () => {
  it("authors six distinct thematic modules with complete 15-lesson arcs", () => {
    expect(A1_IMMERSIVE_MODULES).toHaveLength(6);
    expect(A1_REMAINING_IMMERSIVE_MODULES).toHaveLength(5);
    expect(A1_IMMERSIVE_MODULES.map((module) => module.moduleNumber)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(A1_IMMERSIVE_MODULES.every((module) => module.level === "A1" && module.lessonBlueprints.length === 15)).toBe(true);
  });

  it("varies lesson modes and ends every new module with contextual assessment", () => {
    for (const module of A1_REMAINING_IMMERSIVE_MODULES) {
      const types = new Set(module.lessonBlueprints.map((lesson) => lesson.type));
      expect(types.size).toBeGreaterThanOrEqual(5);
      expect(module.lessonBlueprints.at(-1)?.type).toBe("assessment");
      expect(module.lessonBlueprints.at(-1)?.practiceModes).toContain("reading");
      expect(module.lessonBlueprints.at(-1)?.practiceModes).toContain("writing");
      expect(module.assessmentRecipe.join(" ")).toContain("context");
    }
  });

  it("keeps beginner bilingual explanations and repeated exposure in every new lesson", () => {
    for (const module of A1_REMAINING_IMMERSIVE_MODULES) {
      expect(module.mentorOpeningArabic).toBeTruthy();
      expect(module.lessonBlueprints.every((lesson) => lesson.beginnerExplanation && lesson.beginnerExplanationArabic && lesson.exposurePlan.length >= 4)).toBe(true);
    }
  });

  it("combines the module exposure plans for future word-bank review", () => {
    const index = buildImmersiveExposureIndex();
    expect(index.family.length).toBeGreaterThanOrEqual(2);
    expect(index.apple.length).toBeGreaterThanOrEqual(2);
    expect(index.morning.length).toBeGreaterThanOrEqual(2);
    expect(index.street.length).toBeGreaterThanOrEqual(2);
    expect(index.job.length).toBeGreaterThanOrEqual(2);
  });
});
