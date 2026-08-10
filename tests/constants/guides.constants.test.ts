import { describe, it, expect } from "vitest";
import { COLOR_MAP, GUIDE_SECTIONS } from "@/constants/guides.constants";

describe("guides.constants", () => {
  describe("COLOR_MAP", () => {
    it("has 12 color themes", () => {
      expect(Object.keys(COLOR_MAP)).toHaveLength(12);
    });

    it("includes expected colors", () => {
      expect(COLOR_MAP.blue).toBeTruthy();
      expect(COLOR_MAP.violet).toBeTruthy();
      expect(COLOR_MAP.emerald).toBeTruthy();
      expect(COLOR_MAP.sky).toBeTruthy();
      expect(COLOR_MAP.lime).toBeTruthy();
    });

    it("each color has bg, text, border, pill", () => {
      Object.values(COLOR_MAP).forEach((color) => {
        expect(color.bg).toBeTruthy();
        expect(color.text).toBeTruthy();
        expect(color.border).toBeTruthy();
        expect(color.pill).toBeTruthy();
      });
    });
  });

  describe("GUIDE_SECTIONS", () => {
    it("has 12 guide sections", () => {
      expect(GUIDE_SECTIONS).toHaveLength(12);
    });

    it("each section has metadata and at least one article", () => {
      GUIDE_SECTIONS.forEach((section) => {
        expect(section.id).toBeTruthy();
        expect(section.icon).toBeTruthy();
        expect(section.label).toBeTruthy();
        expect(section.color).toBeTruthy();
        expect(section.title).toBeTruthy();
        expect(section.subtitle).toBeTruthy();
        expect(section.articles.length).toBeGreaterThan(0);
      });
    });

    it("article titles are unique within each section", () => {
      GUIDE_SECTIONS.forEach((section) => {
        const titles = section.articles.map((article) => article.title);
        expect(new Set(titles).size).toBe(titles.length);
      });
    });

    it("every section color exists in COLOR_MAP", () => {
      GUIDE_SECTIONS.forEach((section) => {
        expect(COLOR_MAP[section.color]).toBeTruthy();
      });
    });

    it("first section is getting-started", () => {
      expect(GUIDE_SECTIONS[0].id).toBe("getting-started");
      expect(GUIDE_SECTIONS[0].label).toBe("Getting Started");
    });

    it("last section is troubleshooting", () => {
      expect(GUIDE_SECTIONS[GUIDE_SECTIONS.length - 1].id).toBe("troubleshooting");
      expect(GUIDE_SECTIONS[GUIDE_SECTIONS.length - 1].label).toBe("Troubleshooting");
    });
  });
});
