import type { GuideSection } from "@/types/guides.types";

interface SectionPaginationProps {
  sections: GuideSection[];
  activeId: string;
  onNavigate: (id: string) => void;
}

export function SectionPagination({ sections, activeId, onNavigate }: SectionPaginationProps) {
  const idx = sections.findIndex((s) => s.id === activeId);
  const prev = sections[idx - 1];
  const next = sections[idx + 1];

  return (
    <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-border">
      <div className="flex-1">
        {prev && (
          <button
            onClick={() => onNavigate(prev.id)}
            className="group flex flex-col items-start gap-0.5 text-left"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
              ← Previous
            </span>
            <span className="text-sm font-medium text-foreground">{prev.label}</span>
          </button>
        )}
      </div>
      <div className="flex-1 flex justify-end">
        {next && (
          <button
            onClick={() => onNavigate(next.id)}
            className="group flex flex-col items-end gap-0.5 text-right"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
              Next →
            </span>
            <span className="text-sm font-medium text-foreground">{next.label}</span>
          </button>
        )}
      </div>
    </div>
  );
}