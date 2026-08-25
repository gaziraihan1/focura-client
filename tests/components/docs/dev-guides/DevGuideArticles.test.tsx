import { describe, it, expect } from "vitest";
import { DEV_SECTIONS } from "@/lib/devGuides";
import { DEV_ARTICLE_MAP } from "@/components/docs/dev-guides/DevGuideArticles";

describe("DevGuideArticles", () => {
  it("covers every dev-guide section with a non-empty article list", () => {
    DEV_SECTIONS.forEach((section) => {
      expect(DEV_ARTICLE_MAP[section.id]).toBeTruthy();
      expect(DEV_ARTICLE_MAP[section.id].length).toBeGreaterThan(0);
    });
  });

  it("does not define articles for unknown sections", () => {
    const sectionIds = new Set(DEV_SECTIONS.map((section) => section.id));
    Object.keys(DEV_ARTICLE_MAP).forEach((key) => {
      expect(sectionIds.has(key)).toBe(true);
    });
  });

  it("each article has a title, summary, and content", () => {
    Object.values(DEV_ARTICLE_MAP).forEach((articles) => {
      articles.forEach((article) => {
        expect(article.title).toBeTruthy();
        expect(article.summary).toBeTruthy();
        expect(article.content).toBeTruthy();
      });
    });
  });

  it("article titles are unique within each section", () => {
    DEV_SECTIONS.forEach((section) => {
      const titles = DEV_ARTICLE_MAP[section.id].map((article) => article.title);
      expect(new Set(titles).size).toBe(titles.length);
    });
  });

  it("summaries provide plain text searchable content", () => {
    Object.values(DEV_ARTICLE_MAP).forEach((articles) => {
      articles.forEach((article) => {
        expect(article.summary!.trim().length).toBeGreaterThan(10);
      });
    });
  });
});
