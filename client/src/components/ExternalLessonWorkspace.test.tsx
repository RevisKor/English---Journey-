import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { A1_LESSONS } from "@shared/course/a1";
import { A2_LESSONS } from "@shared/course/a2";
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

  it("renders the authored A2 Module 1 diary as its selected deep reading route with explicit health activities", () => {
    const lesson = A2_LESSONS[8];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Try with support");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain('aria-label="Lesson sections"');
    expect(html).toContain("Read a week of changes");
    expect(html).toContain("Keep the order visible");
  });

  it("renders the authored A2 Module 2 second-chance story as its selected deep reading route", () => {
    const lesson = A2_LESSONS[25];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Try with support");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain("Use it for a reason");
    expect(html).toContain("Read a second-chance story");
    expect(html).toContain("Trace the earlier event");
  });

  it("renders the authored A2 Module 3 delayed-journey update as its selected deep reading route", () => {
    const lesson = A2_LESSONS[33];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Try with support");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain("Use it for a reason");
    expect(html).toContain("Read a delayed-journey update");
    expect(html).toContain("Read once for the problem");
  });

  it("renders the corrected A2 Module 4 opening scene as its selected Stories and Memories reading route", () => {
    const lesson = A2_LESSONS[46];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Try with support");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain("Use it for a reason");
    expect(html).toContain("Read the opening scene");
    expect(html).toContain("Find the place and the words that create its mood");
  });

  it("renders the corrected A2 Module 5 cleaner-neighbourhood notice as its selected Nature and Community reading route", () => {
    const lesson = A2_LESSONS[62];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Try with support");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain("Use it for a reason");
    expect(html).toContain("Read a cleaner-neighbourhood plan");
  });

  it("renders the authored A2 Module 6 difficult decision as its selected Choices and Plans reading route", () => {
    const lesson = A2_LESSONS[81];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Try with support");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain("Use it for a reason");
    expect(html).toContain("Read a difficult decision");
    expect(html).toContain("Find the choice, trace its reasons, and explain one result");
  });

  it("preserves the established tabbed workspace for un-authored later levels during the staged rollout", () => {
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={B1_LESSONS[0]} accent="british" onBack={() => undefined} />);

    expect(html).toContain('aria-label="Lesson sections"');
    expect(html).toContain("Words");
    expect(html).not.toContain("guided route");
  });
});
