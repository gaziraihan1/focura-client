'use client';

import { useIsFocuraAdmin } from '@/hooks/useFeatures';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, Menu, X, Shield } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/admin-dashboard',            label: 'Overview'    },
  { href: '/admin-dashboard/workspaces', label: 'Workspaces'  },
  { href: '/admin-dashboard/users',      label: 'Users'       },
  { href: '/admin-dashboard/projects',   label: 'Projects'    },
  { href: '/admin-dashboard/billing',    label: 'Billing'     },
  { href: '/admin-dashboard/activity',   label: 'Activity'    },
  { href: '/admin-dashboard/contact',   label: 'Messages'    },
  { href: '/admin-dashboard/careers',   label: 'Careers'     },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: isAdmin, isLoading } = useIsFocuraAdmin();
  const router   = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on route change

  useEffect(() => {
    if (!isLoading && !isAdmin) router.replace('/dashboard');
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
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

            {/* Desktop links */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-sm transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
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
              className="md:hidden flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-2 space-y-0.5">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md text-sm transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* ── Page content ──────────────────────────────────────── */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}