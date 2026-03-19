// components/StorageOverview/EmptyState.tsx
import { HardDrive } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <HardDrive className="w-12 h-12 text-muted-foreground" />
        <div>
          <h3 className="text-lg font-semibold">No Workspaces Found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            You need to be a member of at least one workspace to view storage.
          </p>
        </div>
      </div>
    </div>
  );
}