// @vitest-environment node
import { describe, it, expect } from "vitest";
import { articleKey, estimateReadMinutes, searchGuides } from "@/utils/guides.utils";
import type { GuideSection } from "@/types/guides.types";

const sections: GuideSection[] = [
  {
    id: "tasks",
    icon: "◉",
    label: "Tasks & Subtasks",
    color: "amber",
    title: "Tasks & Subtasks",
    subtitle: "Create, assign, and track work items",
    articles: [
      { title: "Creating a task", content: "Click New Task and fill in the details." },
      { title: "Recurring tasks", content: "Toggle Recurring and choose a pattern." },
    ],
  },
  {
    id: "billing",
    icon: "◆",
    label: "Billing & Plans",
    color: "cyan",
    title: "Billing & Plans",
    subtitle: "Manage your subscription",
    articles: [{ title: "Available plans", content: "Free, Pro, Business, and Enterprise plans." }],
  },
];

describe("guides.utils", () => {
  describe("articleKey", () => {
    it("combines section id and article title", () => {
      expect(articleKey("tasks", "Creating a task")).toBe("tasks::Creating a task");
    });
  });

  describe("searchGuides", () => {
    it("returns an empty array for blank queries", () => {
      expect(searchGuides(sections, "")).toEqual([]);
      expect(searchGuides(sections, "   ")).toEqual([]);
    });

    it("matches article titles", () => {
      const results = searchGuides(sections, "recurring");
      expect(results).toHaveLength(1);
      expect(results[0].article.title).toBe("Recurring tasks");
    });

    it("matches article content", () => {
      const results = searchGuides(sections, "enterprise");
      expect(results).toHaveLength(1);
      expect(results[0].section.id).toBe("billing");
    });

    it("matches section titles", () => {
      const results = searchGuides(sections, "billing");
      expect(results).toHaveLength(1);
    });

    it("is case-insensitive", () => {
      expect(searchGuides(sections, "RECURRING")).toHaveLength(1);
      expect(searchGuides(sections, "Task")).toHaveLength(2);
    });

    it("returns stable keys for each result", () => {
      const results = searchGuides(sections, "task");
      expect(results.every((result) => result.key === `${result.section.id}::${result.article.title}`)).toBe(
        true
      );
    });

    it("returns no results for unmatched queries", () => {
      expect(searchGuides(sections, "zzzzzz")).toEqual([]);
    });
  });

  describe("estimateReadMinutes", () => {
    it("returns at least 1 minute", () => {
      expect(estimateReadMinutes(sections[0])).toBeGreaterThanOrEqual(1);
    });

    it("scales with content length", () => {
      const tiny = sections[1];
      const huge: GuideSection = {
        ...sections[0],
        articles: [
          ...sections[0].articles,
          { title: "Long article", content: "word ".repeat(2000) },
        ],
      };
      expect(estimateReadMinutes(huge)).toBeGreaterThan(estimateReadMinutes(tiny));
    });
  });
});
