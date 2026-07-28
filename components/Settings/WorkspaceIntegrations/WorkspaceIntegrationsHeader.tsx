'use client';

import { Wrench, Shield } from 'lucide-react';

interface WorkspaceIntegrationsHeaderProps {
  activeCount: number;
  inactiveCount: number;
  needsAttentionCount: number;
  isAdmin: boolean;
}

export function WorkspaceIntegrationsHeader({
  activeCount,
  inactiveCount,
  needsAttentionCount,
  isAdmin,
}: WorkspaceIntegrationsHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
          <Wrench className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Workspace Integrations
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Connect tools for your entire team and automate workflows
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="flex items-center gap-6 mb-6 p-4 rounded-xl bg-muted/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{activeCount}</span>{' '}
            active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-400" />
          <span className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{inactiveCount}</span>{' '}
            inactive
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{needsAttentionCount}</span>{' '}
            need attention
          </span>
        </div>
      </div>

      {/* Admin Notice */}
      {!isAdmin && (
        <div className="mb-6 flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Only workspace admins can connect or configure integrations. You
            can view the current integration status below.
          </p>
        </div>
      )}
    </>
  );
}
