import { describe, expect, it } from "vitest";
import { B1_COURSE, B1_LESSONS } from "./b1";

describe("B1 cumulative curriculum", () => {
  it("contains 150 complete lessons across ten fifteen-lesson modules", () => {
    expect(B1_COURSE.totalLessons).toBe(150);
    expect(B1_COURSE.lessonsPerModule).toBe(15);
    expect(B1_LESSONS).toHaveLength(150);
    expect(B1_COURSE.modules).toHaveLength(10);
    expect(B1_LESSONS.map((lesson) => lesson.moduleNumber)).toEqual(
      Array.from({ length: 10 }, (_, moduleIndex) => Array.from({ length: 15 }, () => moduleIndex + 1)).flat(),
    );
    expect(B1_COURSE.modules.every((module) => module.lessonNumbers.length === 15)).toBe(true);
  });

  it("provides bilingual language targets with lexical depth and lesson-scoped identity", () => {
    const words = B1_LESSONS.flatMap((lesson) => lesson.words);
    expect(words).toHaveLength(1800);
    expect(new Set(words.map((word) => word.id)).size).toBe(words.length);

    for (const lesson of B1_LESSONS) {
      const network = lesson.lexicalNetworks?.[0];
      expect(lesson.words).toHaveLength(12);
      expect(lesson.words.every((word) => word.arabic.trim().length > 1 && word.exampleEN.trim().length > 10 && /[\u0600-\u06FF]/.test(word.exampleAR))).toBe(true);
      expect(network?.chunks.length).toBeGreaterThanOrEqual(3);
      expect(network?.collocations.length).toBeGreaterThanOrEqual(3);
      expect(network?.wordFamilies.length).toBeGreaterThanOrEqual(2);
      expect(network?.learningNoteArabic).toMatch(/[\u0600-\u06FF]/);
    }
  });

  it("keeps every module editorially varied rather than reducing B1 to word lists", () => {
    for (let moduleNumber = 1; moduleNumber <= 10; moduleNumber += 1) {
      const lessons = B1_LESSONS.filter((lesson) => lesson.moduleNumber === moduleNumber);
      const titles = lessons.map((lesson) => lesson.title.toLowerCase());
      expect(new Set(titles).size).toBe(15);
      expect(lessons.every((lesson) => lesson.practiceBrief?.readingBrief && lesson.practiceBrief.writingPrompt)).toBe(true);
      expect(lessons.every((lesson) => lesson.words.length === 12 && lesson.grammar.topic.length > 20)).toBe(true);
    }
    const allTitles = B1_LESSONS.map((lesson) => lesson.title.toLowerCase());
    expect(allTitles.some((title) => title.includes("dialogue"))).toBe(true);
    expect(allTitles.some((title) => title.includes("read"))).toBe(true);
    expect(allTitles.some((title) => title.includes("write"))).toBe(true);
    expect(allTitles.some((title) => title.includes("speak"))).toBe(true);
    expect(allTitles.some((title) => title.includes("checkpoint"))).toBe(true);
  });

  it("uses A2 retrieval and the six-step route to build supported B1 responses", () => {
    for (const lesson of B1_LESSONS) {
      expect(lesson.learningPlan?.englishFirst).toBe(true);
      expect(lesson.learningPlan?.steps.map((step) => step.id)).toEqual(["start", "explore", "notice", "build", "respond", "prove"]);
      expect(lesson.learningPlan?.retrieval.length).toBeGreaterThanOrEqual(3);
      expect(lesson.learningPlan?.retrieval.every((item) => item.sourceLevel === "A2")).toBe(true);
      expect(lesson.practiceBrief?.readingBrief.length).toBeGreaterThan(70);
      expect(lesson.practiceBrief?.writingPrompt.length).toBeGreaterThan(70);
    }
  });

  it("gives B1 Module 1 explicit, varied narrative, community, workplace, and media-literacy routes", () => {
    const moduleOne = B1_LESSONS.filter((lesson) => lesson.moduleNumber === 1);
    const expectedArchetypes = new Set(["speaking", "interaction", "notice", "reading", "writing", "vocabulary", "real-world", "discover", "assessment"]);

    expect(moduleOne).toHaveLength(15);
    expect(moduleOne.every((lesson) => lesson.experience && lesson.activities?.length)).toBe(true);
    expect(new Set(moduleOne.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(9);
    expect(moduleOne.map((lesson) => lesson.experience?.archetype).every((archetype) => expectedArchetypes.has(archetype ?? ""))).toBe(true);
    expect(moduleOne.some((lesson) => lesson.activities?.some((item) => item.kind === "visual-vocabulary" && item.visualItems?.every((visual) => Boolean(visual.imageUrl && visual.altText))))).toBe(true);
    expect(moduleOne.some((lesson) => lesson.activities?.some((item) => item.readingChecks?.some((check) => check.type === "inference")))).toBe(true);
    expect(moduleOne.some((lesson) => lesson.activities?.some((item) => item.writingPrompt?.includes("more car-free streets")))).toBe(true);
    expect(moduleOne.some((lesson) => lesson.activities?.some((item) => item.kind === "assessment" && item.stage === "assessment"))).toBe(true);
    expect(moduleOne.every((lesson) => lesson.experience?.selectedStages.length)).toBe(true);
  });

  it("gives B1 Module 2 explicit, varied Relationships and Society routes with respectful, evidence-aware practice", () => {
    const moduleTwo = B1_LESSONS.filter((lesson) => lesson.moduleNumber === 2);
    const expectedArchetypes = new Set(["reading", "speaking", "writing", "interaction", "real-world", "discover", "review", "assessment"]);

    expect(moduleTwo).toHaveLength(15);
    expect(moduleTwo.every((lesson) => lesson.experience && lesson.activities?.length)).toBe(true);
    expect(new Set(moduleTwo.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(8);
    expect(moduleTwo.map((lesson) => lesson.experience?.archetype).every((archetype) => expectedArchetypes.has(archetype ?? ""))).toBe(true);
    expect(moduleTwo.some((lesson) => lesson.activities?.some((item) => item.kind === "visual-vocabulary" && item.visualItems?.every((visual) => Boolean(visual.imageUrl && visual.altText))))).toBe(true);
    expect(moduleTwo.some((lesson) => lesson.activities?.some((item) => item.readingChecks?.some((check) => check.type === "inference")))).toBe(true);
    expect(moduleTwo.some((lesson) => lesson.activities?.some((item) => item.writingPrompt?.includes("proposed traffic scheme")))).toBe(true);
    expect(moduleTwo.some((lesson) => lesson.activities?.some((item) => item.kind === "assessment" && item.stage === "assessment"))).toBe(true);
    expect(moduleTwo.every((lesson) => lesson.experience?.selectedStages.length)).toBe(true);
  });

  it("gives B1 Module 3 explicit, varied Travel and Change routes with source-aware practical transfer", () => {
    const moduleThree = B1_LESSONS.filter((lesson) => lesson.moduleNumber === 3);
    const expectedArchetypes = new Set(["discover", "grammar", "notice", "interaction", "listening", "reading", "writing", "real-world", "speaking", "review", "assessment"]);

    expect(moduleThree).toHaveLength(15);
    expect(moduleThree.every((lesson) => lesson.experience && lesson.activities?.length)).toBe(true);
    expect(new Set(moduleThree.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(11);
    expect(moduleThree.map((lesson) => lesson.experience?.archetype).every((archetype) => expectedArchetypes.has(archetype ?? ""))).toBe(true);
    expect(moduleThree.some((lesson) => lesson.activities?.some((item) => item.kind === "visual-vocabulary" && item.visualItems?.every((visual) => Boolean(visual.imageUrl && visual.altText))))).toBe(true);
    expect(moduleThree.some((lesson) => lesson.activities?.some((item) => item.readingChecks?.some((check) => check.type === "inference")))).toBe(true);
    expect(moduleThree.some((lesson) => lesson.activities?.some((item) => item.writingPrompt?.includes("130–160 words")))).toBe(true);
    expect(moduleThree.some((lesson) => lesson.activities?.some((item) => item.kind === "assessment" && item.stage === "assessment"))).toBe(true);
    expect(moduleThree.every((lesson) => lesson.experience?.selectedStages.length)).toBe(true);
  });

  it("gives B1 Module 4 explicit, varied Stories and Opinions routes with fair evidence-aware discussion", () => {
    const moduleFour = B1_LESSONS.filter((lesson) => lesson.moduleNumber === 4);
    const expectedArchetypes = new Set(["discover", "grammar", "notice", "interaction", "listening", "reading", "writing", "real-world", "speaking", "review", "assessment"]);

    expect(moduleFour).toHaveLength(15);
    expect(moduleFour.every((lesson) => lesson.experience && lesson.activities?.length)).toBe(true);
    expect(new Set(moduleFour.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(11);
    expect(moduleFour.map((lesson) => lesson.experience?.archetype).every((archetype) => expectedArchetypes.has(archetype ?? ""))).toBe(true);
    expect(moduleFour.some((lesson) => lesson.activities?.some((item) => item.kind === "visual-vocabulary" && item.visualItems?.every((visual) => Boolean(visual.imageUrl && visual.altText))))).toBe(true);
    expect(moduleFour.some((lesson) => lesson.activities?.some((item) => item.readingChecks?.some((check) => check.type === "inference")))).toBe(true);
    expect(moduleFour.some((lesson) => lesson.activities?.some((item) => item.writingPrompt?.includes("Should communities spend money preserving old cultural places")))).toBe(true);
    expect(moduleFour.some((lesson) => lesson.activities?.some((item) => item.kind === "assessment" && item.stage === "assessment"))).toBe(true);
    expect(moduleFour.every((lesson) => lesson.experience?.selectedStages.length)).toBe(true);
  });

  it("gives B1 Module 5 explicit, varied Health and Choices routes with non-diagnostic practical evidence", () => {
    const moduleFive = B1_LESSONS.filter((lesson) => lesson.moduleNumber === 5);
    const expectedArchetypes = new Set(["discover", "grammar", "notice", "interaction", "listening", "reading", "writing", "speaking", "review", "real-world", "assessment"]);

    expect(moduleFive).toHaveLength(15);
    expect(moduleFive.every((lesson) => lesson.experience && lesson.activities?.length)).toBe(true);
    expect(new Set(moduleFive.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(11);
    expect(moduleFive.map((lesson) => lesson.experience?.archetype).every((archetype) => expectedArchetypes.has(archetype ?? ""))).toBe(true);
    expect(moduleFive.some((lesson) => lesson.activities?.some((item) => item.kind === "visual-vocabulary" && item.visualItems?.every((visual) => Boolean(visual.imageUrl && visual.altText))))).toBe(true);
    expect(moduleFive.some((lesson) => lesson.activities?.some((item) => item.readingChecks?.some((check) => check.type === "inference")))).toBe(true);
    expect(moduleFive.some((lesson) => lesson.activities?.some((item) => item.writingPrompt?.includes("130–160 words about one everyday habit")))).toBe(true);
    expect(moduleFive.some((lesson) => lesson.activities?.some((item) => item.kind === "assessment" && item.stage === "assessment"))).toBe(true);
    expect(moduleFive.every((lesson) => lesson.experience?.selectedStages.length)).toBe(true);
  });

  it("gives B1 Module 6 explicit, varied Media and Digital Life routes with source-aware responsible transfer", () => {
    const moduleSix = B1_LESSONS.filter((lesson) => lesson.moduleNumber === 6);
    const expectedArchetypes = new Set(["discover", "grammar", "reading", "interaction", "speaking", "writing", "review", "real-world", "assessment"]);

    expect(moduleSix).toHaveLength(15);
    expect(moduleSix.every((lesson) => lesson.experience && lesson.activities?.length)).toBe(true);
    expect(new Set(moduleSix.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(9);
    expect(moduleSix.map((lesson) => lesson.experience?.archetype).every((archetype) => expectedArchetypes.has(archetype ?? ""))).toBe(true);
    expect(moduleSix.some((lesson) => lesson.activities?.some((item) => item.kind === "visual-vocabulary" && item.visualItems?.every((visual) => Boolean(visual.imageUrl && visual.altText))))).toBe(true);
    expect(moduleSix.some((lesson) => lesson.activities?.some((item) => item.readingChecks?.some((check) => check.type === "inference")))).toBe(true);
    expect(moduleSix.some((lesson) => lesson.activities?.some((item) => item.writingPrompt?.includes("130–160 words about one way you use media")))).toBe(true);
    expect(moduleSix.some((lesson) => lesson.activities?.some((item) => item.kind === "assessment" && item.stage === "assessment"))).toBe(true);
    expect(moduleSix.every((lesson) => lesson.experience?.selectedStages.length)).toBe(true);
  });

  it("gives B1 Module 7 explicit, varied Environment and Community Action routes with evidence-aware civic transfer", () => {
    const moduleSeven = B1_LESSONS.filter((lesson) => lesson.moduleNumber === 7);
    const expectedArchetypes = new Set(["discover", "grammar", "reading", "interaction", "speaking", "writing", "real-world", "review", "assessment"]);

    expect(moduleSeven).toHaveLength(15);
    expect(moduleSeven.every((lesson) => lesson.experience && lesson.activities?.length)).toBe(true);
    expect(new Set(moduleSeven.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(9);
    expect(moduleSeven.map((lesson) => lesson.experience?.archetype).every((archetype) => expectedArchetypes.has(archetype ?? ""))).toBe(true);
    expect(moduleSeven.some((lesson) => lesson.activities?.some((item) => item.kind === "visual-vocabulary" && item.visualItems?.every((visual) => Boolean(visual.imageUrl && visual.altText))))).toBe(true);
    expect(moduleSeven.some((lesson) => lesson.activities?.some((item) => item.readingChecks?.some((check) => check.type === "inference")))).toBe(true);
    expect(moduleSeven.some((lesson) => lesson.activities?.some((item) => item.title === "Read a community-energy proposal"))).toBe(true);
    expect(moduleSeven.some((lesson) => lesson.activities?.some((item) => item.title === "Interpret a short local source"))).toBe(true);
    expect(moduleSeven.some((lesson) => lesson.activities?.some((item) => item.writingPrompt?.includes("120–150 words to a local association")))).toBe(true);
    expect(moduleSeven.some((lesson) => lesson.activities?.some((item) => item.kind === "assessment" && item.stage === "assessment"))).toBe(true);
    expect(moduleSeven.every((lesson) => lesson.experience?.selectedStages.length)).toBe(true);
  });

  it("gives B1 Module 8 explicit, varied Culture and Identity routes with careful perspective and inclusive participation", () => {
    const moduleEight = B1_LESSONS.filter((lesson) => lesson.moduleNumber === 8);
    const expectedArchetypes = new Set(["discover", "grammar", "notice", "interaction", "speaking", "reading", "writing", "real-world", "review", "assessment"]);

    expect(moduleEight).toHaveLength(15);
    expect(moduleEight.every((lesson) => lesson.experience && lesson.activities?.length)).toBe(true);
    expect(new Set(moduleEight.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(10);
    expect(moduleEight.map((lesson) => lesson.experience?.archetype).every((archetype) => expectedArchetypes.has(archetype ?? ""))).toBe(true);
    expect(moduleEight.some((lesson) => lesson.activities?.some((item) => item.kind === "visual-vocabulary" && item.visualItems?.every((visual) => Boolean(visual.imageUrl && visual.altText))))).toBe(true);
    expect(moduleEight.some((lesson) => lesson.activities?.some((item) => item.title === "Read a community-history feature"))).toBe(true);
    expect(moduleEight.some((lesson) => lesson.activities?.some((item) => item.title === "Interpret visitor feedback carefully"))).toBe(true);
    expect(moduleEight.some((lesson) => lesson.activities?.some((item) => item.writingPrompt?.includes("Write 120–150 words inviting people")))).toBe(true);
    expect(moduleEight.some((lesson) => lesson.activities?.some((item) => item.kind === "assessment" && item.stage === "assessment"))).toBe(true);
    expect(moduleEight.every((lesson) => lesson.experience?.selectedStages.length)).toBe(true);
  });

  it("gives B1 Module 9 explicit, varied Problem-solving and Decisions routes with measured evidence and practical transfer", () => {
    const moduleNine = B1_LESSONS.filter((lesson) => lesson.moduleNumber === 9);
    const expectedArchetypes = new Set(["discover", "grammar", "notice", "interaction", "reading", "writing", "real-world", "speaking", "review", "assessment"]);

    expect(moduleNine).toHaveLength(15);
    expect(moduleNine.every((lesson) => lesson.experience && lesson.activities?.length)).toBe(true);
    expect(new Set(moduleNine.map((lesson) => lesson.experience?.archetype)).size).toBeGreaterThanOrEqual(10);
    expect(moduleNine.map((lesson) => lesson.experience?.archetype).every((archetype) => expectedArchetypes.has(archetype ?? ""))).toBe(true);
    expect(moduleNine.some((lesson) => lesson.activities?.some((item) => item.kind === "visual-vocabulary" && item.visualItems?.length === 5))).toBe(true);
    expect(moduleNine.some((lesson) => lesson.activities?.some((item) => item.title === "Read a proposal for useful detail"))).toBe(true);
    expect(moduleNine.some((lesson) => lesson.activities?.some((item) => item.title === "Interpret a short decision source" && item.readingChecks?.some((check) => check.type === "inference")))).toBe(true);
    expect(moduleNine.some((lesson) => lesson.activities?.some((item) => item.writingPrompt?.includes("Write 140–170 words updating members about a fictional decision")))).toBe(true);
    expect(moduleNine.some((lesson) => lesson.activities?.some((item) => item.kind === "assessment" && item.stage === "assessment"))).toBe(true);
    expect(moduleNine.every((lesson) => lesson.experience?.selectedStages.length)).toBe(true);
  });

  it("increases communicative demand across the B1 sequence", () => {
    const first = B1_LESSONS[0];
    const final = B1_LESSONS.at(-1)!;
    expect(final.lessonNumber).toBe(150);
    expect(final.practiceBrief?.writingPrompt).toContain("160–220");
    expect(final.learningPlan?.outcome.canDo).toContain("future pathways");
    expect(first.learningPlan?.retrieval.every((item) => item.sourceLevel === "A2")).toBe(true);
  });
});
