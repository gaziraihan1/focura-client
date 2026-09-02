"use client";

import { m as motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

type Props = {
  billing: "monthly" | "yearly";
  setBilling: (v: "monthly" | "yearly") => void;
};

export default function BillingToggle({ billing, setBilling }: Props) {
  return (
    <div className="flex items-center justify-center mb-10 px-4">
      <div
        className="relative grid grid-cols-2 items-center bg-card/40 backdrop-blur-xl border border-border 
        p-1 rounded-full gap-1"
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute top-1 bottom-1 rounded-full bg-primary/10"
          style={{
            left: billing === "monthly" ? "4px" : "50%",
            width: "calc(50% - 4px)",
          }}
        />
        <Button
          variant="ghost"
          onClick={() => setBilling("monthly")}
          className={`h-auto w-auto relative z-10 px-4 sm:px-6 py-1.5 text-sm font-medium transition whitespace-nowrap ${
            billing === "monthly"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Monthly
        </Button>
        <Button
          variant="ghost"
          onClick={() => setBilling("yearly")}
          className={`h-auto w-auto relative z-10 px-4 sm:px-6 py-1.5 text-sm font-medium transition whitespace-nowrap ${
            billing === "yearly"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Yearly
        </Button>
      </div>
    </div>
  );
}
