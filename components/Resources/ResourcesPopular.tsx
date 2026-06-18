"use client";

import { PaginatedResult, PopularResourceDTO } from "@/types/resource.types";
// import { fetchPublicPopularResources } from "@/hooks/useResource";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ResourcesPopularProps {
  data: PaginatedResult<PopularResourceDTO>
}

export default function ResourcesPopular({data}: ResourcesPopularProps) {
  
  console.log(data)

  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Popular Resources
          </h2>
          <p className="mt-3 text-foreground/70 max-w-xl mx-auto">
            Hand-picked resources that help you get the most out of Focura.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4 }}
              className="
                rounded-2xl border border-border bg-background/40
                shadow-sm hover:shadow-lg backdrop-blur-md p-5
                transition-all cursor-pointer
              "
            >
              <Link href={`/resources/popular/${item.slug}`}>
              <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {item.category}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm text-foreground/60 mt-1 leading-relaxed">
                {item.description}
              </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      {
  data.totalPages > 1 && (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Previous */}
      <Link
        href={`?page=${Math.max(1, data.page - 1)}`}
        className={`
          flex items-center justify-center
          h-11 w-11 rounded-xl border
          transition-all duration-200
          ${
            data.page === 1
              ? "pointer-events-none opacity-40"
              : "hover:bg-primary hover:text-primary-foreground"
          }
        `}
      >
        <ChevronLeft size={18} />
      </Link>

      {/* Page Numbers */}
      {Array.from({ length: data.totalPages }, (_, i) => i + 1)
        .slice(
          Math.max(0, data.page - 3),
          Math.min(data.totalPages, data.page + 2)
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
                page === data.page
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
        href={`?page=${Math.min(data.totalPages, data.page + 1)}`}
        className={`
          flex items-center justify-center
          h-11 w-11 rounded-xl border
          transition-all duration-200
          ${
            data.page === data.totalPages
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
