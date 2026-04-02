export type HelpTopicId =
  | "getting-started"
  | "workspace"
  | "tasks"
  | "contact";

export type ArticleTag = "guide" | "reference" | "tip" | "new";

export interface HelpArticle {
  id: string;
  title: string;
  description: string;
  tag: ArticleTag;
  topicId: HelpTopicId;
  keywords: string[];
  docsPath: string
}

export interface HelpStep {
  step: number;
  title: string;
  description: string;
}

export interface HelpTopic {
  id: HelpTopicId;
  label: string;
  icon: string;
  description: string;
  accentColor: string;
  articles: HelpArticle[];
  steps?: HelpStep[];
  notice?: string;
}

export interface SearchResult {
  article: HelpArticle;
  score: number;
}

export interface ContactOption {
  id: string;
  icon: string;
  title: string;
  description: string;
  cta: string;
  href?: string;
  onClick?: () => void;
}

export interface ShortcutGroup {
  label: string;
  shortcuts: { description: string; keys: string[] }[];
}