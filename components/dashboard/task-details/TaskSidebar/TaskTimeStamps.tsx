import { Clock, Check } from 'lucide-react';

interface TaskTimestampsProps {
  createdAt: string;
  completedAt?: string | null;
}

export function TaskTimestamps({
  createdAt,
  completedAt,
}: TaskTimestampsProps) {
  return (
    <div className="pt-4 border-t border-border space-y-2">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <Clock size={14} />
        <span>Created {new Date(createdAt).toLocaleDateString()}</span>
      </div>
      {completedAt && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Check size={14} />
          <span>Completed {new Date(completedAt).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
}