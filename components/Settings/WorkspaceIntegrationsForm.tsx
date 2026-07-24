'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Wrench,
  Github,
  MessageSquare,
  Calendar,
  Trello,
  Loader2,
  AlertCircle,
  Shield,
} from 'lucide-react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { WorkspaceIntegrationCard } from './WorkspaceIntegrations/WorkspaceIntegrationCard';
import { WorkspaceConfigurationModal } from './WorkspaceIntegrations/WorkspaceConfigurationModal';
import type {
  WorkspaceIntegration,
  WorkspaceIntegrationConfig,
  WorkspaceMember,
  IntegrationDefinition,
} from './WorkspaceIntegrations/types';

// ─── Integration Definitions ──────────────────────────────────────────────────

const WORKSPACE_INTEGRATIONS: IntegrationDefinition[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Sync repositories, issues, and pull requests with workspace tasks',
    icon: Github,
    color: 'bg-gray-500/10',
    textColor: 'text-gray-600 dark:text-gray-400',
    features: [
      'Link PRs to workspace tasks',
      'Auto-close tasks on PR merge',
      'Sync issues as tasks',
      'Track commit history per project',
      'Create branches from tasks',
    ],
    category: 'development',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Post task updates and receive notifications in team channels',
    icon: MessageSquare,
    color: 'bg-[#4A154B]/10',
    textColor: 'text-[#4A154B] dark:text-[#E01E5A]',
    features: [
      'Post task updates to channels',
      'Create tasks from messages',
      'Receive notifications',
      'Slash commands for quick actions',
      'Daily standup summaries',
    ],
    category: 'communication',
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync project deadlines, milestones, and meetings',
    icon: Calendar,
    color: 'bg-[#4285F4]/10',
    textColor: 'text-[#4285F4]',
    features: [
      'Sync project deadlines',
      'Create events for meetings',
      'View tasks in calendar',
      'Automatic reminders',
      'Team availability sync',
    ],
    category: 'productivity',
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Import boards and lists into Focura projects',
    icon: Trello,
    color: 'bg-[#0079BF]/10',
    textColor: 'text-[#0079BF]',
    features: [
      'Import Trello boards',
      'Sync cards as tasks',
      'Map lists to sections',
      'Preserve labels and due dates',
      'Two-way sync option',
    ],
    category: 'project-management',
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  development: 'Development',
  communication: 'Communication',
  productivity: 'Productivity',
  'project-management': 'Project Management',
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface WorkspaceIntegrationsFormProps {
  workspaceSlug: string;
  workspaceId?: string;
  isAdmin?: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function WorkspaceIntegrationsForm({
  workspaceSlug,
  workspaceId: _workspaceId,
  isAdmin = false,
}: WorkspaceIntegrationsFormProps) {
  const [integrations, setIntegrations] = useState<WorkspaceIntegration[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [configuringIntegration, setConfiguringIntegration] =
    useState<WorkspaceIntegration | null>(null);

  useEffect(() => {
    fetchData();
  }, [workspaceSlug]);

  const fetchData = async () => {
    try {
      const [integrationsResult, membersResult] = await Promise.allSettled([
        api.get<WorkspaceIntegration[]>(
          `/api/v1/workspace-integrations/${workspaceSlug}`,
          { showErrorToast: false },
        ),
        api.get<WorkspaceMember[]>(
          `/api/v1/workspaces/${workspaceSlug}/members`,
          { showErrorToast: false },
        ),
      ]);

      if (
        integrationsResult.status === 'fulfilled' &&
        integrationsResult.value?.success &&
        integrationsResult.value.data
      ) {
        setIntegrations(integrationsResult.value.data);
      }

      if (
        membersResult.status === 'fulfilled' &&
        membersResult.value?.success &&
        membersResult.value.data
      ) {
        setMembers(membersResult.value.data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = useCallback(
    async (provider: string) => {
      if (!isAdmin) {
        toast.error('Only admins can connect integrations');
        return;
      }

      setConnecting(provider);
      try {
        // Get the OAuth URL from the backend
        const result = await api.post<{ authUrl: string }>(
          `/api/v1/workspace-integrations/${workspaceSlug}/auth`,
          { provider },
        );

        if (result?.success && result.data?.authUrl) {
          // Redirect to OAuth consent screen
          window.location.href = result.data.authUrl;
        } else {
          // Fallback: direct POST (for backward compatibility)
          await api.post(`/api/v1/workspace-integrations/${workspaceSlug}`, {
            provider,
          });
          toast.success(`${provider} connected`);
          fetchData();
        }
      } catch {
        toast.error(`Failed to initiate ${provider} connection`);
      } finally {
        setConnecting(null);
      }
    },
    [workspaceSlug, isAdmin],
  );

  const handleDisconnect = useCallback(
    async (integrationId: string, provider: string) => {
      if (!isAdmin) {
        toast.error('Only admins can disconnect integrations');
        return;
      }

      if (!confirm(`Disconnect ${provider}? This will affect all workspace members.`)) return;
      try {
        await api.delete(
          `/api/v1/workspace-integrations/${workspaceSlug}/${integrationId}`,
        );
        setIntegrations((prev) => prev.filter((i) => i.id !== integrationId));
        toast.success(`${provider} disconnected`);
      } catch {
        toast.error(`Failed to disconnect ${provider}`);
      }
    },
    [workspaceSlug, isAdmin],
  );

  const handleConfigure = useCallback((integration: WorkspaceIntegration) => {
    setConfiguringIntegration(integration);
  }, []);

  const handleConfigSave = useCallback(
    (config: WorkspaceIntegrationConfig) => {
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

  // Group integrations by category
  const groupedIntegrations = WORKSPACE_INTEGRATIONS.reduce(
    (acc, integration) => {
      const category = integration.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(integration);
      return acc;
    },
    {} as Record<string, IntegrationDefinition[]>,
  );

  // Calculate stats
  const activeCount = integrations.filter((i) => i.active).length;
  const inactiveCount = integrations.filter((i) => !i.active).length;
  const needsAttentionCount = integrations.filter(
    (i) => i.syncStatus?.lastSyncStatus === 'failed',
  ).length;

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
      <div className="rounded-2xl border border-border bg-card p-6">
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

        {/* Integration Cards by Category */}
        {Object.entries(groupedIntegrations).map(
          ([category, categoryIntegrations]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                {CATEGORY_LABELS[category] || category}
              </h4>
              <div className="space-y-3">
                {categoryIntegrations.map((integration) => (
                  <WorkspaceIntegrationCard
                    key={integration.id}
                    integration={integration}
                    connectedIntegration={getConnectedIntegration(
                      integration.id,
                    )}
                    isConnecting={connecting === integration.id}
                    isAdmin={isAdmin}
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
          ),
        )}
      </div>

      {/* OAuth Callback Notice */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">
              About Workspace Integrations
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Workspace integrations are shared across all members. When you
              connect a service, you&apos;ll be redirected to the
              provider&apos;s authorization page. Only workspace admins can
              connect or disconnect integrations. Configuration changes apply
              to the entire workspace.
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      {configuringIntegration && (
        <WorkspaceConfigurationModal
          integration={configuringIntegration}
          members={members}
          onClose={() => setConfiguringIntegration(null)}
          onSave={handleConfigSave}
        />
      )}
    </div>
  );
}
