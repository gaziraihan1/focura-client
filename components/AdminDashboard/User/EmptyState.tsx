// components/AdminUserDetail/EmptyState.tsx
import Link from 'next/link';
import { User } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <User className="w-12 h-12 text-muted-foreground mb-3" />
      <p className="text-sm font-semibold text-foreground">User not found</p>
      <Link
        href="/admin-dashboard/users"
        className="mt-3 text-xs text-primary hover:underline"
      >
        Back to users
      </Link>
    </div>
  );
}