// components/TaskDetail/TaskSidebar/TaskDetailItem.tsx
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface TaskDetailItemProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
}

export function TaskDetailItem({
  icon: Icon,
  label,
  value,
}: TaskDetailItemProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={16} className="text-muted-foreground" />
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}