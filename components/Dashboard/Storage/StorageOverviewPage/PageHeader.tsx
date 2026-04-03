// components/StorageOverview/PageHeader.tsx
import { Shield, Users } from 'lucide-react';
import { WorkspaceSwitcher } from '../WorkspaceSwitcher';

interface PageHeaderProps {
  selectedWorkspaceId: string;
  isAdmin: boolean;
  onWorkspaceChange: (id: string) => void;
}

export function PageHeader({
  selectedWorkspaceId,
  isAdmin,
  onWorkspaceChange,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
      <div className="flex-1">
        <h1 className="text-xl sm:text-3xl font-semibold tracking-tight">
          Storage Overview
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage workspace file storage
        </p>
      </div>

      <div className="flex items-center gap-4">
        <WorkspaceSwitcher
          currentWorkspaceId={selectedWorkspaceId}
          onWorkspaceChange={onWorkspaceChange}
        />

        {isAdmin ? (
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-500" />
            <span className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-500">
              Admin view
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 bg-muted border rounded-lg">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Member</span>
          </div>
        )}
      </div>
    </div>
  );
}