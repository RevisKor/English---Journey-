import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { A1_LESSONS } from "@shared/course/a1";
import { B1_LESSONS } from "@shared/course/b1";

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
  QuizPractice: ({ level }: { level?: string }) => React.createElement("div", { "data-quiz-level": level }, "Quiz practice"),
}));

import { ExternalLessonWorkspace } from "./ExternalLessonWorkspace";

describe("ExternalLessonWorkspace", () => {
  it("renders an author-selected A1 archetype route instead of tabs or a fixed universal stage sequence", () => {
    const lesson = A1_LESSONS[0];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("discover lesson");
    expect(html).toContain("This lesson’s route");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Try with support");
    expect(html).toContain("Bring it back");
    expect(html).not.toContain("Notice one pattern");
    expect(html).not.toContain("Show what you can do");
    expect(html).toContain(lesson.mentorGuide!.moments[0].messageArabic);
    expect(html).not.toContain('aria-label="Lesson sections"');
  });

  it("preserves the established tabbed workspace for non-A1 levels during the staged rollout", () => {
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={B1_LESSONS[0]} accent="british" onBack={() => undefined} />);

    expect(html).toContain('aria-label="Lesson sections"');
    expect(html).toContain("Words");
    expect(html).not.toContain("guided route");
  });
});
