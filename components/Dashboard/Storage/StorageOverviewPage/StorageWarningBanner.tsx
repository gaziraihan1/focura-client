// components/StorageOverview/StorageWarningBanner.tsx
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import type { StorageWarning } from '@/types/storage-overview.types';

interface StorageWarningBannerProps {
  warning: StorageWarning;
}

export function StorageWarningBanner({ warning }: StorageWarningBannerProps) {
  if (warning.level === 'normal' || !warning.message) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 p-4 rounded-lg border ${
        warning.level === 'critical'
          ? 'bg-destructive/10 border-destructive/30 text-destructive'
          : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-500'
      }`}
    >
      <AlertTriangle className="w-5 h-5 shrink-0" />
      <p className="text-sm font-medium">{warning.message}</p>
    </motion.div>
  );
}