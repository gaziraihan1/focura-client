"use client";

import React from "react";
import PricingCard from "./PricingCard";

type Props = {
  billing: "monthly" | "yearly";
};

const prices = {
  free: 0,
  pro: { monthly: 19, yearly: 190 },
  business: { monthly: 49, yearly: 490 },
};

const features = [
  "Unlimited Projects",
  "Team Collaboration",
  "Real-time Sync",
  "Advanced Permissions",
  "Priority Support",
];

export default function PricingCards({ billing }: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
      <PricingCard
        title="Free"
        price={prices.free}
        features={features.slice(0, 2)}
        buttonText="Get Started"
        popular={false}
        billing={billing}
      />

      <PricingCard
        title="Pro"
        price={prices.pro[billing]}
        originalPrice={billing === "yearly" ? prices.pro.monthly * 12 : undefined}
        features={features.slice(0, 4)}
        buttonText="Upgrade to Pro"
        popular={true}
        billing={billing}
      />

      <PricingCard
        title="Business"
        price={prices.business[billing]}
        originalPrice={
          billing === "yearly"
            ? prices.business.monthly * 12
            : undefined
        }
        features={features}
        buttonText="Get Business"
        popular={false}
        billing={billing}
      />
    </div>
  );
}
