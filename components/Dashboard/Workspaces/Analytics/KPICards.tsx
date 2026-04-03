"use client";

import { ExecutiveKPIs } from "@/hooks/useAnalytics";
import { kpisCard } from "@/constants/analytics.constants";

interface KPICardsProps {
  kpis: ExecutiveKPIs;
}
// KPICards.tsx
export function KPICards({ kpis }: KPICardsProps) {
  const { cards } = kpisCard({ kpis });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-card border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
        >
          {/* Stack icon + value vertically on mobile, side-by-side on sm+ */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2 sm:mb-3">
            <div className={`p-2 rounded-lg w-fit ${card.bgColor}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            {/* min-w-0 + break-all prevents long numbers from blowing the card */}
            <span className="text-xl sm:text-2xl font-bold leading-tight min-w-0 break-all">
              {card.value}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
            {card.label}
          </p>
          {card.subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
}