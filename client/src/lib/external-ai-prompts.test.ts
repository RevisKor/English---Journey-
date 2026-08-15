import { describe, expect, it } from "vitest";
import { A1_LESSONS, B2_LESSONS } from "@shared/course";
import { buildReadingPrompt, buildSentenceReviewPrompt, buildWordHelpPrompt, buildWritingFeedbackPrompt, writingTaskFor } from "./external-ai-prompts";

describe("external AI prompt builders", () => {
  it("keeps word help focused on the selected A1 lesson word and bilingual learner needs", () => {
    const lesson = A1_LESSONS[0];
    const word = lesson.words[0];
    const prompt = buildWordHelpPrompt({ lesson, word, question: "How do I spell this?" });

    expect(prompt).toContain(`Course level: ${lesson.level}`);
    expect(prompt).toContain(`Target word: ${word.word}`);
    expect(prompt).toContain(`Arabic translation in the course: ${word.arabic}`);
    expect(prompt).toContain("British English pronunciation");
    expect(prompt).toContain("Do not complete their quiz");
  });

  it("uses the B2 lesson context, reading range, and draft safeguards in reusable practice prompts", () => {
    const lesson = B2_LESSONS[0];
    const readingPrompt = buildReadingPrompt(lesson);
    const writingPrompt = buildWritingFeedbackPrompt({ lesson, draft: "This is my first draft." });
    const task = writingTaskFor(lesson);
    const sentencePrompt = buildSentenceReviewPrompt({ lesson, sentence: "I have a clear opinion." });

    expect(readingPrompt).toContain("350–450-word British English reading practice");
    expect(readingPrompt).toContain(lesson.grammar.topic);
    expect(writingPrompt).toContain("This is my first draft.");
    expect(writingPrompt).toContain("Do not write a replacement essay");
    expect(task.targetLength).toBe("200–260 words");
    expect(sentencePrompt).toContain("I have a clear opinion.");
    expect(sentencePrompt).toContain("Do not give a score");
  });
});
