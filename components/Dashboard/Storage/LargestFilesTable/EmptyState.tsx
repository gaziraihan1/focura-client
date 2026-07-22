import { File } from 'lucide-react';
import { EmptyState as SharedEmptyState } from '@/components/Shared/EmptyState';

export function EmptyState() {
  return (
    <SharedEmptyState
      icon={File}
      title="No files found"
      description=""
    />
  );
}
