import React from 'react';
import { Task } from '@/hooks/useTask';
import { format, parseISO } from 'date-fns';
import {
  X,
//   Calendar,
  Clock,
  User,
  Users,
  Flag,
  FileText,
  MessageSquare,
//   Paperclip,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetailsModal({ task, onClose }: TaskDetailsModalProps) {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'COMPLETED';

  const getStatusColor = () => {
    switch (task.status) {
      case 'COMPLETED':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'IN_PROGRESS':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'IN_REVIEW':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'BLOCKED':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'CANCELLED':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'URGENT':
        return 'text-red-600';
      case 'HIGH':
        return 'text-orange-500';
      case 'MEDIUM':
        return 'text-blue-500';
      case 'LOW':
        return 'text-gray-500';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-border p-6 bg-muted/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {task.title}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Status Badge */}
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium border',
                    getStatusColor()
                  )}
                >
                  {task.status.replace('_', ' ')}
                </span>

                {/* Priority Badge */}
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium bg-muted border border-border',
                    getPriorityColor()
                  )}
                >
                  {task.priority}
                </span>

                {/* Overdue Indicator */}
                {isOverdue && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Overdue
                  </span>
                )}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-hide">
          <div className="space-y-6">
            {/* Description */}
            {task.description && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Description
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                  {task.description}
                </p>
              </div>
            )}

            {/* Time Information */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  Time Details
                </h3>
              </div>
              <div className="space-y-2 pl-6">
                {task.startDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span className="font-medium text-foreground">
                      {format(parseISO(task.startDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
                {task.dueDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span
                      className={cn(
                        'font-medium',
                        isOverdue ? 'text-destructive' : 'text-foreground'
                      )}
                    >
                      {format(parseISO(task.dueDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
                {task.estimatedHours && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Estimated Time:
                    </span>
                    <span className="font-medium text-foreground">
                      {task.estimatedHours}h
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium text-foreground">
                    {format(parseISO(task.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>

            {/* People */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  People
                </h3>
              </div>
              <div className="space-y-3 pl-6">
                {/* Creator */}
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Created by
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {task.createdBy.name}
                    </span>
                  </div>
                </div>

                {/* Assignees */}
                {task.assignees.length > 0 && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Assigned to
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {task.assignees.map((assignee) => (
                        <div
                          key={assignee.user.id}
                          className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg"
                        >
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {assignee.user.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Personal Task Indicator */}
                {task.assignees.length === 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-600 font-medium">
                      Personal Task
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Project */}
            {task.project && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Flag className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Project
                  </h3>
                </div>
                <div className="pl-6">
                  <div className="flex items-center gap-3 bg-muted rounded-lg p-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: task.project.color }}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        {task.project.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {task.project.workspace.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Counts */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  Activity
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-3 pl-6">
                <div className="bg-muted rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {task._count.comments}
                  </div>
                  <div className="text-xs text-muted-foreground">Comments</div>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {task._count.subtasks}
                  </div>
                  <div className="text-xs text-muted-foreground">Subtasks</div>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {task._count.files}
                  </div>
                  <div className="text-xs text-muted-foreground">Files</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}