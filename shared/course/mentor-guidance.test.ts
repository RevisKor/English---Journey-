import { describe, expect, it } from "vitest";
import { A2_LESSONS, B1_LESSONS, B2_LESSONS, C1_LESSONS, C2_LESSONS } from "./index";
import { buildCourseMapMentorPreview, buildMentorGuide } from "./mentor-guidance";

describe("mentor-guided lesson content", () => {
  it("creates a bilingual, continuous guide for A2, B1, and B2 lessons", () => {
    for (const lesson of [A2_LESSONS[0], B1_LESSONS[0], B2_LESSONS[0], C1_LESSONS[0], C2_LESSONS[0]]) {
      const guide = buildMentorGuide(lesson);
      expect(guide?.moments.map((moment) => moment.id)).toEqual(["welcome", "vocabulary", "grammar", "practice", "reading", "writing", "check"]);
      expect(guide?.moments.every((moment) => moment.message.length > 80 && moment.messageArabic.length > 30)).toBe(true);
      expect(guide?.moments[0].message).toContain(lesson.title);
    }
  });

  it("grounds the guided route in each authored lesson scenario and practice brief", () => {
    for (const lesson of [A2_LESSONS[0], B1_LESSONS[0], B2_LESSONS[0], C1_LESSONS[0], C2_LESSONS[0]]) {
      const guide = buildMentorGuide(lesson);
      expect(guide?.moments.find((moment) => moment.id === "welcome")?.message).toContain(lesson.learningPlan?.outcome.scenario ?? lesson.title);
      expect(guide?.moments.find((moment) => moment.id === "reading")?.message).toContain(lesson.practiceBrief?.readingBrief ?? "Read for the situation first");
      expect(guide?.moments.find((moment) => moment.id === "writing")?.message).toContain(lesson.practiceBrief?.writingPrompt ?? "Write a short response");
    }
  });

  it("creates a bilingual beginner mentor guide for A1", async () => {
    const { A1_LESSONS } = await import("./index");
    const guide = buildMentorGuide(A1_LESSONS[0]);
    expect(guide?.level).toBe("A1");
    expect(guide?.moments).toHaveLength(7);
    expect(guide?.moments[0].messageArabic).toBe(A1_LESSONS[0].mentorGuide?.moments[0].messageArabic);
  });

  it("provides a bilingual pre-lesson mentor preview and lesson-entry CTA for each guided level", () => {
    for (const lesson of [A2_LESSONS[0], B1_LESSONS[0], B2_LESSONS[0], C1_LESSONS[0], C2_LESSONS[0]]) {
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
