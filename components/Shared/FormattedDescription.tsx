"use client";

import { splitDescriptionIntoSentences } from "@/utils/resources.utils";
import { motion } from "framer-motion";

type FormattedDescriptionProps = {
  description: string;
  variant?: "body" | "lede";
  className?: string;
};

export function FormattedDescription({
  description,
  variant = "body",
  className = "",
}: FormattedDescriptionProps) {
  const sentences = splitDescriptionIntoSentences(description);

  if (sentences.length === 0) {
    return null;
  }

  const [lead, ...rest] = sentences;

  return (
    <div className={`space-y-4 ${className}`}>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={
          variant === "lede"
            ? "text-xl font-medium leading-relaxed text-foreground sm:text-2xl"
            : "text-base leading-relaxed text-foreground/90"
        }
      >
        {lead}
      </motion.p>

      {rest.map((sentence, index) => (
        <motion.p
          key={`${index}-${sentence.slice(0, 12)}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 * (index + 1) }}
          className="text-base leading-relaxed text-muted-foreground"
        >
          {sentence}
        </motion.p>
      ))}
    </div>
  );
}