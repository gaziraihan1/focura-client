import React from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Clock } from 'lucide-react';
import Image from 'next/image';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
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
  };
}

export default function TaskCard({ task }: TaskCardProps) {
  const router = useRouter();

  const priorityColors: Record<string, string> = {
    URGENT: 'bg-red-500',
    HIGH: 'bg-orange-500',
    MEDIUM: 'bg-yellow-500',
    LOW: 'bg-green-500',
  };

  return (
    <div
      onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
      className="p-4 rounded-lg bg-card border border-border hover:border-primary cursor-pointer transition space-y-3"
    >
      <div className="flex items-start justify-between">
        <h4 className="font-medium text-foreground line-clamp-2">{task.title}</h4>
        <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {task._count.comments > 0 && (
          <div className="flex items-center gap-1">
            <MessageSquare size={14} />
            <span>{task._count.comments}</span>
          </div>
        )}
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {task.assignees.length > 0 && (
        <div className="flex -space-x-2">
          {task.assignees.slice(0, 3).map(assignee => (
            <div key={assignee.user.id} className="relative">
              {assignee.user.image ? (
                <Image
                width={24}
                height={24}
                  src={assignee.user.image}
                  alt={assignee.user.name}
                  className="w-6 h-6 rounded-full border-2 border-card"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-medium">
                  {assignee.user.name.charAt(0)}
                </div>
              )}
            </div>
          ))}
          {task.assignees.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
