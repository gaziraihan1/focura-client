"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface LegalNavItem {
  id: string;
  label: string;
}

interface LegalNavProps {
  items: LegalNavItem[];
}

export function LegalNav({ items }: LegalNavProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav className="sticky top-24 w-full">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4 px-3">
        On this page
      </p>
      <ul className="space-y-0.5">
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              onClick={() => scrollTo(item.id)}
              className={cn(
                "w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group",
                activeId === item.id
                  ? "text-neutral-900 dark:text-neutral-50 bg-neutral-100 dark:bg-neutral-800/60 font-medium"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
              )}
            >
              <span
                className={cn(
                  "shrink-0 w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center transition-colors",
                  activeId === item.id
                    ? "bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900"
                    : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 group-hover:bg-neutral-300 dark:group-hover:bg-neutral-700"
                )}
              >
                {index + 1}
              </span>
              <span className="leading-tight">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
