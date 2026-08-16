import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { A1_LESSONS } from "@shared/course/a1";
import { A2_LESSONS } from "@shared/course/a2";
import { B1_LESSONS } from "@shared/course/b1";
import { buildSentenceReviewPrompt } from "@/lib/external-ai-prompts";
import { buildMentorGuide } from "@shared/course/mentor-guidance";

vi.mock("@/components/CourseReadingPractice", () => ({
  CourseReadingPractice: () => React.createElement("div", null, "Reading practice"),
}));
vi.mock("@/components/CourseWritingPractice", () => ({
  CourseWritingPractice: () => React.createElement("div", null, "Writing practice"),
}));
vi.mock("@/components/ExternalAiPromptPanel", () => ({
  ExternalAiPromptPanel: () => React.createElement("div", null, "External feedback prompt"),
}));
vi.mock("@/components/QuizPractice", () => ({
  QuizPractice: () => React.createElement("div", null, "Quiz practice"),
}));

import { formatActivityLabel, StructuredLessonWorkspace } from "./A2LessonWorkspace";

describe("guided workspace Arabic scaffolding", () => {
  it("falls back safely when activity metadata is missing or malformed", () => {
    expect(formatActivityLabel("repeat-after-me", "activity")).toBe("repeat after me");
    expect(formatActivityLabel(undefined, "practice")).toBe("practice");
    expect(formatActivityLabel(null, "activity")).toBe("activity");
    expect(formatActivityLabel({ value: "missing" }, "check")).toBe("check");
    expect(formatActivityLabel("   ", "practice")).toBe("practice");
  });
  it("renders Arabic mentor transitions for every route section in A1", () => {
    const lesson = A1_LESSONS[0];
    const guide = buildMentorGuide(lesson);
    const html = renderToStaticMarkup(<StructuredLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(guide).not.toBeNull();
    for (const moment of guide!.moments) {
      expect(moment.messageArabic.length).toBeGreaterThan(12);
      expect(html).toContain(moment.messageArabic);
    }
  });

  it("renders explicit multimodal controls for speaking, interaction, and reading activities", () => {
    const speakingLesson = A1_LESSONS.find((lesson) => lesson.activities?.some((activity) => activity.kind === "speaking"));
    const interactionLesson = A1_LESSONS.find((lesson) => lesson.activities?.some((activity) => activity.kind === "interaction"));
    const readingLesson = A1_LESSONS.find((lesson) => lesson.activities?.some((activity) => activity.kind === "reading"));
    const visualLesson = A1_LESSONS.find((lesson) => lesson.activities?.some((activity) => activity.kind === "visual-vocabulary"));
    expect(speakingLesson).toBeDefined();
    expect(interactionLesson).toBeDefined();
    expect(readingLesson).toBeDefined();
    expect(visualLesson).toBeDefined();
    expect(renderToStaticMarkup(<StructuredLessonWorkspace lesson={visualLesson!} accent="british" onBack={() => undefined} />)).toContain("Reveal example");
    expect(renderToStaticMarkup(<StructuredLessonWorkspace lesson={visualLesson!} accent="british" onBack={() => undefined} />)).toContain("Mark reviewed");
    expect(renderToStaticMarkup(<StructuredLessonWorkspace lesson={visualLesson!} accent="british" onBack={() => undefined} />)).toContain(visualLesson!.words[0].exampleEN);
    expect(renderToStaticMarkup(<StructuredLessonWorkspace lesson={speakingLesson!} accent="british" onBack={() => undefined} />)).toContain("Next sentence");
    expect(renderToStaticMarkup(<StructuredLessonWorkspace lesson={speakingLesson!} accent="british" onBack={() => undefined} />)).toContain("Replay sentence");
    expect(renderToStaticMarkup(<StructuredLessonWorkspace lesson={interactionLesson!} accent="british" onBack={() => undefined} />)).toContain("Play complete dialogue");
    expect(renderToStaticMarkup(<StructuredLessonWorkspace lesson={readingLesson!} accent="british" onBack={() => undefined} />)).toContain("main idea");
  });

  it("renders Arabic mentor transitions and prompt guidance for A2", () => {
    const lesson = A2_LESSONS[0];
    const guide = buildMentorGuide(lesson);
    const html = renderToStaticMarkup(<StructuredLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(guide).not.toBeNull();
    expect(guide!.moments.every((moment) => moment.messageArabic.length > 12)).toBe(true);
    expect(html).toContain(guide!.moments[0].messageArabic);
    expect(buildSentenceReviewPrompt({ lesson, sentence: "I usually plan my week on Sunday." })).toContain("Arabic");
  });

  it("provides separate word-only and example playback controls across A1, A2, and B1", () => {
    for (const lesson of [A1_LESSONS[0], A2_LESSONS[0], B1_LESSONS[0]]) {
      const word = lesson.words[0];
      const html = renderToStaticMarkup(<StructuredLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

      expect(html).toContain(`aria-label="Listen to ${word.word}"`);
      expect(html).toContain(`aria-label="Listen to example for ${word.word}"`);
      expect(html).toContain(word.exampleEN);
    }
  });
});

Object.defineProperty(globalThis, "SpeechSynthesisUtterance", {
  configurable: true,
  value: class SpeechSynthesisUtterance {
    lang = "";
    constructor(public text: string) {}
  },
});
