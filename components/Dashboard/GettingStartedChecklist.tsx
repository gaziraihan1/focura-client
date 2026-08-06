'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Circle,
  ArrowRight,
  Rocket,
  Sparkles,
  PartyPopper,
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  href?: string;
  completed: boolean;
}

interface GettingStartedChecklistProps {
  workspaces: Array<{ id: string; name: string; slug: string }>;
  totalProjects?: number;
  totalMembers?: number;
}

export function GettingStartedChecklist({
  workspaces,
  totalProjects = 0,
  totalMembers = 0,
}: GettingStartedChecklistProps) {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('focura-onboarding-dismissed') === 'true'
  );

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem('focura-onboarding-dismissed', 'true');
  };

  const hasWorkspace = workspaces.length > 0;
  const hasTeam = totalMembers > 1;

  // If user has workspaces and projects, they're past onboarding
  const isPastOnboarding = hasWorkspace && totalProjects > 0 && hasTeam;

  const items: ChecklistItem[] = [
    {
      id: 'workspace',
      label: 'Create a workspace',
      description: 'Your team hub for projects and tasks',
      href: '/dashboard/workspaces/new-workspace',
      completed: hasWorkspace,
    },
    {
      id: 'project',
      label: 'Start your first project',
      description: 'Group related tasks into a project',
      href: workspaces[0] ? `/dashboard/workspaces/${workspaces[0].slug}` : '/dashboard/workspaces',
      completed: totalProjects > 0,
    },
    {
      id: 'task',
      label: 'Create a task',
      description: 'Break work into trackable pieces',
      href: workspaces[0] ? `/dashboard/workspaces/${workspaces[0].slug}` : '/dashboard/tasks/add-task',
      completed: totalProjects > 0, // If they have projects, they likely created tasks
    },
    {
      id: 'invite',
      label: 'Invite a teammate',
      description: 'Collaborate in real-time',
      href: hasWorkspace ? `/dashboard/workspaces/${workspaces[0]?.slug}` : '/dashboard/workspaces',
      completed: hasTeam,
    },
  ];

  const completedCount = items.filter((i) => i.completed).length;
  const allDone = completedCount === items.length;
  const progress = Math.round((completedCount / items.length) * 100);

  if (dismissed || allDone) {
    return null;
  }

  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Rocket className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Get started</h2>
            <p className="text-xs text-muted-foreground">
              {completedCount} of {items.length} complete
            </p>
          </div>
        </div>          <button
          onClick={dismiss}
          className="text-xs text-muted-foreground hover:text-foreground transition"
        >
          Dismiss
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-4">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-colors duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="px-5 pb-5 space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={`group flex items-center gap-3 p-3 rounded-lg transition-colors ${
              item.completed
                ? 'bg-muted/50'
                : 'hover:bg-accent/50'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                item.completed
                  ? 'bg-green-500 text-white'
                  : 'border-2 border-border text-transparent'
              }`}
            >
              {item.completed && <Check className="w-3 h-3" strokeWidth={3} />}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${
                  item.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                }`}
              >
                {item.label}
              </p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
            {!item.completed && item.href && (
              <Link
                href={item.href}
                className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition opacity-0 group-hover:opacity-100"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
