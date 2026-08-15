import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { C1_LESSONS } from "@shared/course/c1";
import { LearnerCourseMap } from "./LearnerCourseMap";

describe("LearnerCourseMap", () => {
  it("renders named bilingual C1 modules and the first direct lesson entry", () => {
    const html = renderToStaticMarkup(<LearnerCourseMap level="C1" lessons={C1_LESSONS} completedLessons={new Set()} canEnter={(lessonNumber) => lessonNumber === 1} openLesson={() => undefined} />);
    expect(html).toContain("Sources and Perspectives");
    expect(html).toContain("المصادر ووجهات النظر");
    expect(html).toContain("Reading between the lines");
    expect(html).toContain("Module 4");
    expect((html.match(/<button/g) ?? []).length).toBe(20);
  });
});
