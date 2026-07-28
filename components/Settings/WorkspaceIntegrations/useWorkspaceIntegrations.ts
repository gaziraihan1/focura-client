'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/axios';
import { invalidateCsrfToken } from '@/lib/csrf';
import toast from 'react-hot-toast';
import { WORKSPACE_INTEGRATIONS } from './integrationDefinitions';
import type {
  WorkspaceIntegration,
  WorkspaceIntegrationConfig,
  WorkspaceMember,
} from './types';

interface UseWorkspaceIntegrationsReturn {
  integrations: WorkspaceIntegration[];
  members: WorkspaceMember[];
  loading: boolean;
  connecting: string | null;
  expandedId: string | null;
  configuringIntegration: WorkspaceIntegration | null;
  disconnectTarget: { id: string; name: string } | null;
  isDisconnecting: boolean;
  groupedIntegrations: Record<string, typeof WORKSPACE_INTEGRATIONS>;
  activeCount: number;
  inactiveCount: number;
  needsAttentionCount: number;
  setExpandedId: (id: string | null) => void;
  handleConnect: (provider: string) => Promise<void>;
  handleDisconnect: (integrationId: string, provider: string) => void;
  confirmDisconnect: () => Promise<void>;
  handleConfigure: (integration: WorkspaceIntegration) => void;
  handleConfigSave: (config: WorkspaceIntegrationConfig) => void;
  getConnectedIntegration: (provider: string) => WorkspaceIntegration | undefined;
  setConfiguringIntegration: (integration: WorkspaceIntegration | null) => void;
  setDisconnectTarget: (target: { id: string; name: string } | null) => void;
}

export function useWorkspaceIntegrations(
  workspaceSlug: string,
  isAdmin: boolean,
): UseWorkspaceIntegrationsReturn {
  const [integrations, setIntegrations] = useState<WorkspaceIntegration[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [configuringIntegration, setConfiguringIntegration] =
    useState<WorkspaceIntegration | null>(null);
  const [disconnectTarget, setDisconnectTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const fetchData = useCallback(async () => {
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
  }, [workspaceSlug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleConnect = useCallback(
    async (provider: string) => {
      if (!isAdmin) {
        toast.error('Only admins can connect integrations');
        return;
      }

      setConnecting(provider);
      try {
        invalidateCsrfToken();
        sessionStorage.setItem('integration_workspace_slug', workspaceSlug);

        const result = await api.post<{ authUrl: string }>(
          `/api/v1/workspace-integrations/${workspaceSlug}/auth`,
          { provider },
        );

        if (result?.success && result.data?.authUrl) {
          window.location.href = result.data.authUrl;
        } else {
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
    [workspaceSlug, isAdmin, fetchData],
  );

  const handleDisconnect = useCallback(
    (integrationId: string, provider: string) => {
      if (!isAdmin) {
        toast.error('Only admins can disconnect integrations');
        return;
      }
      setDisconnectTarget({ id: integrationId, name: provider });
    },
    [isAdmin],
  );

  const confirmDisconnect = useCallback(async () => {
    if (!disconnectTarget) return;
    setIsDisconnecting(true);
    try {
      await api.delete(
        `/api/v1/workspace-integrations/${workspaceSlug}/${disconnectTarget.id}`,
      );
      setIntegrations((prev) => prev.filter((i) => i.id !== disconnectTarget.id));
      toast.success(`${disconnectTarget.name} disconnected`);
    } catch {
      toast.error(`Failed to disconnect ${disconnectTarget.name}`);
    } finally {
      setIsDisconnecting(false);
      setDisconnectTarget(null);
    }
  }, [workspaceSlug, disconnectTarget]);

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

  const groupedIntegrations = WORKSPACE_INTEGRATIONS.reduce(
    (acc, integration) => {
      const category = integration.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(integration);
      return acc;
    },
    {} as Record<string, typeof WORKSPACE_INTEGRATIONS>,
  );

  const activeCount = integrations.filter((i) => i.active).length;
  const inactiveCount = integrations.filter((i) => !i.active).length;
  const needsAttentionCount = integrations.filter(
    (i) => i.syncStatus?.lastSyncStatus === 'failed',
  ).length;

  return {
    integrations,
    members,
    loading,
    connecting,
    expandedId,
    configuringIntegration,
    disconnectTarget,
    isDisconnecting,
    groupedIntegrations,
    activeCount,
    inactiveCount,
    needsAttentionCount,
    setExpandedId,
    handleConnect,
    handleDisconnect,
    confirmDisconnect,
    handleConfigure,
    handleConfigSave,
    getConnectedIntegration,
    setConfiguringIntegration,
    setDisconnectTarget,
  };
}
