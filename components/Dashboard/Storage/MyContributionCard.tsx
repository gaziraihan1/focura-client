'use client';

import { motion } from 'framer-motion';
import { User, Files, TrendingUp } from 'lucide-react';
import { MyContribution } from '@/hooks/useStorage';
import { formatStorageSize } from '@/hooks/useStoragePage';

interface MyContributionCardProps {
  contribution: MyContribution;
  workspaceName: string;
}

export function MyContributionCard({ contribution, workspaceName }: MyContributionCardProps) {
  const { usageMB, fileCount, percentage } = contribution;

  const getProgressColor = () => {
    if (percentage >= 30) return 'bg-amber-500';
    if (percentage >= 20) return 'bg-blue-500';
    return 'bg-primary';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-linear-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Your Contribution</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Your storage usage in {workspaceName}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{percentage}%</p>
          <p className="text-xs text-muted-foreground">of workspace</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Storage Used</p>
            <p className="text-sm font-semibold">{formatStorageSize(usageMB)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Files className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Files</p>
            <p className="text-sm font-semibold">{fileCount}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            Contribution Level
          </span>
          <span className="text-xs font-medium">{percentage}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${getProgressColor()}`}
          />
        </div>
      </div>

      {percentage >= 30 && (
        <p className="text-xs text-amber-600 dark:text-amber-500 mt-3">
          You&apos;re using a significant portion of workspace storage. Consider cleaning up old files.
        </p>
      )}
    </motion.div>
  );
}