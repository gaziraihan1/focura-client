import type { ReactNode } from "react";

export interface ColorTokens {
  bg: string;
  text: string;
  border: string;
  pill: string;
}

export interface GuideArticle {
  /** Optional stable key used by rich (dev-guide) articles. */
  id?: string;
  title: string;
  /** Plain text or rich JSX content — both render inside the article accordion. */
  content: ReactNode;
  /** Plain-text description used for search, snippets & read time when content is JSX. */
  summary?: string;
}

export interface GuideSection {
  id: string;
  icon: string;
  label: string;
  color: string;
  title: string;
  subtitle: string;
  badge?: string;
  articles: GuideArticle[];
}