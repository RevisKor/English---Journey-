import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { A1_LESSONS } from "@shared/course/a1";
import { A2_LESSONS } from "@shared/course/a2";
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

import { StructuredLessonWorkspace } from "./A2LessonWorkspace";

describe("guided workspace Arabic scaffolding", () => {
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

  it("renders Arabic mentor transitions and prompt guidance for A2", () => {
    const lesson = A2_LESSONS[0];
    const guide = buildMentorGuide(lesson);
    const html = renderToStaticMarkup(<StructuredLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(guide).not.toBeNull();
    expect(guide!.moments.every((moment) => moment.messageArabic.length > 12)).toBe(true);
    expect(html).toContain(guide!.moments[0].messageArabic);
    expect(buildSentenceReviewPrompt({ lesson, sentence: "I usually plan my week on Sunday." })).toContain("Arabic");
  });
});

Object.defineProperty(globalThis, "SpeechSynthesisUtterance", {
  configurable: true,
  value: class SpeechSynthesisUtterance {
    lang = "";
    constructor(public text: string) {}
  },
});
