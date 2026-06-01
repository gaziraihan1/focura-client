import { ArrowRight } from "lucide-react";

export function QuickAccessCard({
  icon: Icon,
  title,
  description,
  stat,
  statLabel,
  accent,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  stat: number | string;
  statLabel: string;
  accent: string;
  href?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full text-left rounded-2xl border border-border bg-card overflow-hidden hover:border-border/0 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Gradient sweep on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${accent}0a 0%, ${accent}04 50%, transparent 100%)`,
        }}
      />

      {/* Top accent strip */}
      <div
        className="h-1 w-full"
        style={{ backgroundColor: accent }}
      />

      <div className="p-5 sm:p-6">
        {/* Icon + title row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ring-1 ring-black/5"
            style={{ backgroundColor: `${accent}18` }}
          >
            <Icon size={20} style={{ color: accent }} />
          </div>

          <div
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: `${accent}15`,
              color: accent,
            }}
          >
            <span>{stat}</span>
            <span className="opacity-70">{statLabel}</span>
          </div>
        </div>

        {/* Text */}
        <p className="text-base font-bold text-foreground mb-1">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

        {/* CTA */}
        <div
          className="mt-4 flex items-center gap-1.5 text-xs font-semibold"
          style={{ color: accent }}
        >
          <span>Open</span>
          <ArrowRight
            size={13}
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
        </div>
      </div>
    </button>
  );
}
