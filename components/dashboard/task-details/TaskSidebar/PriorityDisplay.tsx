import { TaskPriority } from '@/types/task.types';
import { getPriorityColor } from '@/utils/task.utils';

interface PriorityDisplayProps {
  priority: TaskPriority;
}

export function PriorityDisplay({ priority }: PriorityDisplayProps) {
  return (
    <div>
      <span className="block text-sm font-medium text-foreground mb-2">
        Priority
      </span>
      <div
        className={`px-4 py-2 rounded-lg border ${getPriorityColor(
          priority
        )} font-medium text-center`}
      >
        {priority}
      </div>
    </div>
  );
}