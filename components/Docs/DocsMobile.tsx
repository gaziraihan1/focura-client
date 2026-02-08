import { DocsTree } from "@/types/docs.types";
import { ChevronsLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

interface DocsMobileProps {
  tree: DocsTree;
  onMenuOpen: (v: boolean) => void;
}

export default function DocsMobile({ tree, onMenuOpen }: DocsMobileProps) {
  return (
    <aside className="lg:hidden fixed left-0 top-16 bottom-0 w-72 bg-background border-r border-border px-6 py-3 overflow-y-auto z-50 scrollbar-hide">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-lg text-foreground">Documentation</h2>
        <button
          onClick={() => onMenuOpen(false)}
          className="p-1.5 hover:bg-accent rounded-md transition-colors"
          aria-label="Close menu"
        >
          <ChevronsLeft className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
      <nav className="space-y-6">
        {tree.map((section) => (
          <div key={section.slug}>
            <h3 className="font-semibold text-foreground mb-2 text-sm">
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.pages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={page.slug}
                    onClick={() => onMenuOpen(false)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors block py-2 px-3 rounded-md hover:bg-accent"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
