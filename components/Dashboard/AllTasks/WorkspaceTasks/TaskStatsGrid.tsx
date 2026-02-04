'use client';

import React from 'react';
import {
  ListFilter,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import StatCard from '@/components/Shared/StatCard';
import { TaskStats } from '@/hooks/useTask';

interface TaskStatsGridProps {
  stats: TaskStats;
}

export function TaskStatsGrid({ stats }: TaskStatsGridProps) {
  const cards = [
    {
      label: 'Total',
      value: stats.totalTasks || 0,
      icon: <ListFilter className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />,
      accentBg: 'bg-blue-50 dark:bg-blue-950',
      accentText: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'In Progress',
      value: stats.inProgress || 0,
      icon: <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" strokeWidth={2} />,
      accentBg: 'bg-purple-50 dark:bg-purple-950',
      accentText: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Completed',
      value: stats.completed || 0,
      icon: <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" strokeWidth={2} />,
      accentBg: 'bg-green-50 dark:bg-green-950',
      accentText: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Due Today',
      value: stats.dueToday || 0,
      icon: <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" strokeWidth={2} />,
      accentBg: 'bg-orange-50 dark:bg-orange-950',
      accentText: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Overdue',
      value: stats.overdue || 0,
      icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" strokeWidth={2} />,
      accentBg: 'bg-red-50 dark:bg-red-950',
      accentText: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          value={card.value}
          icon={card.icon}
          accentBg={card.accentBg}
          accentText={card.accentText}
        />
      ))}
    </div>
  );
}