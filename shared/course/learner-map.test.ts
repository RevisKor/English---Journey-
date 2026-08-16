import { describe, expect, it } from "vitest";
import { A1_COURSE, A1_LESSONS } from "./a1";
import { C1_COURSE, C1_LESSONS } from "./c1";
import { C2_LESSONS } from "./c2";
import { buildLearnerCourseMap } from "./learner-map";

describe("learner-facing course map", () => {
  it("shows all six active fifteen-lesson A1 journeys in the learner map", () => {
    const sections = buildLearnerCourseMap("A1", A1_LESSONS, A1_COURSE.modules);
    expect(sections).toHaveLength(6);
    expect(sections.every((section) => section.immersiveRoadmap?.plannedLessons === 15)).toBe(true);
    expect(sections.every((section) => section.lessons.length === 15)).toBe(true);
    expect(sections.flatMap((section) => section.lessons)).toHaveLength(90);
  });

  it("groups C1 lessons into four named bilingual arcs", () => {
    const sections = buildLearnerCourseMap("C1", C1_LESSONS);
    expect(sections).toHaveLength(4);
    expect(sections.map((section) => section.title)).toEqual(["Sources and Perspectives", "Systems and Change", "Culture and Identity", "Public Reasoning"]);
    expect(sections.every((section) => section.lessons.length === 5 && section.titleArabic.length > 3)).toBe(true);
  });

  it("uses first-class C1 module metadata when rendering the map", () => {
    const sections = buildLearnerCourseMap("C1", C1_LESSONS, C1_COURSE.modules);
    expect(sections[0]).toEqual(expect.objectContaining({ title: "Sources and Perspectives", titleArabic: "المصادر ووجهات النظر", lessons: expect.arrayContaining([expect.objectContaining({ lessonNumber: 1 })]) }));
    expect(sections[0].lessons).toHaveLength(5);
  });

  it("keeps the C2 capstone sequence visible as a final mediation arc", () => {
    const sections = buildLearnerCourseMap("C2", C2_LESSONS);
    expect(sections).toHaveLength(4);
    expect(sections[3].title).toBe("Mediation and Synthesis");
    expect(sections[3].lessons.map((lesson) => lesson.lessonNumber)).toEqual([13, 14, 15, 16]);
  });
});
