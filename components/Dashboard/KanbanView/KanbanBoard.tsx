import React, { useMemo, useState } from 'react';
import { Task } from '@/hooks/useTask';
import { KanbanColumn } from './KanbanColumn';
import { differenceInDays, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { KanbanSort } from '@/app/(dashboard-pages)/dashboard/tasks/kanban-board/page';

interface KanbanBoardProps {
  tasks: Task[];
  sort: KanbanSort;
  enforceWIP: boolean;
  focusMode: boolean;
  onTaskClick: (task: Task) => void;
  isLoading: boolean;
}

export type ColumnConfig = {
  id: string;
  title: string;
  statuses: Task['status'][];
  wipLimit: number;
  color: string;
};

const COLUMNS: ColumnConfig[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    statuses: ['TODO'],
    wipLimit: 20,
    color: 'gray',
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    statuses: ['IN_PROGRESS'],
    wipLimit: 3,
    color: 'blue',
  },
  {
    id: 'review',
    title: 'Review',
    statuses: ['IN_REVIEW'],
    wipLimit: 5,
    color: 'purple',
  },
  {
    id: 'blocked',
    title: 'Blocked',
    statuses: ['BLOCKED'],
    wipLimit: 999,
    color: 'red',
  },
  {
    id: 'done',
    title: 'Done',
    statuses: ['COMPLETED'],
    wipLimit: 999,
    color: 'green',
  },
];

export function KanbanBoard({
  tasks,
  sort,
  enforceWIP,
  focusMode,
  onTaskClick,
  isLoading,
}: KanbanBoardProps) {
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0);

  const tasksByColumn = useMemo(() => {
    const grouped = new Map<string, Task[]>();
    
    COLUMNS.forEach(column => {
      const columnTasks = tasks.filter(task => 
        column.statuses.includes(task.status)
      );
      grouped.set(column.id, columnTasks);
    });

    return grouped;
  }, [tasks]);

  const sortedTasksByColumn = useMemo(() => {
    const sorted = new Map<string, Task[]>();

    tasksByColumn.forEach((tasks, columnId) => {
      const sortedTasks = [...tasks];

      switch (sort) {
        case 'priority':
          const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
          sortedTasks.sort((a, b) => {
            const aPriority = priorityOrder[a.priority] ?? 999;
            const bPriority = priorityOrder[b.priority] ?? 999;
            return aPriority - bPriority;
          });
          break;

        case 'aging':
          sortedTasks.sort((a, b) => {
            const aAge = differenceInDays(new Date(), parseISO(a.updatedAt));
            const bAge = differenceInDays(new Date(), parseISO(b.updatedAt));
            return bAge - aAge;
          });
          break;

        case 'recent':
          sortedTasks.sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          break;

        case 'comments':
          sortedTasks.sort((a, b) => b._count.comments - a._count.comments);
          break;
      }

      sorted.set(columnId, sortedTasks);
    });

    return sorted;
  }, [tasksByColumn, sort]);

  const columnStats = useMemo(() => {
    const stats = new Map<string, {
      count: number;
      avgDays: number;
      isBottleneck: boolean;
    }>();

    COLUMNS.forEach(column => {
      const tasks = sortedTasksByColumn.get(column.id) || [];
      const count = tasks.length;
      
      const totalDays = tasks.reduce((sum, task) => {
        return sum + differenceInDays(new Date(), parseISO(task.updatedAt));
      }, 0);
      const avgDays = tasks.length > 0 ? totalDays / tasks.length : 0;

      const isBottleneck = count > column.wipLimit * 0.8 && avgDays > 3;

      stats.set(column.id, { count, avgDays, isBottleneck });
    });

    return stats;
  }, [sortedTasksByColumn]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading board...</div>
      </div>
    );
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const visibleColumns = isMobile 
    ? [COLUMNS[currentColumnIndex]] 
    : focusMode 
    ? COLUMNS.filter(c => c.id !== 'backlog' && c.id !== 'done')
    : COLUMNS;

  return (
    <div className="h-full flex flex-col bg-background">
      {isMobile && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <button
            onClick={() => setCurrentColumnIndex(Math.max(0, currentColumnIndex - 1))}
            disabled={currentColumnIndex === 0}
            className="p-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            {COLUMNS[currentColumnIndex].title}
          </span>
          <button
            onClick={() => setCurrentColumnIndex(Math.min(COLUMNS.length - 1, currentColumnIndex + 1))}
            disabled={currentColumnIndex === COLUMNS.length - 1}
            className="p-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className={`h-full flex gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6 ${isMobile ? '' : 'min-w-max'}`}>
          {visibleColumns.map((column) => {
            const tasks = sortedTasksByColumn.get(column.id) || [];
            const stats = columnStats.get(column.id)!;

            return (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={tasks}
                stats={stats}
                enforceWIP={enforceWIP}
                onTaskClick={onTaskClick}
                isMobile={isMobile}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}