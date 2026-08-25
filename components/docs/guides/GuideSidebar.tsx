"use client";

import { X } from "lucide-react";
import type { GuideSection } from "@/types/guides.types";
import { COLOR_MAP } from "@/constants/guides.constants";

interface GuideSidebarProps {
  sections: GuideSection[];
  activeId: string;
  mobileOpen: boolean;
  onNavigate: (id: string) => void;
  onClose: () => void;
}

function NavItem({
  section,
  isActive,
  onClick,
}: {
  section: GuideSection;
  isActive: boolean;
  onClick: () => void;
}) {
  const c = COLOR_MAP[section.color];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
        isActive
          ? `${c.bg} font-medium ${c.text}`
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <span className={`shrink-0 text-xs ${isActive ? c.text : "group-hover:text-foreground"}`}>
        {section.icon}
      </span>
      <span className="flex-1 truncate">{section.label}</span>
      <span
        className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
          isActive ? c.pill : "bg-muted text-muted-foreground"
        }`}
      >
        {section.articles.length}
      </span>
    </button>
  );
}

export function GuideSidebar({
  sections,
  activeId,
  mobileOpen,
  onNavigate,
  onClose,
}: GuideSidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-60 shrink-0 sticky top-36 self-start max-h-[calc(100vh-10rem)] overflow-y-auto pr-1">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Topics
        </p>
        <nav aria-label="Guide topics" className="flex flex-col gap-0.5">
          {sections.map((section) => (
            <NavItem
              key={section.id}
              section={section}
              isActive={section.id === activeId}
              onClick={() => onNavigate(section.id)}
            />
          ))}
        </nav>
      </aside>

      {/* Mobile drawer — starts below the sticky header (top-16 h-14). Uses
          explicit directional insets (inset-x-0 bottom-0 top-30) so it always
          spans exactly the viewport width and never overflows on small screens. */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Guide topics"
          className="md:hidden fixed inset-x-0 bottom-0 top-30 max-h-[calc(100dvh-7.5rem)] z-20 bg-background/95 backdrop-blur overflow-y-auto overscroll-contain animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Topics
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close guide topics"
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <nav aria-label="Guide topics" className="flex flex-col gap-0.5 px-3 pb-8">
            {sections.map((section) => (
              <NavItem
                key={section.id}
                section={section}
                isActive={section.id === activeId}
                onClick={() => onNavigate(section.id)}
              />
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
