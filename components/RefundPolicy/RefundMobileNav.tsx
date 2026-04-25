"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RefundNavItem } from "./RefundNav";

interface RefundMobileNavProps {
  items: RefundNavItem[];
}

export const RefundMobileNav = ({ items }: RefundMobileNavProps) => {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: "smooth" });
    setOpen(false);
  };

  return (
    <div className="relative lg:hidden mb-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm font-medium text-neutral-700 dark:text-neutral-300 shadow-sm"
      >
        <span>Jump to section</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg overflow-hidden">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <span className="shrink-0 w-5 h-5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[10px] font-bold flex items-center justify-center">
                {i + 1}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};