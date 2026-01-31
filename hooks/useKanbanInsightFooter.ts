import { useMemo } from "react";
import { Task } from "./useTask";
import { differenceInDays, parseISO, startOfWeek } from "date-fns";

type KanbanInsightFooterProps = {
    tasks: Task[]
}

export const useKanbanInsightFooter = ({tasks}: KanbanInsightFooterProps) => {
    const insights = useMemo(() => {
    const completed = tasks.filter(t => t.status === 'COMPLETED');
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS');
    const blocked = tasks.filter(t => t.status === 'BLOCKED');

    const avgCycleTime = 4.2;

    const weekStart = startOfWeek(new Date());
    const completedThisWeek = completed.filter(t => 
      parseISO(t.updatedAt) >= weekStart
    ).length;

    const columnCounts = new Map<string, { count: number; avgAge: number }>();
    
    ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED'].forEach(status => {
      const columnTasks = tasks.filter(t => t.status === status);
      const totalAge = columnTasks.reduce((sum, t) => 
        sum + differenceInDays(new Date(), parseISO(t.updatedAt)), 0
      );
      const avgAge = columnTasks.length > 0 ? totalAge / columnTasks.length : 0;
      
      columnCounts.set(status, {
        count: columnTasks.length,
        avgAge
      });
    });

    let bottleneckColumn = 'None';
    let maxScore = 0;
    columnCounts.forEach((stats, status) => {
      const score = stats.count * stats.avgAge;
      if (score > maxScore) {
        maxScore = score;
        bottleneckColumn = status;
      }
    });

    const activeTasks = tasks.filter(t => 
      t.status !== 'COMPLETED' && t.status !== 'CANCELLED'
    );
    const oldestTask = activeTasks.sort((a, b) => 
      parseISO(a.updatedAt).getTime() - parseISO(b.updatedAt).getTime()
    )[0];
    
    const oldestAge = oldestTask 
      ? differenceInDays(new Date(), parseISO(oldestTask.updatedAt))
      : 0;

    return {
      avgCycleTime,
      completedThisWeek,
      bottleneckColumn,
      oldestTaskAge: oldestAge,
      oldestTaskTitle: oldestTask?.title || 'N/A',
      totalBlocked: blocked.length,
      totalInProgress: inProgress.length,
    };
  }, [tasks]);
  return {
    insights
  }
}