export interface Integration {
  id: string;
  name: string;
  provider: string;
  active: boolean;
  connectedAt?: string;
  config?: IntegrationConfig;
  syncStatus?: SyncStatus;
  webhookUrl?: string;
}

export interface IntegrationConfig {
  workspaceId?: string;
  syncDirection?: 'one-way' | 'two-way';
  autoSync?: boolean;
  syncInterval?: number;
  notifications?: boolean;
  selectedChannels?: string[];
  selectedRepos?: string[];
}

export interface SyncStatus {
  lastSyncAt?: string;
  lastSyncStatus?: 'success' | 'failed' | 'pending';
  syncCount?: number;
  error?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
}

export interface IntegrationDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  textColor: string;
  features: string[];
  oauthScopes: string[];
}
