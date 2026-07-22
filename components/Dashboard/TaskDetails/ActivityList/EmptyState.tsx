import { Clock } from 'lucide-react';
import { EmptyState as SharedEmptyState } from '@/components/Shared/EmptyState';

export function EmptyState() {
  return (
    <SharedEmptyState
      icon={Clock}
      title="No activity yet"
      description="Activity will appear here as changes are made"
    />
  );
}
