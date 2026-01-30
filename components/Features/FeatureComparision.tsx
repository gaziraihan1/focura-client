"use client";

import React from "react";
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
      },
    },
    {
      name: "Pro",
      price: "$19/mo",
      highlighted: true,
      features: {
        "Real-time Collaboration": true,
        "Task Management": true,
        "Unlimited Projects": true,
        "Advanced Analytics": true,
        "Priority Support": false,
      },
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: {
        "Real-time Collaboration": true,
        "Task Management": true,
        "Unlimited Projects": true,
        "Advanced Analytics": true,
        "Priority Support": true,
      },
    },
  ];

  const featureList = [
    "Real-time Collaboration",
    "Task Management",
    "Unlimited Projects",
    "Advanced Analytics",
    "Priority Support",
  ];

  return (
    <section className="py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Compare Features Across Plans
          </h2>
          <p className="text-foreground/60 mt-3 max-w-2xl mx-auto">
            Choose the plan that fits your workflow best. Every tier includes
            essential tools to stay productive.
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px] grid grid-cols-4 bg-background/50 backdrop-blur-sm rounded-2xl border border-border">
            <div></div>
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`p-6 text-center border-l border-border relative ${
                  plan.highlighted
                    ? "bg-primary/5 shadow-lg shadow-primary/10"
                    : ""
                }`}
              >
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="text-foreground/70 mt-2">{plan.price}</p>

                {plan.highlighted && (
                  <span className="absolute top-4 right-4 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
              </div>
            ))}

            {featureList.map((feature, i) => (
              <React.Fragment key={i}>
                <div className="p-6 border-t border-border font-medium">
                  {feature}
                </div>

                {plans.map((plan, j) => (
                  <div
                    key={j}
                    className="p-6 border-t border-l border-border flex items-center justify-center"
                  >
                    {plan.features[feature] ? (
                      <Check className="text-primary" size={22} />
                    ) : (
                      <Minus className="text-foreground/40" size={22} />
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
