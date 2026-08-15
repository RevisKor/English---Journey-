import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { C1_LESSONS } from "@shared/course/c1";

const mockUseAuth = vi.hoisted(() => vi.fn());
const mockUseQuery = vi.hoisted(() => vi.fn(() => ({ data: undefined, refetch: vi.fn() })));
const mockUseMutation = vi.hoisted(() => vi.fn(() => ({ mutate: vi.fn(), isPending: false })));

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: mockUseAuth }));
vi.mock("@/lib/trpc", () => ({
  trpc: {
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

import { AppShell, CourseDashboard, resolveDirectLesson, resolveLearnerEntry, tutorialCopy } from "./Home";

describe("Home learner entry routing", () => {
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
    expect(C1_LESSONS).toHaveLength(20);
  });

  it("keeps the course guide reachable on mobile and provides Arabic beginner scaffolding", () => {
    const html = renderToStaticMarkup(<AppShell initialSearch="?level=A1" />);
    expect(html).toContain('aria-label="Open course guide"');
    expect(tutorialCopy.A1.introArabic).toContain("رحلة الإنجليزية");
    expect(tutorialCopy.A1.steps.every((step) => step.bodyArabic)).toBe(true);
    expect(tutorialCopy.A2.steps.every((step) => step.bodyArabic)).toBe(true);
  });

  it("keeps a level-only course URL in the course-map state", () => {
    const entry = resolveLearnerEntry("?level=C1");
    expect(entry.level).toBe("C1");
    expect(entry.lesson).toBeUndefined();
  });

  it("still renders the isolated dashboard contract used by the map component", () => {
    const html = renderToStaticMarkup(<CourseDashboard level="C1" lessons={C1_LESSONS} completedLessons={new Set()} profile={{ totalXp: 20, currentStreak: 1, longestStreak: 1 }} canEnter={(lessonNumber) => lessonNumber === 1} openLesson={() => undefined} unlocked />);
    expect(html).toContain("C1 · Guided learning route");
    expect(html).toContain("Module word bank");
    expect(html).toContain("Review + play");
  });
});
