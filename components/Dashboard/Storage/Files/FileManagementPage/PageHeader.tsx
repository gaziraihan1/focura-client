// components/FileManagement/PageHeader.tsx
import { Files } from 'lucide-react';
import { WorkspaceSwitcher } from '../../WorkspaceSwitcher';

interface PageHeaderProps {
  isAdmin: boolean;
  selectedWorkspaceId?: string;
  setSelectedWorkspaceId?: (id: string) => void;
}

export function PageHeader({
  isAdmin,
  selectedWorkspaceId,
  setSelectedWorkspaceId,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Files className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Files</h1>
            <p className="text-muted-foreground mt-1">
              {isAdmin
                ? 'Manage all workspace files'
                : 'View and manage your uploaded files'}
            </p>
          </div>
        </div>
      </div>

      {/* Workspace Switcher */}
      {selectedWorkspaceId && setSelectedWorkspaceId && (
        <WorkspaceSwitcher
          currentWorkspaceId={selectedWorkspaceId}
          onWorkspaceChange={setSelectedWorkspaceId}
        />
      )}
    </div>
  );
}