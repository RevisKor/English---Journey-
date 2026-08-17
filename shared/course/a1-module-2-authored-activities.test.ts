import { describe, expect, it } from "vitest";
import { A1_LESSONS } from "./a1";

describe("A1 Module 2 first authored activity wave", () => {
  const wave = A1_LESSONS.slice(15, 20);

  it("replaces generic fallback activity shapes with five purposefully different family-and-home journeys", () => {
    expect(wave.map((lesson) => lesson.activities?.map((activity) => activity.kind))).toEqual([
      ["visual-vocabulary", "standard", "review"],
      ["review", "interaction", "assessment"],
      ["standard", "interaction", "writing"],
      ["visual-vocabulary", "speaking", "review"],
      ["interaction", "standard", "interaction"],
    ]);
  });

  it("uses semantic labels and progressive support on every authored activity", () => {
    for (const lesson of wave) {
      expect(lesson.activities).toBeDefined();
      expect(lesson.activities?.every((activity) => activity.semantic && activity.progressiveSupports.length > 0)).toBe(true);
    }
  });

  it("keeps family practice voluntary and grounded in a fictional picture when needed", () => {
    expect(wave[0].activities?.find((activity) => activity.id === "a1-m2-l16-family-picture")?.objective).toContain("without asking the learner to disclose personal family information");
    expect(wave[0].activities?.find((activity) => activity.id === "a1-m2-l16-family-frame")?.writingPrompt).toContain("personal information is optional");
    expect(wave[1].activities?.find((activity) => activity.id === "a1-m2-l17-warm-family-retrieval")?.objective).toContain("without forcing a real-life example");
  });

  it("makes grammar, room vocabulary, and location exchange serve distinct learner objectives", () => {
    expect(wave[2].activities?.find((activity) => activity.id === "a1-m2-l18-have-has-notice")?.objective).toContain("have with I and you");
    expect(wave[3].activities?.find((activity) => activity.id === "a1-m2-l19-room-scene")?.objective).toContain("connected picture");
    expect(wave[4].activities?.find((activity) => activity.id === "a1-m2-l20-room-mission")?.objective).toContain("spoken or written response");
  });

  it("assigns five non-identical author-selected experiences rather than repeating the Module 1 pattern", () => {
    expect(wave.map((lesson) => lesson.experience?.archetype)).toEqual([
      "discover",
      "interaction",
      "grammar",
      "vocabulary",
      "interaction",
    ]);
    expect(new Set(wave.map((lesson) => lesson.experience?.selectedStages.join(","))).size).toBeGreaterThan(3);
  });
});

describe("A1 Module 2 completed authoring batch", () => {
  const finalWave = A1_LESSONS.slice(20, 30);
  const closingWave = A1_LESSONS.slice(25, 30);

  it("gives every remaining Module 2 lesson explicit activity data rather than generic fallback content", () => {
    expect(finalWave.every((lesson) => lesson.activities && lesson.activities.length >= 2)).toBe(true);
    expect(finalWave.every((lesson) => lesson.activities?.every((activity) => activity.semantic && activity.progressiveSupports.length > 0))).toBe(true);
  });

  it("keeps the final five journeys visibly different in activity pattern and learner purpose", () => {
    expect(closingWave.map((lesson) => lesson.activities?.map((activity) => activity.kind))).toEqual([
      ["review", "writing", "standard"],
      ["visual-vocabulary", "interaction", "assessment"],
      ["interaction", "standard", "speaking"],
      ["speaking", "interaction", "speaking"],
      ["review", "assessment", "review"],
    ]);
  });

  it("protects the fictional, privacy-safe writing and the supportive checkpoint framing", () => {
    expect(closingWave[0].activities?.find((activity) => activity.id === "a1-m2-l26-invented-room-writing")?.objective).toContain("invented room");
    expect(closingWave[0].activities?.find((activity) => activity.id === "a1-m2-l26-invented-room-writing")?.objective).toContain("private photo or address");
    expect(closingWave[2].activities?.find((activity) => activity.id === "a1-m2-l28-visit-role-choice")?.objective).toContain("fictional family card");
    expect(closingWave[4].activities?.find((activity) => activity.id === "a1-m2-l30-checkpoint-plan")?.writingPrompt).toContain("not a judgement");
  });

  it("assigns the closing lessons five purposeful archetypes without a fixed stage sequence", () => {
    expect(closingWave.map((lesson) => lesson.experience?.archetype)).toEqual([
      "writing",
      "review",
      "interaction",
      "listening",
      "assessment",
    ]);
    expect(new Set(closingWave.map((lesson) => lesson.experience?.selectedStages.join(","))).size).toBeGreaterThan(3);
  });
});
