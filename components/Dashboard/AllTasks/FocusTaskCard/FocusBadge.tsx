"use client";

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { formatTime } from '@/utils/taskcard.utils';

interface FocusBadgeProps {
  timeRemaining: number;
}

export function FocusBadge({ timeRemaining }: FocusBadgeProps) {
  return (
    <motion.div
      className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full bg-linear-to-r from-purple-500 to-purple-600 text-white text-xs font-bold shadow-lg shadow-purple-500/50 flex items-center gap-1.5"
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <Zap className="w-3.5 h-3.5" />
      <span>FOCUS</span>
      <span className="tabular-nums">{formatTime(timeRemaining)}</span>
    </motion.div>
  );
}