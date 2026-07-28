'use client';

import { AlertCircle, Loader2 } from 'lucide-react';
import { WorkspaceIntegrationCard } from './WorkspaceIntegrationCard';
import { WorkspaceConfigurationModal } from './WorkspaceConfigurationModal';
import { WorkspaceIntegrationsHeader } from './WorkspaceIntegrationsHeader';
import { ConfirmModal } from '@/components/Shared/ConfirmModal';
import { useWorkspaceIntegrations } from './useWorkspaceIntegrations';
import { CATEGORY_LABELS } from './integrationDefinitions';

interface WorkspaceIntegrationsFormProps {
  workspaceSlug: string;
  workspaceId?: string;
  isAdmin?: boolean;
}

export function WorkspaceIntegrationsForm({
  workspaceSlug,
  isAdmin = false,
}: WorkspaceIntegrationsFormProps) {
  const {
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
    members,
    setExpandedId,
    handleConnect,
    handleDisconnect,
    confirmDisconnect,
    handleConfigure,
    handleConfigSave,
    getConnectedIntegration,
    setConfiguringIntegration,
    setDisconnectTarget,
  } = useWorkspaceIntegrations(workspaceSlug, isAdmin);

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
        <WorkspaceIntegrationsHeader
          activeCount={activeCount}
          inactiveCount={inactiveCount}
          needsAttentionCount={needsAttentionCount}
          isAdmin={isAdmin}
        />

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

      {/* Disconnect Confirmation Modal */}
      <ConfirmModal
        isOpen={!!disconnectTarget}
        onClose={() => setDisconnectTarget(null)}
        onConfirm={confirmDisconnect}
        title={`Disconnect ${disconnectTarget?.name || ''}?`}
        message="This will revoke access and affect all workspace members. You can reconnect at any time."
        confirmText="Disconnect"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDisconnecting}
      />
    </div>
  );
}
