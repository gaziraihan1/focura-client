'use client';

import { DocsTree } from "@/types/docs.types";
import Link         from "next/link";
import { usePathname } from "next/navigation";
import { cn }       from "@/lib/utils";

export default function DocsDesktop({ tree }: { tree: DocsTree }) {
  const pathname = usePathname();

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
              {section.pages.map((page) => {
                const isActive = pathname === page.slug;
                return (
                  <li key={page.slug}>
                    <Link
                      href={page.slug}
                      className={cn(
                        'text-sm block py-2 px-3 rounded-md transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                      )}
                    >
                      {page.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}