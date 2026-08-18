import { describe, expect, it } from "vitest";
import { A1_COURSE, A2_COURSE, B1_COURSE, B2_COURSE, C1_COURSE, C2_COURSE } from "./index";

const courses = [A1_COURSE, A2_COURSE, B1_COURSE, B2_COURSE, C1_COURSE, C2_COURSE];

describe("all-level lesson activity plans", () => {
  it("keeps activity routes well-formed without imposing a universal authored activity count", () => {
    for (const course of courses) {
      expect(course.lessons).toHaveLength(course.totalLessons);
      for (const lesson of course.lessons) {
        expect(lesson.level).toBe(course.level);
        expect(lesson.lessonType).toBeDefined();
        expect(lesson.activities?.length).toBeGreaterThanOrEqual(lesson.experience ? 1 : 2);
        if (lesson.experience) {
          expect(lesson.experience.selectedStages.length).toBeGreaterThanOrEqual(2);
        } else {
          expect(lesson.progression).toEqual([
            "introduction",
            "explanation",
            "guided-practice",
            "independent-practice",
            "real-context",
            "review",
            "assessment",
          ]);
        }
        expect(lesson.activities?.every((activity) => Boolean(activity.id && activity.kind && activity.title && activity.titleArabic && activity.objective && activity.objectiveArabic && activity.estimatedMinutes > 0))).toBe(true);
        expect(lesson.activities?.some((activity) => Boolean(
          activity.vocabularyIds?.length
          || activity.grammarIds?.length
          || activity.visualItems?.length
          || activity.interactionTurns?.length
          || activity.speakingLines?.length
          || activity.readingText
          || activity.writingPrompt
          || activity.suggestedVocabulary?.length
          || activity.sentencePatterns?.length,
        ))).toBe(true);
        expect(lesson.grammar.teachingGuide).toEqual(expect.objectContaining({ whatItIs: expect.any(String), whyWeUseIt: expect.any(String), positiveExamples: expect.any(Array), negativeExamples: expect.any(Array), questionExamples: expect.any(Array), shortAnswerExamples: expect.any(Array), whenToUse: expect.any(Array), arabicSpeakerNotes: expect.any(Array) }));
      }
    }
  });

  it("provides the appropriate multimodal payload for each generated focus family", () => {
    for (const course of courses) {
      const byType = new Map<string, typeof course.lessons>();
      for (const lesson of course.lessons) {
        const lessons = byType.get(lesson.lessonType) ?? [];
        lessons.push(lesson);
        byType.set(lesson.lessonType, lessons);
      }
      const allActivities = course.lessons.flatMap((lesson) => lesson.activities ?? []);
      if ((["A1", "A2", "B1"] as const).includes(course.level as "A1" | "A2" | "B1")) {
        expect(Boolean(byType.get("visual-vocabulary")?.some((lesson) => lesson.activities?.some((activity) => Boolean(activity.visualItems?.length && activity.visualItems.every((item) => item.imageUrl?.startsWith("data:image/svg+xml") && item.altText)))) || allActivities.some((activity) => Boolean(activity.visualItems?.length && activity.visualItems.every((item) => item.imageUrl?.startsWith("data:image/svg+xml") && item.altText))))).toBe(true);
      }
      expect(allActivities.some((activity) => activity.kind === "interaction" && activity.interactionTurns?.length)).toBe(true);
      expect(allActivities.some((activity) => activity.kind === "speaking" && activity.speakingLines?.length)).toBe(true);
      expect(allActivities.some((activity) => activity.kind === "reading" && activity.readingText && activity.readingChecks?.length)).toBe(true);
      expect(allActivities.some((activity) => activity.kind === "writing" && activity.writingPrompt && (course.level === "C1" || activity.suggestedVocabulary?.length))).toBe(true);
    }
  });
});
