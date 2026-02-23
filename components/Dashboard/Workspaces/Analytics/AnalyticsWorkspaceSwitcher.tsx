'use client';

import { useState } from 'react';
import { Check, ChevronDown, Building2, Crown, Shield, Users } from 'lucide-react';
import { useWorkspaces, Workspace } from '@/hooks/useWorkspace';

interface AnalyticsWorkspaceSwitcherProps {
  currentWorkspaceId: string;
  onWorkspaceChange: (workspaceId: string) => void;
}

export function AnalyticsWorkspaceSwitcher({ 
  currentWorkspaceId, 
  onWorkspaceChange 
}: AnalyticsWorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: workspaces = [], isLoading } = useWorkspaces();

  const currentWorkspace = workspaces.find((w) => w.id === currentWorkspaceId);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="w-3 h-3 text-amber-500" />;
      case 'ADMIN':
        return <Shield className="w-3 h-3 text-blue-500" />;
      case 'MEMBER':
        return <Users className="w-3 h-3 text-blue-400" />;
      default:
        return <Users className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getUserRole = (workspace: Workspace) => {
    if (workspace.ownerId === workspace.members?.[0]?.userId) {
      return 'OWNER';
    }
    return workspace.members?.[0]?.role || 'MEMBER';
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-xs animate-pulse">
        <div className="h-10 bg-muted rounded-lg" />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-card border rounded-lg hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Building2 className="w-5 h-5 text-primary shrink-0" />
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-medium truncate">
              {currentWorkspace?.name || 'Select Workspace'}
            </p>
            {currentWorkspace && (
              <div className="flex items-center gap-2 mt-1">
                {getRoleIcon(getUserRole(currentWorkspace))}
                <span className="text-xs text-muted-foreground capitalize">
                  {getUserRole(currentWorkspace).toLowerCase()}
                </span>
              </div>
            )}
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-2">
              <div className="px-3 py-2 mb-2">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Your Workspaces
                </p>
              </div>

              {workspaces.map((workspace) => {
                const role = getUserRole(workspace);
                return (
                  <button
                    key={workspace.id}
                    onClick={() => {
                      onWorkspaceChange(workspace.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
                      workspace.id === currentWorkspaceId
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Building2 className="w-4 h-4 shrink-0" />
                      <div className="min-w-0 flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium truncate">
                            {workspace.name}
                          </p>
                          {getRoleIcon(role)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground capitalize">
                            {role.toLowerCase()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            • {workspace._count?.projects || 0} projects
                          </span>
                          <span className="text-xs text-muted-foreground">
                            • {workspace._count?.members || 0} members
                          </span>
                        </div>
                      </div>
                    </div>
                    {workspace.id === currentWorkspaceId && (
                      <Check className="w-4 h-4 shrink-0" />
                    )}
                  </button>
                );
              })}

              {workspaces.length === 0 && (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No workspaces found</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}