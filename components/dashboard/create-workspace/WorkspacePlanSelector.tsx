import { m as motion } from 'framer-motion';
import { Check, Zap, Crown, CreditCard } from 'lucide-react';
import { plans } from '@/constants/pricing.constants';
import { Button } from '@/components/ui/Button';

type PlanChoice = 'FREE' | 'PRO';

const PLAN_DATA: Record<PlanChoice, {
  label: string;
  desc: string;
  highlights: string[];
  icon: typeof Zap;
  iconBg: string;
  iconColor: string;
  badge?: string;
}> = {
  FREE: {
    label: 'Free',
    desc: 'Perfect for individuals or simple task planning.',
    highlights: ['1 workspace', '5 members / workspace', '3 projects', '1 GB storage'],
    icon: Zap,
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  PRO: {
    label: 'Pro',
    desc: 'For teams needing real-time collaboration & automation.',
    highlights: ['3 workspaces', '25 members / workspace', 'Unlimited projects', '10 GB storage'],
    icon: Crown,
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-600 dark:text-violet-400',
    badge: 'Popular',
  },
};

const PLAN_ORDER: PlanChoice[] = ['FREE', 'PRO'];

const getPrice = (label: string): string => {
  const match = plans.find((p) => p.name.toLowerCase() === label.toLowerCase());
  return match ? match.price : '';
};

interface WorkspacePlanSelectorProps {
  selectedPlan: PlanChoice;
  onPlanSelect: (plan: PlanChoice) => void;
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
      className="rounded-2xl bg-card border border-border p-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-primary" />
        </div>
        <span className="text-sm font-semibold text-foreground">
          Choose your plan
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-5 ml-10">
        Start free and upgrade anytime — no payment required to create.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLAN_ORDER.map((planKey) => {
          const option = PLAN_DATA[planKey];
          const price = getPrice(option.label);
          const isSelected = selectedPlan === planKey;
          const Icon = option.icon;

          return (
            <Button
              key={planKey}
              type="button"
              variant="ghost"
              onClick={() => onPlanSelect(planKey)}
              aria-pressed={isSelected}
              className={`relative p-5 rounded-2xl border-2 transition-all duration-200 text-left flex flex-col group ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                  : 'border-border hover:border-primary/30 hover:bg-accent/30'
              }`}
            >
              {option.badge && (
                <span className="absolute -top-2.5 right-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500 text-white">
                  {option.badge}
                </span>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${option.iconBg}`}>
                    <Icon size={18} className={option.iconColor} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{option.label}</h3>
                    <span className="text-lg font-bold text-foreground">{price}</span>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 mt-1 ${
                    isSelected ? 'border-primary bg-primary' : 'border-border'
                  }`}
                >
                  {isSelected && <Check size={12} className="text-primary-foreground" strokeWidth={3} />}
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-3">{option.desc}</p>

              <ul className="space-y-1.5 mt-auto">
                {option.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <Check size={13} className="text-green-500 shrink-0" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>

              {planKey === 'PRO' && isSelected && (
                <div className="mt-4 p-3 rounded-xl bg-violet-500/5 border border-violet-500/20">
                  <div className="flex items-center gap-2">
                    <CreditCard size={13} className="text-violet-600 dark:text-violet-400" />
                    <p className="text-[11px] text-violet-700 dark:text-violet-300 font-medium">
                      Payment required after workspace creation
                    </p>
                  </div>
                  <p className="text-[10px] text-violet-600/70 dark:text-violet-400/70 mt-1 ml-5">
                    You&apos;ll be redirected to billing to complete setup
                  </p>
                </div>
              )}
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
}
