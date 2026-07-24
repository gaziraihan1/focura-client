'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Globe,
  Github,
  MessageSquare,
  Calendar,
  Loader2,
  // ExternalLink,
  Check,
  Settings2,
  ChevronDown,
  ChevronUp,
  Webhook,
  RefreshCw,
  AlertCircle,
  Zap,
  Link2,
  Unlink2,
} from 'lucide-react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Integration {
  id: string;
  name: string;
  provider: string;
  active: boolean;
  connectedAt?: string;
  config?: IntegrationConfig;
  syncStatus?: SyncStatus;
  webhookUrl?: string;
}

interface IntegrationConfig {
  workspaceId?: string;
  syncDirection?: 'one-way' | 'two-way';
  autoSync?: boolean;
  syncInterval?: number;
  notifications?: boolean;
  selectedChannels?: string[];
  selectedRepos?: string[];
}

interface SyncStatus {
  lastSyncAt?: string;
  lastSyncStatus?: 'success' | 'failed' | 'pending';
  syncCount?: number;
  error?: string;
}

interface Workspace {
  id: string;
  name: string;
  slug: string;
}

// ─── Integration Definitions ──────────────────────────────────────────────────

const AVAILABLE_INTEGRATIONS = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Sync repositories, issues, and pull requests with your tasks',
    icon: Github,
    color: 'bg-gray-500/10',
    textColor: 'text-gray-600 dark:text-gray-400',
    features: [
      'Link PRs to tasks',
      'Auto-close tasks on PR merge',
      'Sync issues as tasks',
      'Track commit history',
    ],
    oauthScopes: ['repo', 'read:user'],
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notifications and update tasks directly from Slack',
    icon: MessageSquare,
    color: 'bg-[#4A154B]/10',
    textColor: 'text-[#4A154B] dark:text-[#E01E5A]',
    features: [
      'Post task updates to channels',
      'Create tasks from messages',
      'Receive notifications',
      'Slash commands',
    ],
    oauthScopes: ['channels:read', 'chat:write', 'commands'],
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync tasks and deadlines with your calendar',
    icon: Calendar,
    color: 'bg-[#4285F4]/10',
    textColor: 'text-[#4285F4]',
    features: [
      'Sync task deadlines',
      'Create events for meetings',
      'View tasks in calendar',
      'Automatic reminders',
    ],
    oauthScopes: ['calendar.events', 'calendar.readonly'],
  },
];

// ─── Sub-Components ───────────────────────────────────────────────────────────

function IntegrationCard({
  integration,
  connectedIntegration,
  isConnecting,
  onConnect,
  onDisconnect,
  onConfigure,
  expanded,
  onToggleExpand,
}: {
  integration: (typeof AVAILABLE_INTEGRATIONS)[number];
  connectedIntegration?: Integration;
  isConnecting: boolean;
  onConnect: (provider: string) => void;
  onDisconnect: (id: string, name: string) => void;
  onConfigure: (integration: Integration) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const Icon = integration.icon;
  const isConnected = !!connectedIntegration?.active;

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-200',
        isConnected
          ? 'border-green-500/30 bg-green-500/5'
          : 'border-border bg-card hover:border-border/80',
      )}
    >
      {/* Main Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              integration.color,
            )}
          >
            <Icon className={cn('w-6 h-6', integration.textColor)} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{integration.name}</p>
              {isConnected && (
                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" />
                  Connected
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground max-w-md">
              {integration.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isConnected ? (
            <>
              <button
                onClick={() => onConfigure(connectedIntegration!)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors"
              >
                <Settings2 className="w-3.5 h-3.5" />
                Configure
              </button>
              <button
                onClick={() =>
                  onDisconnect(connectedIntegration!.id, integration.name)
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <Unlink2 className="w-3.5 h-3.5" />
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={() => onConnect(integration.id)}
              disabled={isConnecting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isConnecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Link2 className="w-4 h-4" />
              )}
              Connect
            </button>
          )}

          <button
            onClick={onToggleExpand}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-border/50">
          <div className="pt-4 space-y-4">
            {/* Features */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Features
              </p>
              <div className="grid grid-cols-2 gap-2">
                {integration.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <Zap className="w-3 h-3 text-primary" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Sync Status (if connected) */}
            {isConnected && connectedIntegration?.syncStatus && (
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <RefreshCw
                  className={cn(
                    'w-4 h-4',
                    connectedIntegration.syncStatus.lastSyncStatus === 'success'
                      ? 'text-green-500'
                      : connectedIntegration.syncStatus.lastSyncStatus ===
                        'failed'
                        ? 'text-red-500'
                        : 'text-yellow-500',
                  )}
                />
                <div className="text-xs">
                  <span className="text-muted-foreground">Last sync: </span>
                  <span className="font-medium">
                    {connectedIntegration.syncStatus.lastSyncAt
                      ? new Date(
                          connectedIntegration.syncStatus.lastSyncAt,
                        ).toLocaleString()
                      : 'Never'}
                  </span>
                </div>
                {connectedIntegration.syncStatus.syncCount !== undefined && (
                  <div className="text-xs text-muted-foreground">
                    {connectedIntegration.syncStatus.syncCount} syncs
                  </div>
                )}
              </div>
            )}

            {/* Webhook URL (if connected) */}
            {isConnected && connectedIntegration?.webhookUrl && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Webhook className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-xs font-medium text-muted-foreground">
                    Webhook URL
                  </p>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 font-mono text-xs text-muted-foreground overflow-x-auto">
                  <code className="flex-1">{connectedIntegration.webhookUrl}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        connectedIntegration.webhookUrl!,
                      );
                      toast.success('Webhook URL copied');
                    }}
                    className="shrink-0 text-xs text-primary hover:underline"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ConfigurationModal({
  integration,
  workspaces,
  onClose,
  onSave,
}: {
  integration: Integration;
  workspaces: Workspace[];
  onClose: () => void;
  onSave: (config: IntegrationConfig) => void;
}) {
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
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-accent transition-colors"
          >
            <AlertCircle className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Workspace Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Workspace</label>
            <select
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
                Automatically sync changes
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

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Notifications</p>
              <p className="text-xs text-muted-foreground">
                Receive notifications for updates
              </p>
            </div>
            <button
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
                  'absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform',
                  config.notifications && 'translate-x-5',
                )}
              />
            </button>
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

// ─── Main Component ───────────────────────────────────────────────────────────

export function IntegrationsSettingsForm() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [configuringIntegration, setConfiguringIntegration] =
    useState<Integration | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [integrationsResult, workspacesResult] = await Promise.allSettled([
        api.get<Integration[]>('/api/v1/user/integrations', {
          showErrorToast: false,
        }),
        api.get<Workspace[]>('/api/v1/workspaces', { showErrorToast: false }),
      ]);

      if (
        integrationsResult.status === 'fulfilled' &&
        integrationsResult.value?.success &&
        integrationsResult.value.data
      ) {
        setIntegrations(integrationsResult.value.data);
      }

      if (
        workspacesResult.status === 'fulfilled' &&
        workspacesResult.value?.success &&
        workspacesResult.value.data
      ) {
        setWorkspaces(workspacesResult.value.data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = useCallback(async (provider: string) => {
    setConnecting(provider);
    try {
      // Get the OAuth URL from the backend
      const result = await api.post<{ authUrl: string }>(
        '/api/v1/user/integrations/auth',
        { provider },
      );

      if (result?.success && result.data?.authUrl) {
        // Redirect to OAuth consent screen
        window.location.href = result.data.authUrl;
      } else {
        // Fallback: direct POST (for backward compatibility)
        await api.post('/api/v1/user/integrations', { provider });
        toast.success(`${provider} connected successfully`);
        fetchData();
      }
    } catch {
      toast.error(`Failed to initiate ${provider} connection`);
    } finally {
      setConnecting(null);
    }
  }, []);

  const handleDisconnect = useCallback(
    async (integrationId: string, provider: string) => {
      if (!confirm(`Disconnect ${provider}? This will revoke access.`)) return;
      try {
        await api.delete(`/api/v1/user/integrations/${integrationId}`);
        setIntegrations((prev) => prev.filter((i) => i.id !== integrationId));
        toast.success(`${provider} disconnected`);
      } catch {
        toast.error(`Failed to disconnect ${provider}`);
      }
    },
    [],
  );

  const handleConfigure = useCallback((integration: Integration) => {
    setConfiguringIntegration(integration);
  }, []);

  const handleConfigSave = useCallback(
    (config: IntegrationConfig) => {
      if (configuringIntegration) {
        setIntegrations((prev) =>
          prev.map((i) =>
            i.id === configuringIntegration.id ? { ...i, config } : i,
          ),
        );
      }
      setConfiguringIntegration(null);
    },
    [configuringIntegration],
  );

  const getConnectedIntegration = useCallback(
    (provider: string) => {
      return integrations.find((i) => i.provider === provider && i.active);
    },
    [integrations],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">
              Connected Integrations
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage your connected third-party services and automate your
              workflow
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex items-center gap-6 mb-6 p-4 rounded-xl bg-muted/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {integrations.filter((i) => i.active).length}
              </span>{' '}
              active
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {integrations.filter((i) => !i.active).length}
              </span>{' '}
              inactive
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {
                  integrations.filter(
                    (i) => i.syncStatus?.lastSyncStatus === 'failed',
                  ).length
                }
              </span>{' '}
              need attention
            </span>
          </div>
        </div>

        {/* Integration Cards */}
        <div className="space-y-4">
          {AVAILABLE_INTEGRATIONS.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              connectedIntegration={getConnectedIntegration(integration.id)}
              isConnecting={connecting === integration.id}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onConfigure={handleConfigure}
              expanded={expandedId === integration.id}
              onToggleExpand={() =>
                setExpandedId(
                  expandedId === integration.id ? null : integration.id,
                )
              }
            />
          ))}
        </div>
      </div>

      {/* OAuth Callback Notice */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">
              About OAuth Connections
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When you connect a service, you&apos;ll be redirected to the
              provider&apos;s authorization page. Focura requests only the
              permissions needed for the integration features. You can revoke
              access at any time by disconnecting the integration.
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      {configuringIntegration && (
        <ConfigurationModal
          integration={configuringIntegration}
          workspaces={workspaces}
          onClose={() => setConfiguringIntegration(null)}
          onSave={handleConfigSave}
        />
      )}
    </div>
  );
}
