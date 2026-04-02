'use client';

import { useIsFocuraAdmin } from '@/hooks/useFeatures';
import { useRouter }        from 'next/navigation';
import { useEffect }        from 'react';
import { Loader2 }          from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: isAdmin, isLoading } = useIsFocuraAdmin();
  const router = useRouter();

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
      {/* Admin nav */}
      <div className="border-b border-border bg-card px-6 py-3 flex items-center gap-6">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">
          Focura Admin
        </span>
        {[
          { href: '/admin',            label: 'Overview'   },
          { href: '/admin/workspaces', label: 'Workspaces' },
          { href: '/admin/users',      label: 'Users'      },
          { href: '/admin/projects',   label: 'Projects'   },
          { href: '/admin/activity',   label: 'Activity'   },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}