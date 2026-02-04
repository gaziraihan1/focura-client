'use client';

import React from 'react';
import { Users, FolderOpen, ShieldCheck, Award } from 'lucide-react';
import { TeamPageStats } from '@/hooks/useTeamPage';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  /** Subtle accent colour class applied to the icon wrapper background */
  accentBg: string;
  /** Accent text colour for the value */
  accentText: string;
}

function StatCard({ icon, label, value, accentBg, accentText }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* subtle gradient wash in the top-right corner */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 bg-current" />

      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p className={`mt-1.5 text-2xl font-bold ${accentText}`}>{value}</p>
        </div>

        <div className={`rounded-xl p-2.5 ${accentBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function StatsCards({ stats }: { stats: TeamPageStats }) {
  const cards: StatCardProps[] = [
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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}