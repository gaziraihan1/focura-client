"use client";

import { PaginatedResult, ProductUpdateDTO } from "@/types/resource.types";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ResourceUpdatesProps {
  updates: PaginatedResult<ProductUpdateDTO>;
}

export default function ResourcesUpdates({ updates }: ResourceUpdatesProps) {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Latest Product Updates
          </h2>
          <p className="mt-3 text-foreground/70 max-w-xl mx-auto">
            Stay informed about new features, improvements, and enhancements.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {updates?.items.map((u, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.4 }}
              className="
                p-6 rounded-2xl border border-border bg-background/40
                hover:shadow-lg backdrop-blur-md transition cursor-pointer
              "
            >
              <Link href={`/resources/update/${u.slug}`}>
                <span className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                  {u.version}
                </span>

                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  {u.title}
                </h3>

                <p className="text-sm text-foreground/60 mt-2 leading-relaxed">
                  {u.description}
                </p>

                <p className="mt-4 text-xs text-foreground/50">
                  {new Date(u.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      {updates.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {/* Previous */}
          <Link
            href={`?page=${Math.max(1, updates.page - 1)}`}
            className={`
          flex items-center justify-center
          h-11 w-11 rounded-xl border
          transition-all duration-200
          ${
            updates.page === 1
              ? "pointer-events-none opacity-40"
              : "hover:bg-primary hover:text-primary-foreground"
          }
        `}
          >
            <ChevronLeft size={18} />
          </Link>

          {/* Page Numbers */}
          {Array.from({ length: updates.totalPages }, (_, i) => i + 1)
            .slice(
              Math.max(0, updates.page - 3),
              Math.min(updates.totalPages, updates.page + 2),
            )
            .map((page) => (
              <Link
                key={page}
                href={`?page=${page}`}
                className={`
              h-11 min-w-11 px-4
              flex items-center justify-center
              rounded-xl border text-sm font-medium
              transition-all duration-200
              ${
                page === updates.page
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "hover:bg-muted"
              }
            `}
              >
                {page}
              </Link>
            ))}

          {/* Next */}
          <Link
            href={`?page=${Math.min(updates.totalPages, updates.page + 1)}`}
            className={`
          flex items-center justify-center
          h-11 w-11 rounded-xl border
          transition-all duration-200
          ${
            updates.page === updates.totalPages
              ? "pointer-events-none opacity-40"
              : "hover:bg-primary hover:text-primary-foreground"
          }
        `}
          >
            <ChevronRight size={18} />
          </Link>
        </div>
      )}
    </section>
  );
}
