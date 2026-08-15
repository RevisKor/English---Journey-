import { describe, expect, it } from "vitest";
import { C1_LESSONS } from "./c1";
import { C2_LESSONS } from "./c2";
import { buildLearnerCourseMap } from "./learner-map";

describe("learner-facing course map", () => {
  it("groups C1 lessons into four named bilingual arcs", () => {
    const sections = buildLearnerCourseMap("C1", C1_LESSONS);
    expect(sections).toHaveLength(4);
    expect(sections.map((section) => section.title)).toEqual(["Sources and Perspectives", "Systems and Change", "Culture and Identity", "Public Reasoning"]);
    expect(sections.every((section) => section.lessons.length === 5 && section.titleArabic.length > 3)).toBe(true);
  });

  it("keeps the C2 capstone sequence visible as a final mediation arc", () => {
    const sections = buildLearnerCourseMap("C2", C2_LESSONS);
    expect(sections).toHaveLength(4);
    expect(sections[3].title).toBe("Mediation and Synthesis");
    expect(sections[3].lessons.map((lesson) => lesson.lessonNumber)).toEqual([13, 14, 15, 16]);
  });
});
