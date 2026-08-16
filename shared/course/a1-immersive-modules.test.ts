import { describe, expect, it } from "vitest";
import { A1_MEETING_PEOPLE_IMMERSIVE, buildImmersiveExposureIndex } from "./a1-immersive-modules";

describe("A1 immersive module authoring", () => {
  it("defines a complete 15-lesson Meeting People arc", () => {
    const module = A1_MEETING_PEOPLE_IMMERSIVE;
    expect(module.level).toBe("A1");
    expect(module.moduleNumber).toBe(1);
    expect(module.lessonBlueprints).toHaveLength(15);
    expect(module.lessonBlueprints.map((lesson) => lesson.lessonNumber)).toEqual(
      Array.from({ length: 15 }, (_, index) => index + 1),
    );
    expect(module.lessonBlueprints.every((lesson) => lesson.moduleNumber === 1)).toBe(true);
    expect(module.lessonBlueprints.every((lesson) => lesson.title && lesson.titleArabic && lesson.mentorPurpose && lesson.mentorPurposeArabic)).toBe(true);
  });

  it("revisits the same core language through multiple modes", () => {
    const module = A1_MEETING_PEOPLE_IMMERSIVE;
    const allText = module.lessonBlueprints.flatMap((lesson) => [
      ...lesson.vocabularyAnchors,
      ...lesson.exposurePlan.map((exposure) => exposure.task),
    ]).join(" ").toLowerCase();
    expect(allText).toContain("hello");
    expect(allText).toContain("name");
    expect(allText).toContain("family");
    expect(new Set(module.lessonBlueprints.flatMap((lesson) => lesson.practiceModes))).toEqual(
      new Set(["standard", "visual-vocabulary", "interaction", "speaking", "reading", "writing", "review", "assessment"]),
    );
    expect(module.lessonBlueprints.some((lesson) => lesson.exposurePlan.some((exposure) => exposure.mode === "see"))).toBe(true);
    expect(module.lessonBlueprints.some((lesson) => lesson.exposurePlan.some((exposure) => exposure.mode === "hear"))).toBe(true);
    expect(module.lessonBlueprints.some((lesson) => lesson.exposurePlan.some((exposure) => exposure.mode === "read"))).toBe(true);
    expect(module.lessonBlueprints.some((lesson) => lesson.exposurePlan.some((exposure) => exposure.mode === "write"))).toBe(true);
    expect(module.lessonBlueprints.some((lesson) => lesson.exposurePlan.some((exposure) => exposure.mode === "retrieve"))).toBe(true);
  });

  it("indexes repeated exposure for module word-bank integration", () => {
    const index = buildImmersiveExposureIndex();
    expect(index.hello.length).toBeGreaterThanOrEqual(2);
    expect(index.name.length).toBeGreaterThanOrEqual(2);
    expect(index.family.length).toBeGreaterThanOrEqual(2);
    expect(index.hello.some((entry) => entry.mode === "hear")).toBe(true);
    expect(index.name.some((entry) => entry.mode === "retrieve")).toBe(true);
  });

  it("does not assume grammar terminology is already known", () => {
    const module = A1_MEETING_PEOPLE_IMMERSIVE;
    const firstGrammar = module.lessonBlueprints.slice(0, 4);
    expect(firstGrammar.every((lesson) => lesson.beginnerExplanation && lesson.beginnerExplanationArabic)).toBe(true);
    expect(firstGrammar[0].beginnerExplanation).toContain("sentence");
    expect(firstGrammar[2].beginnerExplanationArabic).toContain("العربية");
    expect(module.lessonBlueprints[14].beginnerExplanation).toContain("assessment");
  });

  it("ends with a multi-skill assessment instead of a spelling trap", () => {
    const finalLesson = A1_MEETING_PEOPLE_IMMERSIVE.lessonBlueprints.at(-1)!;
    expect(finalLesson.type).toBe("assessment");
    expect(finalLesson.practiceModes).toEqual(["assessment", "reading", "writing", "speaking", "review"]);
    expect(A1_MEETING_PEOPLE_IMMERSIVE.assessmentRecipe).toHaveLength(5);
    expect(A1_MEETING_PEOPLE_IMMERSIVE.assessmentRecipe.join(" ").toLowerCase()).toContain("contextual");
    expect(A1_MEETING_PEOPLE_IMMERSIVE.assessmentRecipe.join(" ").toLowerCase()).toContain("word bank");
  });
});
