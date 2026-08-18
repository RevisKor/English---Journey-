import { describe, expect, it } from "vitest";
import { C2_COURSE, C2_LESSONS } from "./c2";

describe("C2 precision and mediation curriculum", () => {
  it("contains 180 complete lessons across twelve fifteen-lesson modules", () => {
    expect(C2_COURSE.totalLessons).toBe(180);
    expect(C2_COURSE.lessonsPerModule).toBe(15);
    expect(C2_LESSONS).toHaveLength(180);
    expect(C2_LESSONS.map((lesson) => lesson.moduleNumber)).toEqual(Array.from({ length: 180 }, (_, index) => Math.floor(index / 15) + 1));
  });

  it("provides bilingual vocabulary, lexical networks, and advanced grammar for every lesson", () => {
    const words = C2_LESSONS.flatMap((lesson) => lesson.words);
    expect(words).toHaveLength(1080);
    expect(new Set(words.map((word) => word.word.toLocaleLowerCase())).size).toBeGreaterThan(5);
    for (const lesson of C2_LESSONS) {
      const network = lesson.lexicalNetworks?.[0];
      expect(lesson.words).toHaveLength(6);
      expect(lesson.words.every((word) => word.arabic.trim().length > 1 && word.exampleEN.trim().length > 10 && /[\u0600-\u06FF]/.test(word.exampleAR))).toBe(true);
      expect(network?.chunks.length).toBeGreaterThanOrEqual(3);
      expect(network?.collocations.length).toBeGreaterThanOrEqual(3);
      expect(network?.relatedWords.length).toBeGreaterThanOrEqual(3);
      expect(lesson.grammar.topic.length).toBeGreaterThan(5);
    }
  });

  it("authors the first C2 module as varied bilingual precision-and-mediation journeys", () => {
    const moduleOne = C2_LESSONS.slice(0, 15);
    expect(moduleOne).toHaveLength(15);
    expect(moduleOne.every((lesson) => lesson.activities?.length === 1)).toBe(true);
    expect(new Set(moduleOne.map((lesson) => lesson.activities?.[0]?.kind)).size).toBeGreaterThanOrEqual(6);
    expect(moduleOne.every((lesson) => {
      const retrieval = lesson.activities?.[0]?.retrievalCheck;
      return Boolean(retrieval?.prompt && retrieval?.promptArabic && retrieval?.expectedEvidence && /[\u0600-\u06FF]/.test(retrieval.promptArabic));
    })).toBe(true);
    expect(moduleOne.every((lesson) => lesson.experience?.firstView.whatItIs && lesson.experience?.firstView.whatToDo && lesson.experience?.firstView.whatMatters && lesson.experience?.firstView.whatNext)).toBe(true);
    expect(moduleOne.filter((lesson) => lesson.activities?.[0]?.readingText && lesson.activities?.[0]?.readingChecks?.length).length).toBeGreaterThanOrEqual(4);
    expect(moduleOne.filter((lesson) => lesson.activities?.[0]?.writingPrompt && lesson.activities?.[0]?.writingPromptArabic).length).toBeGreaterThanOrEqual(4);
    const listening = moduleOne.filter((lesson) => lesson.activities?.[0]?.kind === "listening");
    expect(listening.length).toBeGreaterThanOrEqual(2);
    expect(listening.every((lesson) => lesson.activities?.[0]?.progressiveSupports?.includes("transcript"))).toBe(true);
    expect(moduleOne.at(-1)?.activities?.[0]?.semantic).toBe("assessment");
    expect(moduleOne.at(-1)?.experience?.archetype).toBe("assessment");
  });

  it("authors the second C2 module as conflict-to-public-narrative journeys", () => {
    const moduleTwo = C2_LESSONS.slice(15, 30);
    expect(moduleTwo).toHaveLength(15);
    expect(moduleTwo.every((lesson) => lesson.activities?.length === 1)).toBe(true);
    expect(new Set(moduleTwo.map((lesson) => lesson.activities?.[0]?.kind)).size).toBeGreaterThanOrEqual(7);
    expect(moduleTwo.every((lesson) => {
      const retrieval = lesson.activities?.[0]?.retrievalCheck;
      return Boolean(retrieval?.prompt && retrieval?.promptArabic && retrieval?.expectedEvidence && /[\u0600-\u06FF]/.test(retrieval.promptArabic));
    })).toBe(true);
    expect(moduleTwo.every((lesson) => lesson.experience?.firstView.whatItIs && lesson.experience?.firstView.whatToDo && lesson.experience?.firstView.whatMatters && lesson.experience?.firstView.whatNext)).toBe(true);
    expect(moduleTwo.filter((lesson) => lesson.activities?.[0]?.readingText && lesson.activities?.[0]?.readingChecks?.length).length).toBeGreaterThanOrEqual(4);
    expect(moduleTwo.filter((lesson) => lesson.activities?.[0]?.writingPrompt && lesson.activities?.[0]?.writingPromptArabic).length).toBeGreaterThanOrEqual(3);
    const listening = moduleTwo.filter((lesson) => lesson.activities?.[0]?.kind === "listening");
    expect(listening.length).toBeGreaterThanOrEqual(1);
    expect(listening.every((lesson) => lesson.activities?.[0]?.progressiveSupports?.includes("transcript"))).toBe(true);
    expect(moduleTwo.at(-1)?.activities?.[0]?.semantic).toBe("assessment");
    expect(moduleTwo.at(-1)?.experience?.archetype).toBe("assessment");
  });

  it("authors the third C2 module as interpretive-independence and public-judgement journeys", () => {
    const moduleThree = C2_LESSONS.slice(30, 45);
    expect(moduleThree).toHaveLength(15);
    expect(moduleThree.every((lesson) => lesson.activities?.length === 1)).toBe(true);
    expect(new Set(moduleThree.map((lesson) => lesson.activities?.[0]?.kind)).size).toBeGreaterThanOrEqual(7);
    expect(moduleThree.every((lesson) => {
      const retrieval = lesson.activities?.[0]?.retrievalCheck;
      return Boolean(retrieval?.prompt && retrieval?.promptArabic && retrieval?.expectedEvidence && /[\u0600-\u06FF]/.test(retrieval.promptArabic));
    })).toBe(true);
    expect(moduleThree.every((lesson) => lesson.experience?.firstView.whatItIs && lesson.experience?.firstView.whatToDo && lesson.experience?.firstView.whatMatters && lesson.experience?.firstView.whatNext)).toBe(true);
    expect(moduleThree.filter((lesson) => lesson.activities?.[0]?.readingText && lesson.activities?.[0]?.readingChecks?.length).length).toBeGreaterThanOrEqual(4);
    expect(moduleThree.filter((lesson) => lesson.activities?.[0]?.writingPrompt && lesson.activities?.[0]?.writingPromptArabic).length).toBeGreaterThanOrEqual(3);
    const listening = moduleThree.filter((lesson) => lesson.activities?.[0]?.kind === "listening");
    expect(listening.length).toBeGreaterThanOrEqual(2);
    expect(listening.every((lesson) => lesson.activities?.[0]?.progressiveSupports?.includes("transcript"))).toBe(true);
    expect(moduleThree.at(-1)?.activities?.[0]?.semantic).toBe("assessment");
    expect(moduleThree.at(-1)?.experience?.archetype).toBe("assessment");
  });

  it("authors the fourth C2 module as institutional-and-ethical judgement journeys", () => {
    const moduleFour = C2_LESSONS.slice(45, 60);
    expect(moduleFour).toHaveLength(15);
    expect(moduleFour.every((lesson) => lesson.activities?.length === 1)).toBe(true);
    expect(new Set(moduleFour.map((lesson) => lesson.activities?.[0]?.kind)).size).toBeGreaterThanOrEqual(7);
    expect(moduleFour.every((lesson) => {
      const retrieval = lesson.activities?.[0]?.retrievalCheck;
      return Boolean(retrieval?.prompt && retrieval?.promptArabic && retrieval?.expectedEvidence && /[\u0600-\u06FF]/.test(retrieval.promptArabic));
    })).toBe(true);
    expect(moduleFour.every((lesson) => lesson.experience?.firstView.whatItIs && lesson.experience?.firstView.whatToDo && lesson.experience?.firstView.whatMatters && lesson.experience?.firstView.whatNext)).toBe(true);
    expect(moduleFour.filter((lesson) => lesson.activities?.[0]?.readingText && lesson.activities?.[0]?.readingChecks?.length).length).toBeGreaterThanOrEqual(3);
    expect(moduleFour.filter((lesson) => lesson.activities?.[0]?.writingPrompt && lesson.activities?.[0]?.writingPromptArabic).length).toBeGreaterThanOrEqual(3);
    const listening = moduleFour.filter((lesson) => lesson.activities?.[0]?.kind === "listening");
    expect(listening.length).toBeGreaterThanOrEqual(2);
    expect(listening.every((lesson) => lesson.activities?.[0]?.progressiveSupports?.includes("transcript"))).toBe(true);
    expect(moduleFour.at(-1)?.activities?.[0]?.semantic).toBe("assessment");
    expect(moduleFour.at(-1)?.experience?.archetype).toBe("assessment");
  });

  it("authors the fifth C2 module as interpretation-and-uncertainty journeys", () => {
    const moduleFive = C2_LESSONS.slice(60, 75);
    expect(moduleFive).toHaveLength(15);
    expect(moduleFive.every((lesson) => lesson.activities?.length === 1)).toBe(true);
    expect(new Set(moduleFive.map((lesson) => lesson.activities?.[0]?.kind)).size).toBeGreaterThanOrEqual(7);
    expect(moduleFive.every((lesson) => {
      const retrieval = lesson.activities?.[0]?.retrievalCheck;
      return Boolean(retrieval?.prompt && retrieval?.promptArabic && retrieval?.expectedEvidence && /[\u0600-\u06FF]/.test(retrieval.promptArabic));
    })).toBe(true);
    expect(moduleFive.every((lesson) => lesson.experience?.firstView.whatItIs && lesson.experience?.firstView.whatToDo && lesson.experience?.firstView.whatMatters && lesson.experience?.firstView.whatNext)).toBe(true);
    expect(moduleFive.filter((lesson) => lesson.activities?.[0]?.readingText && lesson.activities?.[0]?.readingChecks?.length).length).toBeGreaterThanOrEqual(4);
    expect(moduleFive.filter((lesson) => lesson.activities?.[0]?.writingPrompt && lesson.activities?.[0]?.writingPromptArabic).length).toBeGreaterThanOrEqual(3);
    const listening = moduleFive.filter((lesson) => lesson.activities?.[0]?.kind === "listening");
    expect(listening.length).toBeGreaterThanOrEqual(2);
    expect(listening.every((lesson) => lesson.activities?.[0]?.progressiveSupports?.includes("transcript"))).toBe(true);
    expect(moduleFive.at(-1)?.activities?.[0]?.semantic).toBe("assessment");
    expect(moduleFive.at(-1)?.experience?.archetype).toBe("assessment");
  });

  it("authors the sixth C2 module as risk, discourse-power, and adaptation journeys", () => {
    const moduleSix = C2_LESSONS.slice(75, 90);
    expect(moduleSix).toHaveLength(15);
    expect(moduleSix.every((lesson) => lesson.activities?.length === 1)).toBe(true);
    expect(new Set(moduleSix.map((lesson) => lesson.activities?.[0]?.kind)).size).toBeGreaterThanOrEqual(7);
    expect(moduleSix.every((lesson) => {
      const retrieval = lesson.activities?.[0]?.retrievalCheck;
      return Boolean(retrieval?.prompt && retrieval?.promptArabic && retrieval?.expectedEvidence && /[\u0600-\u06FF]/.test(retrieval.promptArabic));
    })).toBe(true);
    expect(moduleSix.every((lesson) => lesson.experience?.firstView.whatItIs && lesson.experience?.firstView.whatToDo && lesson.experience?.firstView.whatMatters && lesson.experience?.firstView.whatNext)).toBe(true);
    expect(moduleSix.filter((lesson) => lesson.activities?.[0]?.readingText && lesson.activities?.[0]?.readingChecks?.length).length).toBeGreaterThanOrEqual(3);
    expect(moduleSix.filter((lesson) => lesson.activities?.[0]?.writingPrompt && lesson.activities?.[0]?.writingPromptArabic).length).toBeGreaterThanOrEqual(3);
    const listening = moduleSix.filter((lesson) => lesson.activities?.[0]?.kind === "listening");
    expect(listening.length).toBeGreaterThanOrEqual(2);
    expect(listening.every((lesson) => lesson.activities?.[0]?.progressiveSupports?.includes("transcript"))).toBe(true);
    expect(moduleSix.at(-1)?.activities?.[0]?.semantic).toBe("assessment");
    expect(moduleSix.at(-1)?.experience?.archetype).toBe("assessment");
  });

  it("uses C1 retrieval and six-step mediation and independent-judgement routes", () => {
    for (const lesson of C2_LESSONS) {
      expect(lesson.learningPlan?.englishFirst).toBe(true);
      expect(lesson.learningPlan?.steps.map((step) => step.id)).toEqual(["start", "explore", "notice", "build", "respond", "prove"]);
      expect(lesson.learningPlan?.retrieval.every((item) => item.sourceLevel === "C1")).toBe(true);
      expect(lesson.practiceBrief?.readingBrief.length).toBeGreaterThan(100);
      expect(lesson.practiceBrief?.writingPrompt.length).toBeGreaterThan(100);
    }
    expect(C2_LESSONS.at(-1)?.title).toMatch(/Extension|studio/i);
  });
});
