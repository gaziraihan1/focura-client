'use client';

import { useState } from 'react';
import { Loader2, AlertCircle, Bell, Users } from 'lucide-react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import type { WorkspaceIntegration, WorkspaceIntegrationConfig, WorkspaceMember } from './types';

interface WorkspaceConfigurationModalProps {
  integration: WorkspaceIntegration;
  members: WorkspaceMember[];
  onClose: () => void;
  onSave: (config: WorkspaceIntegrationConfig) => void;
}

export function WorkspaceConfigurationModal({
  integration,
  members,
  onClose,
  onSave,
}: WorkspaceConfigurationModalProps) {
  const [config, setConfig] = useState<WorkspaceIntegrationConfig>(
    integration.config || {},
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(
        `/api/v1/workspace-integrations/${integration.id}/config`,
        { config },
      );
      onSave(config);
      toast.success('Configuration saved');
      onClose();
    } catch {
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-lg max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            Configure {integration.name}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-accent transition-colors"
          >
            <AlertCircle className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Sync Direction */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sync Direction</label>
            <div className="flex gap-2">
              {(['one-way', 'two-way'] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => setConfig({ ...config, syncDirection: dir })}
                  className={cn(
                    'flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors',
                    config.syncDirection === dir
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:bg-accent',
                  )}
                >
                  {dir === 'one-way' ? 'Focura → Provider' : 'Two-way'}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Sync */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto Sync</p>
              <p className="text-xs text-muted-foreground">
                Automatically sync changes across the workspace
              </p>
            </div>
            <button
              onClick={() =>
                setConfig({ ...config, autoSync: !config.autoSync })
              }
              className={cn(
                'relative w-11 h-6 rounded-full transition-colors',
                config.autoSync ? 'bg-primary' : 'bg-muted',
              )}
            >
              <span
                className={cn(
                  'absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform',
                  config.autoSync && 'translate-x-5',
                )}
              />
            </button>
          </div>

          {/* Sync Interval (if auto sync enabled) */}
          {config.autoSync && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Sync Interval</label>
              <select
                value={config.syncInterval || 300}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    syncInterval: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
              >
                <option value={60}>Every minute</option>
                <option value={300}>Every 5 minutes</option>
                <option value={900}>Every 15 minutes</option>
                <option value={1800}>Every 30 minutes</option>
                <option value={3600}>Every hour</option>
              </select>
            </div>
          )}

          {/* Workspace Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium">Workspace Notifications</p>
            </div>

            {/* Notify All Members */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Notify all members</p>
                <p className="text-xs text-muted-foreground">
                  Send notifications to all workspace members
                </p>
              </div>
              <button
                onClick={() =>
                  setConfig({
                    ...config,
                    notifyMembers: !config.notifyMembers,
                  })
                }
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  config.notifyMembers ? 'bg-primary' : 'bg-muted',
                )}
              >
                <span
                  className={cn(
                    'absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform',
                    config.notifyMembers && 'translate-x-5',
                  )}
                />
              </button>
            </div>

            {/* Notification Channel (for Slack) */}
            {integration.provider === 'slack' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Notification Channel
                </label>
                <input
                  type="text"
                  placeholder="#general"
                  value={config.notificationChannel || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      notificationChannel: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                />
              </div>
            )}
          </div>

          {/* Member Access Control */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium">Access Control</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Restrict access to specific members (optional)
              </label>
              <div className="max-h-40 overflow-y-auto border border-border rounded-lg p-2 space-y-1">
                {members.map((member) => (
                  <label
                    key={member.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        config.allowedMembers?.includes(member.userId) ?? true
                      }
                      onChange={(e) => {
                        const current = config.allowedMembers || [];
                        const newAllowed = e.target.checked
                          ? [...current, member.userId]
                          : current.filter((id) => id !== member.userId);
                        setConfig({ ...config, allowedMembers: newAllowed });
                      }}
                      className="rounded border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.email}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {member.role}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {config.allowedMembers?.length || 0} of {members.length}{' '}
                members selected
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Save Configuration'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
