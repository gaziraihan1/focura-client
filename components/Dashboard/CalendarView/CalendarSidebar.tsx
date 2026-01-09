import React, { useMemo } from 'react';
import { format, isToday, isTomorrow, isPast, parseISO, differenceInDays } from 'date-fns';
import { Task } from '@/hooks/useTask';
import { 
  AlertTriangle, 
  Calendar, 
  Clock,
  TrendingUp,
  Users,
  User
} from 'lucide-react';
import StatCard from './StatCard';
import TaskSection from './TaskSection';

interface CalendarSidebarProps {
  currentDate: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function CalendarSidebar({ currentDate, tasks, onTaskClick }: CalendarSidebarProps) {
  const analysis = useMemo(() => {
    const now = new Date();
    const overdue: Task[] = [];
    const today: Task[] = [];
    const tomorrow: Task[] = [];
    const upcoming: Task[] = [];
    const conflicts: Array<{ date: string; tasks: Task[] }> = [];

    tasks.forEach((task) => {
      const dueDate = task.dueDate ? parseISO(task.dueDate) : null;
      
      if (!dueDate) return;

      if (isPast(dueDate) && !isToday(dueDate) && task.status !== 'COMPLETED') {
        overdue.push(task);
      } else if (isToday(dueDate)) {
        today.push(task);
      } else if (isTomorrow(dueDate)) {
        tomorrow.push(task);
      } else if (differenceInDays(dueDate, now) <= 7 && differenceInDays(dueDate, now) > 1) {
        upcoming.push(task);
      }
    });

    const tasksByDate = new Map<string, Task[]>();
    tasks.forEach((task) => {
      if (!task.dueDate) return;
      const dateKey = format(parseISO(task.dueDate), 'yyyy-MM-dd');
      if (!tasksByDate.has(dateKey)) {
        tasksByDate.set(dateKey, []);
      }
      tasksByDate.get(dateKey)!.push(task);
    });

    tasksByDate.forEach((dateTasks, date) => {
      if (dateTasks.length >= 4) {
        conflicts.push({ date, tasks: dateTasks });
      }
    });

    return {
      overdue,
      today,
      tomorrow,
      upcoming,
      conflicts,
      totalPersonal: tasks.filter(t => t.assignees.length === 0).length,
      totalAssigned: tasks.filter(t => t.assignees.length > 0).length,
    };
  }, [tasks]);

  return (
    <aside className="w-80 border-l border-border bg-card overflow-y-auto scrollbar-hide">
      <div className="p-4 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">Time Overview</h2>
          <p className="text-sm text-muted-foreground">
            {format(currentDate, 'MMMM yyyy')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<User className="w-4 h-4" />}
            label="Personal"
            value={analysis.totalPersonal}
            color="text-blue-500"
          />
          <StatCard
            icon={<Users className="w-4 h-4" />}
            label="Assigned"
            value={analysis.totalAssigned}
            color="text-purple-500"
          />
        </div>

        {analysis.conflicts.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-semibold text-destructive">
                Time Conflicts Detected
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {analysis.conflicts.length} day(s) with heavy workload (4+ tasks)
            </p>
            <div className="space-y-2">
              {analysis.conflicts.slice(0, 3).map(({ date, tasks: conflictTasks }) => (
                <div key={date} className="text-xs">
                  <div className="font-medium text-foreground">
                    {format(parseISO(date), 'MMM d')} - {conflictTasks.length} tasks
                  </div>
                  <div className="text-muted-foreground">
                    Estimated: {conflictTasks.reduce((sum, t) => sum + (t.estimatedHours || 2), 0)}h
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.overdue.length > 0 && (
          <TaskSection
            title="Overdue"
            icon={<AlertTriangle className="w-4 h-4" />}
            count={analysis.overdue.length}
            tasks={analysis.overdue}
            onTaskClick={onTaskClick}
            variant="destructive"
          />
        )}

        {analysis.today.length > 0 && (
          <TaskSection
            title="Today"
            icon={<Calendar className="w-4 h-4" />}
            count={analysis.today.length}
            tasks={analysis.today}
            onTaskClick={onTaskClick}
            variant="primary"
          />
        )}

        {analysis.tomorrow.length > 0 && (
          <TaskSection
            title="Tomorrow"
            icon={<TrendingUp className="w-4 h-4" />}
            count={analysis.tomorrow.length}
            tasks={analysis.tomorrow}
            onTaskClick={onTaskClick}
            variant="default"
          />
        )}

        {analysis.upcoming.length > 0 && (
          <TaskSection
            title="This Week"
            icon={<Clock className="w-4 h-4" />}
            count={analysis.upcoming.length}
            tasks={analysis.upcoming}
            onTaskClick={onTaskClick}
            variant="muted"
          />
        )}

        {tasks.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              No time-bound tasks scheduled
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
