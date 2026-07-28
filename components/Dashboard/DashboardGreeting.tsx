'use client';

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', emoji: '☀️' };
  if (h < 17) return { text: 'Good afternoon', emoji: '🌤️' };
  return { text: 'Good evening', emoji: '🌙' };
}

function getDateStr() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function getDayOfWeek() {
  return new Date().toLocaleDateString('en-US', { weekday: 'short' });
}

interface DashboardGreetingProps {
  userName?: string | null;
  workspaceCount?: number;
}

export function DashboardGreeting({
  userName,
  workspaceCount = 0,
}: DashboardGreetingProps) {
  const [greeting] = useState(getGreeting);
  const [dateStr] = useState(getDateStr);
  const [dayStr] = useState(getDayOfWeek);
  return (
    <div className="bg-card border rounded-xl p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
              {greeting.text}{userName ? `, ${userName.split(' ')[0]}` : ''}
            </h1>
            <span className="text-lg">
              {greeting.emoji}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Here&apos;s your Focura hub — pick a workspace to dive in.
          </p>              {workspaceCount > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                <span>
                  {workspaceCount} workspace{workspaceCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground">Today</p>
            <p className="text-sm font-medium text-foreground">{dateStr}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
            <span className="text-[10px] font-medium text-primary leading-none">{dayStr}</span>
            <span className="text-sm font-bold text-primary leading-tight">
              {new Date().getDate()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}