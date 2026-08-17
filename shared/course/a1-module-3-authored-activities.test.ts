import { describe, expect, it } from "vitest";
import { A1_LESSONS } from "./a1";

describe("A1 Module 3 authored food-and-market journeys", () => {
  const moduleThree = A1_LESSONS.slice(30, 45);
  const openingWave = moduleThree.slice(0, 5);
  const closingWave = moduleThree.slice(10, 15);

  it("replaces generic activity fallbacks across every Module 3 lesson", () => {
    expect(moduleThree).toHaveLength(15);
    expect(moduleThree.every((lesson) => lesson.activities && lesson.activities.length >= 3)).toBe(true);
    expect(moduleThree.every((lesson) => lesson.activities?.every((activity) => activity.semantic && activity.progressiveSupports?.length))).toBe(true);
  });

  it("uses visibly different activity patterns for the opening food, reading, and quantity journeys", () => {
    expect(openingWave.map((lesson) => lesson.activities?.map((activity) => activity.kind))).toEqual([
      ["visual-vocabulary", "interaction", "review"],
      ["standard", "interaction", "speaking"],
      ["interaction", "speaking", "review"],
      ["reading", "standard", "interaction"],
      ["standard", "interaction", "speaking"],
    ]);
  });

  it("keeps food choices and meal writing privacy-safe while retaining a meaningful communicative purpose", () => {
    expect(moduleThree[0].activities?.find((activity) => activity.id === "a1-m3-l31-basket-choice")?.objective).toContain("low-pressure choice");
    expect(moduleThree[10].activities?.find((activity) => activity.id === "a1-m3-l41-meal-writing")?.writingPrompt).toContain("practice meal, not your own meal");
    expect(moduleThree[10].activities?.find((activity) => activity.id === "a1-m3-l41-writing-self-check")?.objective).toContain("beginner-safe writing habit");
  });

  it("makes the two authored food readings carry well-formed contextual checks", () => {
    const breakfastReading = moduleThree[3].activities?.find((activity) => activity.id === "a1-m3-l34-breakfast-reading");
    const shoppingListReading = moduleThree[8].activities?.find((activity) => activity.id === "a1-m3-l39-shopping-list-reading");

    expect(breakfastReading?.readingChecks?.every((check) => check.type && check.prompt && check.promptArabic)).toBe(true);
    expect(shoppingListReading?.readingChecks?.map((check) => check.answer)).toEqual(["Two apples.", "No, we do not."]);
  });

  it("makes the market role-play, listening task, review, and checkpoint serve separate learner aims", () => {
    expect(closingWave.map((lesson) => lesson.activities?.map((activity) => activity.kind))).toEqual([
      ["review", "writing", "standard"],
      ["interaction", "interaction", "speaking"],
      ["speaking", "interaction", "standard"],
      ["review", "interaction", "review"],
      ["review", "assessment", "review"],
    ]);
    expect(closingWave[1].activities?.find((activity) => activity.id === "a1-m3-l42-market-mission")?.objective).toContain("rather than performing a long fixed dialogue");
    expect(closingWave[4].activities?.find((activity) => activity.id === "a1-m3-l45-next-step")?.writingPrompt).toContain("not a judgement");
  });

  it("assigns purposeful non-identical archetypes and stage selections rather than a universal Module 3 template", () => {
    expect(openingWave.map((lesson) => lesson.experience?.archetype)).toEqual([
      "vocabulary",
      "notice",
      "discover",
      "reading",
      "grammar",
    ]);
    expect(closingWave.map((lesson) => lesson.experience?.archetype)).toEqual([
      "writing",
      "real-world",
      "listening",
      "review",
      "assessment",
    ]);
    expect(new Set(moduleThree.map((lesson) => lesson.experience?.selectedStages.join(","))).size).toBeGreaterThan(10);
  });
});
