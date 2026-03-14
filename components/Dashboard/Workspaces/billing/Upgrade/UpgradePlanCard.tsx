// components/WorkspaceUpgrade/PlanCard.tsx
import { Check } from "lucide-react";
import type {
  Plan,
  BillingCycle,
  PlanName,
} from "@/types/billing.upgrade.types";
import { formatPrice } from "@/utils/billing.upgrade.utils";
import { PLAN_RANK } from "@/constants/billing.upgrade.constants";

interface PlanCardProps {
  plan: Plan;
  cycle: BillingCycle;
  currentPlan: PlanName;
  hasActiveSub: boolean;
  isLoading: boolean;
  onSelect: (planName: PlanName) => void;
}

export function UpgradePlanCard({
  plan,
  cycle,
  currentPlan,
  hasActiveSub,
  isLoading,
  onSelect,
}: PlanCardProps) {
  const Icon = plan.icon;
  const isCurrent = plan.name === currentPlan;
  const priceStr = formatPrice(plan.price[cycle], cycle);
  const isUpgrade =
    PLAN_RANK[plan.name] > PLAN_RANK[currentPlan as keyof typeof PLAN_RANK];

  return (
    <div
      className={`relative rounded-2xl flex flex-col transition-shadow ${
        plan.highlight
          ? "border-2 border-primary bg-card shadow-lg"
          : "border border-border bg-card shadow-sm hover:shadow-md"
      } ${isCurrent ? "ring-2 ring-primary/40 ring-offset-2 ring-offset-background" : ""}`}
    >
      {/* Most Popular Badge */}
      {plan.highlight && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full tracking-wide whitespace-nowrap">
          MOST POPULAR
        </div>
      )}

      {/* Current Badge */}
      {isCurrent && (
        <div className="absolute -top-3.5 right-4 bg-muted text-muted-foreground text-xs font-bold px-3 py-1 rounded-full border border-border">
          CURRENT
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        {/* Plan Name */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <Icon className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="font-bold text-foreground text-lg">
            {plan.displayName}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground mb-5">{plan.description}</p>

        {/* Price */}
        <div className="mb-1">
          <span className="text-4xl font-black text-foreground">
            {priceStr}
          </span>
          {plan.price.monthly > 0 && (
            <span className="text-muted-foreground text-sm ml-1">/mo</span>
          )}
        </div>

        {/* Yearly Billing Info */}
        {cycle === "yearly" && plan.price.yearly > 0 ? (
          <p className="text-xs text-muted-foreground mb-5">
            Billed ${(plan.price.yearly / 100).toFixed(0)}/year{" "}
            <span className="line-through opacity-40">
              ${((plan.price.monthly * 12) / 100).toFixed(0)}
            </span>
          </p>
        ) : (
          <div className="mb-5" />
        )}

        {/* Features */}
        <ul className="space-y-2.5 flex-1 mb-6">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm text-muted-foreground"
            >
              <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center mt-0.5 shrink-0">
                <Check className="w-2.5 h-2.5 text-foreground" />
              </div>
              {feature}
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <button
          onClick={() => onSelect(plan.name)}
          disabled={isCurrent || isLoading}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
            isCurrent
              ? "bg-muted text-muted-foreground cursor-default"
              : plan.highlight || isUpgrade
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {isCurrent
            ? "✓ Current plan"
            : isLoading
              ? "Processing…"
              : plan.name === "FREE"
                ? "Downgrade to Free"
                : hasActiveSub
                  ? `Switch to ${plan.displayName}`
                  : `Get ${plan.displayName}`}
        </button>
      </div>
    </div>
  );
}
