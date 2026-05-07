import {
  Timer,
  AlertCircle,
  TrendingUp,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { Task } from '@/hooks/useTask';
import { TeamTaskAssignees } from './TeamTaskAssignees';
import {
  getStatusColor,
  formatHoursSinceCreation,
  formatTimeDuration,
} from '@/utils/task.utils';
import { TaskTimeInfo } from '../TaskCardTeam';

interface TeamTaskBadgesProps {
  task: Task;
  timeInfo: TaskTimeInfo;
  timeProgress: number | null;
}

export function TeamTaskBadges({ task, timeInfo, timeProgress }: TeamTaskBadgesProps) {
  const { isOverdue, hoursUntilDue } = timeInfo;
  const progress = timeProgress !== null ? Math.min(100, timeProgress) : null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {task.project && (
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${task.project.color}18`,
            color: task.project.color,
            border: `1px solid ${task.project.color}30`,
          }}
        >
          {task.project.name}
        </span>
      )}

      <span
        className={`
          inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
          ${getStatusColor(task.status)}
          ring-1 ring-inset ring-current/20
        `}
      >
        {task.status.replace('_', ' ')}
      </span>

      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Timer size={12} strokeWidth={2} />
        Created {formatHoursSinceCreation(task.createdAt)} ago
      </span>

      {task.dueDate && hoursUntilDue !== null && (
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold ${
            isOverdue
              ? 'text-red-500'
              : hoursUntilDue < 24
              ? 'text-orange-500'
              : 'text-blue-500'
          }`}
        >
          <AlertCircle size={12} strokeWidth={2.2} />
          {formatTimeDuration(hoursUntilDue)}
        </span>
      )}

      {task.dueDate && hoursUntilDue === null && (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar size={12} strokeWidth={2} />
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      )}

      {progress !== null && task.estimatedHours && (
        <div className="flex items-center gap-2">
          <TrendingUp size={12} strokeWidth={2} className="text-muted-foreground" />
          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progress > 100
                  ? 'bg-red-500'
                  : progress > 80
                  ? 'bg-orange-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold tabular-nums text-muted-foreground">
            {progress}%
          </span>
        </div>
      )}

      {task.assignees.length > 0 && (
        <TeamTaskAssignees assignees={task.assignees} />
      )}

      <div className="flex items-center gap-2.5 text-xs text-muted-foreground ml-auto">
        {task._count.comments > 0 && (
          <span className="flex items-center gap-1">
            <MessageCircle size={12} strokeWidth={2} />
            <span className="font-medium">{task._count.comments}</span>
          </span>
        )}
        {task._count.subtasks > 0 && (
          <span className="flex items-center gap-1">
            <span>✓</span>
            <span className="font-medium">{task._count.subtasks}</span>
          </span>
        )}
        {task._count.files > 0 && (
          <span className="flex items-center gap-1">
            <span>📎</span>
            <span className="font-medium">{task._count.files}</span>
          </span>
        )}
      </div>
    </div>
  );
}