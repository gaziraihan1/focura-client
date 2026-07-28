'use client';

import { HardDrive } from 'lucide-react';
import { useWorkspaceStorageInfo } from '@/hooks/useStorage';

interface WorkspaceStorageInfoProps {
  maxStorage: number;
  workspaceId?: string;
}

function formatMB(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

export default function WorkspaceStorageInfo({ maxStorage, workspaceId }: WorkspaceStorageInfoProps) {
  const { data: storageInfo, isLoading } = useWorkspaceStorageInfo(workspaceId ?? '');

  const usedMB = storageInfo?.usedMB ?? 0;
  const totalMB = storageInfo?.totalMB ?? maxStorage;
  const percentage = totalMB > 0 ? Math.min((usedMB / totalMB) * 100, 100) : 0;
  const remainingMB = totalMB - usedMB;

  const isWarning = percentage >= 80;
  const isDanger = percentage >= 95;

  return (
    <div className="p-5 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <HardDrive className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Storage</h3>
      </div>

      {/* Usage display */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-2xl font-bold text-foreground">
            {isLoading ? '--' : formatMB(usedMB)}
          </span>
          <span className="text-xs text-muted-foreground">
            of {formatMB(totalMB)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isDanger ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-primary'
            }`}
            style={{ width: `${isLoading ? 0 : percentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          {isLoading ? 'Loading...' : `${percentage.toFixed(1)}% used · ${formatMB(remainingMB)} remaining`}
        </p>
      </div>

      {/* Warning banner */}
      {isWarning && !isLoading && (
        <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 mb-4">
          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
            {isDanger ? 'Storage almost full' : 'Running low on storage'}
          </p>
          <p className="text-[11px] text-orange-600/70 dark:text-orange-400/70 mt-0.5">
            Consider cleaning up files or upgrading your plan
          </p>
        </div>
      )}


    </div>
  );
}
