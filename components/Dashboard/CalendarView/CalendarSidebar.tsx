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
import { cn } from '@/lib/utils';

interface CalendarSidebarProps {
  currentDate: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function CalendarSidebar({ currentDate, tasks, onTaskClick }: CalendarSidebarProps) {
  // Analyze tasks
  const analysis = useMemo(() => {
    const now = new Date();
    const overdue: Task[] = [];
    const today: Task[] = [];
    const tomorrow: Task[] = [];
    const upcoming: Task[] = [];
    const conflicts: Array<{ date: string; tasks: Task[] }> = [];

    // Categorize tasks
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

    // Detect conflicts (multiple tasks on same day)
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
        {/* Header */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">Time Overview</h2>
          <p className="text-sm text-muted-foreground">
            {format(currentDate, 'MMMM yyyy')}
          </p>
        </div>

        {/* Stats */}
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

        {/* Conflicts Warning */}
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

        {/* Overdue Tasks */}
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

        {/* Today's Tasks */}
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

        {/* Tomorrow's Tasks */}
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

        {/* Upcoming This Week */}
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

        {/* Empty State */}
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

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-muted rounded-lg p-3">
      <div className={cn('flex items-center gap-2 mb-1', color)}>
        {icon}
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}

interface TaskSectionProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  variant: 'destructive' | 'primary' | 'default' | 'muted';
}

function TaskSection({ title, icon, count, tasks, onTaskClick, variant }: TaskSectionProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return 'text-destructive';
      case 'primary':
        return 'text-primary';
      case 'default':
        return 'text-foreground';
      case 'muted':
        return 'text-muted-foreground';
    }
  };

  return (
    <div>
      <div className={cn('flex items-center gap-2 mb-3', getVariantStyles())}>
        {icon}
        <h3 className="text-sm font-semibold">
          {title} <span className="text-muted-foreground">({count})</span>
        </h3>
      </div>
      <div className="space-y-2">
        {tasks.slice(0, 5).map((task) => (
          <button
            key={task.id}
            onClick={() => onTaskClick(task)}
            className="w-full text-left p-3 rounded-lg bg-muted hover:bg-accent transition-colors group"
          >
            <div className="flex items-start gap-2">
              {task.project && (
                <div
                  className="w-1 h-full rounded-full mt-1"
                  style={{ backgroundColor: task.project.color }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground truncate group-hover:text-primary">
                  {task.title}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {task.priority}
                  </span>
                  {task.assignees.length > 0 && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {task.assignees.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
        {tasks.length > 5 && (
          <div className="text-xs text-muted-foreground text-center py-2">
            +{tasks.length - 5} more
          </div>
        )}
      </div>
    </div>
  );
}