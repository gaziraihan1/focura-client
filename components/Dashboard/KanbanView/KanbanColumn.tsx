import React from 'react';
import { Task } from '@/hooks/useTask';
import { cn } from '@/lib/utils';
import { KanbanCard } from './KanbanCard';
import { ColumnConfig } from '@/hooks/useKanbanBoard';
import KanbanColumnHeader from './KanbanColumn/KanbanColumnHeader';
import EmptyKanbanColumnState from './KanbanColumn/EmptyKanbanColumnState';

interface KanbanColumnProps {
  column: ColumnConfig;
  tasks: Task[];
  stats: {
    count: number;
    avgDays: number;
    isBottleneck: boolean;
  };
  enforceWIP: boolean;
  onTaskClick: (task: Task) => void;
  isMobile?: boolean;
}

export function KanbanColumn({
  column,
  tasks,
  stats,
  enforceWIP,
  onTaskClick,
  isMobile = false,
}: KanbanColumnProps) {
  const isOverLimit = enforceWIP && stats.count > column.wipLimit;
  const isNearLimit = enforceWIP && stats.count > column.wipLimit * 0.8;
  const isBlocked = column.id === 'blocked';

  const getColumnStyle = () => {
    if (isBlocked) return 'bg-destructive/5';
    if (stats.isBottleneck) return 'bg-amber-500/5';
    return 'bg-card';
  };


  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border border-border overflow-hidden transition-all',
        isMobile ? 'w-full' : 'w-[280px] sm:w-[320px] shrink-0',
        getColumnStyle()
      )}
    >
      <KanbanColumnHeader isOverLimit={isOverLimit} isNearLimit={isNearLimit} column={column} stats={stats} enforceWIP={enforceWIP} isBlocked={isBlocked} taskLength={tasks.length}/>

      <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 scrollbar-hide">
        {tasks.length === 0 ? (
          <EmptyKanbanColumnState isBlocked columnId={column.id} />
        ) : (
          tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              isBlocked={isBlocked}
            />
          ))
        )}
      </div>
    </div>
  );
}