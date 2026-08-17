import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { A1_LESSONS } from "@shared/course/a1";
import { A2_LESSONS } from "@shared/course/a2";
import { B1_LESSONS } from "@shared/course/b1";
import { B2_LESSONS } from "@shared/course/b2";

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

  it("renders the authored A2 Module 7 digital-safety guide as its selected Communication and Technology reading route", () => {
    const lesson = A2_LESSONS[98];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Try with support");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain("Use it for a reason");
    expect(html).toContain("Read a safety guide");
    expect(html).toContain("Separate the rule, the advice, and the condition before answering the checks");
  });

  it("renders the authored A2 Module 8 shop review as its selected Food, Shopping, and Services reading route", () => {
    const lesson = A2_LESSONS[108];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Try with support");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain("Use it for a reason");
    expect(html).toContain("Read a shop review");
    expect(html).toContain("Find the opening-time fact, the writer’s opinion, and the evidence offered for it");
  });

  it("renders the authored A2 Module 9 celebration comparison as its selected respectful reading route", () => {
    const lesson = A2_LESSONS[123];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Try with support");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain("Use it for a reason");
    expect(html).toContain("Read two celebrations respectfully");
    expect(html).toContain("Find one shared feature, one difference, and the sentence that avoids calling either event better");
  });

  it("renders the authored B1 Module 1 source-check investigation as its selected media-literacy route", () => {
    const lesson = B1_LESSONS[12];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Know the purpose");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Bring it back");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain('aria-label="Lesson sections"');
    expect(html).toContain("Trace a story to its source");
    expect(html).toContain("Compare a claim with direct and reported sources");
  });

  it("renders the authored B1 Module 2 community-source interpretation as its selected Relationships and Society reading route", () => {
    const lesson = B1_LESSONS[26];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Know the purpose");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain('aria-label="Lesson sections"');
    expect(html).toContain("Interpret a short community source");
    expect(html).toContain("Find the claim, its evidence, and one missing voice");
  });

  it("renders the authored B1 Module 3 relocation diary as its selected Travel and Change reading route", () => {
    const lesson = B1_LESSONS[35];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Know the purpose");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Bring it back");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain('aria-label="Lesson sections"');
    expect(html).toContain("Read a relocation diary for detail");
    expect(html).toContain("Trace the problem, response, cost, and wider outcome");
  });

  it("renders the authored B1 Module 4 cinema feature as its selected Stories and Opinions reading route", () => {
    const lesson = B1_LESSONS[50];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Know the purpose");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Bring it back");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain('aria-label="Lesson sections"');
    expect(html).toContain("Read a local-story feature for detail");
    expect(html).toContain("Trace the decision, two viewpoints, and what the evidence can support");
  });

  it("renders the authored B1 Module 5 workplace wellbeing case as its selected Health and Choices reading route", () => {
    const lesson = B1_LESSONS[65];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Know the purpose");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Bring it back");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain("Try with support");
    expect(html).not.toContain('aria-label="Lesson sections"');
    expect(html).toContain("Read a workplace wellbeing proposal");
    expect(html).toContain("Trace the problem, proposed change, practical limit, and reported effect");
  });

  it("renders the authored B1 Module 6 digital-safety guide as its selected Media and Digital Life reading route", () => {
    const lesson = B1_LESSONS[80];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Know the purpose");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Bring it back");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain("Try with support");
    expect(html).not.toContain('aria-label="Lesson sections"');
    expect(html).toContain("Read a digital-safety guide");
    expect(html).toContain("Trace advice, reasons, and practical limits in a short digital-safety guide");
  });

  it("renders the authored B1 Module 7 community-energy proposal as its selected Environment and Community Action reading route", () => {
    const lesson = B1_LESSONS[95];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Know the purpose");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain('aria-label="Lesson sections"');
    expect(html).toContain("Read a community-energy proposal");
    expect(html).toContain("Identify the proposal, its evidence, its trade-off, and one unanswered question");
  });

  it("renders the authored B1 Module 8 community-history feature as its selected Culture and Identity reading route", () => {
    const lesson = B1_LESSONS[110];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Know the purpose");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain('aria-label="Lesson sections"');
    expect(html).toContain("Read a community-history feature");
    expect(html).toContain("Trace the sources, the voices included, and one record the exhibition still lacks");
  });

  it("renders the authored B1 Module 9 proposal reading as its selected Problem-solving and Decisions route", () => {
    const lesson = B1_LESSONS[125];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Know the purpose");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain('aria-label="Lesson sections"');
    expect(html).toContain("Read a proposal for useful detail");
    expect(html).toContain("Identify who a solution is for, which details explain it, and what needs testing");
  });

  it("renders the authored B1 Module 10 opportunity reading as its selected Future Pathways route", () => {
    const lesson = B1_LESSONS[140];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Know the purpose");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain('aria-label="Lesson sections"');
    expect(html).toContain("Read an opportunity notice for detail");
    expect(html).toContain("Identify who can apply, what commitment is required, and what you still need to ask");
  });

  it("renders the authored B2 Module 1 source investigation as its selected evidence-reading route", () => {
    const lesson = B2_LESSONS[0];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("A source-reading investigation");
    expect(html).toContain("Read information under pressure");
    expect(html).toContain("Separate fact, attribution, and uncertainty");
    expect(html).not.toContain('aria-label="Lesson sections"');
  });

  it("preserves the established tabbed workspace for un-authored later levels during the staged rollout", () => {
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={B2_LESSONS[45]} accent="british" onBack={() => undefined} />);

    expect(html).toContain('aria-label="Lesson sections"');
    expect(html).toContain("Words");
    expect(html).not.toContain("guided route");
  });

  it("renders the authored B2 Module 2 belonging investigation as its selected critical-reading route", () => {
    const lesson = B2_LESSONS[15];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain('aria-label="Lesson sections"');
    expect(html).toContain("Read the business of belonging");
    expect(html).toContain("Separate claim from evidence");
  });

  it("renders the authored B2 Module 3 culture-in-translation source as its selected critical-reading route", () => {
    const lesson = B2_LESSONS[38];
    const html = renderToStaticMarkup(<ExternalLessonWorkspace lesson={lesson} accent="british" onBack={() => undefined} />);

    expect(html).toContain("reading lesson");
    expect(html).toContain("Meet the English");
    expect(html).toContain("Notice one pattern");
    expect(html).toContain("Show what you can do");
    expect(html).not.toContain('aria-label="Lesson sections"');
    expect(html).toContain("Read culture in translation");
    expect(html).toContain("Distinguish a source’s representation from a broad claim about a culture");
  });
});
