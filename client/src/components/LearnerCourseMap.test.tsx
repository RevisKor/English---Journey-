import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { A1_LESSONS } from "@shared/course/a1";
import { C1_LESSONS } from "@shared/course/c1";
import { LearnerCourseMap } from "./LearnerCourseMap";

describe("LearnerCourseMap", () => {
  it("renders the A1 immersive roadmap without replacing active gated lessons", () => {
    const html = renderToStaticMarkup(<LearnerCourseMap level="A1" lessons={A1_LESSONS} completedLessons={new Set()} canEnter={(lessonNumber) => lessonNumber === 1} openLesson={() => undefined} />);
    expect(html).toContain("Immersive roadmap");
    expect(html).toContain("15 planned lessons");
    expect(html).toContain("يجري تعميق هذه الوحدة");
    expect((html.match(/<button/g) ?? []).length).toBe(20);
  });

  it("renders named bilingual C1 modules and the first direct lesson entry", () => {
    const html = renderToStaticMarkup(<LearnerCourseMap level="C1" lessons={C1_LESSONS} completedLessons={new Set()} canEnter={(lessonNumber) => lessonNumber === 1} openLesson={() => undefined} />);
    expect(html).toContain("Sources and Perspectives");
    expect(html).toContain("المصادر ووجهات النظر");
    expect(html).toContain("Reading between the lines");
    expect(html).toContain("Module 4");
    expect((html.match(/<button/g) ?? []).length).toBe(20);
  });
});
