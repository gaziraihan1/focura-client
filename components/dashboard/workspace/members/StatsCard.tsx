'use client';

import { Users, FolderOpen, ShieldCheck, Award } from 'lucide-react';
import { TeamPageStats } from '@/hooks/useTeamPage';
import StatCard from '@/components/shared/StatCard';

export function StatsCards({ stats }: { stats: TeamPageStats }) {
  const cards = [
    {
      icon: <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />,
      label: 'Total Members',
      value: stats.totalMembers,
      accentBg: 'bg-blue-50 dark:bg-blue-950',
      accentText: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: <FolderOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />,
      label: 'Projects',
      value: stats.totalProjects,
      accentBg: 'bg-emerald-50 dark:bg-emerald-950',
      accentText: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={2} />,
      label: 'Admins',
      value: stats.adminCount,
      accentBg: 'bg-amber-50 dark:bg-amber-950',
      accentText: 'text-amber-600 dark:text-amber-400',
    },
    {
      icon: <Award className="w-5 h-5 text-violet-600 dark:text-violet-400" strokeWidth={2} />,
      label: 'Project Managers',
      value: stats.managerCount,
      accentBg: 'bg-violet-50 dark:bg-violet-950',
      accentText: 'text-violet-600 dark:text-violet-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}