"use client";

import { COLOR_MAP, DevSection } from "@/lib/devGuides";
// ── DevSectionHero ────────────────────────────────────────────────────────────
export function DevSectionHero({ section }: { section: DevSection }) {
  const col = COLOR_MAP[section.color];
  return (
    <div className={`rounded-2xl border p-5 sm:p-7 mb-6 ${col.bg} ${col.border}`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-background/60 border ${col.border}`}>
          {section.icon}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h1 className={`text-xl sm:text-2xl font-bold ${col.text}`}>{section.title}</h1>
            {section.badge && (
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${col.pill}`}>
                {section.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{section.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

// ── DevSectionPagination ──────────────────────────────────────────────────────
interface PaginationProps {
  sections: DevSection[];
  activeId: string;
  onNavigate: (id: string) => void;
}

export function DevSectionPagination({ sections, activeId, onNavigate }: PaginationProps) {
  const idx = sections.findIndex(s => s.id === activeId);
  const prev = sections[idx - 1];
  const next = sections[idx + 1];

  return (
    <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-border">
      <div className="flex-1">
        {prev && (
          <button onClick={() => onNavigate(prev.id)} className="group flex flex-col items-start gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">← Previous</span>
            <span className="text-sm font-medium text-foreground">{prev.label}</span>
          </button>
        )}
      </div>
      <div className="flex-1 flex justify-end">
        {next && (
          <button onClick={() => onNavigate(next.id)} className="group flex flex-col items-end gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Next →</span>
            <span className="text-sm font-medium text-foreground">{next.label}</span>
          </button>
        )}
      </div>
    </div>
  );
}