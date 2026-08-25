import type { GuideSection } from "@/types/guides.types";
import { COLOR_MAP } from "@/constants/guides.constants";
import { estimateReadMinutes } from "@/utils/guides.utils";

interface SectionHeroProps {
  section: GuideSection;
}

export function SectionHero({ section }: SectionHeroProps) {
  const col = COLOR_MAP[section.color];
  const readMinutes = estimateReadMinutes(section);

  return (
    <div className={`rounded-2xl border p-5 sm:p-7 mb-6 ${col.bg} ${col.border}`}>
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 shrink-0 rounded-xl border bg-background/70 flex items-center justify-center text-2xl ${col.border}`}
        >
          {section.icon}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className={`text-xl sm:text-2xl font-bold ${col.text}`}>{section.title}</h1>
            {section.badge && (
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${col.pill}`}
              >
                {section.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{section.subtitle}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${col.pill}`}>
          {section.articles.length} {section.articles.length === 1 ? "article" : "articles"}
        </span>
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-background/70 text-muted-foreground border border-border">
          ~{readMinutes} min read
        </span>
      </div>
    </div>
  );
}
