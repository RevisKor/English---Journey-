import { describe, expect, it } from "vitest";
import { A1_LESSONS } from "./a1";

describe("A1 Module 5 authored places-and-getting-around journeys", () => {
  const moduleFive = A1_LESSONS.slice(60, 75);
  const openingWave = moduleFive.slice(0, 5);
  const closingWave = moduleFive.slice(10, 15);

  it("replaces generic activity fallbacks across every places-and-directions lesson", () => {
    expect(moduleFive).toHaveLength(15);
    expect(moduleFive.every((lesson) => lesson.activities && lesson.activities.length >= 2)).toBe(true);
    expect(moduleFive.every((lesson) => lesson.activities?.every((activity) => activity.semantic && activity.progressiveSupports?.length))).toBe(true);
  });

  it("opens with visibly different town, question, direction, transport, and help experiences", () => {
    expect(openingWave.map((lesson) => lesson.activities?.map((activity) => activity.kind))).toEqual([
      ["visual-vocabulary", "speaking", "review"],
      ["interaction", "standard", "speaking"],
      ["speaking", "interaction"],
      ["visual-vocabulary", "interaction", "review"],
      ["interaction", "speaking"],
    ]);
  });

  it("keeps route writing privacy-safe while making fictional map work purposeful", () => {
    const routeModel = moduleFive[10].activities?.find((activity) => activity.id === "a1-m5-l71-route-model");
    const routeDraft = moduleFive[10].activities?.find((activity) => activity.id === "a1-m5-l71-fictional-route");

    expect(routeModel?.writingPrompt).toContain("Start at the park");
    expect(routeDraft?.objective).toContain("fictional map");
    expect(routeDraft?.writingPrompt).toContain("practice map only");
  });

  it("makes both authored place readings carry well-formed contextual checks", () => {
    const busJourney = moduleFive[7].activities?.find((activity) => activity.id === "a1-m5-l68-bus-journey-read");
    const cityMessage = moduleFive[8].activities?.find((activity) => activity.id === "a1-m5-l69-city-message-read");

    expect(busJourney?.readingChecks?.every((check) => check.type && check.prompt && check.promptArabic && check.answer)).toBe(true);
    expect(cityMessage?.readingChecks?.map((check) => check.answer)).toEqual([
      "At the park.",
      "He is playing football.",
      "False",
    ]);
  });

  it("keeps route writing, social help, listening, review, and assessment purposefully separate", () => {
    expect(closingWave.map((lesson) => lesson.activities?.map((activity) => activity.kind))).toEqual([
      ["writing", "writing"],
      ["interaction", "speaking"],
      ["speaking", "interaction"],
      ["review", "interaction"],
      ["assessment", "review"],
    ]);
    expect(closingWave[1].activities?.find((activity) => activity.id === "a1-m5-l72-lost-help-roleplay")?.objective).toContain("flexible help exchange");
    expect(closingWave[4].activities?.find((activity) => activity.id === "a1-m5-l75-next-bridge")?.objective).toContain("work, hobbies");
  });

  it("assigns varied town archetypes and selected stages instead of a universal route", () => {
    expect(openingWave.map((lesson) => lesson.experience?.archetype)).toEqual([
      "vocabulary",
      "interaction",
      "speaking",
      "vocabulary",
      "interaction",
    ]);
    expect(closingWave.map((lesson) => lesson.experience?.archetype)).toEqual([
      "writing",
      "real-world",
      "listening",
      "review",
      "assessment",
    ]);
    expect(new Set(moduleFive.map((lesson) => lesson.experience?.selectedStages.join(","))).size).toBeGreaterThan(9);
  });
});
