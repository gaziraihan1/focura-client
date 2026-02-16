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

export function TeamTaskBadges({
  task,
  timeInfo,
  timeProgress,
}: TeamTaskBadgesProps) {
  const { isOverdue, hoursUntilDue } = timeInfo;

  return (
    <div className="flex flex-wrap items-center gap-4 mt-3">
      {/* Project Badge */}
      {task.project && (
        <span
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{
            backgroundColor: `${task.project.color}20`,
            color: task.project.color,
          }}
        >
          {task.project.name}
        </span>
      )}

      {/* Status Badge */}
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
          task.status
        )}`}
      >
        {task.status.replace('_', ' ')}
      </span>

      {/* Created Time */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Timer size={14} />
        <span>Created {formatHoursSinceCreation(task.createdAt)} ago</span>
      </div>

      {/* Due Date with Hours */}
      {task.dueDate && hoursUntilDue !== null && (
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            isOverdue
              ? 'text-red-500'
              : hoursUntilDue < 24
              ? 'text-orange-500'
              : 'text-blue-500'
          }`}
        >
          <AlertCircle size={14} />
          <span>{formatTimeDuration(hoursUntilDue)}</span>
        </div>
      )}

      {/* Due Date (Simple) */}
      {task.dueDate && hoursUntilDue === null && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar size={14} />
          {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}

      {/* Time Progress */}
      {timeProgress !== null && task.estimatedHours && (
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-muted-foreground" />
          <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                timeProgress > 100
                  ? 'bg-red-500'
                  : timeProgress > 80
                  ? 'bg-orange-500'
                  : 'bg-blue-500'
              }`}
              style={{
                width: `${Math.min(100, timeProgress)}%`,
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{timeProgress}%</span>
        </div>
      )}

      {/* Assignees */}
      {task.assignees.length > 0 && (
        <TeamTaskAssignees assignees={task.assignees} />
      )}

      {/* Counts */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto">
        {task._count.comments > 0 && (
          <div className="flex items-center gap-1">
            <MessageCircle size={14} />
            <span>{task._count.comments}</span>
          </div>
        )}
        {task._count.subtasks > 0 && <span>{task._count.subtasks} ✓</span>}
        {task._count.files > 0 && <span>{task._count.files} 📎</span>}
      </div>
    </div>
  );
}