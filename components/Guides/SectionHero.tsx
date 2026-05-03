import type { GuideSection } from "@/types/guides.types";
import { COLOR_MAP } from "@/constants/guides.constants";

interface SectionHeroProps {
  section: GuideSection;
}

export function SectionHero({ section }: SectionHeroProps) {
  const col = COLOR_MAP[section.color];

  return (
    <div className={`rounded-2xl border p-5 sm:p-7 mb-6 ${col.bg} ${col.border}`}>
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-background/60 border ${col.border}`}
        >
          {section.icon}
        </div>
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold ${col.text} mb-0.5`}>{section.title}</h1>
          <p className="text-sm text-muted-foreground">{section.subtitle}</p>
        </div>
      </div>
    </div>
  );
}