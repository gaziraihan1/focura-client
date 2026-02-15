import {
  Folder,
  Timer,
  AlertCircle,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { Task } from '@/hooks/useTask';
import { Avatar } from '@/components/Shared/Avatar';
import {
  getStatusColor,
  getTimeStatusColor,
  formatHoursSinceCreation,
  formatTimeDuration,
  getProgressBarColor,
} from '@/utils/taskcard.utils';

interface TaskMetadataProps {
  task: Task;
}

export function TaskMetadata({ task }: TaskMetadataProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 mt-3">
      {/* Project */}
      {task.project && (
        <div className="flex items-center gap-2">
          <Folder size={14} className="text-muted-foreground" />
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              backgroundColor: `${task.project.color}20`,
              color: task.project.color,
            }}
          >
            {task.project.name}
          </span>
        </div>
      )}

      {/* Status */}
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(
          task.status
        )} border border-current/30`}
      >
        {task.status.replace('_', ' ')}
      </span>

      {/* Time Tracking */}
      {task.timeTracking && (
        <>
          {/* Created */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Timer size={14} />
            <span>
              Created {formatHoursSinceCreation(task.timeTracking.hoursSinceCreation)} ago
            </span>
          </div>

          {/* Time Until Due */}
          {task.timeTracking.hoursUntilDue !== null && (
            <div
              className={`flex items-center gap-1.5 text-xs font-bold ${getTimeStatusColor(
                task.timeTracking
              )}`}
            >
              <AlertCircle size={14} />
              <span>{formatTimeDuration(task.timeTracking.hoursUntilDue)}</span>
            </div>
          )}

          {/* Time Progress */}
          {task.timeTracking.timeProgress !== null && task.estimatedHours && (
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-muted-foreground" />
              <div className="w-24 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${getProgressBarColor(
                    task.timeTracking.timeProgress
                  )}`}
                  style={{
                    width: `${Math.min(100, task.timeTracking.timeProgress)}%`,
                  }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {task.timeTracking.timeProgress}%
              </span>
            </div>
          )}
        </>
      )}

      {/* Due Date (fallback) */}
      {task.dueDate && !task.timeTracking && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar size={14} />
          {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}

      {/* Assignees */}
      {task.assignees && task.assignees.length > 0 && (
        <div className="flex -space-x-2">
          {task.assignees.slice(0, 3).map((assignee) => (
            <div
              key={assignee.user.id}
              className="ring-2 ring-purple-500/30 rounded-full"
            >
              <Avatar
                name={assignee.user.name}
                image={assignee.user.image}
                size="sm"
              />
            </div>
          ))}
          {task.assignees.length > 3 && (
            <div className="w-7 h-7 rounded-full bg-purple-500/20 border-2 border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-600 dark:text-purple-400">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>
      )}

      {/* Counts */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto">
        {task._count?.comments > 0 && (
          <span className="font-medium">{task._count.comments} 💬</span>
        )}
        {task._count?.subtasks > 0 && (
          <span className="font-medium">{task._count.subtasks} ✓</span>
        )}
        {task._count?.files > 0 && (
          <span className="font-medium">{task._count.files} 📎</span>
        )}
      </div>
    </div>
  );
}