import { HardDrive } from 'lucide-react';
import { EmptyState as SharedEmptyState } from '@/components/Shared/EmptyState';

export function EmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <SharedEmptyState
        icon={HardDrive}
        title="No Workspaces Found"
        description="You need to be a member of at least one workspace to view storage."
      />
    </div>
  );
}
