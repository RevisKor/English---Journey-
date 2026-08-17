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

  it("renders the Module 3 quantity lesson as its selected deep grammar route with authored market practice", () => {
    const lesson = A1_LESSONS[34];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("grammar lesson");
    expect(html).toContain("Know the purpose");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Try with support");
    expect(html).toContain("Use it for a reason");
    expect(html).not.toContain("Bring it back");
    expect(html).toContain("See food as pieces or a shared amount");
    expect(html).toContain("Build a basket with the right amount");
  });

  it("renders the Module 4 he/she routine lesson as its selected grammar route with its own daily-life activities", () => {
    const lesson = A1_LESSONS[48];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("grammar lesson");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Try with support");
    expect(html).toContain("Use it for a reason");
    expect(html).not.toContain("Bring it back");
    expect(html).toContain("See the small change for he and she");
    expect(html).toContain("Give each person one routine");
  });

  it("renders the Module 5 directions workshop as its selected grammar route with authored town-map activities", () => {
    const lesson = A1_LESSONS[65];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("grammar lesson");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Try with support");
    expect(html).toContain("Use it for a reason");
    expect(html).not.toContain("Bring it back");
    expect(html).toContain("Use a direction action");
    expect(html).toContain("Build a three-step route");
  });

  it("renders the final A1 connected-conversation lesson as its selected integration route with authored social activities", () => {
    const lesson = A1_LESSONS[87];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("integration lesson");
    expect(html).toContain("Try with support");
    expect(html).toContain("Use it for a reason");
    expect(html).not.toContain("Meet the English");
    expect(html).not.toContain("Bring it back");
    expect(html).toContain("Build a complete conversation");
    expect(html).toContain("Rehearse one chosen turn");
  });

  it("preserves the established tabbed workspace for non-A1 levels during the staged rollout", () => {
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={B1_LESSONS[0]} accent="british" onBack={() => undefined} />);

    expect(html).toContain('aria-label="Lesson sections"');
    expect(html).toContain("Words");
    expect(html).not.toContain("guided route");
  });
});
