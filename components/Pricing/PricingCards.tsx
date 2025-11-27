"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

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

type CardProps = {
  title: string;
  price: number;
  originalPrice?: number;
  features: string[];
  buttonText: string;
  popular: boolean;
  billing: "monthly" | "yearly";
};

function PricingCard({
  title,
  price,
  originalPrice,
  features,
  buttonText,
  popular,
  billing,
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`
        relative p-8 rounded-2xl border backdrop-blur-xl
        bg-card/50 border-border
        shadow-[0_8px_30px_rgb(0,0,0,0.06)]
        dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
        ${popular ? "scale-[1.03] border-primary/40" : ""}
      `}
    >
      {popular && (
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="
            absolute -top-3 left-1/2 -translate-x-1/2
            bg-primary text-primary-foreground
            text-xs font-semibold px-3 py-1 rounded-full
            shadow-md
          "
        >
          Most Popular
        </motion.span>
      )}

      <h3 className="text-xl font-semibold text-foreground">{title}</h3>

      <div className="mt-4 mb-6">
        <div className="flex items-end gap-2">
          <h4 className="text-4xl font-bold text-foreground">
            ${price}
          </h4>

          {billing === "yearly" && originalPrice && (
            <span className="line-through text-muted-foreground text-sm">
              ${originalPrice}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          {billing === "yearly" ? "Billed yearly (save 20%)" : "Billed monthly"}
        </p>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-foreground/80">
            <Check size={18} className="text-primary" />
            {f}
          </li>
        ))}
      </ul>

      <button
        className="
          w-full py-2.5 rounded-xl font-medium
          bg-primary/80 hover:bg-primary transition
          text-primary-foreground
        "
      >
        {buttonText}
      </button>
    </motion.div>
  );
}
