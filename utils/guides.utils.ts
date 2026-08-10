import type { GuideArticle, GuideSection } from "@/types/guides.types";

export interface GuideSearchResult {
  section: GuideSection;
  article: GuideArticle;
  /** Stable key used to open an article from anywhere (e.g. search results). */
  key: string;
}

export function articleKey(sectionId: string, articleTitle: string): string {
  return `${sectionId}::${articleTitle}`;
}

/**
 * Plain-text representation of an article. String content is used directly;
 * rich JSX content falls back to the article summary.
 */
export function getArticleText(article: GuideArticle): string {
  return typeof article.content === "string" ? article.content : article.summary ?? "";
}

/**
 * Case-insensitive substring search across article titles, article text, and
 * the section title. Returns an empty array for blank queries so callers can
 * branch into "no search" mode cheaply.
 */
export function searchGuides(sections: GuideSection[], query: string): GuideSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [];
  }

  const results: GuideSearchResult[] = [];
  for (const section of sections) {
    for (const article of section.articles) {
      const haystack = `${article.title} ${getArticleText(article)} ${section.title}`.toLowerCase();
      if (haystack.includes(q)) {
        results.push({
          section,
          article,
          key: articleKey(section.id, article.title),
        });
      }
    }
  }
  return results;
}

/** Rough reading-time estimate in minutes for a whole guide section. */
export function estimateReadMinutes(section: GuideSection): number {
  const words = section.articles.reduce((total, article) => {
    return total + article.title.split(/\s+/).length + getArticleText(article).split(/\s+/).length;
  }, 0);
  return Math.max(1, Math.round(words / 200));
}
