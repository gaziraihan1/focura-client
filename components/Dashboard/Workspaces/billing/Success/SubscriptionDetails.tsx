// components/BillingSuccess/SubscriptionDetails.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SubscriptionDetail } from '@/types/billing.success.types';

interface SubscriptionDetailsProps {
  details: SubscriptionDetail[];
  visible: boolean;
}

export function SubscriptionDetails({
  details,
  visible,
}: SubscriptionDetailsProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className={`rounded-2xl border border-border bg-card mb-6 overflow-hidden transition-all duration-700 delay-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
      >
        Subscription details
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            showDetails ? 'rotate-180' : ''
          }`}
        />
      </button>

      {showDetails && (
        <div className="border-t border-border divide-y divide-border">
          {details.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between px-6 py-3 text-sm"
            >
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium text-foreground">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}