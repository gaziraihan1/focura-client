import type { LucideIcon } from 'lucide-react';

export interface WorkspaceIntegration {
  id: string;
  name: string;
  provider: string;
  active: boolean;
  connectedAt?: string;
  connectedBy?: {
    id: string;
    name: string;
    email: string;
  };
  config?: WorkspaceIntegrationConfig;
  syncStatus?: SyncStatus;
  webhookUrl?: string;
}

export interface WorkspaceIntegrationConfig {
  syncDirection?: 'one-way' | 'two-way';
  autoSync?: boolean;
  syncInterval?: number;
  notifications?: boolean;
  notificationChannel?: string;
  notifyMembers?: boolean;
  allowedMembers?: string[];
  selectedChannels?: string[];
  selectedRepos?: string[];
  projectMapping?: Record<string, string>;
}

export interface SyncStatus {
  lastSyncAt?: string;
  lastSyncStatus?: 'success' | 'failed' | 'pending';
  syncCount?: number;
  error?: string;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface IntegrationDefinition {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
  features: string[];
  category: string;
}
