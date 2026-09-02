import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { Integration, IntegrationConfig, Workspace } from '@/types/integration.types';

interface ConfigurationModalProps {
  integration: Integration;
  workspaces: Workspace[];
  onClose: () => void;
  onSave: (config: IntegrationConfig) => void;
}

export function ConfigurationModal({
  integration,
  workspaces,
  onClose,
  onSave,
}: ConfigurationModalProps) {
  const [config, setConfig] = useState<IntegrationConfig>(
    integration.config || {},
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/api/v1/user/integrations/${integration.id}/config`, {
        config,
      });
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
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-4 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            Configure {integration.name}
          </h3>
          <Button variant="ghost"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-accent transition-colors"
            aria-label="Close"
          >
            <AlertCircle className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Workspace Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="fld-64">Workspace</label>
            <select id="fld-64"
              value={config.workspaceId || ''}
              onChange={(e) =>
                setConfig({ ...config, workspaceId: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            >
              <option value="">Select a workspace</option>
              {workspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sync Direction */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Sync Direction</span>
            <div className="flex gap-2">
              {(['one-way', 'two-way'] as const).map((dir) => (
                <Button
                  key={dir}
                  variant="outline"
                  onClick={() => setConfig({ ...config, syncDirection: dir })}
                  className={cn(
                    'flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors',
                    config.syncDirection === dir
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:bg-accent',
                  )}
                >
                  {dir === 'one-way' ? 'Focura → Provider' : 'Two-way'}
                </Button>
              ))}
            </div>
          </div>

          {/* Auto Sync */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto Sync</p>
              <p className="text-xs text-muted-foreground">
                Automatically sync changes
              </p>
            </div>
            <button
              aria-label="Toggle automatic sync"
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
                  'absolute top-1 left-1 w-4 h-4 rounded-full bg-background transition-transform',
                  config.autoSync && 'translate-x-5',
                )}
              />
            </button>
          </div>

          {/* Sync Interval (if auto sync enabled) */}
          {config.autoSync && (
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="fld-65">Sync Interval</label>
              <select id="fld-65"
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

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Notifications</p>
              <p className="text-xs text-muted-foreground">
                Receive notifications for updates
              </p>
            </div>
            <button
              aria-label="Toggle notifications"
              onClick={() =>
                setConfig({
                  ...config,
                  notifications: !config.notifications,
                })
              }
              className={cn(
                'relative w-11 h-6 rounded-full transition-colors',
                config.notifications ? 'bg-primary' : 'bg-muted',
              )}
            >
              <span
                className={cn(
                  'absolute top-1 left-1 w-4 h-4 rounded-full bg-background transition-transform',
                  config.notifications && 'translate-x-5',
                )}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
            loading={saving}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
