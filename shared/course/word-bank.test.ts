import { describe, expect, it } from "vitest";
import { A1_COURSE, B1_COURSE, C2_COURSE } from "./index";
import { buildModuleWordBank, summarizeWordBank } from "./word-bank";

describe("module word banks", () => {
  it("aggregates only the selected module and preserves lesson provenance", () => {
    const entries = buildModuleWordBank(A1_COURSE, 1, new Set([1]));
    expect(entries.length).toBeGreaterThan(0);
    expect(new Set(entries.map((entry) => entry.introducedLessonNumber))).toEqual(new Set([1, 2, 3, 4, 5]));
    expect(entries.filter((entry) => entry.introducedLessonNumber === 1).every((entry) => entry.familiarity === "recognized")).toBe(true);
    expect(entries.some((entry) => entry.introducedLessonNumber > 1 && entry.familiarity === "introduced")).toBe(true);
  });

  it("scales across different authored module sizes and summarizes review state", () => {
    const b1Entries = buildModuleWordBank(B1_COURSE, 2, new Set([7]));
    const c2Entries = buildModuleWordBank(C2_COURSE, 3, new Set());
    expect(b1Entries.length).toBeGreaterThan(0);
    expect(c2Entries.length).toBeGreaterThan(0);
    expect(summarizeWordBank(c2Entries)).toMatchObject({ total: c2Entries.length, introduced: c2Entries.length, recognized: 0 });
  });
});
