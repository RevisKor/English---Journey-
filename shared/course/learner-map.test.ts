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

  it("groups C1 lessons into ten named bilingual arcs", () => {
    const sections = buildLearnerCourseMap("C1", C1_LESSONS);
    expect(sections).toHaveLength(10);
    expect(sections[0].title).toBe("Sources and Perspectives");
    expect(sections.every((section) => section.lessons.length === 16 && section.titleArabic.length > 3)).toBe(true);
  });

  it("uses first-class C1 module metadata when rendering the map", () => {
    const sections = buildLearnerCourseMap("C1", C1_LESSONS, C1_COURSE.modules);
    expect(sections[0]).toEqual(expect.objectContaining({ title: "Sources and Perspectives", titleArabic: "المصادر ووجهات النظر", lessons: expect.arrayContaining([expect.objectContaining({ lessonNumber: 1 })]) }));
    expect(sections[0].lessons).toHaveLength(16);
  });

  it("keeps the C2 capstone sequence visible as a final mediation arc", () => {
    const sections = buildLearnerCourseMap("C2", C2_LESSONS);
    expect(sections).toHaveLength(12);
    expect(sections.at(-1)?.title).toBe("Final Independent Studio");
    expect(sections.at(-1)?.lessons.map((lesson) => lesson.lessonNumber)).toEqual([166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180]);
  });
});
