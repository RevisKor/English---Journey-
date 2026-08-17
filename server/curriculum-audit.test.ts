import { describe, expect, it } from "vitest";
import { ACTIVE_COURSES, auditCourse, buildCurriculumAuditReport, formatCurriculumAudit } from "./curriculum-audit";

describe("curriculum audit", () => {
  it("covers the active A1–C2 portfolio with its declared lesson totals", () => {
    const report = buildCurriculumAuditReport(new Date("2026-08-17T00:00:00.000Z"));

    expect(report.levels.map((level) => level.level)).toEqual(["A1", "A2", "B1", "B2", "C1", "C2"]);
    expect(report.totals.lessons).toBe(865);
    expect(report.levels.every((level) => level.totalLessons === level.expectedLessons)).toBe(true);
    expect(report.levels.every((level) => level.modules === level.expectedModules)).toBe(true);
  });

  it("flags no duplicate lesson numbers and exposes lesson-family distributions for every level", () => {
    for (const course of ACTIVE_COURSES) {
      const audit = auditCourse(course);
      expect(audit.duplicateLessonNumbers).toEqual([]);
      expect(Object.values(audit.lessonTypeDistribution).reduce((total, count) => total + count, 0)).toBe(course.totalLessons);
    }
  });

  it("renders a concise human-readable audit table", () => {
    const report = buildCurriculumAuditReport(new Date("2026-08-17T00:00:00.000Z"));
    const markdown = formatCurriculumAudit(report);
    expect(markdown).toContain("| A1 | 90/90 |");
    expect(markdown).toContain("| C2 | 180/180 |");
    expect(markdown).toContain("865 lessons");
  });
});
