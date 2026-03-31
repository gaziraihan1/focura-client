// components/TaskActivity/ActivityItem.tsx
import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';
import { UserAvatar } from './UserAvatar';
import { ActivityIcon } from './ActivityIcon';
import {
  getActivityIcon,
  getActionColor,
  getActivityDescription,
} from '@/utils/task-activity.utils';
import type { Activity } from '@/types/task-activity.types';

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const timeAgo = formatDistanceToNow(new Date(activity.createdAt), {
    addSuffix: true,
  });

  const iconName = getActivityIcon(activity.action);
  const colorClass = getActionColor(activity.action);
  const description = getActivityDescription(
    activity.action,
    activity.metadata,
    activity.entityType
  );

  return (
    <div className="flex gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      {/* User Avatar */}
      <UserAvatar user={activity.user} />

      {/* Activity Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <div className={`mt-0.5 shrink-0 ${colorClass}`}>
            <ActivityIcon iconName={iconName} />
          </div>

          <div className="flex-1">
            <p className="text-sm leading-relaxed">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {activity.user.name}
              </span>{' '}
              <span className="text-gray-600 dark:text-gray-400">
                {description}
              </span>{' '}
              
              {(activity.metadata?.subtaskTitle || activity.metadata?.taskTitle) && (
    <span className="font-medium text-gray-900 dark:text-gray-100">
      {activity.metadata?.subtaskTitle ?? activity.metadata?.taskTitle}
    </span>
  )}
            </p>

            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <time className="text-xs text-gray-500 dark:text-gray-400">
                {timeAgo}
              </time>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}