// components/BillingSuccess/FeaturesGained.tsx
import { Sparkles, CheckCircle2 } from 'lucide-react';
import type { GainedFeature } from '@/types/billing.success.types';

interface FeaturesGainedProps {
  features: GainedFeature[];
  fromPlanLabel: string;
  toPlanLabel: string;
  visible: boolean;
}

export function FeaturesGained({
  features,
  fromPlanLabel,
  toPlanLabel,
  visible,
}: FeaturesGainedProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card mb-5 overflow-hidden transition-all duration-700 delay-200 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="px-6 py-4 border-b border-border flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h2 className="font-semibold text-foreground text-sm">
          What you unlocked
          <span className="ml-2 text-xs text-muted-foreground font-normal">
            {fromPlanLabel} → {toPlanLabel}
          </span>
        </h2>
      </div>

      <div className="divide-y divide-border">
        {features.map(({ icon: Icon, label, detail }, i) => (
          <div
            key={label}
            className="flex items-start gap-4 px-6 py-4 transition-all duration-500"
            style={{ transitionDelay: `${300 + i * 60}ms` }}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{detail}</p>
            </div>
            <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400 ml-auto shrink-0 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}