"use client";

import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2,
  Circle,
  Pencil,
  Plus,
  Trash2,
  Users,
  MessageSquare,
  Clock,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";

interface ActivityMetadata {
  changes?: Record<string, unknown>;
  newStatus?: string;
  newPriority?: string;
  [key: string]: unknown;
}

interface Activity {
  id: string;
  action: string;
  entityType: string;
  createdAt: string;
  metadata?: ActivityMetadata;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

interface TaskActivityListProps {
  activities: Activity[];
}

export function TaskActivityList({ activities }: TaskActivityListProps) {
  console.log(activities)
  const getActivityIcon = (action: string) => {
    const iconClass = "h-4 w-4";
    
    switch (action) {
      case "CREATED":
        return <Plus className={iconClass} />;
      case "UPDATED":
        return <Pencil className={iconClass} />;
      case "DELETED":
        return <Trash2 className={iconClass} />;
      case "COMPLETED":
        return <CheckCircle2 className={iconClass} />;
      case "ASSIGNED":
      case "UNASSIGNED":
        return <Users className={iconClass} />;
      case "COMMENTED":
        return <MessageSquare className={iconClass} />;
      case "STATUS_CHANGED":
      case "PRIORITY_CHANGED":
        return <AlertCircle className={iconClass} />;
      default:
        return <Circle className={iconClass} />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATED":
        return "text-green-600 dark:text-green-400";
      case "COMPLETED":
        return "text-blue-600 dark:text-blue-400";
      case "DELETED":
        return "text-red-600 dark:text-red-400";
      case "UPDATED":
      case "STATUS_CHANGED":
      case "PRIORITY_CHANGED":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getActivityDescription = (activity: Activity) => {
    const action = activity.action.toLowerCase().replace("_", " ");
    
    switch (activity.action) {
      case "CREATED":
        return "created this";
      case "UPDATED":
        return activity.metadata?.changes 
          ? `updated ${Object.keys(activity.metadata.changes).join(", ")}`
          : "updated this";
      case "COMPLETED":
        return "completed this";
      case "STATUS_CHANGED":
        return activity.metadata?.newStatus
          ? `changed status to ${activity.metadata.newStatus}`
          : "changed the status";
      case "PRIORITY_CHANGED":
        return activity.metadata?.newPriority
          ? `changed priority to ${activity.metadata.newPriority}`
          : "changed the priority";
      case "ASSIGNED":
        return "was assigned to this task";
      case "UNASSIGNED":
        return "was unassigned from this task";
      case "COMMENTED":
        return "added a comment";
      default:
        return action;
    }
  };

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
          <Clock className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">No activity yet</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Activity will appear here as changes are made
        </p>
      </div>
    );
  }

  // Group by date
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = new Date(activity.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedActivities).map(([date, dateActivities]) => (
        <div key={date}>
          {/* Date Header */}
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {date}
            </h4>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </div>

          {/* Activities */}
          <div className="space-y-3">
            {dateActivities.map((activity) => {
              const userInitials = activity.user.name?.charAt(0).toUpperCase() || "U";
              const timeAgo = formatDistanceToNow(new Date(activity.createdAt), {
                addSuffix: true,
              });

              return (
                <div
                  key={activity.id}
                  className="flex gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {/* User Avatar */}
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {activity.user.image ? (
                        <Image
                        width={100}
                        height={100}
                          src={activity.user.image}
                          alt={activity.user.name || ""}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        userInitials
                      )}
                    </div>
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <div className={`mt-0.5 shrink-0 ${getActionColor(activity.action)}`}>
                        {getActivityIcon(activity.action)}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {activity.user.name}
                          </span>
                          {" "}
                          <span className="text-gray-600 dark:text-gray-400">
                            {getActivityDescription(activity)} {activity.entityType.toLowerCase()}
                          </span>
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
            })}
          </div>
        </div>
      ))}
    </div>
  );
}