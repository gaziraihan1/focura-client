// components/WorkspaceUpgrade/BillingCycleToggle.tsx
import type { BillingCycle } from '@/types/billing.upgrade.types';

interface BillingCycleToggleProps {
  cycle: BillingCycle;
  discount: number;
  onCycleChange: (cycle: BillingCycle) => void;
}

export function UpgradeCycleToggle({
  cycle,
  discount,
  onCycleChange,
}: BillingCycleToggleProps) {
  return (
    <div className="flex justify-center mb-10">
      <div className="inline-flex rounded-xl border border-border p-1 bg-card shadow-sm">
        {(['monthly', 'yearly'] as const).map((c) => (
          <button
            key={c}
            onClick={() => onCycleChange(c)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              cycle === c
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {c === 'yearly' ? `Yearly · save ${discount}%` : 'Monthly'}
          </button>
        ))}
      </div>
    </div>
  );
}