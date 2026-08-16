import { describe, expect, it } from "vitest";
import { COURSE_MODULE_THEMES, moduleTheme } from "./module-guidance";

describe("bilingual thematic module architecture", () => {
  it("defines named modules with Arabic overviews for every authored level", () => {
    for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"] as const) {
      const expectedCount = level === "A1" ? 6 : level === "A2" ? 9 : 4;
      expect(COURSE_MODULE_THEMES[level]).toHaveLength(expectedCount);
      expect(COURSE_MODULE_THEMES[level].every((theme) => theme.title.length > 5 && theme.titleArabic.length > 3 && theme.overview.length > 40 && theme.overviewArabic.length > 20)).toBe(true);
    }
  });

  it("keeps the most advanced module arcs focused on judgement and mediation", () => {
    expect(moduleTheme("C1", 4).title).toBe("Public Reasoning");
    expect(moduleTheme("C2", 4).title).toBe("Mediation and Synthesis");
  });
});
