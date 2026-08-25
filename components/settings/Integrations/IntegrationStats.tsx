import type { Integration } from './index';

interface IntegrationStatsProps {
  integrations: Integration[];
}

export function IntegrationStats({ integrations }: IntegrationStatsProps) {
  const activeCount = integrations.filter((i) => i.active).length;
  const inactiveCount = integrations.filter((i) => !i.active).length;
  const failedCount = integrations.filter(
    (i) => i.syncStatus?.lastSyncStatus === 'failed',
  ).length;

  return (
    <div className="flex items-center gap-6 p-4 rounded-xl bg-muted/50">
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
          <span className="font-medium text-foreground">{failedCount}</span>{' '}
          need attention
        </span>
      </div>
    </div>
  );
}
