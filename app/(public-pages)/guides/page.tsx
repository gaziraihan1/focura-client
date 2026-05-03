"use client";

import { GuideHeader } from "@/components/Guides/GuideHeader";
import { GuideSidebar } from "@/components/Guides/GuideSidebar";
import { SectionHero } from "@/components/Guides/SectionHero";
import { SectionPagination } from "@/components/Guides/SectionPagination";
import { useSectionContent } from "@/components/Guides/UseSectionContent";
import { GUIDE_SECTIONS } from "@/constants/guides.constants";
import { useRef, useState } from "react";

export default function GuidePage() {
  const [activeId, setActiveId] = useState(GUIDE_SECTIONS[0].id);
  const [mobileOpen, setMobileOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentSection = GUIDE_SECTIONS.find((s) => s.id === activeId)!;
  const sectionContent = useSectionContent(activeId);

  function navigate(id: string) {
    setActiveId(id);
    setMobileOpen(false);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GuideHeader
        current={currentSection}
        mobileOpen={mobileOpen}
        onMobileToggle={() => setMobileOpen((v) => !v)}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6 lg:gap-8 items-start">
        {/* Sidebar lives inside the flex container, aligns left */}
        <GuideSidebar
          sections={GUIDE_SECTIONS}
          activeId={activeId}
          mobileOpen={mobileOpen}
          onNavigate={navigate}
        />

        {/* Main content takes remaining space */}
        <main ref={contentRef} className="flex-1 min-w-0">
          <SectionHero section={currentSection} />

          <div key={activeId} className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            {sectionContent}
          </div>

          <SectionPagination
            sections={GUIDE_SECTIONS}
            activeId={activeId}
            onNavigate={navigate}
          />
        </main>
      </div>
    </div>
  );
}