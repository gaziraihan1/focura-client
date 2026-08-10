import { describe, it, expect } from "vitest";
import { COLOR_MAP, DEV_SECTIONS } from "@/lib/devGuides";

describe("lib/devGuides", () => {
  it("exports DEV_SECTIONS array", () => {
    expect(Array.isArray(DEV_SECTIONS)).toBe(true);
    expect(DEV_SECTIONS.length).toBeGreaterThan(0);
  });

  it("each section has id, icon, label, color, title, subtitle", () => {
    DEV_SECTIONS.forEach((section) => {
      expect(section.id).toBeTruthy();
      expect(section.icon).toBeTruthy();
      expect(section.label).toBeTruthy();
      expect(section.color).toBeTruthy();
      expect(section.title).toBeTruthy();
      expect(section.subtitle).toBeTruthy();
    });
  });

  it("first section is overview", () => {
    expect(DEV_SECTIONS[0].id).toBe("overview");
    expect(DEV_SECTIONS[0].label).toBe("Overview");
  });

  it("includes setup, frontend-arch, backend-arch sections", () => {
    const ids = DEV_SECTIONS.map((s) => s.id);
    expect(ids).toContain("setup");
    expect(ids).toContain("frontend-arch");
    expect(ids).toContain("backend-arch");
  });

  it("each section has a unique id", () => {
    const ids = DEV_SECTIONS.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("every section color exists in the shared COLOR_MAP", () => {
    DEV_SECTIONS.forEach((section) => {
      expect(COLOR_MAP[section.color]).toBeTruthy();
    });
  });

  it("re-exports the shared COLOR_MAP", () => {
    expect(COLOR_MAP.blue).toBeTruthy();
    expect(COLOR_MAP.pink).toBeTruthy();
  });
});
