import React from 'react';
import Link from 'next/link';
import { Activity } from '@/hooks/useActivity';
import { 
  CheckCircle2, 
  Circle, 
  FileText, 
  FolderKanban, 
  MessageSquare, 
  Pencil, 
  Plus, 
  Trash2, 
  Users,
  AlertCircle,
//   PlayCircle,
  Clock,
//   XCircle,
  ArrowRightLeft,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface ActivityItemProps {
  activity: Activity;
  showWorkspace?: boolean;
  compact?: boolean;
}

export function ActivityItem({ 
  activity, 
  // showWorkspace = true,
  compact = false,
}: ActivityItemProps) {
  const getActivityIcon = () => {
    const iconClass = "h-4 w-4";
    
    switch (activity.action) {
      case 'CREATED':
        return <Plus className={iconClass} />;
      case 'UPDATED':
        return <Pencil className={iconClass} />;
      case 'DELETED':
        return <Trash2 className={iconClass} />;
      case 'COMPLETED':
        return <CheckCircle2 className={iconClass} />;
      case 'ASSIGNED':
      case 'UNASSIGNED':
        return <Users className={iconClass} />;
      case 'COMMENTED':
        return <MessageSquare className={iconClass} />;
      case 'MOVED':
        return <ArrowRightLeft className={iconClass} />;
      case 'STATUS_CHANGED':
      case 'PRIORITY_CHANGED':
        return <AlertCircle className={iconClass} />;
      default:
        return <Circle className={iconClass} />;
    }
  };

  const getEntityIcon = () => {
    const iconClass = "h-3.5 w-3.5";
    
    switch (activity.entityType) {
      case 'TASK':
        return <FileText className={iconClass} />;
      case 'PROJECT':
        return <FolderKanban className={iconClass} />;
      case 'WORKSPACE':
        return <Users className={iconClass} />;
      default:
        return <Circle className={iconClass} />;
    }
  };

  const getActionColor = () => {
    switch (activity.action) {
      case 'CREATED':
        return 'text-green-600 dark:text-green-400';
      case 'COMPLETED':
        return 'text-blue-600 dark:text-blue-400';
      case 'DELETED':
        return 'text-red-600 dark:text-red-400';
      case 'UPDATED':
      case 'STATUS_CHANGED':
      case 'PRIORITY_CHANGED':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getEntityLink = () => {
    if (activity.task) {
      return `/dashboard/tasks/${activity.task.id}`;
    }
    if (activity.entityType === 'PROJECT') {
      return `/dashboard/projects/${activity.entityId}`;
    }
    if (activity.entityType === 'WORKSPACE') {
      return `/dashboard/workspaces/${activity.entityId}`;
    }
    return null;
  };

  const getActivityDescription = () => {
    const action = activity.action.toLowerCase().replace('_', ' ');
    const entityType = activity.entityType.toLowerCase();
    
    let description = `${action} ${entityType}`;
    
    if (activity.task) {
      description = `${action} task "${activity.task.title}"`;
    } else if (activity.entityType === 'PROJECT' && activity.metadata?.projectName) {
      description = `${action} project "${activity.metadata.projectName}"`;
    } else if (activity.entityType === 'WORKSPACE') {
      description = `${action} workspace "${activity.workspace.name}"`;
    }
    
    return description;
  };

  const entityLink = getEntityLink();
  const timeAgo = formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true });

  // User avatar initials
  const userInitials = activity.user.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div
      className={`group relative flex gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
        compact ? 'p-2' : ''
      }`}
    >
      {/* User Avatar */}
      <div className="shrink-0">
        <div className={`flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 ${compact ? 'h-6 w-6 text-xs' : 'h-8 w-8 text-sm'} font-medium text-gray-700 dark:text-gray-300`}>
          {activity.user.image ? (
            <Image
            width={100}
            height={100}
              src={activity.user.image}
              alt={activity.user.name || ''}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            userInitials
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1.5 overflow-hidden">
        {/* Main Description */}
        <div className="flex items-start gap-2">
          <div className={`mt-0.5 shrink-0 ${getActionColor()}`}>
            {getActivityIcon()}
          </div>
          
          <div className="flex-1 space-y-1">
            <p className={`leading-relaxed ${compact ? 'text-xs' : 'text-sm'}`}>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {activity.user.name}
              </span>
              {' '}
              <span className="text-gray-600 dark:text-gray-400">
                {getActivityDescription()}
              </span>
            </p>

            {/* Entity Details */}
            {activity.task && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-xs font-normal text-gray-700 dark:text-gray-300">
                  {getEntityIcon()}
                  <span className="truncate max-w-[200px]">
                    {activity.task.title}
                  </span>
                </span>
                
                {activity.task.project && (
                  <span 
                    className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-normal"
                    style={{ 
                      borderColor: activity.task.project.color,
                      backgroundColor: `${activity.task.project.color}10`,
                      color: activity.task.project.color,
                    }}
                  >
                    <FolderKanban className="h-3 w-3" />
                    <span className="truncate max-w-[150px]">
                      {activity.task.project.name}
                    </span>
                  </span>
                )}
              </div>
            )}

            {/* Metadata */}
            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {activity.metadata.changes && (
                  <span>
                    Updated: {Object.keys(activity.metadata.changes).join(', ')}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
          <Clock className="h-3 w-3" />
          <time dateTime={activity.createdAt}>{timeAgo}</time>
        </div>
      </div>

      {/* Link Overlay */}
      {entityLink && (
        <Link 
          href={entityLink}
          className="absolute inset-0 z-10"
          aria-label={`View ${activity.entityType.toLowerCase()}`}
        >
          <span className="sr-only">View details</span>
        </Link>
      )}
    </div>
  );
}