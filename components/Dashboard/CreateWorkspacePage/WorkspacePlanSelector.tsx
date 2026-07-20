import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { plans } from "@/constants/pricing.constants";

type Plan = "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE";

// Map the canonical pricing data (single source of truth) to the
// two plans offered during workspace creation. This keeps the price and
// feature copy in sync with the rest of the app (pricing page, etc.).
const PLAN_DATA: Record<"FREE" | "PRO", { label: string; plan: Plan; desc: string; highlights: string[] }> = {
  FREE: {
    plan: "FREE",
    label: "Free",
    desc: "Perfect for individuals or simple task planning.",
    highlights: ["1 workspace", "5 members / workspace", "3 projects", "1 GB storage"],
  },
  PRO: {
    plan: "PRO",
    label: "Pro",
    desc: "For teams needing real-time collaboration & automation.",
    highlights: ["3 workspaces", "25 members / workspace", "Unlimited projects", "10 GB storage"],
  },
};

const PLAN_ORDER: Array<"FREE" | "PRO"> = ["FREE", "PRO"];

// Pull the real price from pricing.constants.ts instead of hardcoding it.
const getPrice = (label: string): string => {
  const match = plans.find((p) => p.name.toLowerCase() === label.toLowerCase());
  return match ? match.price : "";
};

interface WorkspacePlanSelectorProps {
  selectedPlan: Plan;
  onPlanSelect: (plan: Plan) => void;
}

export function WorkspacePlanSelector({
  selectedPlan,
  onPlanSelect,
}: WorkspacePlanSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl bg-card border border-border p-6"
    >
      <label className="block text-sm font-medium text-foreground mb-4">
        Select Plan
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLAN_ORDER.map((key) => {
          const option = PLAN_DATA[key];
          const price = getPrice(option.label);
          const isSelected = selectedPlan === option.plan;
          return (
            <button
              key={option.plan}
              type="button"
              onClick={() => onPlanSelect(option.plan)}
              aria-pressed={isSelected}
              className={`p-4 rounded-xl border-2 transition text-left flex flex-col ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">{option.label}</h3>
                <span className="text-sm font-medium text-primary">{price}</span>
              </div>
              <p className="text-sm text-muted-foreground">{option.desc}</p>
              <ul className="mt-3 space-y-1.5">
                {option.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <Check size={14} className="text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
