"use client";

import { COLOR_MAP, DevSection } from "@/lib/devGuides";
interface DevGuideSidebarProps {
  sections: DevSection[];
  activeId: string;
  mobileOpen: boolean;
  onNavigate: (id: string) => void;
}

function NavItem({ section, isActive, onClick }: { section: DevSection; isActive: boolean; onClick: () => void }) {
  const c = COLOR_MAP[section.color];
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all group w-full ${
        isActive ? `${c.bg} font-medium ${c.text}` : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      <span className={`text-xs shrink-0 ${isActive ? c.text : "group-hover:text-foreground"}`}>
        {section.icon}
      </span>
      {section.label}
    </button>
  );
}

function MobileNavItem({ section, isActive, onClick }: { section: DevSection; isActive: boolean; onClick: () => void }) {
  const c = COLOR_MAP[section.color];
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
        isActive ? `${c.bg} ${c.border} ${c.text}` : "border-border text-muted-foreground hover:bg-muted"
      }`}
    >
      <span className={`text-base shrink-0 ${isActive ? c.text : ""}`}>{section.icon}</span>
      <span className="text-xs font-medium leading-tight">{section.label}</span>
    </button>
  );
}

export function DevGuideSidebar({ sections, activeId, mobileOpen, onNavigate }: DevGuideSidebarProps) {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden sm:block w-52 shrink-0 sticky top-36 self-start">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-3">
          Topics
        </p>
        <nav className="flex flex-col gap-0.5">
          {sections.map(s => (
            <NavItem key={s.id} section={s} isActive={s.id === activeId} onClick={() => onNavigate(s.id)} />
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-20 top-30 bg-background/95 backdrop-blur overflow-y-auto">
          <div className="p-4 grid grid-cols-2 gap-2">
            {sections.map(s => (
              <MobileNavItem key={s.id} section={s} isActive={s.id === activeId} onClick={() => onNavigate(s.id)} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}