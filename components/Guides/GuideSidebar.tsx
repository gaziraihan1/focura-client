"use client";

import type { GuideSection } from "@/types/guides.types";
import { COLOR_MAP } from "@/constants/guides.constants";

interface GuideSidebarProps {
  sections: GuideSection[];
  activeId: string;
  mobileOpen: boolean;
  onNavigate: (id: string) => void;
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
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all group w-full ${
        isActive
          ? `${c.bg} font-medium ${c.text}`
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      <span
        className={`text-xs shrink-0 ${
          isActive ? c.text : "group-hover:text-foreground"
        }`}
      >
        {section.icon}
      </span>
      {section.label}
    </button>
  );
}

function MobileNavItem({
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
      onClick={onClick}
      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
        isActive
          ? `${c.bg} ${c.border} ${c.text}`
          : "border-border text-muted-foreground hover:bg-muted"
      }`}
    >
      <span className={`text-base shrink-0 ${isActive ? c.text : ""}`}>{section.icon}</span>
      <span className="text-xs font-medium leading-tight">{section.label}</span>
    </button>
  );
}

export function GuideSidebar({ sections, activeId, mobileOpen, onNavigate }: GuideSidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex flex-col w-52 shrink-0 sticky top-20 self-start">
        <div className="">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-3">
            Topics
          </p>
          <nav className="flex flex-col gap-0.5">
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
      </aside>

      {/* Mobile fullscreen overlay */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-20 top-20 bg-background/95 backdrop-blur overflow-y-auto">
          <div className="p-4 grid grid-cols-2 gap-2">
            {sections.map((section) => (
              <MobileNavItem
                key={section.id}
                section={section}
                isActive={section.id === activeId}
                onClick={() => onNavigate(section.id)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}