import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { A1_IMMERSIVE_MODULES } from "@shared/course/a1-immersive-modules";
import { PROGRESSIVE_IMMERSIVE_MODULES } from "@shared/course/progressive-immersive";
import { ImmersiveCurriculumInventory, IMMERSIVE_INVENTORY_TEST_MARKER } from "./ImmersiveCurriculumInventory";

describe("ImmersiveCurriculumInventory", () => {
  it("shows the authored A1 family and progressive A2-C2 model for owner review", () => {
    const html = renderToStaticMarkup(<ImmersiveCurriculumInventory />);
    expect(A1_IMMERSIVE_MODULES).toHaveLength(6);
    expect(PROGRESSIVE_IMMERSIVE_MODULES).toHaveLength(33);
    expect(html).toContain(IMMERSIVE_INVENTORY_TEST_MARKER);
    expect(html).toContain("A1 · Module 1");
    expect(html).toContain("A2 · Module 1");
    expect(html).toContain("C2 · Module 6");
    expect(html).toContain("39 modules · 39 migration records");
  });
});
