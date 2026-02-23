import { motion } from 'framer-motion';
import { Clock, Calendar, User, Folder } from 'lucide-react';
import Link from 'next/link';
import { Task } from '@/types/task.types';
import { TaskDetailItem } from './TaskDetailItem';
import { TaskAssigneesList } from './TaskAssigneesList';
import { TaskTimestamps } from './TaskTimeStamps';

interface TaskDetailsSectionProps {
  task: Task;
}

export function TaskDetailsSection({ task }: TaskDetailsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-xl bg-card border border-border p-6 space-y-4"
    >
      <h3 className="font-semibold text-foreground mb-4">Details</h3>

      {task.project && (
        <div className="flex items-center gap-3">
          <Folder size={16} className="text-muted-foreground" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Project</p>
            <Link
              className="font-medium hover:underline"
              style={{ color: task.project.color }}
              href={`/dashboard/workspaces/${task.project.workspace?.slug}/projects/${task.projectId}`}
            >
              {task.project.name}
            </Link>
          </div>
        </div>
      )}

      {task.estimatedHours && (
        <TaskDetailItem
          icon={Clock}
          label="Estimated Hours"
          value={`${task.estimatedHours}h`}
        />
      )}

      {task.startDate && (
        <TaskDetailItem
          icon={Calendar}
          label="Start Date"
          value={new Date(task.startDate).toLocaleDateString()}
        />
      )}

      {task.dueDate && (
        <TaskDetailItem
          icon={Calendar}
          label="Due Date"
          value={new Date(task.dueDate).toLocaleDateString()}
        />
      )}

      <TaskDetailItem
        icon={User}
        label="Created By"
        value={task.createdBy.name}
      />

      <TaskAssigneesList assignees={task.assignees || []} />

      <TaskTimestamps
        createdAt={task.createdAt}
        completedAt={task.completedAt}
      />
    </motion.div>
  );
}