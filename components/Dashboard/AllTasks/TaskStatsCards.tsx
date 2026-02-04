'use client';

import React from 'react';
import { 
  User, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo, 
  TrendingUp,
  Users
} from 'lucide-react';
import StatCard from '@/components/Shared/StatCard';

interface TaskStats {
  personal: number;
  assigned: number;
  created?: number;
  dueToday: number;
  overdue: number;
  totalTasks?: number;
  inProgress?: number;
  completed?: number;
  byStatus?: Record<string, number>;
}

interface TaskStatsCardsProps {
  stats: TaskStats;
  activeTab?: 'all' | 'personal' | 'assigned';
}

interface CardDef {
  label: string;
  value: number;
  icon: React.ReactNode;
  accentBg: string;
  accentText: string;
}

export function TaskStatsCards({ stats, activeTab = 'all' }: TaskStatsCardsProps) {
  const getStatCards = (): CardDef[] => {
    switch (activeTab) {
      case 'personal':
        return [
          {
            label: 'Personal Tasks',
            value: stats.personal,
            icon: <User className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />,
            accentBg: 'bg-blue-50 dark:bg-blue-950',
            accentText: 'text-blue-600 dark:text-blue-400',
          },
          {
            label: 'In Progress',
            value: stats.inProgress ?? 0,
            icon: <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" strokeWidth={2} />,
            accentBg: 'bg-yellow-50 dark:bg-yellow-950',
            accentText: 'text-yellow-600 dark:text-yellow-400',
          },
          {
            label: 'Completed',
            value: stats.completed ?? 0,
            icon: <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" strokeWidth={2} />,
            accentBg: 'bg-green-50 dark:bg-green-950',
            accentText: 'text-green-600 dark:text-green-400',
          },
          {
            label: 'Overdue',
            value: stats.overdue,
            icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" strokeWidth={2} />,
            accentBg: 'bg-red-50 dark:bg-red-950',
            accentText: 'text-red-600 dark:text-red-400',
          },
        ];

      case 'assigned':
        return [
          {
            label: 'Assigned to Me',
            value: stats.assigned,
            icon: <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" strokeWidth={2} />,
            accentBg: 'bg-purple-50 dark:bg-purple-950',
            accentText: 'text-purple-600 dark:text-purple-400',
          },
          {
            label: 'In Progress',
            value: stats.inProgress ?? 0,
            icon: <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" strokeWidth={2} />,
            accentBg: 'bg-yellow-50 dark:bg-yellow-950',
            accentText: 'text-yellow-600 dark:text-yellow-400',
          },
          {
            label: 'Completed',
            value: stats.completed ?? 0,
            icon: <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" strokeWidth={2} />,
            accentBg: 'bg-green-50 dark:bg-green-950',
            accentText: 'text-green-600 dark:text-green-400',
          },
          {
            label: 'Overdue',
            value: stats.overdue,
            icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" strokeWidth={2} />,
            accentBg: 'bg-red-50 dark:bg-red-950',
            accentText: 'text-red-600 dark:text-red-400',
          },
        ];

      case 'all':
      default:
        return [
          {
            label: 'Total Tasks',
            value: stats.totalTasks ?? 0,
            icon: <ListTodo className="w-5 h-5 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />,
            accentBg: 'bg-indigo-50 dark:bg-indigo-950',
            accentText: 'text-indigo-600 dark:text-indigo-400',
          },
          {
            label: 'Personal',
            value: stats.personal,
            icon: <User className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />,
            accentBg: 'bg-blue-50 dark:bg-blue-950',
            accentText: 'text-blue-600 dark:text-blue-400',
          },
          {
            label: 'Assigned',
            value: stats.assigned,
            icon: <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" strokeWidth={2} />,
            accentBg: 'bg-purple-50 dark:bg-purple-950',
            accentText: 'text-purple-600 dark:text-purple-400',
          },
          {
            label: 'Due Today',
            value: stats.dueToday,
            icon: <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" strokeWidth={2} />,
            accentBg: 'bg-orange-50 dark:bg-orange-950',
            accentText: 'text-orange-600 dark:text-orange-400',
          },
          {
            label: 'Overdue',
            value: stats.overdue,
            icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" strokeWidth={2} />,
            accentBg: 'bg-red-50 dark:bg-red-950',
            accentText: 'text-red-600 dark:text-red-400',
          },
          {
            label: 'In Progress',
            value: stats.inProgress ?? 0,
            icon: <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" strokeWidth={2} />,
            accentBg: 'bg-yellow-50 dark:bg-yellow-950',
            accentText: 'text-yellow-600 dark:text-yellow-400',
          },
          {
            label: 'Completed',
            value: stats.completed ?? 0,
            icon: <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" strokeWidth={2} />,
            accentBg: 'bg-green-50 dark:bg-green-950',
            accentText: 'text-green-600 dark:text-green-400',
          },
        ];
    }
  };

  const statCards = getStatCards();

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${
      activeTab === 'all' ? 'lg:grid-cols-4 xl:grid-cols-7' : 'lg:grid-cols-4'
    } gap-4`}>
      {statCards.map((card) => (
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