"use client";

import React from "react";
import { Check } from "lucide-react";
import { plans } from "@/constant/pricing.constant";

export default function PricingPlans() {
  
  return (
    <section className="relative py-28 bg-background px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Pricing that grows with your team
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Transparent, scalable, and built for teams of all sizes.
          </p>
        </div>
        <div
          className="
          grid grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-8 
        "
        >
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`
                relative rounded-2xl border backdrop-blur-lg p-8 flex flex-col
                transition-all duration-300
                ${
                  plan.highlighted
                    ? "border-primary/40 bg-primary/10 shadow-lg scale-[1.02]"
                    : "border-border bg-background/30"
                }
                hover:shadow-xl hover:-translate-y-1
              `}
            >
              {plan.highlighted && (
                <span className="absolute top-4 right-4 text-xs font-medium bg-primary text-primary-foreground px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <h3 className="text-2xl font-semibold text-foreground">
                {plan.name}
              </h3>
              <p className="text-foreground/60 mt-1 text-sm">{plan.tagline}</p>

              <div className="mt-6">
                <span className="text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                {plan.price !== "Free" && plan.price !== "Custom" && (
                  <span className="text-foreground/50 text-sm"> /user</span>
                )}
              </div>

              <ul className="mt-8 space-y-3 text-sm flex-1">
                {plan.features.map((f, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-foreground/80"
                  >
                    <Check className="w-4 h-4 text-primary mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`
                  mt-10 w-full py-3 rounded-xl font-medium border transition-all
                  ${
                    plan.highlighted
                      ? "bg-primary text-primary-foreground border-primary hover:opacity-90"
                      : "border-border hover:border-foreground/30"
                  }
                `}
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
