import { DocsTree } from "@/types/docs.types";
import Link from "next/link";
import React from "react";

export default function DocsDesktop({ tree }: { tree: DocsTree }) {
  return (
    <aside className="hidden lg:block w-64 border-r border-border p-6 sticky top-0 h-screen overflow-y-auto scrollbar-hide">
      <h2 className="font-semibold text-lg text-foreground mb-6">
        Documentation
      </h2>
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
