import { describe, expect, it } from "vitest";
import { B2_COURSE, B2_LESSONS } from "./b2";

describe("B2 evidence and influence curriculum", () => {
  it("contains 150 complete lessons across ten fifteen-lesson modules", () => {
    expect(B2_COURSE.totalLessons).toBe(150);
    expect(B2_COURSE.lessonsPerModule).toBe(15);
    expect(B2_LESSONS).toHaveLength(150);
    expect(B2_LESSONS.map((lesson) => lesson.moduleNumber)).toEqual(Array.from({ length: 150 }, (_, index) => Math.floor(index / 15) + 1));
  });

  it("provides unique bilingual targets with register-aware lexical networks", () => {
    const words = B2_LESSONS.flatMap((lesson) => lesson.words);
    const uniqueTargets = new Set(words.map((word) => word.word.toLocaleLowerCase()));
    expect(words).toHaveLength(1800);
    expect(uniqueTargets.size).toBeGreaterThan(200);

    for (const lesson of B2_LESSONS) {
      const network = lesson.lexicalNetworks?.[0];
      expect(lesson.words).toHaveLength(12);
      expect(lesson.words.every((word) => word.arabic.trim().length > 1 && word.exampleEN.trim().length > 10 && /[\u0600-\u06FF]/.test(word.exampleAR))).toBe(true);
      expect(network?.chunks.length).toBeGreaterThanOrEqual(3);
      expect(network?.collocations.length).toBeGreaterThanOrEqual(3);
      expect(network?.wordFamilies.length).toBeGreaterThanOrEqual(2);
      expect(network?.register).toMatch(/neutral|informal|formal|mixed/);
    }
  });

  it("uses B1 retrieval and six-step evidence-based performance routes", () => {
    for (const lesson of B2_LESSONS) {
      expect(lesson.learningPlan?.englishFirst).toBe(true);
      expect(lesson.learningPlan?.steps.map((step) => step.id)).toEqual(["start", "explore", "notice", "build", "respond", "prove"]);
      expect(lesson.learningPlan?.retrieval.length).toBeGreaterThanOrEqual(3);
      expect(lesson.learningPlan?.retrieval.every((item) => item.sourceLevel === "B1")).toBe(true);
      expect(lesson.practiceBrief?.readingBrief.length).toBeGreaterThan(90);
      expect(lesson.practiceBrief?.writingPrompt.length).toBeGreaterThan(90);
    }
  });

  it("authors Module 1 as varied bilingual evidence-and-judgement journeys rather than retaining generated fallback activities", () => {
    const moduleOne = B2_LESSONS.slice(0, 15);
    expect(moduleOne.every((lesson) => lesson.experience && lesson.activities.length > 0)).toBe(true);
    expect(new Set(moduleOne.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(7);
    expect(B2_LESSONS[0].activities.some((activity) => activity.title === "Read information under pressure")).toBe(true);
    expect(B2_LESSONS[8].activities.some((activity) => activity.title === "Build the case for change" && activity.kind === "writing")).toBe(true);
    expect(B2_LESSONS[11].activities.some((activity) => activity.title === "Negotiate a fair compromise")).toBe(true);
    expect(B2_LESSONS[14].activities.some((activity) => activity.kind === "assessment")).toBe(true);
  });

  it("authors Module 2 as varied bilingual public-argument and consequential-choice journeys", () => {
    const moduleTwo = B2_LESSONS.slice(15, 30);
    expect(moduleTwo.every((lesson) => lesson.experience && lesson.activities.length > 0)).toBe(true);
    expect(new Set(moduleTwo.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(6);
    expect(B2_LESSONS[15].activities.some((activity) => activity.title === "Read the business of belonging" && activity.kind === "reading")).toBe(true);
    expect(B2_LESSONS[20].activities.some((activity) => activity.title === "Plan for consequences" && activity.kind === "writing")).toBe(true);
    expect(B2_LESSONS[24].activities.some((activity) => activity.title === "Test information under pressure")).toBe(true);
    expect(B2_LESSONS[29].activities.some((activity) => activity.kind === "assessment")).toBe(true);
    expect(B2_LESSONS[120].experience).toBeUndefined();
  });

  it("authors Module 3 as varied public-decision, representation, and consequence journeys", () => {
    const moduleThree = B2_LESSONS.slice(30, 45);
    expect(moduleThree.every((lesson) => lesson.experience && lesson.activities.length > 0)).toBe(true);
    expect(new Set(moduleThree.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(8);
    expect(B2_LESSONS[30].activities.some((activity) => activity.title === "Design access before appearance" && activity.kind === "interaction")).toBe(true);
    expect(B2_LESSONS[32].activities.some((activity) => activity.title === "Map the case for change" && activity.kind === "reading")).toBe(true);
    expect(B2_LESSONS[41].activities.some((activity) => activity.title === "Frame an automated decision ethically")).toBe(true);
    expect(B2_LESSONS[44].activities.some((activity) => activity.kind === "assessment" && activity.title === "Proposal with consequences")).toBe(true);
    expect(B2_LESSONS[120].experience).toBeUndefined();
  });

  it("authors Module 4 as varied evidence, responsibility, and negotiated public-choice journeys", () => {
    const moduleFour = B2_LESSONS.slice(45, 60);
    expect(moduleFour.every((lesson) => lesson.experience && lesson.activities.length > 0)).toBe(true);
    expect(new Set(moduleFour.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(9);
    expect(B2_LESSONS[45].activities.some((activity) => activity.title === "Repair the recommendation" && activity.kind === "standard")).toBe(true);
    expect(B2_LESSONS[45].activities.every((activity) => activity.retrievalCheck?.prompt && activity.retrievalCheck.expectedEvidence)).toBe(true);
    expect(B2_LESSONS[51].activities.some((activity) => activity.title === "Listen for responsibility" && activity.kind === "listening" && activity.progressiveSupports?.includes("transcript"))).toBe(true);
    expect(B2_LESSONS[48].activities.some((activity) => activity.title === "Rank claims before publishing" && activity.kind === "reading")).toBe(true);
    expect(B2_LESSONS[54].activities.some((activity) => activity.title === "Propose access before decoration" && activity.kind === "writing")).toBe(true);
    expect(B2_LESSONS[59].activities.some((activity) => activity.kind === "assessment" && activity.title === "A compromise that can be reviewed")).toBe(true);
    expect(B2_LESSONS[120].experience).toBeUndefined();
  });

  it("authors Module 5 as compact, varied work-and-public-choice journeys", () => {
    const moduleFive = B2_LESSONS.slice(60, 75);
    expect(moduleFive.every((lesson) => lesson.experience && lesson.activities.length > 0)).toBe(true);
    expect(new Set(moduleFive.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(7);
    expect(moduleFive.every((lesson) => lesson.activities.every((activity) => activity.retrievalCheck?.prompt && activity.retrievalCheck.expectedEvidence))).toBe(true);
    expect(B2_LESSONS[62].activities.some((activity) => activity.kind === "listening" && activity.progressiveSupports?.includes("transcript"))).toBe(true);
    expect(B2_LESSONS[64].activities.some((activity) => activity.kind === "assessment")).toBe(true);
    expect(B2_LESSONS[74].activities.some((activity) => activity.kind === "assessment")).toBe(true);
  });

  it("authors Module 6 as compact, varied technology, fairness, and responsible-judgement journeys", () => {
    const moduleSix = B2_LESSONS.slice(75, 90);
    expect(moduleSix.every((lesson) => lesson.experience && lesson.activities.length > 0)).toBe(true);
    expect(new Set(moduleSix.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(7);
    expect(moduleSix.every((lesson) => lesson.activities.every((activity) => activity.retrievalCheck?.prompt && activity.retrievalCheck.expectedEvidence))).toBe(true);
    expect(B2_LESSONS[81].activities.some((activity) => activity.kind === "listening" && activity.progressiveSupports?.includes("transcript"))).toBe(true);
    expect(B2_LESSONS[86].activities.some((activity) => activity.kind === "listening" && activity.progressiveSupports?.includes("transcript"))).toBe(true);
    expect(B2_LESSONS[88].activities.some((activity) => activity.kind === "assessment")).toBe(true);
    expect(B2_LESSONS[89].activities.some((activity) => activity.kind === "assessment")).toBe(true);
    expect(B2_LESSONS[120].experience).toBeUndefined();
  });

  it("authors Module 7 as compact, varied judgement, evidence, and public-change journeys", () => {
    const moduleSeven = B2_LESSONS.slice(90, 105);
    expect(moduleSeven.every((lesson) => lesson.experience && lesson.activities.length > 0)).toBe(true);
    expect(new Set(moduleSeven.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(8);
    expect(moduleSeven.every((lesson) => lesson.activities.every((activity) => activity.retrievalCheck?.prompt && activity.retrievalCheck.expectedEvidence))).toBe(true);
    expect(B2_LESSONS[93].activities.some((activity) => activity.kind === "listening" && activity.progressiveSupports?.includes("transcript"))).toBe(true);
    expect(B2_LESSONS[96].activities.some((activity) => activity.kind === "listening" && activity.progressiveSupports?.includes("transcript"))).toBe(true);
    expect(B2_LESSONS[97].activities.some((activity) => activity.kind === "writing")).toBe(true);
    expect(B2_LESSONS[104].activities.some((activity) => activity.kind === "assessment")).toBe(true);
    expect(B2_LESSONS[120].experience).toBeUndefined();
  });
});
