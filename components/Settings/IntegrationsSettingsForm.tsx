'use client';

import { useState, useEffect } from 'react';
import { Globe, Github, MessageSquare, Calendar, Save, Loader2, ExternalLink, Check } from 'lucide-react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

interface Integration {
  id: string;
  name: string;
  provider: string;
  active: boolean;
  connectedAt?: string;
}

const AVAILABLE_INTEGRATIONS = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Sync repositories, issues, and pull requests',
    icon: Github,
    color: 'bg-gray-500/10',
    textColor: 'text-gray-600 dark:text-gray-400',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notifications and update tasks from Slack',
    icon: MessageSquare,
    color: 'bg-[#4A154B]/10',
    textColor: 'text-[#4A154B] dark:text-[#E01E5A]',
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync tasks and deadlines with your calendar',
    icon: Calendar,
    color: 'bg-[#4285F4]/10',
    textColor: 'text-[#4285F4]',
  },
];

export function IntegrationsSettingsForm() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const result = await api.get<Integration[]>('/api/v1/user/integrations', { showErrorToast: false });
      if (result?.success && result.data) {
        setIntegrations(result.data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (provider: string) => {
    setConnecting(provider);
    try {
      await api.post('/api/v1/user/integrations', { provider });
      fetchIntegrations();
      toast.success(`${provider} connected successfully`);
    } catch {
      toast.error(`Failed to connect ${provider}`);
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (integrationId: string, provider: string) => {
    if (!confirm(`Disconnect ${provider}?`)) return;
    try {
      await api.delete(`/api/v1/user/integrations/${integrationId}`);
      setIntegrations((prev) => prev.filter((i) => i.id !== integrationId));
      toast.success(`${provider} disconnected`);
    } catch {
      toast.error(`Failed to disconnect ${provider}`);
    }
  };

  const isConnected = (provider: string) => integrations.some((i) => i.provider === provider && i.active);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Available Integrations</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Connect external tools to enhance your workflow
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {AVAILABLE_INTEGRATIONS.map((integration) => {
            const Icon = integration.icon;
            const connected = isConnected(integration.id);

            return (
              <div key={integration.id} className="flex items-center justify-between p-4 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${integration.color} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${integration.textColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{integration.name}</p>
                    <p className="text-xs text-muted-foreground">{integration.description}</p>
                  </div>
                </div>

                {connected ? (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                      <Check className="w-3 h-3" />
                      Connected
                    </span>
                    <button
                      onClick={() => {
                        const found = integrations.find((i) => i.provider === integration.id);
                        if (found) handleDisconnect(found.id, found.name);
                      }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleConnect(integration.id)}
                    disabled={connecting === integration.id}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
                  >
                    {connecting === integration.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ExternalLink className="w-4 h-4" />
                    )}
                    Connect
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
