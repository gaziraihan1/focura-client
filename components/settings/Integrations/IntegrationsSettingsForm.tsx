"use client";

import { useState, useEffect, useCallback } from "react";
import { Globe, Loader2 } from "lucide-react";
import { api } from "@/lib/axios";
import { invalidateCsrfToken } from "@/lib/csrf";
import toast from "react-hot-toast";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { IntegrationCard } from "./IntegrationCard";
import { ConfigurationModal } from "./ConfigurationModal";
import { IntegrationStats } from "./IntegrationStats";
import { OAuthNotice } from "./OAuthNotice";
import { AVAILABLE_INTEGRATIONS } from "./integration-definitions";
import type { Integration, IntegrationConfig, Workspace } from "@/types/integration.types";

export function IntegrationsSettingsForm() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [configuringIntegration, setConfiguringIntegration] =
    useState<Integration | null>(null);
  const [disconnectTarget, setDisconnectTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [integrationsResult, workspacesResult] = await Promise.allSettled([
        api.get<Integration[]>("/api/v1/user/integrations", {
          showErrorToast: false,
        }),
        api.get<Workspace[]>("/api/v1/workspaces", { showErrorToast: false }),
      ]);

      if (
        integrationsResult.status === "fulfilled" &&
        integrationsResult.value?.success &&
        integrationsResult.value.data
      ) {
        setIntegrations(integrationsResult.value.data);
      }

      if (
        workspacesResult.status === "fulfilled" &&
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
      invalidateCsrfToken();

      const result = await api.post<{ authUrl: string }>(
        "/api/v1/user/integrations/auth",
        { provider },
      );

      if (result?.success && result.data?.authUrl) {
        window.location.href = result.data.authUrl;
      } else {
        await api.post("/api/v1/user/integrations", { provider });
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
      setDisconnectTarget({ id: integrationId, name: provider });
    },
    [],
  );

  const confirmDisconnect = useCallback(async () => {
    if (!disconnectTarget) return;
    setIsDisconnecting(true);
    try {
      await api.delete(`/api/v1/user/integrations/${disconnectTarget.id}`);
      setIntegrations((prev) =>
        prev.filter((i) => i.id !== disconnectTarget.id),
      );
      toast.success(`${disconnectTarget.name} disconnected`);
    } catch {
      toast.error(`Failed to disconnect ${disconnectTarget.name}`);
    } finally {
      setIsDisconnecting(false);
      setDisconnectTarget(null);
    }
  }, [disconnectTarget]);

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

        <IntegrationStats integrations={integrations} />

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

      <OAuthNotice />

      {/* Configuration Modal */}
      {configuringIntegration && (
        <ConfigurationModal
          integration={configuringIntegration}
          workspaces={workspaces}
          onClose={() => setConfiguringIntegration(null)}
          onSave={handleConfigSave}
        />
      )}

      {/* Disconnect Confirmation Modal */}
      <ConfirmModal
        isOpen={!!disconnectTarget}
        onClose={() => setDisconnectTarget(null)}
        onConfirm={confirmDisconnect}
        title={`Disconnect ${disconnectTarget?.name || ""}?`}
        message="This will revoke access. You can reconnect at any time."
        confirmText="Disconnect"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDisconnecting}
      />
    </div>
  );
}
