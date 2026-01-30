import { motion } from "framer-motion";

type Plan = "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE";

const PLAN_OPTIONS = [
  {
    plan: "FREE" as Plan,
    label: "Free",
    desc: "Perfect for getting started",
    price: "$0/mo",
  },
  {
    plan: "PRO" as Plan,
    label: "Pro",
    desc: "For growing teams",
    price: "$10/mo",
  },
];

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
        {PLAN_OPTIONS.map((option) => (
          <button
            key={option.plan}
            type="button"
            onClick={() => onPlanSelect(option.plan)}
            className={`p-4 rounded-xl border-2 transition text-left ${
              selectedPlan === option.plan
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground">{option.label}</h3>
              <span className="text-sm font-medium text-primary">
                {option.price}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{option.desc}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
}