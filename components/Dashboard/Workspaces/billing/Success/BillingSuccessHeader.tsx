// components/BillingSuccess/SuccessHeader.tsx
import { CheckCircle2, Sparkles } from 'lucide-react';

interface SuccessHeaderProps {
  planLabel: string;
  workspaceName: string;
  isTrialing: boolean;
  trialDays: number | null;
  visible: boolean;
}

export function BillingSuccessHeader({
  planLabel,
  workspaceName,
  isTrialing,
  trialDays,
  visible,
}: SuccessHeaderProps) {
  return (
    <div
      className={`flex flex-col items-center text-center mb-10 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Animated check */}
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2
            className="w-10 h-10 text-primary"
            strokeWidth={1.5}
          />
        </div>
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
      </div>

      <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
        <Sparkles className="w-3 h-3" />
        Payment successful
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
        Welcome to {planLabel}!
      </h1>
      <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
        Your workspace{' '}
        <span className="font-semibold text-foreground">{workspaceName}</span>{' '}
        has been upgraded.
        {isTrialing
          ? ` Your ${trialDays}-day free trial starts now.`
          : ' Your plan is now active.'}
      </p>
    </div>
  );
}