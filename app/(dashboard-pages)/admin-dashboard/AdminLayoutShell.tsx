"use client";

import { useIsFocuraAdmin } from "@/hooks/useFeatures";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Menu, X, Shield } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/themes/ThemeSwitcher";

const NAV_LINKS = [
  { href: "/admin-dashboard",            label: "Overview"    },
  { href: "/admin-dashboard/workspaces", label: "Workspaces"  },
  { href: "/admin-dashboard/users",      label: "Users"       },
  { href: "/admin-dashboard/projects",   label: "Projects"    },
  { href: "/admin-dashboard/billing",    label: "Billing"     },
  { href: "/admin-dashboard/activity",   label: "Activities"  },
  { href: "/admin-dashboard/contact",    label: "Messages"    },
  { href: "/admin-dashboard/careers",    label: "Careers"     },
  { href: "/admin-dashboard/templates",  label: "Templates"   },
  { href: "/admin-dashboard/resource",   label: "Resources"   },
];

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const { data: isAdmin, isLoading } = useIsFocuraAdmin();
  const router   = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu with the Escape key.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // Redirect gate on async admin-status query — no event-handler or server
  // component has this client-fetched info; per the rule's own validation
  // this is a false positive (async-subscription-gated).
  //
  // SECURITY NOTE: this redirect is UX polish only, NOT the authorization
  // boundary. Real enforcement lives in:
  //   1. proxy.ts (Next.js middleware) — JWT role check for /admin-dashboard/*
  //   2. Backend: /api/v1/admin/* is mounted behind `authenticate +
  //      requireFocuraAdmin` — API calls from non-admins are rejected there.
  useEffect(() => {
    // react-doctor-disable-next-line react-doctor/nextjs-no-client-side-redirect
    if (!isLoading && !isAdmin) router.replace("/dashboard");
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" role="status" aria-label="Loading admin dashboard">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav bar ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-12">

            {/* Brand */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                <Shield className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Focura Admin
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <ThemeToggle />

              {/* Desktop links */}
              <nav className="hidden lg:flex items-center gap-1">
                {NAV_LINKS.map(({ href, label }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "px-2.5 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap",
                        active
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="lg:hidden flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label={menuOpen ? "Close Admin menu" : "Open Admin menu"}
                aria-expanded={menuOpen}
                aria-controls={menuOpen ? "admin-mobile-nav" : undefined}
              >
                {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            id="admin-mobile-nav"
            className="lg:hidden border-t border-border bg-card px-4 py-3 space-y-0.5 animate-in slide-in-from-top-4 fade-in duration-200"
          >
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-md text-sm transition-colors",
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  {label}
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* ── Page content ──────────────────────────────────────── */}
      <main id="main-content" className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
