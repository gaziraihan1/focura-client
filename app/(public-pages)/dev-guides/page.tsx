"use client";

import { useEffect, useMemo, useState } from "react";
import type { GuideSection } from "@/types/guides.types";
import { GuideHeader } from "@/components/docs/guides/GuideHeader";
import { GuideSidebar } from "@/components/docs/guides/GuideSidebar";
import { SectionHero } from "@/components/docs/guides/SectionHero";
import { GuideSectionList } from "@/components/docs/guides/GuideSectionList";
import { GuideSearchResults } from "@/components/docs/guides/GuideSearchResults";
import { GuideSearchInput } from "@/components/docs/guides/GuideSearchInput";
import { SectionPagination } from "@/components/docs/guides/SectionPagination";
import { DEV_SECTIONS } from "@/lib/devGuides";
import { DEV_ARTICLE_MAP } from "@/components/docs/dev-guides/DevGuideArticles";
import { searchGuides } from "@/utils/guides.utils";

/** Merge section metadata with the rich article content once, at module scope. */
const SECTIONS: GuideSection[] = DEV_SECTIONS.map((section) => ({
  ...section,
  articles: DEV_ARTICLE_MAP[section.id] ?? [],
}));

export default function DevGuidePage() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [openArticle, setOpenArticle] = useState<string | null>(null);

  const currentSection = SECTIONS.find((section) => section.id === activeId) ?? SECTIONS[0];
  const trimmedQuery = query.trim();

  const results = useMemo(() => searchGuides(SECTIONS, trimmedQuery), [trimmedQuery]);

  // Close the mobile drawer with Escape for keyboard users.
  useEffect(() => {
    if (!mobileOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  function navigate(id: string, articleKey: string | null = null) {
    setActiveId(id);
    setOpenArticle(articleKey);
    setMobileOpen(false);
    setQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-clip">
      <GuideHeader
        current={currentSection}
        mobileOpen={mobileOpen}
        onMobileToggle={() => setMobileOpen((value) => !value)}
        query={query}
        onQueryChange={setQuery}
        label="Developer Guide"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex gap-8 items-start">
        <GuideSidebar
          sections={SECTIONS}
          activeId={activeId}
          mobileOpen={mobileOpen}
          onNavigate={navigate}
          onClose={() => setMobileOpen(false)}
        />

        <main className="flex-1 min-w-0">
          <GuideSearchInput
            value={query}
            onChange={setQuery}
            id="dev-guide-search-mobile"
            className="mb-4 sm:hidden"
          />

          {trimmedQuery ? (
            <GuideSearchResults
              query={trimmedQuery}
              results={results}
              onOpen={(sectionId, key) => navigate(sectionId, key)}
            />
          ) : (
            <>
              <SectionHero section={currentSection} />
              <GuideSectionList
                section={currentSection}
                openArticle={openArticle}
                onToggleArticle={(key) =>
                  setOpenArticle((current) => (current === key ? null : key))
                }
              />
              <SectionPagination
                sections={SECTIONS}
                activeId={activeId}
                onNavigate={(id) => navigate(id)}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
