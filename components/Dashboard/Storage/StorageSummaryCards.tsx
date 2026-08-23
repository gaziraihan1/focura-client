'use client';

import { m as motion } from 'framer-motion';
import { Database, HardDrive, AlertCircle, CheckCircle, Building2 } from 'lucide-react';
import { StorageInfo } from '@/hooks/useStorage';
import { formatStorageSize } from '@/hooks/useStoragePage';

interface StorageSummaryCardsProps {
  storageInfo: StorageInfo;
}

const RING_SIZE = 72;
const RING_RADIUS = 30;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function getUsageColor(percentage: number) {
  if (percentage >= 95) return 'hsl(var(--destructive))';
  if (percentage >= 80) return '#f59e0b';
  return 'hsl(var(--primary))';
}

export function StorageSummaryCards({ storageInfo }: StorageSummaryCardsProps) {
  const { usedMB, totalMB, remainingMB, percentage, plan, workspaceName } = storageInfo;

  const getProgressColor = () => {
    if (percentage >= 95) return 'bg-destructive';
    if (percentage >= 80) return 'bg-amber-500';
    return 'bg-primary';
  };

  const getStatusIcon = () => {
    if (percentage >= 95) return <AlertCircle className="w-5 h-5 text-destructive" />;
    if (percentage >= 80) return <AlertCircle className="w-5 h-5 text-amber-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 mb-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Workspace</p>
              <h2 className="text-xl sm:text-2xl font-bold">{workspaceName}</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Current Plan</p>
            <span className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
              {plan}
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">
              {formatStorageSize(usedMB)} of {formatStorageSize(totalMB)} used
            </p>
            <div className="mt-2 w-full max-w-xs bg-background/60 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                className={`h-full w-full origin-left rounded-full ${getProgressColor()}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            {formatStorageSize(remainingMB)} remaining
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border rounded-lg p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg sm:text-2xl font-semibold">{formatStorageSize(usedMB)}</span>
          </div>
          <p className="text-sm text-muted-foreground">Storage Used</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border rounded-lg p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <HardDrive className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-lg sm:text-2xl font-semibold">{formatStorageSize(totalMB)}</span>
          </div>
          <p className="text-sm text-muted-foreground">Total Limit</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border rounded-lg p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-lg sm:text-2xl font-semibold">{formatStorageSize(remainingMB)}</span>
          </div>
          <p className="text-sm text-muted-foreground">Remaining</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-muted rounded-lg">{getStatusIcon()}</div>
          </div>
          <div className="relative w-[72px] h-[72px] shrink-0 mx-auto">
            <svg viewBox="0 0 72 72" className="w-[72px] h-[72px] -rotate-90">
              <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="7"
              />
              <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                fill="none"
                stroke={getUsageColor(percentage)}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={
                  RING_CIRCUMFERENCE * (1 - Math.min(Math.max(percentage, 0), 100) / 100)
                }
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {percentage}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-2 mb-3">Usage</p>

          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              className={`h-full w-full origin-left rounded-full ${getProgressColor()}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}