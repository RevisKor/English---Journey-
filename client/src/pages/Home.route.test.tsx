import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { C1_LESSONS } from "@shared/course/c1";
import { A1_COURSE, A1_LESSONS, A2_COURSE, A2_LESSONS, B1_COURSE, B1_LESSONS, B2_COURSE, B2_LESSONS, C1_COURSE, C2_COURSE, C2_LESSONS } from "@shared/course";
import { buildReviewRequestPlan, reviewDispatchStatus, ContentReview } from "@/components/ContentReview";

const mockUseAuth = vi.hoisted(() => vi.fn());
const mockUseQuery = vi.hoisted(() => vi.fn(() => ({ data: undefined, refetch: vi.fn() })));
const mockUseMutation = vi.hoisted(() => vi.fn(() => ({ mutate: vi.fn(), isPending: false })));

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: mockUseAuth }));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({ admin: { catalog: { fetch: vi.fn(() => Promise.resolve([])) }, lesson: { fetch: vi.fn(() => Promise.resolve(null)) } } }),
    course: {

      dashboard: { useQuery: mockUseQuery },
      progress: { useQuery: mockUseQuery },
      recordActivity: { useMutation: mockUseMutation },
      updateAccent: { useMutation: mockUseMutation },
    },
  },
}));
vi.mock("@/components/A2LessonWorkspace", () => ({
  StructuredLessonWorkspace: ({ lesson }: { lesson: { title: string } }) => React.createElement("div", null, `Guided lesson workspace: ${lesson.title}`),
}));

import { AppShell, CourseDashboard, resolveDirectLesson, resolveLearnerEntry, tutorialCopy, WORD_BANK_DIALOG_LAYOUT_CLASS, WORD_BANK_TABLE_LAYOUT_CLASS, WORD_BANK_TABLE_SCROLL_CLASS } from "./Home";

describe("Home learner entry routing", () => {
  it("renders resolved owner-review catalog modules and selected lesson detail", () => {
    const html = renderToStaticMarkup(<ContentReview onOpenCourse={() => undefined} initialData={{
      selectedLevel: "A1",
      selectedLesson: 1,
      catalog: [{ code: "A1", title: "Beginner English", titleArabic: "الإنجليزية للمبتدئين", totalLessons: 20, modules: [{ id: 1, moduleNumber: 1, title: "Foundations", lessons: [{ id: 1, lessonNumber: 1, title: "Hello & introductions" }] }] }],
      detail: { lesson: { title: "Hello & introductions", titleArabic: "التحية والتعارف", learningPlan: { outcome: { canDo: "Introduce yourself", canDoArabic: "قدّم نفسك" }, steps: [] } }, topic: { title: "Greetings" }, vocabulary: [], grammar: [], readings: [], writingTasks: [], assessments: [] } as any,
    }} />);
    expect(html).toContain("Inspect every completed lesson.");
    expect(html).toContain("Module 1 · Foundations");
    expect(html).toContain("Hello &amp; introductions");
    expect(html).toContain("Introduce yourself");
    expect(html).toContain("Open learner view");
  });

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: { name: "Owner", role: "admin" },
      isAuthenticated: true,
      logout: vi.fn(),
    });
  });

  it("renders the authenticated C1 AppShell course map with bilingual mentor preview", () => {
    const html = renderToStaticMarkup(<AppShell initialSearch="?level=C1" />);
    expect(html).toContain("C1 · Guided learning route");
    expect(html).toContain("Before you begin");
    expect(html).toContain("At C1, you are learning to read and write with intellectual control");
    expect(html).toContain("في مستوى C1، تتعلم القراءة والكتابة بضبط فكري");
    expect(html).toContain("Sources and Perspectives");
  });

  it("renders the authenticated AppShell direct C1 lesson URL as a guided workspace", () => {
    const html = renderToStaticMarkup(<AppShell initialSearch="?level=C1&lesson=1" />);
    expect(html).toContain("Guided lesson workspace: Reading between the lines");
    expect(resolveDirectLesson("?level=C1&lesson=1", true, new Set())?.title).toBe("Reading between the lines");
  });

  it("keeps the shared route model aligned with the C1 lesson catalog", () => {
    const entry = resolveLearnerEntry("?level=C1&lesson=1");
    expect(entry.level).toBe("C1");
    expect(entry.lesson?.lessonNumber).toBe(1);
    expect(entry.lesson?.title).toBe("Reading between the lines");
    expect(entry.mentorPreview?.title).toBe("Your mentor is here");
    expect(entry.mentorPreview?.messageArabic).toContain("C1");
    expect(C1_LESSONS).toHaveLength(160);
  });

  it("keeps the course guide reachable on mobile and provides Arabic beginner scaffolding", () => {
    const html = renderToStaticMarkup(<AppShell initialSearch="?level=A1" />);
    expect(html).toContain('aria-label="Open course guide"');
    expect(html).toContain("Good to see you again");
    expect(tutorialCopy.A1.introArabic).toContain("رحلة الإنجليزية");
    expect(tutorialCopy.A1.steps.every((step) => step.bodyArabic)).toBe(true);
    expect(tutorialCopy.A2.steps.every((step) => step.bodyArabic)).toBe(true);
  });

  it("enters the protected review shell for an authenticated owner", () => {
    const html = renderToStaticMarkup(<AppShell initialSearch="?review=1" />);
    expect(html).toContain("Content review");
    expect(html).toContain("Content review");
    expect(html).toContain("Loading completed content");
  });

  it("defines and validates the catalog plus selected lesson-detail dispatch contract", () => {
    expect(buildReviewRequestPlan("C1", 7)).toEqual({
      catalog: { procedure: "admin.catalog", input: undefined },
      lesson: { procedure: "admin.lesson", input: { level: "C1", lessonNumber: 7 } },
    });
    expect(reviewDispatchStatus([{ code: "C1", modules: [{ lessons: [{ lessonNumber: 7 }] }], totalLessons: 20 }], {
      lesson: { title: "Reading between the lines" }, vocabulary: [], grammar: [], assessments: [],
    })).toEqual({ catalogLoaded: true, lessonLoaded: true });
  });

  it("keeps a level-only course URL in the course-map state", () => {
    const entry = resolveLearnerEntry("?level=C1");
    expect(entry.level).toBe("C1");
    expect(entry.lesson).toBeUndefined();
  });

  it("validates the complete A1–C2 learner route and Arabic activity contract", () => {
    const courses = [
      [A1_COURSE, A1_LESSONS], [A2_COURSE, A2_LESSONS], [B1_COURSE, B1_LESSONS], [B2_COURSE, B2_LESSONS], [C1_COURSE, C1_COURSE.lessons], [C2_COURSE, C2_LESSONS],
    ] as const;
    for (const [course, lessons] of courses) {
      expect(lessons).toHaveLength(course.totalLessons);
      expect(course.modules!.length).toBeGreaterThanOrEqual(4);
      expect(lessons[0].titleArabic).toBeTruthy();
      expect(lessons.at(-1)?.titleArabic).toBeTruthy();
      expect(lessons.every((lesson) => lesson.activities?.length && lesson.grammar?.teachingGuide?.whatItIs && lesson.grammar?.teachingGuide?.shortAnswerExamples.length)).toBe(true);
      expect(resolveDirectLesson(`?level=${course.level}&lesson=${course.totalLessons}`, true, new Set())?.lessonNumber).toBe(course.totalLessons);
      expect(resolveDirectLesson(`?level=${course.level}&lesson=${course.totalLessons}`, false, new Set())).toBeUndefined();
    }
    expect(A1_COURSE.modules).toHaveLength(6);
    expect(A1_COURSE.modules?.every((module) => module.lessonNumbers.length === 15)).toBe(true);
  });

  it("still renders the isolated dashboard contract used by the map component", () => {
    const html = renderToStaticMarkup(<CourseDashboard level="C1" lessons={C1_LESSONS} completedLessons={new Set()} profile={{ totalXp: 20, currentStreak: 1, longestStreak: 1 }} canEnter={(lessonNumber) => lessonNumber === 1} openLesson={() => undefined} unlocked />);
    expect(html).toContain("C1 · Guided learning route");
    expect(html).toContain("Open word bank");
    expect(html).not.toContain("Module word bank");
  });

  it("reserves a wider, scrollable word-bank table so vocabulary rows remain readable", () => {
    expect(WORD_BANK_DIALOG_LAYOUT_CLASS).toContain("1280px");
    expect(WORD_BANK_TABLE_LAYOUT_CLASS).toContain("min-w-[1180px]");
    expect(WORD_BANK_TABLE_LAYOUT_CLASS).toContain("table-fixed");
    expect(WORD_BANK_TABLE_SCROLL_CLASS).toContain("overflow-auto");
    expect(WORD_BANK_TABLE_SCROLL_CLASS).toContain("isolate");
  });

});
