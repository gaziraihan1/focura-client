import Link from 'next/link';
import { User } from 'lucide-react';
import { EmptyState as SharedEmptyState } from '@/components/Shared/EmptyState';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <SharedEmptyState
        icon={User}
        title="User not found"
        description=""
      />
      <Link
        href="/admin-dashboard/users"
        className="mt-3 text-xs text-primary hover:underline"
      >
        Back to users
      </Link>
    </div>
  );
}
