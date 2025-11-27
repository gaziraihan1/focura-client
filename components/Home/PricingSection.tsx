"use client";

import React from "react";
import { Check } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      tagline: "Perfect for individuals and early-stage projects.",
      features: [
        "Up to 3 projects",
        "Basic task management",
        "Single workspace",
        "Community support",
      ],
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$19",
      tagline: "Best for fast-moving teams who need more control.",
      features: [
        "Unlimited projects",
        "Team collaboration tools",
        "Real-time updates",
        "Advanced analytics",
        "Priority support",
      ],
      highlighted: true,
    },
    {
      name: "Business",
      price: "$49",
      tagline: "For organizations who need full visibility and power.",
      features: [
        "Unlimited workspaces",
        "Custom roles and permissions",
        "Automation workflows",
        "Audit logs",
        "Dedicated manager",
      ],
      highlighted: false,
    },
  ];

  return (
    <section className="py-28 bg-background">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-lg text-foreground/70">
          Choose a plan tailored to your team&apos;s needs. No hidden fees.
        </p>

        <div className="mt-20 grid md:grid-cols-3 gap-10">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl p-8 border
                ${
                  plan.highlighted
                    ? "bg-primary/10 border-primary/20 shadow-xl shadow-primary/5 scale-[1.03]"
                    : "bg-white/40 dark:bg-white/5 border-border backdrop-blur-xl shadow-lg flex flex-col justify-between"
                }
                transition-all`}
            >
              <div>

              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-medium shadow ">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-semibold text-foreground">
                {plan.name}
              </h3>

              <div className="mt-4 flex items-end justify-center gap-1">
                <span className="text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                {plan.price !== "Free" && (
                  <span className="text-foreground/60 mb-1">/month</span>
                )}
              </div>

              <p className="mt-2 text-foreground/70 text-sm">{plan.tagline}</p>

              <ul className="mt-8 space-y-3 text-left">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={18} className="text-primary mt-1" />
                    <span className="text-foreground/80 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              </div>

              <button
                className={`mt-10 w-full py-3 rounded-lg font-semibold transition ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border hover:bg-muted"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
