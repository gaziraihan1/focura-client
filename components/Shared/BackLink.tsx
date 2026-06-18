"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

type BackLinkProps = {
  href: string;
  label: string;
};

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <motion.span
        className="inline-flex"
        whileHover={{ x: -4 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <ArrowLeft className="h-4 w-4" />
      </motion.span>
      {label}
    </Link>
  );
}