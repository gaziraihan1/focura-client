import { User } from 'lucide-react';
import { Avatar } from '@/components/Shared/Avatar';

interface Assignee {
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

interface TaskAssigneesListProps {
  assignees: Assignee[];
}

export function TaskAssigneesList({ assignees }: TaskAssigneesListProps) {
  if (assignees.length === 0) return null;

  return (
    <div className="flex items-start gap-3">
      <User size={16} className="text-muted-foreground mt-1" />
      <div className="flex-1">
        <p className="text-xs text-muted-foreground mb-2">Assignees</p>
        <div className="space-y-2">
          {assignees.map((assignee) => (
            <div key={assignee.user.id} className="flex items-center gap-2">
              <Avatar
                name={assignee.user.name}
                image={assignee.user.image}
                size="sm"
              />
              <span className="text-sm text-foreground">
                {assignee.user.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}