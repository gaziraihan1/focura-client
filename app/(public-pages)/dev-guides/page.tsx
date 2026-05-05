"use client";

import { DevGuideHeader } from "@/components/DevGuides/DevGuideHeader";
import { DevGuideSidebar } from "@/components/DevGuides/DevGuideSidebar";
import { DevSectionHero, DevSectionPagination } from "@/components/DevGuides/DevSectionHero";
import { useDevSectionContent } from "@/components/DevGuides/UseDevSectionContent";
import { DEV_SECTIONS } from "@/lib/devGuides";
import { useRef, useState } from "react";

export default function DevGuidePage() {
  const [activeId, setActiveId] = useState(DEV_SECTIONS[0].id);
  const [mobileOpen, setMobileOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentSection = DEV_SECTIONS.find(s => s.id === activeId)!;
  const sectionContent = useDevSectionContent(activeId);

  function navigate(id: string) {
    setActiveId(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DevGuideHeader
        current={currentSection}
        mobileOpen={mobileOpen}
        onMobileToggle={() => setMobileOpen(v => !v)}
      />

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6 lg:gap-8 items-start">
        <DevGuideSidebar
          sections={DEV_SECTIONS}
          activeId={activeId}
          mobileOpen={mobileOpen}
          onNavigate={navigate}
        />

        <main ref={contentRef} className="flex-1 min-w-0">
          <DevSectionHero section={currentSection} />

          <div key={activeId} className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            {sectionContent}
          </div>

          <DevSectionPagination
            sections={DEV_SECTIONS}
            activeId={activeId}
            onNavigate={navigate}
          />
        </main>
      </div>
    </div>
  );
}