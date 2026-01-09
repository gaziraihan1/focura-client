"use client";

import React, { useState, useMemo } from 'react';
import { useTasks } from '@/hooks/useTask';
import { Task } from '@/hooks/useTask';
import { KanbanHeader } from '@/components/Dashboard/KanbanView/KanbanHeader';
import { ExecutionControlBar } from '@/components/Dashboard/KanbanView/ExecutionControlBar';
import { KanbanBoard } from '@/components/Dashboard/KanbanView/KanbanBoard';
import { InsightFooter } from '@/components/Dashboard/KanbanView/InsightFooter';
import { TaskDetailsModal } from '@/components/Dashboard/CalendarView/TaskDetailsModal';

export type KanbanScope = 'personal' | 'assigned' | 'team';
export type KanbanSort = 'priority' | 'aging' | 'recent' | 'comments';

export interface KanbanFilters {
  status?: string[];
  priority?: string[];
  assigneeId?: string;
  blockedOnly?: boolean;
  staleOnly?: boolean;
}

export default function KanbanPage() {
  const [scope, setScope] = useState<KanbanScope>('personal');
  const [filters, setFilters] = useState<KanbanFilters>({
    status: ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED'],
  });
  const [sort, setSort] = useState<KanbanSort>('priority');
  const [focusMode, setFocusMode] = useState(false);
  const [enforceWIP, setEnforceWIP] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data: allTasks = [], isLoading } = useTasks();

  const scopedTasks = useMemo(() => {
    switch (scope) {
      case 'personal':
        return allTasks.filter(task => task.assignees.length === 0);
      case 'assigned':
        return allTasks.filter(task => task.assignees.length > 0);
      case 'team':
        return allTasks;
      default:
        return allTasks;
    }
  }, [allTasks, scope]);

  const filteredTasks = useMemo(() => {
    let tasks = scopedTasks;

    if (filters.status && filters.status.length > 0) {
      tasks = tasks.filter(task => filters.status!.includes(task.status));
    }

    if (filters.priority && filters.priority.length > 0) {
      tasks = tasks.filter(task => filters.priority!.includes(task.priority));
    }

    if (filters.assigneeId) {
      tasks = tasks.filter(task => 
        task.assignees.some(a => a.user.id === filters.assigneeId)
      );
    }

    if (filters.blockedOnly) {
      tasks = tasks.filter(task => task.status === 'BLOCKED');
    }

    if (filters.staleOnly) {
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
      tasks = tasks.filter(task => new Date(task.updatedAt) < fiveDaysAgo);
    }

    return tasks;
  }, [scopedTasks, filters]);

  const displayTasks = useMemo(() => {
    if (!focusMode) return filteredTasks;

    return filteredTasks.filter(task => {
      const isHighPriority = task.priority === 'URGENT' || task.priority === 'HIGH';
      const isInProgress = task.status === 'IN_PROGRESS';
      const isAssignedToMe = task.assignees.length > 0; // In real app, check actual user ID

      return isHighPriority && (isInProgress || isAssignedToMe);
    });
  }, [filteredTasks, focusMode]);

  const taskCounts = useMemo(() => {
    const total = displayTasks.length;
    const inProgress = displayTasks.filter(t => t.status === 'IN_PROGRESS').length;
    const blocked = displayTasks.filter(t => t.status === 'BLOCKED').length;

    return { total, inProgress, blocked };
  }, [displayTasks]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <KanbanHeader
        scope={scope}
        onScopeChange={setScope}
        taskCounts={taskCounts}
        focusMode={focusMode}
        onFocusModeChange={setFocusMode}
      />

      <ExecutionControlBar
        filters={filters}
        onFiltersChange={setFilters}
        sort={sort}
        onSortChange={setSort}
        enforceWIP={enforceWIP}
        onEnforceWIPChange={setEnforceWIP}
        focusMode={focusMode}
      />

      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          tasks={displayTasks}
          sort={sort}
          enforceWIP={enforceWIP}
          focusMode={focusMode}
          onTaskClick={setSelectedTask}
          isLoading={isLoading}
        />
      </div>

      {showInsights && (
        <InsightFooter
          tasks={displayTasks}
          onClose={() => setShowInsights(false)}
        />
      )}

      {!showInsights && (
        <button
          onClick={() => setShowInsights(true)}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card border border-border px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all text-sm font-medium z-10"
        >
          Show Insights
        </button>
      )}

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}