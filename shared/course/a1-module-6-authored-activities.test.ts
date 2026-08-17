import { describe, expect, it } from "vitest";
import { A1_LESSONS } from "./a1";

describe("A1 Module 6 authored work, hobbies, and connected-life journeys", () => {
  const moduleSix = A1_LESSONS.slice(75, 90);
  const openingWave = moduleSix.slice(0, 5);
  const closingWave = moduleSix.slice(10, 15);

  it("replaces generic activity fallbacks across every final A1 lesson", () => {
    expect(moduleSix).toHaveLength(15);
    expect(moduleSix.every((lesson) => lesson.activities && lesson.activities.length >= 2)).toBe(true);
    expect(moduleSix.every((lesson) => lesson.activities?.every((activity) => activity.semantic && activity.progressiveSupports?.length))).toBe(true);
  });

  it("opens with visibly different jobs, questions, hobby, ability, and reason experiences", () => {
    expect(openingWave.map((lesson) => lesson.activities?.map((activity) => activity.kind))).toEqual([
      ["visual-vocabulary", "speaking", "review"],
      ["interaction", "standard"],
      ["standard", "speaking"],
      ["standard", "speaking", "review"],
      ["standard", "writing"],
    ]);
  });

  it("keeps the connected-day writing route privacy-safe while preserving a meaningful paragraph purpose", () => {
    const dayModel = moduleSix[10].activities?.find((activity) => activity.id === "a1-m6-l86-day-model");
    const dayDraft = moduleSix[10].activities?.find((activity) => activity.id === "a1-m6-l86-character-day-write");

    expect(dayModel?.writingPrompt).toContain("Rami is a student");
    expect(dayDraft?.objective).toContain("fictional work-or-study day");
    expect(dayDraft?.writingPrompt).toContain("character card if you prefer privacy");
  });

  it("makes both authored connected-life readings carry well-formed contextual checks", () => {
    const busyWeek = moduleSix[7].activities?.find((activity) => activity.id === "a1-m6-l83-busy-week-read");
    const workPeople = moduleSix[8].activities?.find((activity) => activity.id === "a1-m6-l84-work-people-read");

    expect(busyWeek?.readingChecks?.every((check) => check.type && check.prompt && check.promptArabic && check.answer)).toBe(true);
    expect(workPeople?.readingChecks?.map((check) => check.answer)).toEqual([
      "The nurse.",
      "His students.",
      "Mr Ali's students.",
    ]);
  });

  it("keeps character writing, social speaking, conversation integration, review, and the final checkpoint purposefully separate", () => {
    expect(closingWave.map((lesson) => lesson.activities?.map((activity) => activity.kind))).toEqual([
      ["writing", "writing"],
      ["speaking", "interaction"],
      ["interaction", "speaking"],
      ["review", "interaction"],
      ["assessment", "review"],
    ]);
    expect(closingWave[2].activities?.find((activity) => activity.id === "a1-m6-l88-complete-conversation")?.objective).toContain("greeting, work or study, hobby, invitation, and close");
    expect(closingWave[4].activities?.find((activity) => activity.id === "a1-m6-l90-a1-next-bridge")?.objective).toContain("bridge into A2");
  });

  it("assigns varied connected-life archetypes and selected stages instead of a universal route", () => {
    expect(openingWave.map((lesson) => lesson.experience?.archetype)).toEqual([
      "vocabulary",
      "interaction",
      "vocabulary",
      "grammar",
      "notice",
    ]);
    expect(closingWave.map((lesson) => lesson.experience?.archetype)).toEqual([
      "writing",
      "speaking",
      "integration",
      "review",
      "assessment",
    ]);
    expect(new Set(moduleSix.map((lesson) => lesson.experience?.selectedStages.join(","))).size).toBeGreaterThan(9);
  });
});
