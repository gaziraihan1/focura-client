"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Tag } from "lucide-react";
import { PopularResourceDTO } from "@/types/resource.types";
import { formatDate, getCategoryAccent } from "@/utils/resources.utils";
import { BackLink } from "@/components/Shared/BackLink";
import { FormattedDescription } from "@/components/Shared/FormattedDescription";

type PopularResourceDetailsViewProps = {
  data: PopularResourceDTO;
};

export function PopularResourceDetailsView({ data }: PopularResourceDetailsViewProps) {
  const accent = getCategoryAccent(data.category);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-16">
      <BackLink href="/resources" label="Back to resources" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative mt-8 overflow-hidden rounded-2xl border border-border bg-muted"
      >
        <div className="relative aspect-video w-full">
          <Image
            src={data.image}
            alt={data.title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 768px, 100vw"
          />
        </div>

        <span
          className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${accent.bg} ${accent.text} ${accent.border}`}
        >
          <Tag className="h-3.5 w-3.5" />
          {data.category}
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="mt-8"
      >
        <span className="font-mono text-xs text-muted-foreground">
          Updated {formatDate(data.updatedAt)}
        </span>

        <h1 className="mt-2 font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {data.title}
        </h1>
      </motion.div>

      <div className="mt-8">
        <FormattedDescription description={data.description} variant="lede" />
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Added {formatDate(data.createdAt)}
        </span>
        <BackLink href="/resources" label="Back to resources" />
      </div>
    </div>
  );
}