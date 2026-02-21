'use client';

import { ExecutiveKPIs } from '@/hooks/useAnalytics';
import { kpisCard } from '@/constant/analytics.constant';

interface KPICardsProps {
  kpis: ExecutiveKPIs;
}

export function KPICards({ kpis }: KPICardsProps) {
  const {cards} = kpisCard({kpis})

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <span className="text-2xl font-bold">{card.value}</span>
          </div>
          <p className="text-sm text-muted-foreground">{card.label}</p>
          {card.subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
}