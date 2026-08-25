"use client";

import type { GuideSection } from "@/types/guides.types";
import { articleKey } from "@/utils/guides.utils";
import { ArticleCard } from "./ArticleCard";

interface GuideSectionListProps {
  section: GuideSection;
  openArticle: string | null;
  onToggleArticle: (key: string) => void;
}

export function GuideSectionList({ section, openArticle, onToggleArticle }: GuideSectionListProps) {
  return (
    <div className="space-y-2.5">
      {section.articles.map((article, index) => {
        const key = articleKey(section.id, article.title);
        return (
          <ArticleCard
            key={key}
            article={article}
            index={index}
            isOpen={openArticle === key}
            onToggle={() => onToggleArticle(key)}
          />
        );
      })}
    </div>
  );
}
