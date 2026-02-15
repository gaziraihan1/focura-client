"use client";

import { motion } from 'framer-motion';
import { getProgressPercentage } from '@/utils/taskcard.utils';

interface TaskProgressBarProps {
  timeRemaining: number;
}

export function TaskProgressBar({ timeRemaining }: TaskProgressBarProps) {
  const progress = getProgressPercentage(timeRemaining);

  return (
    <div className="mt-4 mb-3">
      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-linear-to-r from-purple-500 via-purple-600 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
}