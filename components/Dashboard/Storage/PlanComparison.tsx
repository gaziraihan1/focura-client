'use client';

import { motion } from 'framer-motion';
import { Check, Zap, Crown, Building2 } from 'lucide-react';
import { getPlanLimits } from '@/hooks/useStoragePage';

interface PlanComparisonProps {
  currentPlan: string;
  workspaceName: string;
}

export function PlanComparison({ currentPlan, workspaceName }: PlanComparisonProps) {
  const plans = [
    {
      name: 'FREE',
      icon: Building2,
      description: 'For small teams getting started',
    },
    {
      name: 'PRO',
      icon: Zap,
      description: 'For growing teams and projects',
      popular: true,
    },
    {
      name: 'BUSINESS',
      icon: Crown,
      description: 'For established organizations',
    },
    {
      name: 'ENTERPRISE',
      icon: Crown,
      description: 'For large-scale operations',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border rounded-lg p-6"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Workspace Plan Comparison</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upgrade {workspaceName} for more storage and features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan, index) => {
          const limits = getPlanLimits(plan.name);
          const isCurrent = currentPlan === plan.name;

          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative border rounded-lg p-6 ${
                isCurrent
                  ? 'border-primary bg-primary/5'
                  : plan.popular
                  ? 'border-blue-500/50 bg-blue-500/5'
                  : 'bg-card'
              }`}
            >
              {/* Current Plan Badge */}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                    Current Plan
                  </span>
                </div>
              )}

              {/* Popular Badge */}
              {plan.popular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <plan.icon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">{plan.name}</h3>
              </div>

              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

              {/* Storage */}
              <div className="mb-6">
                <p className="text-3xl font-bold">
                  {limits.storage >= 1048576
                    ? `${(limits.storage / 1048576).toFixed(0)} TB`
                    : limits.storage >= 1024
                    ? `${(limits.storage / 1024).toFixed(0)} GB`
                    : `${limits.storage} MB`}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Storage</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {limits.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {!isCurrent && (
                <button
                  className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  Upgrade to {plan.name}
                </button>
              )}

              {isCurrent && (
                <div className="w-full py-2.5 text-sm font-medium text-center text-muted-foreground">
                  Active Plan
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          Need a custom plan for {workspaceName}?{' '}
          <button className="text-primary hover:underline font-medium">Contact Sales</button>
        </p>
      </div>
    </motion.div>
  );
}