import { describe, expect, it } from "vitest";
import { A2_LESSONS, B1_LESSONS, B2_LESSONS } from "./index";
import { buildCourseMapMentorPreview, buildMentorGuide } from "./mentor-guidance";

describe("mentor-guided lesson content", () => {
  it("creates a bilingual, continuous guide for A2, B1, and B2 lessons", () => {
    for (const lesson of [A2_LESSONS[0], B1_LESSONS[0], B2_LESSONS[0]]) {
      const guide = buildMentorGuide(lesson);
      expect(guide?.moments.map((moment) => moment.id)).toEqual(["welcome", "vocabulary", "grammar", "practice", "reading", "writing", "check"]);
      expect(guide?.moments.every((moment) => moment.message.length > 80 && moment.messageArabic.length > 30)).toBe(true);
      expect(guide?.moments[0].message).toContain(lesson.title);
    }
  });

  it("does not create a mentor guide for the intentionally lighter A1 route", async () => {
    const { A1_LESSONS } = await import("./index");
    expect(buildMentorGuide(A1_LESSONS[0])).toBeNull();
  });

  it("provides a bilingual pre-lesson mentor preview and lesson-entry CTA for each guided level", () => {
    for (const lesson of [A2_LESSONS[0], B1_LESSONS[0], B2_LESSONS[0]]) {
      const preview = buildCourseMapMentorPreview(lesson);
      expect(preview).toMatchObject({
        level: lesson.level,
        lessonNumber: lesson.lessonNumber,
        lessonTitle: lesson.title,
        lessonTitleArabic: lesson.titleArabic,
        ctaLabel: "Open lesson",
        ctaLabelArabic: "افتح الدرس",
      });
      expect(preview?.message).toContain(lesson.title);
      expect(preview?.messageArabic).toContain(lesson.titleArabic);
    }
  });
});
