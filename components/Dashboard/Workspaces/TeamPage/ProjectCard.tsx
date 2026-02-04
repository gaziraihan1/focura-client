'use client';

import React from 'react';
import { ChevronDown, Users, CheckCircle2, Circle } from 'lucide-react';
import { ProjectSummary } from '@/hooks/useTeamPage';

// Status / priority colour helpers
const STATUS_COLOURS: Record<string, string> = {
  PLANNING:  'bg-slate-100  text-slate-600  dark:bg-slate-800  dark:text-slate-300',
  ACTIVE:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  ON_HOLD:   'bg-amber-100  text-amber-700  dark:bg-amber-950  dark:text-amber-300',
  COMPLETED: 'bg-blue-100   text-blue-700   dark:bg-blue-950   dark:text-blue-300',
  ARCHIVED:  'bg-gray-100   text-gray-500   dark:bg-gray-800   dark:text-gray-400',
};

const PRIORITY_COLOURS: Record<string, string> = {
  URGENT: 'text-red-600   dark:text-red-400',
  HIGH:   'text-orange-600 dark:text-orange-400',
  MEDIUM: 'text-amber-600  dark:text-amber-400',
  LOW:    'text-green-600  dark:text-green-400',
};

interface ProjectCardProps {
  project: ProjectSummary;
  isExpanded: boolean;
  onToggle: () => void;
  /** Rendered as children when expanded (the members panel) */
  children?: React.ReactNode;
}

export function ProjectCard({ project, isExpanded, onToggle, children }: ProjectCardProps) {
  const completionPct =
    project.taskCount > 0
      ? Math.round((project.completedTasks / project.taskCount) * 100)
      : 0;

  const statusClass = STATUS_COLOURS[project.status] ?? STATUS_COLOURS.PLANNING;
  const priorityClass = PRIORITY_COLOURS[project.priority] ?? PRIORITY_COLOURS.MEDIUM;

  return (
    <div className={[
      'rounded-xl border border-border bg-card shadow-sm',
      'transition-shadow duration-200',
      isExpanded ? 'ring-2 ring-ring shadow-md' : 'hover:shadow-md',
    ].join(' ')}>
      {/* ── card header (always visible, clickable) ─────────────────────── */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-4"
      >
        <div className="flex items-start justify-between gap-3">
          {/* left: icon stub + title + description */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* colour dot representing project.color */}
              <span
                className="inline-block w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: project.color || '#6366f1' }}
              />
              <h3 className="text-sm font-semibold text-foreground truncate">
                {project.name}
              </h3>
              {/* status pill */}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
                {project.status.charAt(0) + project.status.slice(1).toLowerCase().replace('_', ' ')}
              </span>
            </div>
            {project.description && (
              <p className="mt-1 text-xs text-muted-foreground truncate">{project.description}</p>
            )}
          </div>

          {/* chevron */}
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            strokeWidth={2}
          />
        </div>

        {/* ── meta row ──────────────────────────────────────────────────── */}
        <div className="mt-3 flex items-center justify-between gap-4 flex-wrap">
          {/* members + tasks counts */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" strokeWidth={2} />
              {project.memberCount} member{project.memberCount !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <Circle className="w-3.5 h-3.5" strokeWidth={2} />
              {project.taskCount} task{project.taskCount !== 1 ? 's' : ''}
            </span>
          </div>

          {/* priority */}
          <span className={`text-xs font-semibold ${priorityClass}`}>
            {project.priority.charAt(0) + project.priority.slice(1).toLowerCase()}
          </span>
        </div>

        {/* ── progress bar ──────────────────────────────────────────────── */}
        <div className="mt-2.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} />
              {completionPct}% complete
            </span>
            <span>{project.completedTasks}/{project.taskCount}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </button>

      {/* ── expandable members panel ────────────────────────────────────── */}
      {isExpanded && (
        <div className="border-t border-border/60">
          {children}
        </div>
      )}
    </div>
  );
}