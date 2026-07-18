import { Clock, Zap, Target, Flame, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import type { CalendarDayAggregate, GoalCheckpoint, SystemCalendarEvent } from '@/types/calendar.types';

export const getBurnoutColor = (score: number): string => {
  if (score > 1.5) return 'text-red-600 dark:text-red-400 bg-red-500/10';
  if (score > 1.2) return 'text-orange-600 dark:text-orange-400 bg-orange-500/10';
  if (score > 1.0) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10';
  return 'text-green-600 dark:text-green-400 bg-green-500/10';
};

export const getBurnoutLabel = (score: number): string => {
  if (score > 1.5) return 'Critical';
  if (score > 1.2) return 'High Risk';
  if (score > 1.0) return 'Moderate';
  return 'Low Risk';
};

function StatCardShell({
  icon,
  iconClass,
  title,
  children,
}: {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-xl border border-border bg-background">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg ${iconClass}`}>{icon}</div>
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      </div>
      {children}
    </div>
  );
}

export function PlannedHoursCard({ aggregate }: { aggregate?: CalendarDayAggregate }) {
  return (
    <StatCardShell icon={<Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />} iconClass="bg-blue-500/10" title="Planned Hours">
      {aggregate ? (
        <div>
          <p className="text-2xl font-bold">{aggregate.plannedHours.toFixed(1)}h</p>
          {aggregate.actualHours > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {aggregate.actualHours.toFixed(1)}h actual
            </p>
          )}
          {aggregate.totalTasks > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              {aggregate.totalTasks} task{aggregate.totalTasks !== 1 ? 's' : ''} scheduled
            </p>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground">No tasks scheduled</p>
      )}
    </StatCardShell>
  );
}

export function FocusSessionsCard({ aggregate }: { aggregate?: CalendarDayAggregate }) {
  return (
    <StatCardShell icon={<Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />} iconClass="bg-purple-500/10" title="Focus Sessions">
      {aggregate && aggregate.focusMinutes > 0 ? (
        <div>
          <p className="text-2xl font-bold">
            {Math.round(aggregate.focusMinutes / 60)}h {aggregate.focusMinutes % 60}m
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Deep work time
          </p>
          {aggregate.hasPrimaryFocus && (
            <div className="mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Primary focus day
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground">No focus sessions</p>
      )}
    </StatCardShell>
  );
}

export function GoalsCard({ goals }: { goals: GoalCheckpoint[] }) {
  return (
    <StatCardShell icon={<Target className="w-4 h-4 text-green-600 dark:text-green-400" />} iconClass="bg-green-500/10" title="Goals">
      {goals.length > 0 ? (
        <div className="space-y-2">
          <p className="text-2xl font-bold">{goals.length}</p>
          <div className="space-y-1.5 max-h-24 overflow-y-auto">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-start gap-2">
                {goal.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <Target className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {goal.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {goal.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">No goals set</p>
      )}
    </StatCardShell>
  );
}

export function BurnoutCard({ aggregate }: { aggregate?: CalendarDayAggregate }) {
  return (
    <StatCardShell icon={<Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />} iconClass="bg-orange-500/10" title="Burnout Level">
      {aggregate ? (
        <div>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${getBurnoutColor(aggregate.workloadScore)}`}>
            <p className="text-sm font-bold">
              {getBurnoutLabel(aggregate.workloadScore)}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Load score: {aggregate.workloadScore.toFixed(2)}
          </p>
          {aggregate.overCapacity && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">
              ⚠ Over capacity
            </p>
          )}
          {aggregate.criticalTasks > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {aggregate.criticalTasks} critical task{aggregate.criticalTasks !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground">No data</p>
      )}
    </StatCardShell>
  );
}

export function EventsCard({
  events,
  isReviewDay,
}: {
  events: SystemCalendarEvent[];
  isReviewDay?: boolean;
}) {
  return (
    <StatCardShell icon={<CalendarIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />} iconClass="bg-indigo-500/10" title="Events">
      {events.length > 0 ? (
        <div className="space-y-2">
          <p className="text-2xl font-bold">{events.length}</p>
          <div className="space-y-1.5 max-h-24 overflow-y-auto">
            {events.map((event) => (
              <div key={event.id} className="flex items-start gap-2">
                <CalendarIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">
                    {event.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {event.type.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {isReviewDay ? (
            <div>
              <p className="text-muted-foreground mb-2">Review Day</p>
              <p className="text-xs text-muted-foreground">
                Take time to review your progress
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">No events</p>
          )}
        </>
      )}
    </StatCardShell>
  );
}

export function DaySummaryBar({ aggregate }: { aggregate?: CalendarDayAggregate }) {
  if (!aggregate) return null;

  return (
    <div className="pt-4 border-t border-border">
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        {aggregate.dueTasks > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>{aggregate.dueTasks} due today</span>
          </div>
        )}
        {aggregate.milestoneCount > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>{aggregate.milestoneCount} milestone{aggregate.milestoneCount !== 1 ? 's' : ''}</span>
          </div>
        )}
        {aggregate.actualHours > 0 && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>
              {((aggregate.actualHours / aggregate.plannedHours) * 100).toFixed(0)}% completed
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
