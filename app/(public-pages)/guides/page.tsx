"use client";

import { useEffect, useMemo, useState } from "react";
import { GuideHeader } from "@/components/Guides/GuideHeader";
import { GuideSidebar } from "@/components/Guides/GuideSidebar";
import { SectionHero } from "@/components/Guides/SectionHero";
import { GuideSectionList } from "@/components/Guides/GuideSectionList";
import { GuideSearchResults } from "@/components/Guides/GuideSearchResults";
import { GuideSearchInput } from "@/components/Guides/GuideSearchInput";
import { SectionPagination } from "@/components/Guides/SectionPagination";
import { GUIDE_SECTIONS } from "@/constants/guides.constants";
import { searchGuides } from "@/utils/guides.utils";

export default function GuidePage() {
  const [activeId, setActiveId] = useState(GUIDE_SECTIONS[0].id);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [openArticle, setOpenArticle] = useState<string | null>(null);

  const currentSection =
    GUIDE_SECTIONS.find((section) => section.id === activeId) ?? GUIDE_SECTIONS[0];
  const trimmedQuery = query.trim();

  const results = useMemo(() => searchGuides(GUIDE_SECTIONS, trimmedQuery), [trimmedQuery]);

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
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex gap-8 items-start">
        <GuideSidebar
          sections={GUIDE_SECTIONS}
          activeId={activeId}
          mobileOpen={mobileOpen}
          onNavigate={navigate}
          onClose={() => setMobileOpen(false)}
        />

        <main className="flex-1 min-w-0">
          <GuideSearchInput
            value={query}
            onChange={setQuery}
            id="guide-search-mobile"
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
                sections={GUIDE_SECTIONS}
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
