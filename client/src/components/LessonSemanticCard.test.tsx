import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { describe, expect, it } from "vitest";
import { LessonSemanticCard, LESSON_SEMANTIC_PRESENTATION } from "./LessonSemanticCard";

describe("LessonSemanticCard", () => {
  it("renders semantic meaning with an English label, Arabic label, and icon-backed accessibility label", () => {
    const html = renderToStaticMarkup(
      <LessonSemanticCard semantic="common-mistake" title="Do not omit am" titleArabic="لا تحذف am">
        English needs am in this sentence.
      </LessonSemanticCard>,
    );

    expect(html).toContain('aria-label="Common mistake"');
    expect(html).toContain("Common mistake");
    expect(html).toContain("خطأ شائع");
    expect(html).toContain("Do not omit am");
  });

  it("defines a complete visual-language presentation for every semantic role", () => {
    expect(Object.keys(LESSON_SEMANTIC_PRESENTATION).sort()).toEqual([
      "activity",
      "assessment",
      "common-mistake",
      "example",
      "grammar",
      "objective",
      "retrieval",
      "tip",
      "vocabulary",
    ]);
  });
});
