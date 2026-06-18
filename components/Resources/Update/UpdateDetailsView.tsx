"use client";

import { BackLink } from "@/components/Shared/BackLink";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { VersionStamp } from "./VersionStamp";
import { formatDate } from "@/utils/resources.utils";
import { FormattedDescription } from "@/components/Shared/FormattedDescription";
import { ProductUpdateDTO } from "@/types/resource.types";

type UpdateDetailsViewProps = {
  data: ProductUpdateDTO;
};

export function UpdateDetailsView({ data }: UpdateDetailsViewProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-16">
      <BackLink href="/resources" label="Back to updates" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-8"
      >
        <VersionStamp version={data.version} />

        <h1 className="mt-5 font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {data.title}
        </h1>

        <div className="mt-3 flex items-center gap-2 font-mono text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(data.date)}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-10 border-l-2 border-primary/20 pl-6"
      >
        <FormattedDescription description={data.description} />
      </motion.div>

      <div className="mt-12 flex items-center gap-2 border-t border-border pt-6 font-mono text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>Last updated {formatDate(data.updatedAt)}</span>
      </div>
    </div>
  );
}