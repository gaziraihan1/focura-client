import { Flag } from 'lucide-react';
import { getPriorityColor } from '@/utils/taskcard.utils';
import { TaskPriority } from '@/types/task.types';

interface TaskHeaderProps {
  title: string;
  description?: string | null;
  priority: TaskPriority;
}

export function TaskHeader({ title, description, priority }: TaskHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <h3 className="font-bold text-lg text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
            {description}
          </p>
        )}
      </div>

      <Flag size={20} className={getPriorityColor(priority)} />
    </div>
  );
}