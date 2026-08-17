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
  it("renders A1 as a single bilingual mentor-led route instead of isolated lesson tabs", () => {
    const lesson = A1_LESSONS[0];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("guided route");
    expect(html).toContain("Useful words first");
    expect(html).toContain("One small grammar tool");
    expect(html).toContain("Say it with courage, not perfection");
    expect(html).toContain("Meet the words again in context");
    expect(html).toContain("Show what you can do");
    expect(html).toContain(lesson.mentorGuide!.moments[0].messageArabic);
    expect(html).toContain('data-quiz-level="A1"');
    expect(html).not.toContain('aria-label="Lesson sections"');
  });

  it("preserves the established tabbed workspace for non-A1 levels during the staged rollout", () => {
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={B1_LESSONS[0]} accent="british" onBack={() => undefined} />);

    expect(html).toContain('aria-label="Lesson sections"');
    expect(html).toContain("Words");
    expect(html).not.toContain("guided route");
  });
});
