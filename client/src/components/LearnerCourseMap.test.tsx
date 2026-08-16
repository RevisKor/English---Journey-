import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { A1_LESSONS } from "@shared/course/a1";
import { C1_LESSONS } from "@shared/course/c1";
import { LearnerCourseMap } from "./LearnerCourseMap";

describe("LearnerCourseMap", () => {
  it("renders the six active A1 immersive journeys with gated lesson controls", () => {
    const html = renderToStaticMarkup(<LearnerCourseMap level="A1" lessons={A1_LESSONS} completedLessons={new Set()} canEnter={(lessonNumber) => lessonNumber === 1} openLesson={() => undefined} />);
    expect(html).toContain("Active 15-lesson journey");
    expect(html).toContain("15 guided lessons");
    expect(html).toContain("هذه رحلتك النشطة الموجّهة");
    expect((html.match(/aria-label="Open lesson /g) ?? []).length).toBe(90);
    expect(html).toContain("Active 15-lesson journey");
    expect((html.match(/<ol/g) ?? []).length).toBe(6);
    expect((html.match(/Hide lessons/g) ?? []).length).toBe(6);
    expect(html).toContain("aria-expanded=\"true\"");
    expect(html).toContain("Module focus:");
    expect(html).toContain("arabic-support");
  });

  it("renders named bilingual C1 modules and the first direct lesson entry", () => {
    const html = renderToStaticMarkup(<LearnerCourseMap level="C1" lessons={C1_LESSONS} completedLessons={new Set()} canEnter={(lessonNumber) => lessonNumber === 1} openLesson={() => undefined} />);
    expect(html).toContain("Sources and Perspectives");
    expect(html).toContain("المصادر ووجهات النظر");
    expect(html).toContain("Reading between the lines");
    expect(html).toContain("Module 4");
    expect((html.match(/aria-label="Open lesson /g) ?? []).length).toBe(20);
    expect(html).toContain("Guided preview:");
  });
});
