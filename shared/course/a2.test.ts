import { describe, expect, it } from "vitest";
import { A2_COURSE, A2_LESSONS } from "./a2";

describe("A2 cumulative curriculum", () => {
  it("contains 135 globally ordered lessons across nine fifteen-lesson modules", () => {
    expect(A2_COURSE.totalLessons).toBe(135);
    expect(A2_COURSE.lessonsPerModule).toBe(15);
    expect(A2_LESSONS).toHaveLength(135);
    expect(A2_LESSONS.map((lesson) => lesson.lessonNumber)).toEqual(Array.from({ length: 135 }, (_, index) => index + 1));
    expect(A2_COURSE.modules).toHaveLength(9);
    for (let moduleNumber = 1; moduleNumber <= 9; moduleNumber += 1) {
      expect(A2_LESSONS.filter((lesson) => lesson.moduleNumber === moduleNumber)).toHaveLength(15);
    }
  });

  it("provides bilingual lexical networks with repeated exposure across the expanded journey", () => {
    const words = A2_LESSONS.flatMap((lesson) => lesson.words);
    expect(words.length).toBeGreaterThanOrEqual(900);
    expect(new Set(A2_LESSONS.map((lesson) => lesson.title)).size).toBe(135);
    for (const word of words) {
      expect(word.arabic.trim().length).toBeGreaterThan(1);
      expect(word.definition.trim().split(/\s+/).length).toBeGreaterThanOrEqual(3);
      expect(word.exampleEN).toMatch(/[.!?]$/);
      expect(word.exampleAR).toMatch(/[\u0600-\u06FF]/);
    }
  });

  it("uses a distinct lesson-scoped persistence key for every A2 vocabulary occurrence", () => {
    const vocabularyIds = A2_LESSONS.flatMap((lesson) => lesson.words.map((word) => word.id));

    expect(new Set(vocabularyIds).size).toBe(vocabularyIds.length);
    expect(vocabularyIds.every((id) => /^a2-lesson-\d+-/.test(id))).toBe(true);
  });

  it("makes prior learning visible through a six-step, English-first learning journey", () => {
    for (const lesson of A2_LESSONS) {
      expect(lesson.learningPlan?.englishFirst).toBe(true);
      expect(lesson.learningPlan?.steps.map((step) => step.id)).toEqual(["start", "explore", "notice", "build", "respond", "prove"]);
      expect(lesson.learningPlan?.retrieval.length).toBeGreaterThanOrEqual(3);
      expect(lesson.learningPlan?.retrieval.every((item) => item.sourceLevel === "A1")).toBe(true);
      expect(lesson.lexicalNetworks).toHaveLength(1);
      expect(lesson.lexicalNetworks?.[0]?.chunks.length).toBeGreaterThanOrEqual(3);
      expect(lesson.practiceBrief?.readingBrief.length).toBeGreaterThan(70);
      expect(lesson.practiceBrief?.writingPrompt.length).toBeGreaterThan(70);
      expect(lesson.activities?.some((activity) => activity.kind === lesson.lessonType)).toBe(true);
    }
  });

  it("gives A2 Module 1 explicit, varied health-and-habits routes with retrieval and learner evidence", () => {
    const moduleOne = A2_LESSONS.filter((lesson) => lesson.moduleNumber === 1);
    const expectedArchetypes = new Set(["discover", "reading", "vocabulary", "interaction", "speaking", "real-world", "writing", "grammar", "listening", "review", "assessment"]);

    expect(moduleOne).toHaveLength(15);
    expect(moduleOne.every((lesson) => lesson.experience && lesson.activities?.length)).toBe(true);
    expect(new Set(moduleOne.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(10);
    expect(moduleOne.map((lesson) => lesson.experience?.archetype).every((archetype) => expectedArchetypes.has(archetype ?? ""))).toBe(true);
    expect(moduleOne.some((lesson) => lesson.activities?.some((activity) => activity.kind === "visual-vocabulary" && activity.visualItems?.every((item) => Boolean(item.imageUrl && item.altText))))).toBe(true);
    expect(moduleOne.some((lesson) => lesson.activities?.some((activity) => activity.readingChecks?.some((check) => check.type === "inference")))).toBe(true);
    expect(moduleOne.some((lesson) => lesson.activities?.some((activity) => activity.progressiveSupports?.includes("external-ai-prompt")))).toBe(true);
    expect(moduleOne.every((lesson) => lesson.experience?.selectedStages.length)).toBe(true);
  });

  it("gives A2 Module 2 explicit, varied learning-and-work routes with connected evidence", () => {
    const moduleTwo = A2_LESSONS.filter((lesson) => lesson.moduleNumber === 2);
    const expectedArchetypes = new Set(["notice", "vocabulary", "reading", "real-world", "speaking", "interaction", "grammar", "review", "writing", "assessment"]);

    expect(moduleTwo).toHaveLength(15);
    expect(moduleTwo.every((lesson) => lesson.experience && lesson.activities?.length)).toBe(true);
    expect(new Set(moduleTwo.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(10);
    expect(moduleTwo.map((lesson) => lesson.experience?.archetype).every((archetype) => expectedArchetypes.has(archetype ?? ""))).toBe(true);
    expect(moduleTwo.some((lesson) => lesson.activities?.some((activity) => activity.kind === "visual-vocabulary" && activity.visualItems?.every((item) => Boolean(item.imageUrl && item.altText))))).toBe(true);
    expect(moduleTwo.some((lesson) => lesson.activities?.some((activity) => activity.readingChecks?.some((check) => check.type === "inference")))).toBe(true);
    expect(moduleTwo.some((lesson) => lesson.activities?.some((activity) => activity.progressiveSupports?.includes("external-ai-prompt")))).toBe(true);
    expect(moduleTwo.some((lesson) => lesson.activities?.some((activity) => activity.kind === "assessment" && activity.stage === "assessment"))).toBe(true);
    expect(moduleTwo.every((lesson) => lesson.experience?.selectedStages.length)).toBe(true);
  });

  it("gives A2 Module 3 explicit, varied travel-and-services routes with practical connected evidence", () => {
    const moduleThree = A2_LESSONS.filter((lesson) => lesson.moduleNumber === 3);
    const expectedArchetypes = new Set(["grammar", "vocabulary", "interaction", "reading", "speaking", "real-world", "notice", "writing", "listening", "review", "integration", "assessment"]);

    expect(moduleThree).toHaveLength(15);
    expect(moduleThree.every((lesson) => lesson.experience && lesson.activities?.length)).toBe(true);
    expect(new Set(moduleThree.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(10);
    expect(moduleThree.map((lesson) => lesson.experience?.archetype).every((archetype) => expectedArchetypes.has(archetype ?? ""))).toBe(true);
    expect(moduleThree.some((lesson) => lesson.activities?.some((activity) => activity.kind === "visual-vocabulary" && activity.visualItems?.every((item) => Boolean(item.imageUrl && item.altText))))).toBe(true);
    expect(moduleThree.some((lesson) => lesson.activities?.some((activity) => activity.readingChecks?.some((check) => check.type === "inference")))).toBe(true);
    expect(moduleThree.some((lesson) => lesson.activities?.some((activity) => activity.progressiveSupports?.includes("external-ai-prompt")))).toBe(true);
    expect(moduleThree.some((lesson) => lesson.activities?.some((activity) => activity.kind === "assessment" && activity.stage === "assessment"))).toBe(true);
    expect(moduleThree.every((lesson) => lesson.experience?.selectedStages.length)).toBe(true);
  });

  it("gives A2 Module 4 explicit, varied Stories and Memories routes with connected narrative evidence", () => {
    const moduleFour = A2_LESSONS.filter((lesson) => lesson.moduleNumber === 4);
    const expectedArchetypes = new Set(["notice", "grammar", "vocabulary", "writing", "interaction", "speaking", "reading", "review", "assessment"]);

    expect(moduleFour).toHaveLength(15);
    expect(moduleFour.every((lesson) => lesson.experience && lesson.activities?.length)).toBe(true);
    expect(new Set(moduleFour.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(9);
    expect(moduleFour.map((lesson) => lesson.experience?.archetype).every((archetype) => expectedArchetypes.has(archetype ?? ""))).toBe(true);
    expect(moduleFour.some((lesson) => lesson.activities?.some((item) => item.kind === "visual-vocabulary" && item.visualItems?.every((visual) => Boolean(visual.imageUrl && visual.altText))))).toBe(true);
    expect(moduleFour.some((lesson) => lesson.activities?.some((item) => item.readingText?.includes("small café") && item.readingText.includes("river")))).toBe(true);
    expect(moduleFour.some((lesson) => lesson.activities?.some((item) => item.kind === "interaction" && item.interactionTurns && item.interactionTurns.length >= 3))).toBe(true);
    expect(moduleFour.some((lesson) => lesson.activities?.some((item) => item.kind === "assessment" && item.writingPrompt?.includes("fictional prompt")))).toBe(true);
    expect(moduleFour.every((lesson) => lesson.experience?.selectedStages.length)).toBe(true);
  });

  it("gives A2 Module 5 explicit, varied Nature and Community routes with practical connected evidence", () => {
    const moduleFive = A2_LESSONS.filter((lesson) => lesson.moduleNumber === 5);
    const expectedArchetypes = new Set(["vocabulary", "notice", "reading", "interaction", "speaking", "real-world", "grammar", "writing", "review", "assessment"]);

    expect(moduleFive).toHaveLength(15);
    expect(moduleFive.every((lesson) => lesson.experience && lesson.activities?.length)).toBe(true);
    expect(new Set(moduleFive.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(10);
    expect(moduleFive.map((lesson) => lesson.experience?.archetype).every((archetype) => expectedArchetypes.has(archetype ?? ""))).toBe(true);
    expect(moduleFive.some((lesson) => lesson.activities?.some((item) => item.kind === "visual-vocabulary" && item.visualItems?.every((visual) => Boolean(visual.imageUrl && visual.altText))))).toBe(true);
    expect(moduleFive.some((lesson) => lesson.activities?.some((item) => item.readingText?.includes("The east street is cleaner than it was last year")))).toBe(true);
    expect(moduleFive.some((lesson) => lesson.activities?.some((item) => item.writingPrompt?.includes("fictional community improvement")))).toBe(true);
    expect(moduleFive.some((lesson) => lesson.activities?.some((item) => item.kind === "assessment" && item.stage === "assessment"))).toBe(true);
    expect(moduleFive.every((lesson) => lesson.experience?.selectedStages.length)).toBe(true);
  });

  it("gives A2 Module 6 explicit, varied Choices and Plans routes with balanced decision evidence", () => {
    const moduleSix = A2_LESSONS.filter((lesson) => lesson.moduleNumber === 6);
    const expectedArchetypes = new Set(["grammar", "reading", "writing", "interaction", "notice", "speaking", "real-world", "vocabulary", "review", "assessment"]);

    expect(moduleSix).toHaveLength(15);
    expect(moduleSix.every((lesson) => lesson.experience && lesson.activities?.length)).toBe(true);
    expect(new Set(moduleSix.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(10);
    expect(moduleSix.map((lesson) => lesson.experience?.archetype).every((archetype) => expectedArchetypes.has(archetype ?? ""))).toBe(true);
    expect(moduleSix.some((lesson) => lesson.activities?.some((item) => item.kind === "visual-vocabulary" && item.visualItems?.every((visual) => Boolean(visual.imageUrl && visual.altText))))).toBe(true);
    expect(moduleSix.some((lesson) => lesson.activities?.some((item) => item.readingChecks?.some((check) => check.type === "inference")))).toBe(true);
    expect(moduleSix.some((lesson) => lesson.activities?.some((item) => item.writingPrompt?.includes("recommending one of two fictional weekend workshops")))).toBe(true);
    expect(moduleSix.some((lesson) => lesson.activities?.some((item) => item.kind === "assessment" && item.stage === "assessment"))).toBe(true);
    expect(moduleSix.every((lesson) => lesson.experience?.selectedStages.length)).toBe(true);
  });

  it("gives A2 Module 7 explicit, varied Communication and Technology routes with clarity and safety evidence", () => {
    const moduleSeven = A2_LESSONS.filter((lesson) => lesson.moduleNumber === 7);
    const expectedArchetypes = new Set(["grammar", "vocabulary", "writing", "interaction", "speaking", "reading", "notice", "review", "real-world", "assessment"]);

    expect(moduleSeven).toHaveLength(15);
    expect(moduleSeven.every((lesson) => lesson.experience && lesson.activities?.length)).toBe(true);
    expect(new Set(moduleSeven.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(10);
    expect(moduleSeven.map((lesson) => lesson.experience?.archetype).every((archetype) => expectedArchetypes.has(archetype ?? ""))).toBe(true);
    expect(moduleSeven.some((lesson) => lesson.activities?.some((item) => item.kind === "visual-vocabulary" && item.visualItems?.every((visual) => Boolean(visual.imageUrl && visual.altText))))).toBe(true);
    expect(moduleSeven.some((lesson) => lesson.activities?.some((item) => item.readingChecks?.some((check) => check.type === "inference")))).toBe(true);
    expect(moduleSeven.some((lesson) => lesson.activities?.some((item) => item.writingPrompt?.includes("Do not include a real link, password, or account")))).toBe(true);
    expect(moduleSeven.some((lesson) => lesson.activities?.some((item) => item.kind === "assessment" && item.stage === "assessment"))).toBe(true);
    expect(moduleSeven.every((lesson) => lesson.experience?.selectedStages.length)).toBe(true);
  });

  it("gives A2 Module 8 explicit, varied Food, Shopping, and Services routes with practical service evidence", () => {
    const moduleEight = A2_LESSONS.filter((lesson) => lesson.moduleNumber === 8);
    const expectedArchetypes = new Set(["vocabulary", "interaction", "grammar", "reading", "speaking", "notice", "writing", "review", "real-world", "assessment"]);

    expect(moduleEight).toHaveLength(15);
    expect(moduleEight.every((lesson) => lesson.experience && lesson.activities?.length)).toBe(true);
    expect(new Set(moduleEight.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(10);
    expect(moduleEight.map((lesson) => lesson.experience?.archetype).every((archetype) => expectedArchetypes.has(archetype ?? ""))).toBe(true);
    expect(moduleEight.some((lesson) => lesson.activities?.some((item) => item.kind === "visual-vocabulary" && item.visualItems?.every((visual) => Boolean(visual.imageUrl && visual.altText))))).toBe(true);
    expect(moduleEight.some((lesson) => lesson.activities?.some((item) => item.readingChecks?.some((check) => check.type === "inference")))).toBe(true);
    expect(moduleEight.some((lesson) => lesson.activities?.some((item) => item.writingPrompt?.includes("Dear Customer Service")))).toBe(true);
    expect(moduleEight.some((lesson) => lesson.activities?.some((item) => item.kind === "assessment" && item.stage === "assessment"))).toBe(true);
    expect(moduleEight.every((lesson) => lesson.experience?.selectedStages.length)).toBe(true);
  });
});
