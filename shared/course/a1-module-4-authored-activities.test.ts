import { describe, expect, it } from "vitest";
import { A1_LESSONS } from "./a1";

describe("A1 Module 4 authored daily-life journeys", () => {
  const moduleFour = A1_LESSONS.slice(45, 60);
  const openingWave = moduleFour.slice(0, 5);
  const closingWave = moduleFour.slice(10, 15);

  it("replaces generic activity fallbacks across every daily-life lesson", () => {
    expect(moduleFour).toHaveLength(15);
    expect(moduleFour.every((lesson) => lesson.activities && lesson.activities.length >= 2)).toBe(true);
    expect(moduleFour.every((lesson) => lesson.activities?.every((activity) => activity.semantic && activity.progressiveSupports?.length))).toBe(true);
  });

  it("uses visibly different opening patterns for time, routines, grammar, and speaking", () => {
    expect(openingWave.map((lesson) => lesson.activities?.map((activity) => activity.kind))).toEqual([
      ["visual-vocabulary", "speaking", "review"],
      ["interaction", "standard", "writing"],
      ["visual-vocabulary", "interaction"],
      ["standard", "interaction", "speaking"],
      ["interaction", "speaking"],
    ]);
  });

  it("keeps weekday writing privacy-safe while giving it a clear connected-text purpose", () => {
    const weekdayPlan = moduleFour[10].activities?.find((activity) => activity.id === "a1-m4-l56-weekday-plan");
    const model = moduleFour[10].activities?.find((activity) => activity.id === "a1-m4-l56-postcard-model");

    expect(weekdayPlan?.objective).toContain("invented person, a typical day, or yourself");
    expect(weekdayPlan?.writingPrompt).toContain("fictional routine is welcome");
    expect(model?.writingPrompt).toContain("change the person, day, time, or action");
  });

  it("makes both authored daily-life readings carry well-formed contextual checks", () => {
    const schoolDay = moduleFour[5].activities?.find((activity) => activity.id === "a1-m4-l51-school-day-read");
    const twoLives = moduleFour[8].activities?.find((activity) => activity.id === "a1-m4-l54-two-lives-read");

    expect(schoolDay?.readingChecks?.every((check) => check.type && check.prompt && check.promptArabic && check.answer)).toBe(true);
    expect(twoLives?.readingChecks?.map((check) => check.answer)).toEqual([
      "Kareem.",
      "She studies.",
      "Kareem reads and Sara watches a film.",
    ]);
  });

  it("keeps planning, listening, review, and checkpoint work purposefully separate", () => {
    expect(closingWave.map((lesson) => lesson.activities?.map((activity) => activity.kind))).toEqual([
      ["writing", "writing"],
      ["interaction", "writing"],
      ["speaking", "interaction"],
      ["review", "interaction"],
      ["assessment", "review"],
    ]);
    expect(closingWave[1].activities?.find((activity) => activity.id === "a1-m4-l57-tomorrow-board")?.objective).toContain("fictional or real plan");
    expect(closingWave[4].activities?.find((activity) => activity.id === "a1-m4-l60-next-bridge")?.objective).toContain("next module");
  });

  it("assigns varied daily-life archetypes and selected stages instead of a universal route", () => {
    expect(openingWave.map((lesson) => lesson.experience?.archetype)).toEqual([
      "vocabulary",
      "discover",
      "vocabulary",
      "grammar",
      "interaction",
    ]);
    expect(closingWave.map((lesson) => lesson.experience?.archetype)).toEqual([
      "writing",
      "real-world",
      "listening",
      "review",
      "assessment",
    ]);
    expect(new Set(moduleFour.map((lesson) => lesson.experience?.selectedStages.join(","))).size).toBeGreaterThan(9);
  });
});
