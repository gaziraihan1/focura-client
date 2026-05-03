import { COLOR_MAP, GETTING_STARTED_CARDS, PLATFORM_OVERVIEW } from "@/constants/guides.constants";
import { SectionH } from "../ui";

export function GettingStartedSection() {
  return (
    <div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        Focura is a project management platform designed to help teams stay organized, focused, and
        aligned. This guide walks you through every part of the platform so you can hit the ground
        running.
      </p>

      <SectionH>Start here — four steps to launch</SectionH>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {GETTING_STARTED_CARDS.map((card, i) => {
          const col = COLOR_MAP[card.color];
          return (
            <div key={card.title} className={`rounded-xl border p-4 ${col.bg} ${col.border}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-lg ${col.text}`}>{card.icon}</span>
                <div className={`text-[10px] font-bold uppercase tracking-widest ${col.text}`}>
                  Step {i + 1}
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">{card.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
            </div>
          );
        })}
      </div>

      <SectionH>What&apos;s in Focura</SectionH>
      <div className="rounded-xl border border-border overflow-hidden">
        {PLATFORM_OVERVIEW.map((item, i) => (
          <div
            key={item.name}
            className={`flex items-start gap-3 px-4 py-3 ${
              i < PLATFORM_OVERVIEW.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="text-muted-foreground text-xs mt-0.5 font-mono w-28 shrink-0">
              {item.name}
            </span>
            <span className="text-sm text-muted-foreground">{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}