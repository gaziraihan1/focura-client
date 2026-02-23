'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Building2, Crown, Shield, Users } from 'lucide-react';
import { useWorkspacesSummary } from '@/hooks/useStorage';

interface WorkspaceSwitcherProps {
  currentWorkspaceId: string;
  onWorkspaceChange: (workspaceId: string) => void;
}

export function WorkspaceSwitcher({ currentWorkspaceId, onWorkspaceChange }: WorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: workspaces = [], isLoading } = useWorkspacesSummary();

  const currentWorkspace = workspaces.find((w) => w.workspaceId === currentWorkspaceId);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="w-3 h-3 text-amber-500" />;
      case 'ADMIN':
        return <Shield className="w-3 h-3 text-blue-500" />;
      default:
        return <Users className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getStorageColor = (percentage: number) => {
    if (percentage >= 95) return 'bg-destructive';
    if (percentage >= 80) return 'bg-amber-500';
    return 'bg-primary';
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
              {currentWorkspace?.workspaceName || 'Select Workspace'}
            </p>
            {currentWorkspace && (
              <div className="flex items-center gap-2 mt-1">
                {getRoleIcon(currentWorkspace.role)}
                <span className="text-xs text-muted-foreground">
                  {currentWorkspace.percentage}% used
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
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
            >
              <div className="p-2">
                <div className="px-3 py-2 mb-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Your Workspaces
                  </p>
                </div>

                {workspaces.map((workspace, index) => (
                  <motion.button
                    key={workspace.workspaceId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onWorkspaceChange(workspace.workspaceId);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
                      workspace.workspaceId === currentWorkspaceId
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Building2 className="w-4 h-4 shrink-0" />
                      <div className="min-w-0 flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium truncate">
                            {workspace.workspaceName}
                          </p>
                          {getRoleIcon(workspace.role)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {workspace.usageMB.toFixed(1)} / {workspace.totalMB} MB
                          </span>
                          <span className="text-xs font-medium">
                            {workspace.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1 mt-2">
                          <div
                            className={`h-full rounded-full transition-all ${getStorageColor(
                              workspace.percentage
                            )}`}
                            style={{ width: `${workspace.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    {workspace.workspaceId === currentWorkspaceId && (
                      <Check className="w-4 h-4 shrink-0" />
                    )}
                  </motion.button>
                ))}

                {workspaces.length === 0 && (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No workspaces found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}