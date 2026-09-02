import {
  Check,
  Settings2,
  ChevronDown,
  ChevronUp,
  Webhook,
  RefreshCw,
  Zap,
  Link2,
  Unlink2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { Integration, IntegrationDefinition } from './index';

interface IntegrationCardProps {
  integration: IntegrationDefinition;
  connectedIntegration?: Integration;
  isConnecting: boolean;
  onConnect: (provider: string) => void;
  onDisconnect: (id: string, name: string) => void;
  onConfigure: (integration: Integration) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}

export function IntegrationCard({
  integration,
  connectedIntegration,
  isConnecting,
  onConnect,
  onDisconnect,
  onConfigure,
  expanded,
  onToggleExpand,
}: IntegrationCardProps) {
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
              <Button
                variant="outline"
                onClick={() => onConfigure(connectedIntegration!)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors"
              >
                <Settings2 className="w-3.5 h-3.5" />
                Configure
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  onDisconnect(connectedIntegration!.id, integration.name)
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <Unlink2 className="w-3.5 h-3.5" />
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={() => onConnect(integration.id)}
              disabled={isConnecting}
              loading={isConnecting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {!isConnecting && <Link2 className="w-4 h-4" />}
              Connect
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={onToggleExpand}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
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
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        connectedIntegration.webhookUrl!,
                      );
                      toast.success('Webhook URL copied');
                    }}
                    className="shrink-0 text-xs text-primary hover:underline"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
