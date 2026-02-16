import { Flag } from 'lucide-react';
import { getPriorityColor } from '@/utils/task.utils';
import { TaskPriority } from '@/types/task.types';

interface TeamTaskHeaderProps {
  title: string;
  description?: string | null;
  priority: TaskPriority;
}

export function TeamTaskHeader({
  title,
  description,
  priority,
}: TeamTaskHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </div>

      <Flag size={18} className={getPriorityColor(priority)} />
    </div>
  );
}