"use client";

import { motion } from "framer-motion";
import React from "react";

type Props = {
  billing: "monthly" | "yearly";
  setBilling: (v: "monthly" | "yearly") => void;
};

export default function BillingToggle({ billing, setBilling }: Props) {
  return (
    <div className="flex items-center justify-center mb-10">
      <div
        className="relative flex items-center bg-card/40 backdrop-blur-xl border border-border 
        px-2 py-1 rounded-full gap-1"
      >
        {/* Toggle Background */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-primary/10`}
          style={{
            left: billing === "monthly" ? "4px" : "calc(50% + -4px)",
          }}
        />

        {/* Buttons */}
        <button
          onClick={() => setBilling("monthly")}
          className={`relative z-10 px-4 py-1 text-sm font-medium transition ${
            billing === "monthly"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Monthly
        </button>

        <button
          onClick={() => setBilling("yearly")}
          className={`relative z-10 px-4 py-1 text-sm font-medium transition ${
            billing === "yearly"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Yearly
        </button>
      </div>
    </div>
  );
}
