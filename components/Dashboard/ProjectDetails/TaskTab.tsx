// components/Dashboard/ProjectDetails/TaskTab.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: string;
  assignees: Array<{
    user: {
      id: string;
      name: string;
      image?: string;
    };
  }>;
  _count: {
    comments: number;
  };
}

interface ProjectMember {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface TasksTabProps {
  project: {
    id: string;
    tasks: Task[];
    members: ProjectMember[];
    isAdmin: boolean;
  };
  showCreateTask: boolean;
  setShowCreateTask: (show: boolean) => void;
}

export default function TasksTab({ project, showCreateTask, setShowCreateTask }: TasksTabProps) {
  const groupedTasks = {
    TODO: project.tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: project.tasks.filter(t => t.status === 'IN_PROGRESS'),
    IN_REVIEW: project.tasks.filter(t => t.status === 'IN_REVIEW'),
    COMPLETED: project.tasks.filter(t => t.status === 'COMPLETED'),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreateTask(true)}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {Object.entries(groupedTasks).map(([status, tasks]) => (
          <div key={status} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-semibold text-foreground">
                {status.replace('_', ' ')} ({tasks.length})
              </h3>
            </div>
            <div className="space-y-2">
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              {tasks.length === 0 && (
                <div className="p-4 rounded-lg border border-dashed border-border text-center text-sm text-muted-foreground">
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showCreateTask && (
        <CreateTaskModal 
          projectId={project.id} 
          projectMembers={project.members}
          onClose={() => setShowCreateTask(false)} 
        />
      )}
    </div>
  );
}