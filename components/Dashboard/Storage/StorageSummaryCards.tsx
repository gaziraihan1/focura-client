'use client';

import { motion } from 'framer-motion';
import { Database, HardDrive, AlertCircle, CheckCircle, Building2 } from 'lucide-react';
import { StorageInfo } from '@/hooks/useStorage';
import { formatStorageSize } from '@/hooks/useStoragePage';

interface StorageSummaryCardsProps {
  storageInfo: StorageInfo;
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
      {/* Workspace Name Card */}
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
              <h2 className="text-2xl font-bold">{workspaceName}</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
            <span className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
              {plan}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Storage Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Used Storage */}
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
            <span className="text-2xl font-semibold">{formatStorageSize(usedMB)}</span>
          </div>
          <p className="text-sm text-muted-foreground">Storage Used</p>
        </motion.div>

        {/* Total Storage */}
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
            <span className="text-2xl font-semibold">{formatStorageSize(totalMB)}</span>
          </div>
          <p className="text-sm text-muted-foreground">Total Limit</p>
        </motion.div>

        {/* Remaining Storage */}
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
            <span className="text-2xl font-semibold">{formatStorageSize(remainingMB)}</span>
          </div>
          <p className="text-sm text-muted-foreground">Remaining</p>
        </motion.div>

        {/* Usage Percentage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border rounded-lg p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-muted rounded-lg">{getStatusIcon()}</div>
            <span className="text-2xl font-semibold">{percentage}%</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Usage</p>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${getProgressColor()}`}
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}