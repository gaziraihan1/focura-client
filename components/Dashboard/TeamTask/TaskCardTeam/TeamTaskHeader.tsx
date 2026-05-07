import { Flag } from 'lucide-react';
import { getPriorityColor } from '@/utils/task.utils';
import { TaskPriority } from '@/types/task.types';

interface TeamTaskHeaderProps {
  title: string;
  description?: string | null;
  priority: TaskPriority;
}

export function TeamTaskHeader({ title, description, priority }: TeamTaskHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <Flag size={16} strokeWidth={2.2} className={`${getPriorityColor(priority)} shrink-0 mt-0.5`} />
    </div>
  );
}