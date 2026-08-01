"use client";

import { Check, Minus } from "lucide-react";

type Plans = {
  name: string;
  price: string;
  highlighted?: boolean;
  features: Record<string, boolean>;
};

export default function FeatureComparison() {
  const plans: Plans[] = [
    {
      name: "Free",
      price: "$0",
      features: {
        "Real-time Collaboration": true,
        "Task Management": true,
        "Unlimited Projects": false,
        "Advanced Analytics": false,
        "Priority Support": false,
        "More Features": false,
        "API Access": false,
      },
    },
    {
      name: "Pro",
      price: "$12/mo",
      highlighted: true,
      features: {
        "Real-time Collaboration": true,
        "Task Management": true,
        "Unlimited Projects": true,
        "Advanced Analytics": true,
        "Priority Support": false,
        "More Features": false,
        "API Access": false,
      },
    },
    {
      name: "Business",
      price: "$49/mo",
      features: {
        "Real-time Collaboration": true,
        "Task Management": true,
        "Unlimited Projects": true,
        "Advanced Analytics": true,
        "Priority Support": true,
        "More Features": true,
        "API Access": true,
      },
    },
  ];

  const featureList = [
    "Real-time Collaboration",
    "Task Management",
    "Unlimited Projects",
    "Advanced Analytics",
    "Priority Support",
    "More Features",
    "API Access",
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">
            Compare Features Across Plans
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-foreground/60">
            Choose the plan that fits your workflow best. Every tier includes
            essential tools to stay productive.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Header row — 3 plan columns on mobile, 4 with the label on md+ */}
          <div className="grid grid-cols-3 border-b border-border bg-muted/40 md:grid-cols-4">
            <div className="hidden items-end p-5 text-sm font-medium text-muted-foreground md:flex">
              Features
            </div>

            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col items-center justify-center gap-1 p-4 text-center sm:p-5 ${
                  i > 0 ? "md:border-l md:border-border/60" : ""
                } ${plan.highlighted ? "bg-primary/5" : ""}`}
              >
                {plan.highlighted ? (
                  <span className="whitespace-nowrap rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground sm:text-xs">
                    Most Popular
                  </span>
                ) : (
                  <span aria-hidden className="h-4 sm:h-5" />
                )}
                <h3 className="text-lg font-semibold text-foreground sm:text-xl">
                  {plan.name}
                </h3>
                <p className="text-sm text-foreground/70">{plan.price}</p>
              </div>
            ))}
          </div>

          {/* Feature rows — stacked cards on mobile, 4-column table on md+ */}
          {featureList.map((feature, i) => (
            <div
              key={i}
              className={`md:grid md:grid-cols-4 md:items-stretch ${
                i < featureList.length - 1 ? "border-b border-border/60" : ""
              }`}
            >
              <div className="px-4 py-3.5 font-medium text-foreground sm:px-5 md:flex md:items-center">
                {feature}
              </div>

              {/* md:contents lets these cells join the 4-col grid on md+ */}
              <div className="grid grid-cols-3 md:contents">
                {plans.map((plan, j) => (
                  <div
                    key={j}
                    className={`flex items-center justify-center py-3.5 md:px-5 ${
                      j > 0 ? "md:border-l md:border-border/60" : ""
                    } ${plan.highlighted ? "md:bg-primary/5" : ""}`}
                  >
                    {plan.features[feature] ? (
                      <Check className="text-primary" size={20} strokeWidth={3} />
                    ) : (
                      <Minus className="text-foreground/40" size={20} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
