export interface StorageOverviewPageProps {
  initialWorkspaceId?: string;
}

export interface StorageOverviewState {
  selectedWorkspaceId: string;
}

export type WarningLevel = 'normal' | 'warning' | 'critical' | string;

export interface StorageWarning {
  level: WarningLevel;
  message: string | null;
}