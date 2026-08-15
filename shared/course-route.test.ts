import { describe, expect, it } from "vitest";
import { courseRoutePath, resolveCourseRoute } from "./course-route";

describe("course lesson routes", () => {
  it("resolves only available levels and positive lesson numbers", () => {
    expect(resolveCourseRoute("?level=B2&lesson=24")).toEqual({ level: "B2", lessonNumber: 24 });
    expect(resolveCourseRoute("?level=C1&lesson=-2")).toEqual({ level: "A1", lessonNumber: null });
  });

  it("builds shareable course and lesson paths", () => {
    expect(courseRoutePath("A2", 1)).toBe("/?level=A2&lesson=1");
    expect(courseRoutePath("B1")).toBe("/?level=B1");
  });
});
