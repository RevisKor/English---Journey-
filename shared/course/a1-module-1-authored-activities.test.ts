import { describe, expect, it } from "vitest";
import { A1_LESSONS } from "./a1";

describe("A1 Module 1 authored activity waves", () => {
  const pilot = A1_LESSONS.slice(0, 8);

  it("replaces generic fallback activity shapes with varied authored journeys", () => {
    expect(pilot.map((lesson) => lesson.activities?.map((activity) => activity.kind))).toEqual([
      ["visual-vocabulary", "speaking", "interaction", "review"],
      ["review", "interaction", "standard", "speaking"],
      ["standard", "writing", "assessment"],
      ["visual-vocabulary", "standard", "interaction", "review"],
      ["review", "speaking", "interaction", "assessment"],
      ["standard", "speaking", "interaction", "review"],
      ["visual-vocabulary", "standard", "interaction", "speaking"],
      ["review", "interaction", "interaction", "assessment"],
    ]);
  });

  it("uses semantic labels and progressive support rather than decorative colour or a universal sequence", () => {
    for (const lesson of pilot) {
      expect(lesson.activities).toBeDefined();
      expect(lesson.activities?.every((activity) => activity.semantic && activity.progressiveSupports?.length)).toBe(true);
    }
  });

  it("keeps module-one retrieval natural and records the first speaking integration without an accent score", () => {
    expect(pilot[3].activities?.find((activity) => activity.id === "a1-m1-l4-return")?.writingPrompt).toContain("Do not force every old word");
    expect(pilot[4].activities?.find((activity) => activity.id === "a1-m1-l5-self-check")?.objective).toContain("accent is never graded");
  });

  it("keeps the second authoring wave objective-led, private by choice, and safe to repair", () => {
    expect(pilot[5].activities?.find((activity) => activity.id === "a1-m1-l6-age-card")?.objective).toContain("never has to disclose personal information");
    expect(pilot[6].activities?.find((activity) => activity.id === "a1-m1-l7-word-order-notice")?.objective).toContain("without adding a long adjective lecture");
    expect(pilot[7].activities?.find((activity) => activity.id === "a1-m1-l8-help-roleplay")?.objective).toContain("repair phrase");
  });

  it("gives the third authoring wave distinct reading, writing, and family-language experiences", () => {
    const thirdWave = A1_LESSONS.slice(8, 11);

    expect(thirdWave.map((lesson) => lesson.activities?.map((activity) => activity.kind))).toEqual([
      ["reading", "standard", "interaction", "review"],
      ["review", "standard", "writing", "assessment"],
      ["visual-vocabulary", "standard", "interaction", "review"],
    ]);
    expect(thirdWave[0].activities?.find((activity) => activity.id === "a1-m1-l9-kind-reading")?.objective).toContain("rather than trying to translate every word");
    expect(thirdWave[1].activities?.find((activity) => activity.id === "a1-m1-l10-profile-pieces")?.objective).toContain("optional");
    expect(thirdWave[2].activities?.find((activity) => activity.id === "a1-m1-l11-fictional-family-card")?.objective).toContain("safe fictional scenario");
  });

  it("finishes Module 1 with distinct profession, meeting, speaking, and supportive assessment journeys", () => {
    const finalWave = A1_LESSONS.slice(11, 15);

    expect(finalWave.map((lesson) => lesson.activities?.map((activity) => activity.kind))).toEqual([
      ["visual-vocabulary", "standard", "interaction", "review"],
      ["review", "standard", "interaction", "assessment"],
      ["speaking", "interaction", "review"],
      ["assessment", "reading", "writing", "speaking", "review"],
    ]);
    expect(finalWave[0].activities?.find((activity) => activity.id === "a1-m1-l12-job-picture-set")?.objective).toContain("people and purposes");
    expect(finalWave[1].activities?.find((activity) => activity.id === "a1-m1-l13-supported-meeting")?.objective).toContain("short first meeting");
    expect(finalWave[2].activities?.find((activity) => activity.id === "a1-m1-l14-choice-rehearsal")?.objective).toContain("short, medium, or full version");
    expect(finalWave[3].activities?.find((activity) => activity.id === "a1-m1-l15-kind-assessment-intro")?.objective).toContain("supported chance");
  });
});
